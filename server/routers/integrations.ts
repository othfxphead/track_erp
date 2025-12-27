import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as integrations from "../integrations";
import * as db from "../db";

export const integrationsRouter = router({
  // Focus NFe - Emissão de Nota Fiscal
  emitirNFe: protectedProcedure
    .input(z.object({
      apiKey: z.string(),
      ambiente: z.enum(["homologacao", "producao"]),
      clienteId: z.number(),
      valorTotal: z.number(),
      itens: z.array(z.object({
        descricao: z.string(),
        quantidade: z.number(),
        valorUnitario: z.number(),
        ncm: z.string().optional(),
      })),
    }))
    .mutation(async ({ input, ctx }) => {
      const resultado = await integrations.emitirNFeFocus(
        { apiKey: input.apiKey, ambiente: input.ambiente },
        {
          clienteId: input.clienteId,
          valorTotal: input.valorTotal,
          itens: input.itens,
        }
      );

      await db.createLogAuditoria({
        usuarioId: ctx.user.id,
        acao: "emitir_nfe_focus",
        modulo: "fiscal",
        descricao: `Tentativa de emissão de NF-e via Focus API`,
        dadosDepois: JSON.stringify(resultado),
      });

      return resultado;
    }),

  // Serasa - Consulta CPF/CNPJ
  consultarSerasa: protectedProcedure
    .input(z.object({
      cpfCnpj: z.string(),
      clienteId: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const resultado = await integrations.consultarSerasa(input.cpfCnpj);

      // Atualizar dados do cliente se fornecido
      if (input.clienteId && resultado.sucesso) {
        await db.updateCliente(input.clienteId, {
          consultaSerasaData: new Date(),
          consultaSerasaResultado: JSON.stringify(resultado),
        });
      }

      await db.createLogAuditoria({
        usuarioId: ctx.user.id,
        acao: "consulta_serasa",
        modulo: "serasa",
        descricao: `Consulta Serasa para ${input.cpfCnpj}`,
        dadosDepois: JSON.stringify(resultado),
      });

      return resultado;
    }),

  // Asaas - Criar cobrança
  criarCobrancaAsaas: protectedProcedure
    .input(z.object({
      apiKey: z.string(),
      ambiente: z.enum(["sandbox", "producao"]),
      clienteId: z.number(),
      valor: z.number(),
      descricao: z.string(),
      dataVencimento: z.date(),
    }))
    .mutation(async ({ input, ctx }) => {
      const resultado = await integrations.criarCobrancaAsaas(
        { apiKey: input.apiKey, ambiente: input.ambiente },
        {
          clienteId: input.clienteId,
          valor: input.valor,
          descricao: input.descricao,
          dataVencimento: input.dataVencimento,
        }
      );

      await db.createLogAuditoria({
        usuarioId: ctx.user.id,
        acao: "criar_cobranca_asaas",
        modulo: "financeiro",
        descricao: `Criação de cobrança via Asaas`,
        dadosDepois: JSON.stringify(resultado),
      });

      return resultado;
    }),

  // Sicredi - Buscar extrato
  buscarExtratoSicredi: protectedProcedure
    .input(z.object({
      clientId: z.string(),
      clientSecret: z.string(),
      contaId: z.string(),
      dataInicio: z.date(),
      dataFim: z.date(),
    }))
    .mutation(async ({ input, ctx }) => {
      const resultado = await integrations.buscarExtratoSicredi(
        {
          clientId: input.clientId,
          clientSecret: input.clientSecret,
          contaId: input.contaId,
        },
        input.dataInicio,
        input.dataFim
      );

      await db.createLogAuditoria({
        usuarioId: ctx.user.id,
        acao: "buscar_extrato_sicredi",
        modulo: "financeiro",
        descricao: `Busca de extrato bancário Sicredi`,
        dadosDepois: JSON.stringify({ sucesso: resultado.sucesso, quantidadeTransacoes: resultado.transacoes?.length }),
      });

      return resultado;
    }),
});
