import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { aiRouter } from "./routers/ai";
import { integrationsRouter } from "./routers/integrations";
import { AIOrchestrator } from "./services/aiOrchestrator";

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
      return await db.getNotificacoes(ctx.user.id);
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
        email: z.string().optional(),
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
    uploadCertificado: protectedProcedure
      .input(z.object({
        base64: z.string(),
        fileName: z.string(),
        senha: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { storagePut } = await import("./storage");
        const buffer = Buffer.from(input.base64, "base64");
        
        // Validar formato do arquivo
        if (!input.fileName.endsWith(".pfx") && !input.fileName.endsWith(".p12")) {
          throw new Error("Formato inválido. Envie um arquivo .pfx ou .p12");
        }
        
        // Validar tamanho (máx 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
          throw new Error("Arquivo muito grande. Tamanho máximo: 5MB");
        }
        
        // TODO: Validar certificado com a senha fornecida
        // Isso requer biblioteca como node-forge ou pkcs12
        // Por ora, apenas salvamos
        
        const randomSuffix = Math.random().toString(36).substring(7);
        const key = `certificados/${Date.now()}-${randomSuffix}-${input.fileName}`;
        const { url } = await storagePut(key, buffer, "application/x-pkcs12");
        
        // Buscar empresa existente e atualizar certificado
        const empresaAtual = await db.getEmpresa();
        if (empresaAtual) {
          await db.upsertEmpresa({
            ...empresaAtual,
            certificadoDigitalUrl: url,
            certificadoSenha: input.senha,
            // TODO: Extrair datas de validade do certificado
            // certificadoValidadeInicio: new Date(),
            // certificadoValidadeFim: new Date(),
          });
        } else {
          throw new Error("Configure os dados da empresa antes de enviar o certificado");
        }
        
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "upload_certificado",
          modulo: "configuracoes",
          descricao: "Certificado digital A1 atualizado",
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
        email: z.string().optional(),
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
          email: z.string().optional(),
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
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteCliente(input.id);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "delete_cliente",
          modulo: "clientes",
          descricao: `Cliente ID ${input.id} excluído`,
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
        email: z.string().optional(),
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
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getFornecedorById(input.id);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          tipo: z.enum(["fisica", "juridica"]).optional(),
          nome: z.string().optional(),
          cpfCnpj: z.string().optional(),
          email: z.string().email().optional(),
          telefone: z.string().optional(),
          endereco: z.string().optional(),
          cidade: z.string().optional(),
          estado: z.string().optional(),
          cep: z.string().optional(),
          observacoes: z.string().optional(),
          ativo: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateFornecedor(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_fornecedor",
          modulo: "fornecedores",
          descricao: `Fornecedor ID ${input.id} atualizado`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteFornecedor(input.id);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "delete_fornecedor",
          modulo: "fornecedores",
          descricao: `Fornecedor ID ${input.id} excluído`,
        });
        return { success: true };
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
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServicoById(input.id);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          codigo: z.string().optional(),
          nome: z.string().optional(),
          descricao: z.string().optional(),
          valorUnitario: z.string().optional(),
          categoria: z.string().optional(),
          codigoServico: z.string().optional(),
          ativo: z.boolean().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateServico(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_servico",
          modulo: "servicos",
          descricao: `Serviço ID ${input.id} atualizado`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteServico(input.id);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "delete_servico",
          modulo: "servicos",
          descricao: `Serviço ID ${input.id} excluído`,
        });
        return { success: true };
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
          // Garantir que itens seja string JSON
          const itensString = typeof orcamento.itens === 'string' 
            ? orcamento.itens 
            : JSON.stringify(orcamento.itens);
          
          await db.createVenda({
            numero: `VEN-${Date.now()}`,
            clienteId: orcamento.clienteId,
            valorTotal: orcamento.valorTotal,
            desconto: orcamento.desconto,
            observacoes: `Convertido do orçamento ${orcamento.numero}`,
            itens: itensString,
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
        let itens = [];
        try {
          itens = typeof input.itens === 'string' ? JSON.parse(input.itens) : input.itens;
          if (!Array.isArray(itens)) itens = [];
        } catch (e) {
          console.error('Erro ao fazer parse de itens:', e);
          itens = [];
        }
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
    emitirNFe: protectedProcedure
      .input(z.object({
        vendaId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        // 1. Buscar configurações fiscais
        const config = await db.getConfigFiscal();
        if (!config || !config.nfeAtivo) {
          throw new Error("Emissão de NF-e não está configurada. Configure em Configurações > Configurações Fiscais");
        }

        // 2. Buscar dados da empresa
        const empresa = await db.getEmpresa();
        if (!empresa) {
          throw new Error("Dados da empresa não encontrados. Configure em Configurações > Dados da Empresa");
        }

        // 3. Buscar dados da venda com itens
        const venda = await db.getVendaById(input.vendaId);
        if (!venda) {
          throw new Error("Venda não encontrada");
        }

        // 4. Buscar cliente
        const cliente = await db.getClienteById(venda.clienteId);
        if (!cliente) {
          throw new Error("Cliente não encontrado");
        }

        // 5. Importar serviço Focus NFe
        const { emitirNFe: emitirNFeAPI } = await import("./services/focusNFe");

        // 6. Montar dados da NFe
        const referencia = `VENDA-${venda.id}-${Date.now()}`;
        const dadosNFe = {
          natureza_operacao: "Venda de mercadoria",
          tipo_documento: "1", // Saída
          finalidade_emissao: "1", // Normal
          cnpj_emitente: empresa.cnpj?.replace(/\D/g, "") || "",
          inscricao_estadual_emitente: config.nfeInscricaoEstadual || "",
          nome_emitente: empresa.razaoSocial || "",
          nome_fantasia_emitente: empresa.nomeFantasia || "",
          logradouro_emitente: empresa.endereco || "",
          numero_emitente: empresa.numero || "",
          bairro_emitente: empresa.bairro || "",
          municipio_emitente: empresa.cidade || "",
          uf_emitente: empresa.estado || "",
          cep_emitente: empresa.cep?.replace(/\D/g, "") || "",
          telefone_emitente: empresa.telefone?.replace(/\D/g, "") || "",
          cpf_destinatario: cliente.cpf?.replace(/\D/g, ""),
          cnpj_destinatario: cliente.cnpj?.replace(/\D/g, ""),
          nome_destinatario: cliente.nome,
          logradouro_destinatario: cliente.endereco || "",
          numero_destinatario: cliente.numero || "S/N",
          bairro_destinatario: cliente.bairro || "",
          municipio_destinatario: cliente.cidade || "",
          uf_destinatario: cliente.estado || "",
          cep_destinatario: cliente.cep?.replace(/\D/g, "") || "",
          items: [{
            numero_item: "1",
            codigo_produto: "VENDA",
            descricao: `Venda #${venda.id}`,
            cfop: "5102",
            unidade_comercial: "UN",
            quantidade_comercial: "1",
            valor_unitario_comercial: venda.valorTotal,
            valor_bruto: venda.valorTotal,
            icms_situacao_tributaria: "102",
          }],
        };

        // 7. Criar registro de nota fiscal
        const notaId = await db.createNotaFiscal({
          tipo: "produto",
          clienteId: venda.clienteId,
          vendaId: venda.id,
          valorTotal: venda.valorTotal,
          serie: config.nfeSerie || "1",
          status: "pendente",
          focusApiReferencia: referencia,
          usuarioId: ctx.user.id,
        });

        try {
          // 8. Emitir NFe via Focus API
          const resultado = await emitirNFeAPI(referencia, dadosNFe);

          // 9. Atualizar nota com dados da emissão
          await db.updateNotaFiscal(notaId, {
            status: resultado.status === "autorizado" ? "emitida" : "pendente",
            numero: resultado.numero,
            chaveAcesso: resultado.chave_nfe,
            dataEmissao: new Date(),
          });

          // 9.1. Atualizar status da venda para "faturado" se nota foi autorizada
          if (resultado.status === "autorizado") {
            await db.updateVenda(venda.id, {
              status: "faturado",
            });
          }

          // 10. Atualizar último número da NF-e nas configurações
          if (resultado.numero) {
            await db.upsertConfigFiscal({
              nfeUltimoNumero: resultado.numero,
            });
          }

          // 11. Log de auditoria
          await db.createLogAuditoria({
            usuarioId: ctx.user.id,
            acao: "emitir_nfe",
            modulo: "fiscal",
            descricao: `NF-e emitida para venda #${venda.id}`,
            dadosDepois: JSON.stringify(resultado),
          });

          return { 
            success: true, 
            notaId,
            numero: resultado.numero,
            chaveAcesso: resultado.chave_nfe,
            status: resultado.status,
            mensagem: resultado.mensagem_sefaz,
            referencia: referencia,
          };
        } catch (error: any) {
          // Atualizar nota com erro
          await db.updateNotaFiscal(notaId, {
            status: "erro",
            mensagemErro: error.message,
          });
          throw error;
        }
      }),
    cancelarNFe: protectedProcedure
      .input(z.object({
        referencia: z.string(),
        justificativa: z.string().min(15, "Justificativa deve ter no mínimo 15 caracteres"),
      }))
      .mutation(async ({ input, ctx }) => {
        const { cancelarNFe: cancelarNFeAPI } = await import("./services/focusNFe");
        
        // Cancelar via Focus API
        const resultado = await cancelarNFeAPI(input.referencia, input.justificativa);
        
        // Buscar nota pelo focusApiReferencia
        const notas = await db.getAllNotasFiscais();
        const nota = notas.find(n => n.focusApiReferencia === input.referencia);
        
        if (nota) {
          await db.updateNotaFiscal(nota.id, {
            status: "cancelada",
          });
        }
        
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "cancelar_nfe",
          modulo: "fiscal",
          descricao: `NF-e ${input.referencia} cancelada`,
          dadosDepois: JSON.stringify({ justificativa: input.justificativa }),
        });
        
        return { success: true, resultado };
      }),
    downloadXML: protectedProcedure
      .input(z.object({
        referencia: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { baixarXMLNFe } = await import("./services/focusNFe");
        const xmlBuffer = await baixarXMLNFe(input.referencia);
        
        // Buscar nota para pegar o número
        const notas = await db.getAllNotasFiscais();
        const nota = notas.find(n => n.focusApiReferencia === input.referencia);
        
        return { 
          xml: xmlBuffer.toString("utf-8"),
          numero: nota?.numero || input.referencia,
        };
      }),
    downloadPDF: protectedProcedure
      .input(z.object({
        referencia: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { baixarPDFNFe } = await import("./services/focusNFe");
        const pdfBuffer = await baixarPDFNFe(input.referencia);
        
        // Buscar nota para pegar o número
        const notas = await db.getAllNotasFiscais();
        const nota = notas.find(n => n.focusApiReferencia === input.referencia);
        
        return { 
          pdf: pdfBuffer.toString("base64"),
          numero: nota?.numero || input.referencia,
        };
      }),
  }),

  // IA
  ai: aiRouter,

  // Integrações
  integrations: integrationsRouter,

  // Contratos
  contratos: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllContratos();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContratoById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string(),
        clienteId: z.number(),
        tipo: z.enum(["mensal", "trimestral", "semestral", "anual"]),
        dataInicio: z.date(),
        dataFim: z.date(),
        valor: z.string(),
        diaVencimento: z.number(),
        status: z.enum(["ativo", "pendente", "expirado", "cancelado"]).default("ativo"),
        observacoes: z.string().optional(),
        itens: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createContrato({ ...input, usuarioId: ctx.user.id });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_contrato",
          modulo: "contratos",
          descricao: `Contrato ${input.numero} criado`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          numero: z.string().optional(),
          clienteId: z.number().optional(),
          tipo: z.enum(["mensal", "trimestral", "semestral", "anual"]).optional(),
          dataInicio: z.date().optional(),
          dataFim: z.date().optional(),
          valor: z.string().optional(),
          diaVencimento: z.number().optional(),
          status: z.enum(["ativo", "pendente", "expirado", "cancelado"]).optional(),
          observacoes: z.string().optional(),
          itens: z.string().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateContrato(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_contrato",
          modulo: "contratos",
          descricao: `Contrato ID ${input.id} atualizado`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteContrato(input.id);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "delete_contrato",
          modulo: "contratos",
          descricao: `Contrato ID ${input.id} excluído`,
        });
        return { success: true };
      }),
  }),

  // Parcelas
  parcelas: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllParcelas();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getParcelaById(input.id);
      }),
    getByVendaId: protectedProcedure
      .input(z.object({ vendaId: z.number() }))
      .query(async ({ input }) => {
        return await db.getParcelasByVendaId(input.vendaId);
      }),
    create: protectedProcedure
      .input(z.object({
        vendaId: z.number(),
        contratoId: z.number().optional(),
        numero: z.string(),
        dataVencimento: z.date(),
        dataPagamento: z.date().optional(),
        valor: z.string(),
        status: z.enum(["pendente", "pago", "vencido"]).default("pendente"),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createParcela(input);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_parcela",
          modulo: "parcelas",
          descricao: `Parcela ${input.numero} criada`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          dataVencimento: z.date().optional(),
          dataPagamento: z.date().optional(),
          valor: z.string().optional(),
          status: z.enum(["pendente", "pago", "vencido"]).optional(),
          formaPagamento: z.string().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateParcela(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_parcela",
          modulo: "parcelas",
          descricao: `Parcela ID ${input.id} atualizada`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteParcela(input.id);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "delete_parcela",
          modulo: "parcelas",
          descricao: `Parcela ID ${input.id} excluída`,
        });
        return { success: true };
      }),
  }),

  // Ordens de Serviço
  ordensServico: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllOrdensServico();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getOrdemServicoById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string(),
        clienteId: z.number(),
        servicoId: z.number(),
        tecnicoId: z.number().optional(),
        dataPrevista: z.date(),
        dataConclusao: z.date().optional(),
        valor: z.string(),
        status: z.enum(["pendente", "em_andamento", "concluida", "cancelada"]).default("pendente"),
        descricaoProblema: z.string().optional(),
        descricaoSolucao: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createOrdemServico({ ...input, usuarioId: ctx.user.id });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "create_ordem_servico",
          modulo: "ordens_servico",
          descricao: `Ordem de serviço ${input.numero} criada`,
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          numero: z.string().optional(),
          clienteId: z.number().optional(),
          servicoId: z.number().optional(),
          tecnicoId: z.number().optional(),
          dataPrevista: z.date().optional(),
          dataConclusao: z.date().optional(),
          valor: z.string().optional(),
          status: z.enum(["pendente", "em_andamento", "concluida", "cancelada"]).optional(),
          descricaoProblema: z.string().optional(),
          descricaoSolucao: z.string().optional(),
          observacoes: z.string().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.updateOrdemServico(input.id, input.data);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update_ordem_servico",
          modulo: "ordens_servico",
          descricao: `Ordem de serviço ID ${input.id} atualizada`,
          dadosDepois: JSON.stringify(input.data),
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteOrdemServico(input.id);
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "delete_ordem_servico",
          modulo: "ordens_servico",
          descricao: `Ordem de serviço ID ${input.id} excluída`,
        });
        return { success: true };
      }),
  }),

  // Favoritos
  favoritos: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllFavoritos(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        tipo: z.enum(["produto", "cliente", "fornecedor", "venda", "servico", "orcamento"]),
        referenciaId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createFavorito({
          usuarioId: ctx.user.id,
          tipo: input.tipo,
          referenciaId: input.referenciaId,
        });
        return { success: true, id };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteFavorito(input.id);
        return { success: true };
      }),
    deleteByRef: protectedProcedure
      .input(z.object({
        tipo: z.string(),
        referenciaId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteFavoritoByRef(ctx.user.id, input.tipo, input.referenciaId);
        return { success: true };
      }),
  }),

  // Contas a Pagar
  contasPagar: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllContasPagar();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContaPagarById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string(),
        fornecedorId: z.number().optional(),
        compraId: z.number().optional(),
        descricao: z.string(),
        categoria: z.string().optional(),
        dataVencimento: z.date(),
        valor: z.string(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createContaPagar({ ...input, usuarioId: ctx.user.id });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendente", "pago", "vencido", "cancelado"]).optional(),
        dataPagamento: z.date().optional(),
        valorPago: z.string().optional(),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data } = input;
        await db.updateContaPagar(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteContaPagar(input.id);
        return { success: true };
      }),
  }),

  // Contas a Receber
  contasReceber: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllContasReceber();
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getContaReceberById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        numero: z.string(),
        clienteId: z.number(),
        vendaId: z.number().optional(),
        parcelaId: z.number().optional(),
        descricao: z.string(),
        categoria: z.string().optional(),
        dataVencimento: z.date(),
        valor: z.string(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createContaReceber({ ...input, usuarioId: ctx.user.id });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendente", "recebido", "vencido", "cancelado"]).optional(),
        dataRecebimento: z.date().optional(),
        valorRecebido: z.string().optional(),
        formaPagamento: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { id, ...data} = input;
        await db.updateContaReceber(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteContaReceber(input.id);
        return { success: true };
      }),
  }),

  // Extratos Bancários
  extratosBancarios: router({
    list: protectedProcedure
      .input(z.object({ contaBancariaId: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getAllExtratosBancarios(input.contaBancariaId);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getExtratoBancarioById(input.id);
      }),
    create: protectedProcedure
      .input(z.object({
        contaBancariaId: z.number(),
        tipo: z.enum(["entrada", "saida", "transferencia"]),
        categoria: z.string().optional(),
        descricao: z.string(),
        data: z.date(),
        valor: z.string(),
        saldoAnterior: z.string(),
        saldoPosterior: z.string(),
        documento: z.string().optional(),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createExtratoBancario({ ...input, usuarioId: ctx.user.id });
        return { success: true, id };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        await db.deleteExtratoBancario(input.id);
        return { success: true };
      }),
  }),

  // DDA
  dda: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDDA();
    }),
    create: protectedProcedure
      .input(z.object({
        codigoBarras: z.string(),
        beneficiario: z.string(),
        pagador: z.string(),
        dataVencimento: z.date(),
        valor: z.string(),
        contaBancariaId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createDDA({ ...input, dataEmissao: new Date(), usuarioId: ctx.user.id });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendente", "autorizado", "pago", "rejeitado", "cancelado"]),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateDDA(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDDA(input.id);
        return { success: true };
      }),
  }),

  // Inadimplentes
  inadimplentes: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllInadimplentes();
    }),
    create: protectedProcedure
      .input(z.object({
        clienteId: z.number(),
        contaReceberId: z.number().optional(),
        parcelaId: z.number().optional(),
        valorDevido: z.string(),
        diasAtraso: z.number(),
        dataVencimento: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.createInadimplente({ ...input, dataInadimplencia: new Date(), usuarioId: ctx.user.id });
        return { success: true, id };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["ativo", "negociando", "parcelado", "quitado", "protesto"]),
        observacoes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateInadimplente(id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteInadimplente(input.id);
        return { success: true };
      }),
  }),

  // Configurações Fiscais
  configFiscais: router({
    get: protectedProcedure.query(async () => {
      return await db.getConfigFiscal();
    }),
    upsert: protectedProcedure
      .input(z.object({
        // NFS-e
        nfseAtivo: z.boolean().optional(),
        nfseInscricaoMunicipal: z.string().optional(),
        nfseUltimoRps: z.union([z.string(), z.number()]).optional(),
        nfseSerieRps: z.string().optional(),
        nfseRegimeTributario: z.string().optional(),
        nfseNaturezaOperacao: z.string().optional(),
        nfseUsuario: z.string().optional(),
        nfseSenha: z.string().optional(),
        // NF-e
        nfeAtivo: z.boolean().optional(),
        nfeInscricaoEstadual: z.string().optional(),
        nfeSerie: z.union([z.string(), z.number()]).optional(),
        nfeUltimoNumero: z.union([z.string(), z.number()]).optional(),
        nfeExcluirIcmsBaseCalculo: z.boolean().optional(),
        // NFC-e
        nfceAtivo: z.boolean().optional(),
        nfceIdCsc: z.string().optional(),
        nfceCodigoCsc: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const id = await db.upsertConfigFiscal({ ...input, usuarioId: ctx.user.id });
        await db.createLogAuditoria({
          usuarioId: ctx.user.id,
          acao: "update",
          modulo: "configFiscais",
          dadosAntes: JSON.stringify(await db.getConfigFiscal()),
          dadosDepois: JSON.stringify(input),
        });
        return { success: true, id };
      }),
  }),

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

  // IA Orquestradora
  aiAssistant: router({
    analisarSistema: protectedProcedure.query(async () => {
      const vendas = await db.getAllVendas();
      const clientes = await db.getAllClientes();
      const produtos = await db.getAllProdutos();
      
      return await AIOrchestrator.analisarSistema({
        vendas,
        clientes,
        produtos,
      });
    }),
    sugerirDestino: protectedProcedure
      .input(z.object({ descricao: z.string() }))
      .mutation(async ({ input }) => {
        return await AIOrchestrator.sugerirDestino(input.descricao);
      }),
    gerarRelatorio: protectedProcedure
      .input(z.object({
        tipo: z.string(),
        periodo: z.object({
          inicio: z.date(),
          fim: z.date(),
        }).optional(),
      }))
      .mutation(async ({ input }) => {
        let dados: any[] = [];
        
        // Buscar dados baseado no tipo de relatório
        switch (input.tipo.toLowerCase()) {
          case 'vendas':
            dados = await db.getAllVendas();
            break;
          case 'clientes':
            dados = await db.getAllClientes();
            break;
          case 'produtos':
            dados = await db.getAllProdutos();
            break;
          case 'financeiro':
            dados = await db.getAllVendas(); // Usar vendas como base
            break;
          default:
            dados = [];
        }
        
        return await AIOrchestrator.gerarRelatorio(input.tipo, dados, input.periodo);
      }),
    validarDados: protectedProcedure
      .input(z.object({
        modulo: z.string(),
        dados: z.any(),
      }))
      .mutation(async ({ input }) => {
        return await AIOrchestrator.validarEEnriquecerDados(input.modulo, input.dados);
      }),
  }),
});

export type AppRouter = typeof appRouter;
