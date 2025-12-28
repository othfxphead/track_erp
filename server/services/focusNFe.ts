/**
 * Serviço de Integração Focus NFe
 * 
 * Este serviço gerencia a comunicação com a API da Focus NFe para emissão
 * de documentos fiscais (NFe, NFSe, NFCe).
 * 
 * Documentação: https://focusnfe.com.br/doc
 * 
 * Configuração:
 * - Token de Homologação: Configurado via variável de ambiente FOCUS_NFE_TOKEN_HOMOLOG
 * - Token de Produção: Configurado via variável de ambiente FOCUS_NFE_TOKEN_PROD
 * - Ambiente: Configurado via variável de ambiente FOCUS_NFE_AMBIENTE (homologacao|producao)
 * 
 * Autenticação: HTTP Basic Auth (token como username, senha vazia)
 */

const AMBIENTE = process.env.FOCUS_NFE_AMBIENTE || "homologacao";
const TOKEN_HOMOLOG = process.env.FOCUS_NFE_TOKEN_HOMOLOG || "ePobVyoOvXYQn41yllsOxk3L3IwB9sgb";
const TOKEN_PROD = process.env.FOCUS_NFE_TOKEN_PROD || "";

const BASE_URLS = {
  homologacao: "https://homologacao.focusnfe.com.br",
  producao: "https://api.focusnfe.com.br",
};

const BASE_URL = BASE_URLS[AMBIENTE as keyof typeof BASE_URLS];
const TOKEN = AMBIENTE === "producao" ? TOKEN_PROD : TOKEN_HOMOLOG;

/**
 * Faz requisição autenticada para API Focus NFe
 */
async function request(
  method: string,
  endpoint: string,
  data?: any
): Promise<any> {
  const url = `${BASE_URL}${endpoint}`;
  const auth = Buffer.from(`${TOKEN}:`).toString("base64");

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
  };

  if (data && (method === "POST" || method === "PUT")) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(
      responseData.mensagem ||
        `Erro na API Focus NFe: ${response.status} ${response.statusText}`
    );
  }

  return responseData;
}

/**
 * Tipos de dados
 */
export interface NFeDadosEmitente {
  cnpj: string;
  nome: string;
  nome_fantasia?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  telefone?: string;
  inscricao_estadual: string;
}

export interface NFeDadosDestinatario {
  nome: string;
  cpf?: string;
  cnpj?: string;
  telefone?: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
}

export interface NFeItem {
  numero_item: string;
  codigo_produto: string;
  descricao: string;
  cfop: string;
  unidade_comercial: string;
  quantidade_comercial: string;
  valor_unitario_comercial: string;
  valor_bruto: string;
  icms_origem: string;
  icms_situacao_tributaria: string;
  pis_situacao_tributaria: string;
  cofins_situacao_tributaria: string;
}

export interface NFeDados {
  natureza_operacao: string;
  tipo_documento: string;
  finalidade_emissao: string;
  cnpj_emitente: string;
  nome_emitente: string;
  nome_fantasia_emitente?: string;
  logradouro_emitente: string;
  numero_emitente: string;
  bairro_emitente: string;
  municipio_emitente: string;
  uf_emitente: string;
  cep_emitente: string;
  telefone_emitente?: string;
  inscricao_estadual_emitente: string;
  nome_destinatario: string;
  cpf_destinatario?: string;
  cnpj_destinatario?: string;
  telefone_destinatario?: string;
  logradouro_destinatario: string;
  numero_destinatario: string;
  bairro_destinatario: string;
  municipio_destinatario: string;
  uf_destinatario: string;
  cep_destinatario: string;
  items: NFeItem[];
  valor_frete: string;
  valor_seguro: string;
  valor_total: string;
  valor_produtos: string;
  modalidade_frete: string;
  informacoes_adicionais_contribuinte?: string;
}

export interface NFeResposta {
  status: string;
  status_sefaz?: string;
  mensagem_sefaz?: string;
  chave_nfe?: string;
  numero?: string;
  serie?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_danfe?: string;
  ref: string;
}

/**
 * Emite uma NFe
 * @param referencia Identificador único da nota no seu sistema
 * @param dados Dados da NFe
 * @returns Resposta da API com status e dados da nota
 */
