import axios from "axios";
import * as db from "./db";

/**
 * Focus NFe API - Emissão de Notas Fiscais
 * Documentação: https://focusnfe.com.br/doc/
 */

interface FocusNFeConfig {
  apiKey: string;
  ambiente: "homologacao" | "producao";
}

export async function emitirNFeFocus(
  config: FocusNFeConfig,
  dados: {
    clienteId: number;
    valorTotal: number;
    itens: Array<{ descricao: string; quantidade: number; valorUnitario: number; ncm?: string }>;
  }
): Promise<{ sucesso: boolean; chaveAcesso?: string; numero?: string; xmlUrl?: string; erro?: string }> {
  try {
    const cliente = await db.getClienteById(dados.clienteId);
    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const empresa = await db.getEmpresa();
    if (!empresa) {
      throw new Error("Dados da empresa não configurados");
    }

    const baseUrl = config.ambiente === "producao" 
      ? "https://api.focusnfe.com.br" 
      : "https://homologacao.focusnfe.com.br";

    // Monta o corpo da requisição conforme API Focus
    const nfeData = {
      natureza_operacao: "Venda de mercadoria",
      data_emissao: new Date().toISOString(),
      tipo_documento: "1", // NF-e
      finalidade_emissao: "1", // Normal
      cnpj_emitente: empresa.cnpj,
      nome_emitente: empresa.razaoSocial,
      nome_destinatario: cliente.nome,
      cpf_cnpj_destinatario: cliente.cpfCnpj,
      endereco_destinatario: cliente.endereco,
      municipio_destinatario: cliente.cidade,
      uf_destinatario: cliente.estado,
      items: dados.itens.map((item, index) => ({
        numero_item: index + 1,
        codigo_produto: `PROD${index + 1}`,
        descricao: item.descricao,
        ncm: item.ncm || "00000000",
        quantidade_comercial: item.quantidade,
        valor_unitario_comercial: item.valorUnitario,
        valor_bruto: item.quantidade * item.valorUnitario,
      })),
      valor_total: dados.valorTotal,
    };

    const response = await axios.post(`${baseUrl}/v2/nfe`, nfeData, {
      headers: {
        Authorization: `Basic ${Buffer.from(config.apiKey + ":").toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    await db.createLogIntegracao({
      servico: "focus",
      tipo: "emissao_nfe",
      status: "sucesso",
      request: JSON.stringify(nfeData),
      response: JSON.stringify(response.data),
    });

    return {
      sucesso: true,
      chaveAcesso: response.data.chave_nfe,
      numero: response.data.numero,
      xmlUrl: response.data.caminho_xml_nota_fiscal,
    };
  } catch (error: any) {
    const mensagemErro = error.response?.data?.mensagem || error.message;
    
    await db.createLogIntegracao({
      servico: "focus",
      tipo: "emissao_nfe",
      status: "erro",
      request: JSON.stringify(dados),
      mensagemErro,
    });

    return {
      sucesso: false,
      erro: mensagemErro,
    };
  }
}

/**
 * Serasa - Consulta de CPF/CNPJ
 * Nota: Esta é uma implementação simulada. Em produção, usar a API oficial da Serasa.
 */

export async function consultarSerasa(cpfCnpj: string): Promise<{
  sucesso: boolean;
  score?: number;
  situacao?: "regular" | "pendencias" | "irregular";
  detalhes?: string;
  erro?: string;
}> {
  try {
    // Simulação de consulta (em produção, integrar com API real da Serasa)
    // API oficial: https://www.serasaexperian.com.br/
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulação de resposta
    const score = Math.floor(Math.random() * 1000);
    const situacao = score > 700 ? "regular" : score > 400 ? "pendencias" : "irregular";

    await db.createLogIntegracao({
      servico: "serasa",
      tipo: "consulta_cpf_cnpj",
      status: "sucesso",
      request: JSON.stringify({ cpfCnpj }),
      response: JSON.stringify({ score, situacao }),
    });

    return {
      sucesso: true,
      score,
      situacao,
      detalhes: `Consulta realizada com sucesso. Score: ${score}`,
    };
  } catch (error: any) {
    await db.createLogIntegracao({
      servico: "serasa",
      tipo: "consulta_cpf_cnpj",
      status: "erro",
      request: JSON.stringify({ cpfCnpj }),
      mensagemErro: error.message,
    });

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}

/**
 * Asaas - Gestão de cobranças
 * Documentação: https://docs.asaas.com/
 */

interface AsaasConfig {
  apiKey: string;
  ambiente: "sandbox" | "producao";
}

export async function criarCobrancaAsaas(
  config: AsaasConfig,
  dados: {
    clienteId: number;
    valor: number;
    descricao: string;
    dataVencimento: Date;
  }
): Promise<{ sucesso: boolean; cobrancaId?: string; linkPagamento?: string; erro?: string }> {
  try {
    const cliente = await db.getClienteById(dados.clienteId);
    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const baseUrl = config.ambiente === "producao"
      ? "https://www.asaas.com/api/v3"
      : "https://sandbox.asaas.com/api/v3";

    // Criar ou buscar cliente no Asaas
    const customerData = {
      name: cliente.nome,
      cpfCnpj: cliente.cpfCnpj,
      email: cliente.email,
      phone: cliente.celular || cliente.telefone,
    };

    const customerResponse = await axios.post(`${baseUrl}/customers`, customerData, {
      headers: {
        "access_token": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    const customerId = customerResponse.data.id;

    // Criar cobrança
    const paymentData = {
      customer: customerId,
      billingType: "BOLETO",
      value: dados.valor,
      dueDate: dados.dataVencimento.toISOString().split("T")[0],
      description: dados.descricao,
    };

    const paymentResponse = await axios.post(`${baseUrl}/payments`, paymentData, {
      headers: {
        "access_token": config.apiKey,
        "Content-Type": "application/json",
      },
    });

    await db.createLogIntegracao({
      servico: "asaas",
      tipo: "criar_cobranca",
      status: "sucesso",
      request: JSON.stringify(paymentData),
      response: JSON.stringify(paymentResponse.data),
    });

    return {
      sucesso: true,
      cobrancaId: paymentResponse.data.id,
      linkPagamento: paymentResponse.data.bankSlipUrl,
    };
  } catch (error: any) {
    const mensagemErro = error.response?.data?.errors?.[0]?.description || error.message;

    await db.createLogIntegracao({
      servico: "asaas",
      tipo: "criar_cobranca",
      status: "erro",
      request: JSON.stringify(dados),
      mensagemErro,
    });

    return {
      sucesso: false,
      erro: mensagemErro,
    };
  }
}

/**
 * Sicredi - Extrato bancário
 * Nota: Esta é uma implementação simulada. Em produção, usar a API oficial do Sicredi.
 */

interface SicrediConfig {
  clientId: string;
  clientSecret: string;
  contaId: string;
}

export async function buscarExtratoSicredi(
  config: SicrediConfig,
  dataInicio: Date,
  dataFim: Date
): Promise<{
  sucesso: boolean;
  transacoes?: Array<{
    data: Date;
    descricao: string;
    valor: number;
    tipo: "credito" | "debito";
  }>;
  erro?: string;
}> {
  try {
    // Simulação de consulta (em produção, integrar com API real do Sicredi)
    // API oficial: https://developers.sicredi.com.br/
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulação de transações
    const transacoes = [
      {
        data: new Date(),
        descricao: "Pagamento recebido - Cliente XYZ",
        valor: 1500.00,
        tipo: "credito" as const,
      },
      {
        data: new Date(),
        descricao: "Pagamento fornecedor ABC",
        valor: 800.00,
        tipo: "debito" as const,
      },
    ];

    await db.createLogIntegracao({
      servico: "sicredi",
      tipo: "extrato_bancario",
      status: "sucesso",
      request: JSON.stringify({ dataInicio, dataFim }),
      response: JSON.stringify({ transacoes }),
    });

    return {
      sucesso: true,
      transacoes,
    };
  } catch (error: any) {
    await db.createLogIntegracao({
      servico: "sicredi",
      tipo: "extrato_bancario",
      status: "erro",
      request: JSON.stringify({ dataInicio, dataFim }),
      mensagemErro: error.message,
    });

    return {
      sucesso: false,
      erro: error.message,
    };
  }
}
