import OpenAI from "openai";

const openai = new OpenAI();

/**
 * Serviço de IA Orquestradora
 * 
 * Responsável por:
 * - Analisar dados do sistema e sugerir ações
 * - Conectar informações entre módulos
 * - Identificar inconsistências e oportunidades
 * - Gerar insights automáticos
 */

interface DadosEmpresa {
  vendas?: any[];
  clientes?: any[];
  produtos?: any[];
  estoque?: any[];
  financeiro?: any[];
}

export class AIOrchestrator {
  /**
   * Analisa dados do sistema e retorna insights e sugestões
   */
  static async analisarSistema(dados: DadosEmpresa): Promise<{
    insights: string[];
    acoes: string[];
    alertas: string[];
  }> {
    try {
      const prompt = `
Você é um assistente de ERP inteligente. Analise os dados fornecidos e identifique:

1. INSIGHTS: Padrões, tendências e oportunidades
2. AÇÕES SUGERIDAS: O que o usuário deveria fazer
3. ALERTAS: Problemas que precisam de atenção

Dados do sistema:
- Total de vendas: ${dados.vendas?.length || 0}
- Total de clientes: ${dados.clientes?.length || 0}
- Total de produtos: ${dados.produtos?.length || 0}
- Itens em estoque: ${dados.estoque?.length || 0}

Responda em formato JSON:
{
  "insights": ["insight 1", "insight 2", ...],
  "acoes": ["ação 1", "ação 2", ...],
  "alertas": ["alerta 1", "alerta 2", ...]
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente especializado em gestão empresarial e análise de dados de ERP. Responda sempre em português brasileiro.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const resultado = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        insights: resultado.insights || [],
        acoes: resultado.acoes || [],
        alertas: resultado.alertas || [],
      };
    } catch (error) {
      console.error("Erro ao analisar sistema com IA:", error);
      return {
        insights: [],
        acoes: [],
        alertas: ["Erro ao gerar análise automática"],
      };
    }
  }

  /**
   * Sugere onde cadastrar uma informação baseado no contexto
   */
  static async sugerirDestino(descricao: string): Promise<{
    modulo: string;
    tipo: string;
    campos: Record<string, any>;
  }> {
    try {
      const prompt = `
Baseado na descrição fornecida, identifique:
1. Em qual módulo do ERP isso deve ser cadastrado (clientes, produtos, servicos, fornecedores, vendas, compras)
2. Qual o tipo específico (fisica/juridica para clientes, produto/servico, etc)
3. Quais campos podem ser preenchidos automaticamente

Descrição: "${descricao}"

Responda em formato JSON:
{
  "modulo": "nome_do_modulo",
  "tipo": "tipo_especifico",
  "campos": {
    "campo1": "valor1",
    "campo2": "valor2"
  }
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente de ERP que ajuda a organizar informações. Responda sempre em português brasileiro.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const resultado = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        modulo: resultado.modulo || "clientes",
        tipo: resultado.tipo || "",
        campos: resultado.campos || {},
      };
    } catch (error) {
      console.error("Erro ao sugerir destino com IA:", error);
      return {
        modulo: "clientes",
        tipo: "",
        campos: {},
      };
    }
  }

  /**
   * Gera relatório inteligente baseado em dados
   */
  static async gerarRelatorio(
    tipo: string,
    dados: any[],
    periodo?: { inicio: Date; fim: Date }
  ): Promise<{
    titulo: string;
    resumo: string;
    metricas: Array<{ label: string; valor: string; variacao?: string }>;
    graficos: Array<{ tipo: string; dados: any[] }>;
    recomendacoes: string[];
  }> {
    try {
      const prompt = `
Gere um relatório gerencial do tipo "${tipo}" com os dados fornecidos.

Total de registros: ${dados.length}
Período: ${periodo ? `${periodo.inicio.toLocaleDateString()} a ${periodo.fim.toLocaleDateString()}` : "Não especificado"}

O relatório deve conter:
1. Título descritivo
2. Resumo executivo (2-3 frases)
3. Métricas principais (3-5 métricas com valores)
4. Sugestões de gráficos (tipos e estrutura de dados)
5. Recomendações estratégicas (3-5 ações)

Responda em formato JSON:
{
  "titulo": "Título do Relatório",
  "resumo": "Resumo executivo...",
  "metricas": [
    {"label": "Métrica 1", "valor": "R$ 1.000", "variacao": "+10%"},
    ...
  ],
  "graficos": [
    {"tipo": "linha", "dados": [...]},
    ...
  ],
  "recomendacoes": ["recomendação 1", ...]
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Você é um analista de negócios especializado em relatórios gerenciais. Responda sempre em português brasileiro.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const resultado = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        titulo: resultado.titulo || `Relatório de ${tipo}`,
        resumo: resultado.resumo || "",
        metricas: resultado.metricas || [],
        graficos: resultado.graficos || [],
        recomendacoes: resultado.recomendacoes || [],
      };
    } catch (error) {
      console.error("Erro ao gerar relatório com IA:", error);
      return {
        titulo: `Relatório de ${tipo}`,
        resumo: "Erro ao gerar relatório automático",
        metricas: [],
        graficos: [],
        recomendacoes: [],
      };
    }
  }

  /**
   * Valida e enriquece dados antes de salvar
   */
  static async validarEEnriquecerDados(
    modulo: string,
    dados: Record<string, any>
  ): Promise<{
    valido: boolean;
    erros: string[];
    sugestoes: Record<string, any>;
    dadosEnriquecidos: Record<string, any>;
  }> {
    try {
      const prompt = `
Valide e enriqueça os dados fornecidos para o módulo "${modulo}":

${JSON.stringify(dados, null, 2)}

Verifique:
1. Se todos os campos obrigatórios estão preenchidos
2. Se os formatos estão corretos (CPF, CNPJ, email, etc)
3. Se há campos que podem ser preenchidos automaticamente
4. Se há inconsistências ou valores suspeitos

Responda em formato JSON:
{
  "valido": true/false,
  "erros": ["erro 1", "erro 2", ...],
  "sugestoes": {
    "campo1": "valor_sugerido",
    ...
  },
  "dadosEnriquecidos": {
    ...dados originais + campos enriquecidos
  }
}
`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: "Você é um validador de dados de ERP. Responda sempre em português brasileiro.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const resultado = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        valido: resultado.valido !== false,
        erros: resultado.erros || [],
        sugestoes: resultado.sugestoes || {},
        dadosEnriquecidos: resultado.dadosEnriquecidos || dados,
      };
    } catch (error) {
      console.error("Erro ao validar dados com IA:", error);
      return {
        valido: true,
        erros: [],
        sugestoes: {},
        dadosEnriquecidos: dados,
      };
    }
  }
}