export async function emitirNFe(
  referencia: string,
  dados: NFeDados
): Promise<NFeResposta> {
  return request("POST", `/v2/nfe?ref=${referencia}`, dados);
}

/**
 * Consulta o status de uma NFe
 * @param referencia Identificador único da nota
 * @returns Status atual da NFe
 */
export async function consultarNFe(referencia: string): Promise<NFeResposta> {
  return request("GET", `/v2/nfe/${referencia}`);
}

/**
 * Cancela uma NFe autorizada
 * @param referencia Identificador único da nota
 * @param justificativa Motivo do cancelamento (mínimo 15 caracteres)
 * @returns Resposta do cancelamento
 */
export async function cancelarNFe(
  referencia: string,
  justificativa: string
): Promise<any> {
  return request("DELETE", `/v2/nfe/${referencia}`, { justificativa });
}

/**
 * Baixa o XML de uma NFe autorizada
 * @param referencia Identificador único da nota
 * @returns Buffer com o conteúdo do XML
 */
export async function baixarXMLNFe(referencia: string): Promise<Buffer> {
  const url = `${BASE_URL}/v2/nfe/${referencia}.xml`;
  const auth = Buffer.from(`${TOKEN}:`).toString("base64");

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao baixar XML: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Baixa o PDF (DANFE) de uma NFe autorizada
 * @param referencia Identificador único da nota
 * @returns Buffer com o conteúdo do PDF
 */
export async function baixarPDFNFe(referencia: string): Promise<Buffer> {
  const url = `${BASE_URL}/v2/nfe/${referencia}.pdf`;
  const auth = Buffer.from(`${TOKEN}:`).toString("base64");

  const response = await fetch(url, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao baixar PDF: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Converte dados de venda do Track ERP para formato NFe da Focus
 */
export function converterVendaParaNFe(
  venda: any,
  emitente: NFeDadosEmitente
): NFeDados {
  return {
    natureza_operacao: "Venda",
    tipo_documento: "1", // Saída
    finalidade_emissao: "1", // Normal
    cnpj_emitente: emitente.cnpj,
    nome_emitente: emitente.nome,
    nome_fantasia_emitente: emitente.nome_fantasia,
    logradouro_emitente: emitente.logradouro,
    numero_emitente: emitente.numero,
    bairro_emitente: emitente.bairro,
    municipio_emitente: emitente.municipio,
    uf_emitente: emitente.uf,
    cep_emitente: emitente.cep,
    telefone_emitente: emitente.telefone,
    inscricao_estadual_emitente: emitente.inscricao_estadual,
    nome_destinatario: venda.nomeCliente || "Consumidor Final",
    cpf_destinatario: venda.cpfCliente,
    cnpj_destinatario: venda.cnpjCliente,
    telefone_destinatario: venda.telefoneCliente,
    logradouro_destinatario: venda.enderecoCliente || "Não informado",
    numero_destinatario: venda.numeroCliente || "S/N",
    bairro_destinatario: venda.bairroCliente || "Centro",
    municipio_destinatario: venda.cidadeCliente || "São Paulo",
    uf_destinatario: venda.ufCliente || "SP",
    cep_destinatario: venda.cepCliente || "00000000",
    items: (venda.itens || []).map((item: any, index: number) => ({
      numero_item: String(index + 1),
      codigo_produto: item.codigoProduto || item.id,
      descricao: item.descricao || item.nome,
      cfop: "5102", // Venda de mercadoria adquirida ou recebida de terceiros
      unidade_comercial: "UN",
      quantidade_comercial: String(item.quantidade || 1),
      valor_unitario_comercial: String(item.valorUnitario || item.preco || 0),
      valor_bruto: String(item.valorTotal || item.quantidade * item.preco || 0),
      icms_origem: "0", // Nacional
      icms_situacao_tributaria: "102", // Tributada pelo Simples Nacional sem permissão de crédito
      pis_situacao_tributaria: "07", // Operação Isenta da Contribuição
      cofins_situacao_tributaria: "07", // Operação Isenta da Contribuição
    })),
    valor_frete: "0.00",
    valor_seguro: "0.00",
    valor_total: String(venda.valorTotal || 0),
    valor_produtos: String(venda.valorTotal || 0),
    modalidade_frete: "9", // Sem frete
    informacoes_adicionais_contribuinte: venda.observacoes || "",
  };
}
