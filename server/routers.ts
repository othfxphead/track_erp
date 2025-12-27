import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { aiRouter } from "./routers/ai";
import { integrationsRouter } from "./routers/integrations";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard
  dashboard: router({
    kpis: protectedProcedure.query(async () => {
      return await db.getDashboardKPIs();
    }),
    vendasPorMes: protectedProcedure
      .input(z.object({
        dataInicio: z.date().optional(),
        dataFim: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getVendasPorMes(input?.dataInicio, input?.dataFim);
      }),
    fluxoCaixaPorMes: protectedProcedure
      .input(z.object({
        dataInicio: z.date().optional(),
        dataFim: z.date().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getFluxoCaixaPorMes(input?.dataInicio, input?.dataFim);
      }),
    notificacoes: protectedProcedure.query(async ({ ctx }) => {
      return await getNotificacoes(ctx.user.id);
    }),
  }),

  // Empresas
  empresa: router({
    get: protectedProcedure.query(async () => {
      return await db.getEmpresa();
    }),
    upsert: protectedProcedure
      .input(z.object({
        razaoSocial: z.string(),
        nomeFantasia: z.string().optional(),
        cnpj: z.string(),
        inscricaoEstadual: z.string().optional(),
        inscricaoMunicipal: z.string().optional(),
        email: z.string().email().or(z.literal("")).optional(),
        telefone: z.string().optional(),
        logoUrl: z.string().optional(),
        certificadoDigitalUrl: z.string().optional(),
        certificadoSenha: z.string().optional(),
        regimeTributario: z.enum(["simples", "lucro_presumido", "lucro_real"]).optional(),
        endereco: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        cep: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.upsertEmpresa(input);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "upsert_empresa",
          modulo: "configuracoes",
          descricao: "Dados da empresa atualizados",
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    uploadLogo: protectedProcedure
      .input(z.object({
        base64: z.string(),
        fileName: z.string(),
        mimeType: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.base64, "base64");
        const randomSuffix = Math.random().toString(36).substring(7);
        const key = `logos/${Date.now()}-${randomSuffix}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        
        // Buscar empresa existente e atualizar logo
        const empresaAtual = await db.getEmpresa();
        if (empresaAtual) {
          await db.upsertEmpresa({
            ...empresaAtual,
            logoUrl: url,
          });
        } else {
          // Criar empresa com dados mínimos se não existir
          await db.upsertEmpresa({
            razaoSocial: "Empresa",
            cnpj: "00.000.000/0000-00",
            logoUrl: url,
          });
        }
        
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "upload_logo",
          modulo: "configuracoes",
          descricao: "Logo da empresa atualizada",
        });
        
        return { success: true, url };
      }),
  }),

  // Clientes
  clientes: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllClientes();
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getClienteById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        tipo: z.enum(["fisica", "juridica"]),
        nome: z.string(),
        cpfCnpj: z.string(),
        email: z.string().email().or(z.literal("")).optional(),
        telefone: z.string().optional(),
        celular: z.string().optional(),
        endereco: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        cep: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createCliente(input);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_cliente",
          modulo: "clientes",
          descricao: `Cliente ${input.nome} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          tipo: z.enum(["fisica", "juridica"]).optional(),
          nome: z.string().optional(),
          cpfCnpj: z.string().optional(),
          email: z.string().email().or(z.literal("")).optional(),
          telefone: z.string().optional(),
          celular: z.string().optional(),
          endereco: z.string().optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
          cep: z.string().optional(),
          observacoes: z.string().optional(),
          ativo: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateCliente(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_cliente",
          modulo: "clientes",
          descricao: `Cliente ID ${input.id} atualizado`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
  }),

  // Fornecedores
  fornecedores: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllFornecedores();
    }),
    create: protectedProcedure
      .input(z.object({
        tipo: z.enum(["fisica", "juridica"]),
        nome: z.string(),
        cpfCnpj: z.string(),
        email: z.string().email().or(z.literal("")).optional(),
        telefone: z.string().optional(),
        endereco: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
        cep: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createFornecedor(input);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_fornecedor",
          modulo: "fornecedores",
          descricao: `Fornecedor ${input.nome} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
  }),

  // Produtos
  produtos: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllProdutos();
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProdutoById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        codigo: z.string(),
        nome: z.string(),
        descricao: z.string().optional(),
        unidade: z.string().default("UN"),
        precoCusto: z.string(),
        precoVenda: z.string(),
        margemLucro: z.string().optional(),
        estoque: z.number().default(0),
        estoqueMinimo: z.number().default(0),
        ncm: z.string().optional(),
        categoria: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createProduto(input);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_produto",
          modulo: "produtos",
          descricao: `Produto ${input.nome} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          codigo: z.string().optional(),
          nome: z.string().optional(),
          descricao: z.string().optional(),
          unidade: z.string().optional(),
          precoCusto: z.string().optional(),
          precoVenda: z.string().optional(),
          margemLucro: z.string().optional(),
          estoqueMinimo: z.number().optional(),
          ncm: z.string().optional(),
          categoria: z.string().optional(),
          ativo: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateProduto(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_produto",
          modulo: "produtos",
          descricao: `Produto ID ${input.id} atualizado`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
  }),

  // Serviços
  servicos: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllServicos();
    }),
    create: protectedProcedure
      .input(z.object({
        codigo: z.string(),
        nome: z.string(),
        descricao: z.string().optional(),
        valorUnitario: z.string(),
        categoria: z.string().optional(),
        codigoServico: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createServico(input);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_servico",
          modulo: "servicos",
          descricao: `Serviço ${input.nome} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
  }),

  // Orcamentos
  orcamentos: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllOrcamentos();
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrcamentoById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string().optional(),
        clienteId: z.number(),
        dataValidade: z.date(),
        valorTotal: z.string(),
        desconto: z.string().default("0"),
        observacoes: z.string().optional(),
        itens: z.any(), // Array de itens
      }))
      .mutation(async ({ input, ctx }) => {
        const numero = input.numero || `ORC-${Date.now()}`;
        const id = await db.createOrcamento({
          ...input,
          numero,
          itens: JSON.stringify(input.itens),
          usuarioId: ctx.user.id,
        });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_orcamento",
          modulo: "orcamentos",
          descricao: `Orçamento ${numero} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    aprovar: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.updateOrcamento(input.id, { status: "aprovado" });
        const orcamento = await db.getOrcamentoById(input.id);
        if (orcamento) {
          // Criar venda automaticamente
          await db.createVenda({
            numero: `VEN-${Date.now()}`,
            clienteId: orcamento.clienteId,
            valorTotal: orcamento.valorTotal,
            desconto: orcamento.desconto,
            observacoes: `Convertido do orçamento ${orcamento.numero}`,
            itens: orcamento.itens,
            usuarioId: ctx.user.id,
          });
        }
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "aprovar_orcamento",
          modulo: "orcamentos",
          descricao: `Orçamento #${input.id} aprovado e convertido em venda`,
        });
        return { success: true };
      }),
    rejeitar: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.updateOrcamento(input.id, { status: "rejeitado" });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "rejeitar_orcamento",
          modulo: "orcamentos",
          descricao: `Orçamento #${input.id} rejeitado`,
        });
        return { success: true };
      }),
  }),

  // Vendas
  vendas: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllVendas();
    }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getVendaById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string(),
        clienteId: z.number(),
        orcamentoId: z.number().optional(),
        valorTotal: z.string(),
        desconto: z.string().default("0"),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
        itens: z.string(), // JSON
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createVenda({
          ...input,
          usuarioId: ctx.user.id,
        });
        
        // Atualizar estoque dos produtos vendidos
        const itens = JSON.parse(input.itens);
        for (const item of itens) {
          if (item.tipo === "produto") {
            const produto = await db.getProdutoById(item.id);
            if (produto) {
              const novoEstoque = produto.estoque - item.quantidade;
              await db.updateEstoqueProduto(item.id, novoEstoque);
              await db.createMovimentacaoEstoque({
                produtoId: item.id,
                tipo: "saida",
                quantidade: item.quantidade,
                estoqueAnterior: produto.estoque,
                estoqueAtual: novoEstoque,
                valorUnitario: item.valorUnitario,
                motivo: "Venda",
                documentoReferencia: input.numero,
                usuarioId: ctx.user.id,
              });
            }
          }
        }
        
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_venda",
          modulo: "vendas",
          descricao: `Venda ${input.numero} criada`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
  }),

  // Compras
  compras: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllCompras();
    }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string(),
        fornecedorId: z.number(),
        valorTotal: z.string(),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
        itens: z.string(), // JSON
        notaFiscalXml: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createCompra({
          ...input,
          usuarioId: ctx.user.id,
        });
        
        // Atualizar estoque dos produtos comprados
        const itens = JSON.parse(input.itens);
        for (const item of itens) {
          const produto = await db.getProdutoById(item.id);
          if (produto) {
            const novoEstoque = produto.estoque + item.quantidade;
            await db.updateEstoqueProduto(item.id, novoEstoque);
            await db.createMovimentacaoEstoque({
              produtoId: item.id,
              tipo: "entrada",
              quantidade: item.quantidade,
              estoqueAnterior: produto.estoque,
              estoqueAtual: novoEstoque,
              valorUnitario: item.valorUnitario,
              motivo: "Compra",
              documentoReferencia: input.numero,
              usuarioId: ctx.user.id,
            });
          }
        }
        
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_compra",
          modulo: "compras",
          descricao: `Compra ${input.numero} criada`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
  }),

  // Estoque
  estoque: router({
    movimentacoes: protectedProcedure
      .input(z.object({ produtoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMovimentacoesByProduto(input.produtoId);
      }),
    ajustar: protectedProcedure
      .input(z.object({
        produtoId: z.number(),
        novaQuantidade: z.number(),
        motivo: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const produto = await db.getProdutoById(input.produtoId);
        if (!produto) {
          throw new Error("Produto não encontrado");
        }
        
        await db.updateEstoqueProduto(input.produtoId, input.novaQuantidade);
        await db.createMovimentacaoEstoque({
          produtoId: input.produtoId,
          tipo: "ajuste",
          quantidade: input.novaQuantidade - produto.estoque,
          estoqueAnterior: produto.estoque,
          estoqueAtual: input.novaQuantidade,
          motivo: input.motivo,
          usuarioId: ctx.user.id,
        });
        
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "ajuste_estoque",
          modulo: "estoque",
          descricao: `Estoque do produto ID ${input.produtoId} ajustado`,
          dadosAntes: JSON.stringify({ estoque: produto.estoque }),
          dadosDepois: JSON.stringify({ estoque: input.novaQuantidade }),
        });
        
        return { success: true };
      }),
  }),

  // Financeiro
  financeiro: router({
    lancamentos: protectedProcedure.query(async () => {
      return await db.getAllLancamentos();
    }),
    lancamentosPorPeriodo: protectedProcedure
      .input(z.object({
        dataInicio: z.date(),
        dataFim: z.date(),
      }))
      .query(async ({ input }) => {
        return await db.getLancamentosByPeriodo(input.dataInicio, input.dataFim);
      }),
    vencidos: protectedProcedure.query(async () => {
      return await db.getLancamentosVencidos();
    }),
    criar: protectedProcedure
      .input(z.object({
        tipo: z.enum(["receita", "despesa"]),
        categoria: z.string(),
        descricao: z.string(),
        valor: z.string(),
        dataVencimento: z.date(),
        dataPagamento: z.date().optional(),
        status: z.enum(["pendente", "pago", "vencido", "cancelado"]).default("pendente"),
        formaPagamento: z.string().optional(),
        contaBancariaId: z.number().optional(),
        clienteId: z.number().optional(),
        fornecedorId: z.number().optional(),
        vendaId: z.number().optional(),
        compraId: z.number().optional(),
        recorrente: z.boolean().default(false),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createLancamento({
          ...input,
          usuarioId: ctx.user.id,
        });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_lancamento",
          modulo: "financeiro",
          descricao: `Lançamento ${input.tipo} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    atualizar: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          status: z.enum(["pendente", "pago", "vencido", "cancelado"]).optional(),
          dataPagamento: z.date().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateLancamento(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_lancamento",
          modulo: "financeiro",
          descricao: `Lançamento ID ${input.id} atualizado`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    contas: protectedProcedure.query(async () => {
      return await db.getAllContasBancarias();
    }),
    criarConta: protectedProcedure
      .input(z.object({
        banco: z.string(),
        agencia: z.string(),
        conta: z.string(),
        tipo: z.enum(["corrente", "poupanca", "investimento"]).default("corrente"),
        saldoInicial: z.string().default("0"),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createContaBancaria({
          ...input,
          saldoAtual: input.saldoInicial,
        });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_conta_bancaria",
          modulo: "financeiro",
          descricao: `Conta bancária ${input.banco} criada`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
  }),

  // Notas Fiscais
  fiscal: router({
    notas: protectedProcedure.query(async () => {
      return await db.getAllNotasFiscais();
    }),
    criar: protectedProcedure
      .input(z.object({
        tipo: z.enum(["produto", "servico"]),
        clienteId: z.number(),
        vendaId: z.number().optional(),
        valorTotal: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createNotaFiscal({
          ...input,
          usuarioId: ctx.user.id,
        });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_nota_fiscal",
          modulo: "fiscal",
          descricao: `Nota fiscal ${input.tipo} criada`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    atualizar: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          numero: z.string().optional(),
          serie: z.string().optional(),
          chaveAcesso: z.string().optional(),
          status: z.enum(["pendente", "emitida", "cancelada", "erro"]).optional(),
          xmlUrl: z.string().optional(),
          pdfUrl: z.string().optional(),
          focusApiReferencia: z.string().optional(),
          mensagemErro: z.string().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateNotaFiscal(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_nota_fiscal",
          modulo: "fiscal",
          descricao: `Nota fiscal ID ${input.id} atualizada`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
  }),

  // IA
  ai: aiRouter,

  // Integrações
  integrations: integrationsRouter,

  // Logs
  logs: router({
    auditoria: protectedProcedure
      .input(z.object({ limit: z.number().default(100) }))
      .query(async ({ input }) => {
        return await db.getLogsAuditoria(input.limit);
      }),
    integracoes: protectedProcedure
      .input(z.object({
        servico: z.string().optional(),
        limit: z.number().default(100),
      }))
      .query(async ({ input }) => {
        return await db.getLogsIntegracoes(input.servico, input.limit);
      }),
  }),
});

export type AppRouter = typeof appRouter;
