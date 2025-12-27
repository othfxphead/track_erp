import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as aiHelpers from "../ai-helpers";

export const aiRouter = router({
  // Gerar descrição de produto
  gerarDescricaoProduto: protectedProcedure
    .input(z.object({
      nome: z.string(),
      categoria: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const descricao = await aiHelpers.gerarDescricaoProduto(input.nome, input.categoria);
      return { descricao };
    }),

  // Sugerir preço de venda
  sugerirPrecoVenda: protectedProcedure
    .input(z.object({
      precoCusto: z.number(),
      categoria: z.string().optional(),
      margemSugerida: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      return await aiHelpers.sugerirPrecoVenda(
        input.precoCusto,
        input.categoria,
        input.margemSugerida
      );
    }),

  // Classificar lançamento financeiro
  classificarLancamento: protectedProcedure
    .input(z.object({
      descricao: z.string(),
      valor: z.number(),
    }))
    .mutation(async ({ input }) => {
      return await aiHelpers.classificarLancamento(input.descricao, input.valor);
    }),

  // Prever fluxo de caixa
  preverFluxoCaixa: protectedProcedure
    .input(z.object({
      historicoReceitas: z.array(z.number()),
      historicoDespesas: z.array(z.number()),
      mesesFuturos: z.number().default(3),
    }))
    .mutation(async ({ input }) => {
      return await aiHelpers.preverFluxoCaixa(
        input.historicoReceitas,
        input.historicoDespesas,
        input.mesesFuturos
      );
    }),

  // Extrair dados de nota fiscal
  extrairDadosNF: protectedProcedure
    .input(z.object({
      conteudo: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await aiHelpers.extrairDadosNotaFiscal(input.conteudo);
    }),

  // Gerar lembretes
  gerarLembretes: protectedProcedure
    .input(z.object({
      lancamentos: z.array(z.object({
        id: z.number(),
        descricao: z.string(),
        valor: z.number(),
        dataVencimento: z.date(),
      })),
    }))
    .mutation(async ({ input }) => {
      return await aiHelpers.gerarLembretes(input.lancamentos);
    }),

  // Processar documento com OCR
  processarDocumento: protectedProcedure
    .input(z.object({
      arquivo: z.string(), // base64
      tipoArquivo: z.string(),
      nomeArquivo: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await aiHelpers.processarDocumentoOCR(
        input.arquivo,
        input.tipoArquivo,
        input.nomeArquivo
      );
    }),
});
