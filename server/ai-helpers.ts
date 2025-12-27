import { invokeLLM } from "./_core/llm";

/**
 * Gera sugestões de descrição para produtos baseado no nome
 */
export async function gerarDescricaoProduto(nome: string, categoria?: string): Promise<string> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em criar descrições profissionais e atrativas para produtos. Seja conciso, objetivo e destaque os principais benefícios.",
        },
        {
          role: "user",
          content: `Crie uma descrição profissional para o produto: ${nome}${categoria ? ` (Categoria: ${categoria})` : ""}`,
        },
      ],
    });

    const content = response.choices[0]?.message?.content;
    return (typeof content === 'string' ? content : "") || "";
  } catch (error) {
    console.error("Erro ao gerar descrição:", error);
    return "";
  }
}

/**
 * Sugere preço de venda baseado no custo e categoria
 */
export async function sugerirPrecoVenda(
  precoCusto: number,
  categoria?: string,
  margemSugerida?: number
): Promise<{ precoSugerido: number; margem: number; justificativa: string }> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um consultor financeiro especializado em precificação. Analise o custo e sugira um preço de venda justo com margem adequada.",
        },
        {
          role: "user",
          content: `Custo: R$ ${precoCusto.toFixed(2)}${categoria ? `, Categoria: ${categoria}` : ""}${margemSugerida ? `, Margem desejada: ${margemSugerida}%` : ""}. Sugira um preço de venda e explique a margem.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "preco_sugerido",
          strict: true,
          schema: {
            type: "object",
            properties: {
              precoSugerido: { type: "number", description: "Preço de venda sugerido" },
              margem: { type: "number", description: "Margem de lucro em percentual" },
              justificativa: { type: "string", description: "Explicação da sugestão" },
            },
            required: ["precoSugerido", "margem", "justificativa"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (content && typeof content === 'string') {
      return JSON.parse(content);
    }

    // Fallback: cálculo simples
    const margem = margemSugerida || 30;
    const precoSugerido = precoCusto * (1 + margem / 100);
    return {
      precoSugerido,
      margem,
      justificativa: `Margem padrão de ${margem}% aplicada ao custo`,
    };
  } catch (error) {
    console.error("Erro ao sugerir preço:", error);
    const margem = margemSugerida || 30;
    const precoSugerido = precoCusto * (1 + margem / 100);
    return {
      precoSugerido,
      margem,
      justificativa: `Margem padrão de ${margem}% aplicada ao custo`,
    };
  }
}

/**
 * Classifica automaticamente uma despesa/receita
 */
export async function classificarLancamento(descricao: string, valor: number): Promise<{
  categoria: string;
  tipo: "receita" | "despesa";
  confianca: number;
}> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um assistente financeiro que classifica lançamentos. Analise a descrição e valor para determinar se é receita ou despesa e qual a categoria.",
        },
        {
          role: "user",
          content: `Classifique este lançamento: "${descricao}" - Valor: R$ ${valor.toFixed(2)}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "classificacao",
          strict: true,
          schema: {
            type: "object",
            properties: {
              categoria: { type: "string", description: "Categoria do lançamento" },
              tipo: { type: "string", enum: ["receita", "despesa"], description: "Tipo do lançamento" },
              confianca: { type: "number", description: "Nível de confiança de 0 a 1" },
            },
            required: ["categoria", "tipo", "confianca"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (content && typeof content === 'string') {
      return JSON.parse(content);
    }

    return {
      categoria: "Outros",
      tipo: valor >= 0 ? "receita" : "despesa",
      confianca: 0.5,
    };
  } catch (error) {
    console.error("Erro ao classificar lançamento:", error);
    return {
      categoria: "Outros",
      tipo: valor >= 0 ? "receita" : "despesa",
      confianca: 0.5,
    };
  }
}

/**
 * Gera previsão de fluxo de caixa baseado em histórico
 */
export async function preverFluxoCaixa(
  historicoReceitas: number[],
  historicoDespesas: number[],
  mesesFuturos: number = 3
): Promise<{
  previsoes: Array<{ mes: number; receitaPrevista: number; despesaPrevista: number; saldo: number }>;
  tendencia: string;
  recomendacoes: string[];
}> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um analista financeiro especializado em previsões de fluxo de caixa. Analise o histórico e faça previsões realistas.",
        },
        {
          role: "user",
          content: `Histórico de receitas (últimos meses): ${JSON.stringify(historicoReceitas)}. Histórico de despesas: ${JSON.stringify(historicoDespesas)}. Preveja os próximos ${mesesFuturos} meses e dê recomendações.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "previsao_fluxo",
          strict: true,
          schema: {
            type: "object",
            properties: {
              previsoes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    mes: { type: "number" },
                    receitaPrevista: { type: "number" },
                    despesaPrevista: { type: "number" },
                    saldo: { type: "number" },
                  },
                  required: ["mes", "receitaPrevista", "despesaPrevista", "saldo"],
                  additionalProperties: false,
                },
              },
              tendencia: { type: "string", description: "Análise da tendência" },
              recomendacoes: {
                type: "array",
                items: { type: "string" },
                description: "Recomendações estratégicas",
              },
            },
            required: ["previsoes", "tendencia", "recomendacoes"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (content && typeof content === 'string') {
      return JSON.parse(content);
    }

    // Fallback: média simples
    const mediaReceitas = historicoReceitas.reduce((a, b) => a + b, 0) / historicoReceitas.length;
    const mediaDespesas = historicoDespesas.reduce((a, b) => a + b, 0) / historicoDespesas.length;

    const previsoes = Array.from({ length: mesesFuturos }, (_, i) => ({
      mes: i + 1,
      receitaPrevista: mediaReceitas,
      despesaPrevista: mediaDespesas,
      saldo: mediaReceitas - mediaDespesas,
    }));

    return {
      previsoes,
      tendencia: "Estável baseado na média histórica",
      recomendacoes: ["Mantenha o controle de custos", "Busque oportunidades de aumento de receita"],
    };
  } catch (error) {
    console.error("Erro ao prever fluxo de caixa:", error);
    const mediaReceitas = historicoReceitas.reduce((a, b) => a + b, 0) / historicoReceitas.length || 0;
    const mediaDespesas = historicoDespesas.reduce((a, b) => a + b, 0) / historicoDespesas.length || 0;

    const previsoes = Array.from({ length: mesesFuturos }, (_, i) => ({
      mes: i + 1,
      receitaPrevista: mediaReceitas,
      despesaPrevista: mediaDespesas,
      saldo: mediaReceitas - mediaDespesas,
    }));

    return {
      previsoes,
      tendencia: "Estável baseado na média histórica",
      recomendacoes: ["Mantenha o controle de custos", "Busque oportunidades de aumento de receita"],
    };
  }
}

/**
 * Extrai dados de nota fiscal (XML ou texto)
 */
export async function extrairDadosNotaFiscal(conteudo: string): Promise<{
  numero?: string;
  serie?: string;
  dataEmissao?: string;
  valorTotal?: number;
  fornecedor?: string;
  cnpjFornecedor?: string;
  itens?: Array<{ descricao: string; quantidade: number; valorUnitario: number }>;
}> {
  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em extrair dados de notas fiscais. Analise o conteúdo e extraia as informações estruturadas.",
        },
        {
          role: "user",
          content: `Extraia os dados desta nota fiscal:\n\n${conteudo.substring(0, 2000)}`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "dados_nf",
          strict: true,
          schema: {
            type: "object",
            properties: {
              numero: { type: "string" },
              serie: { type: "string" },
              dataEmissao: { type: "string" },
              valorTotal: { type: "number" },
              fornecedor: { type: "string" },
              cnpjFornecedor: { type: "string" },
              itens: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    descricao: { type: "string" },
                    quantidade: { type: "number" },
                    valorUnitario: { type: "number" },
                  },
                  required: ["descricao", "quantidade", "valorUnitario"],
                  additionalProperties: false,
                },
              },
            },
            required: [],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (content && typeof content === 'string') {
      return JSON.parse(content);
    }

    return {};
  } catch (error) {
    console.error("Erro ao extrair dados de NF:", error);
    return {};
  }
}

/**
 * Gera lembretes inteligentes baseado em vencimentos
 */
export async function gerarLembretes(
  lancamentosVencendo: Array<{ id: number; descricao: string; valor: number; dataVencimento: Date }>
): Promise<Array<{ lancamentoId: number; mensagem: string; prioridade: "alta" | "media" | "baixa" }>> {
  try {
    const hoje = new Date();
    const lembretes = lancamentosVencendo.map((lanc) => {
      const diasRestantes = Math.ceil((lanc.dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      
      let prioridade: "alta" | "media" | "baixa" = "baixa";
      let mensagem = "";

      if (diasRestantes < 0) {
        prioridade = "alta";
        mensagem = `⚠️ VENCIDO: ${lanc.descricao} - R$ ${lanc.valor.toFixed(2)} (${Math.abs(diasRestantes)} dias de atraso)`;
      } else if (diasRestantes <= 3) {
        prioridade = "alta";
        mensagem = `🔴 URGENTE: ${lanc.descricao} - R$ ${lanc.valor.toFixed(2)} vence em ${diasRestantes} dia(s)`;
      } else if (diasRestantes <= 7) {
        prioridade = "media";
        mensagem = `🟡 ATENÇÃO: ${lanc.descricao} - R$ ${lanc.valor.toFixed(2)} vence em ${diasRestantes} dias`;
      } else {
        prioridade = "baixa";
        mensagem = `ℹ️ ${lanc.descricao} - R$ ${lanc.valor.toFixed(2)} vence em ${diasRestantes} dias`;
      }

      return {
        lancamentoId: lanc.id,
        mensagem,
        prioridade,
      };
    });

    return lembretes;
  } catch (error) {
    console.error("Erro ao gerar lembretes:", error);
    return [];
  }
}

/**
 * Processa documento (PDF, XML, imagem) com OCR e extrai dados estruturados
 */
export async function processarDocumentoOCR(
  arquivoBase64: string,
  tipoArquivo: string,
  nomeArquivo: string
): Promise<{
  tipo: "nfe" | "nfse" | "recibo" | "boleto" | "outro";
  numero?: string;
  dataEmissao?: string;
  fornecedor?: {
    nome: string;
    cnpj: string;
  };
  cliente?: {
    nome: string;
    cpfCnpj: string;
  };
  valorTotal: number;
  itens?: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
  impostos?: {
    icms?: number;
    ipi?: number;
    pis?: number;
    cofins?: number;
  };
  observacoes?: string;
}> {
  try {
    // Se for XML, extrair diretamente
    if (tipoArquivo.includes("xml")) {
      const xmlContent = Buffer.from(
        arquivoBase64.split(",")[1] || arquivoBase64,
        "base64"
      ).toString("utf-8");
      
      // Usar IA para extrair dados do XML
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em extrair dados de documentos fiscais XML (NF-e, NFS-e). Analise o XML e extraia todas as informações relevantes de forma estruturada.",
          },
          {
            role: "user",
            content: `Extraia os dados deste XML de nota fiscal:\n\n${xmlContent.substring(0, 3000)}`,
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "documento_fiscal",
            strict: true,
            schema: {
              type: "object",
              properties: {
                tipo: {
                  type: "string",
                  enum: ["nfe", "nfse", "recibo", "boleto", "outro"],
                },
                numero: { type: "string" },
                dataEmissao: { type: "string" },
                fornecedor: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    cnpj: { type: "string" },
                  },
                  required: ["nome", "cnpj"],
                  additionalProperties: false,
                },
                valorTotal: { type: "number" },
                itens: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      descricao: { type: "string" },
                      quantidade: { type: "number" },
                      valorUnitario: { type: "number" },
                      valorTotal: { type: "number" },
                    },
                    required: ["descricao", "quantidade", "valorUnitario", "valorTotal"],
                    additionalProperties: false,
                  },
                },
                impostos: {
                  type: "object",
                  properties: {
                    icms: { type: "number" },
                    ipi: { type: "number" },
                    pis: { type: "number" },
                    cofins: { type: "number" },
                  },
                  required: [],
                  additionalProperties: false,
                },
                observacoes: { type: "string" },
              },
              required: ["tipo", "valorTotal"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (content && typeof content === 'string') {
        return JSON.parse(content);
      }
    }

    // Se for PDF ou imagem, usar visão da IA
    if (tipoArquivo.includes("pdf") || tipoArquivo.startsWith("image/")) {
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "Você é um especialista em OCR e extração de dados de documentos fiscais. Analise a imagem/PDF e extraia todas as informações de forma estruturada e precisa.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Extraia todos os dados deste documento fiscal (NF-e, NFS-e, recibo, boleto, etc.). Identifique o tipo, fornecedor, itens, valores e impostos.",
              },
              {
                type: "image_url",
                image_url: {
                  url: arquivoBase64,
                  detail: "high",
                },
              },
            ],
          },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "documento_fiscal",
            strict: true,
            schema: {
              type: "object",
              properties: {
                tipo: {
                  type: "string",
                  enum: ["nfe", "nfse", "recibo", "boleto", "outro"],
                },
                numero: { type: "string" },
                dataEmissao: { type: "string" },
                fornecedor: {
                  type: "object",
                  properties: {
                    nome: { type: "string" },
                    cnpj: { type: "string" },
                  },
                  required: ["nome", "cnpj"],
                  additionalProperties: false,
                },
                valorTotal: { type: "number" },
                itens: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      descricao: { type: "string" },
                      quantidade: { type: "number" },
                      valorUnitario: { type: "number" },
                      valorTotal: { type: "number" },
                    },
                    required: ["descricao", "quantidade", "valorUnitario", "valorTotal"],
                    additionalProperties: false,
                  },
                },
                impostos: {
                  type: "object",
                  properties: {
                    icms: { type: "number" },
                    ipi: { type: "number" },
                    pis: { type: "number" },
                    cofins: { type: "number" },
                  },
                  required: [],
                  additionalProperties: false,
                },
                observacoes: { type: "string" },
              },
              required: ["tipo", "valorTotal"],
              additionalProperties: false,
            },
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (content && typeof content === 'string') {
        return JSON.parse(content);
      }
    }

    // Fallback
    return {
      tipo: "outro",
      valorTotal: 0,
      observacoes: "Não foi possível extrair dados do documento",
    };
  } catch (error) {
    console.error("Erro ao processar documento com OCR:", error);
    return {
      tipo: "outro",
      valorTotal: 0,
      observacoes: "Erro ao processar documento",
    };
  }
}
