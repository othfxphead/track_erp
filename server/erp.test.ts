import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@track-erp.com",
    name: "Test User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Track ERP - Testes de Integração", () => {
  describe("Dashboard KPIs", () => {
    it("deve retornar KPIs do dashboard", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const kpis = await caller.dashboard.kpis();

      expect(kpis).toBeDefined();
      expect(kpis).toHaveProperty("contasReceber");
      expect(kpis).toHaveProperty("contasPagar");
      expect(kpis).toHaveProperty("contasVencidas");
      expect(kpis).toHaveProperty("vendasMes");
    });
  });

  describe("Produtos", () => {
    it("deve listar produtos", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const produtos = await caller.produtos.list();

      expect(Array.isArray(produtos)).toBe(true);
    });

    it("deve criar um novo produto", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const novoProduto = {
        codigo: `TEST-${Date.now()}`,
        nome: "Produto Teste",
        descricao: "Descrição do produto teste",
        unidade: "UN",
        precoCusto: "10.00",
        precoVenda: "15.00",
        margemLucro: "50.00",
        estoque: 10,
        estoqueMinimo: 5,
        categoria: "Testes",
      };

      const resultado = await caller.produtos.create(novoProduto);

      expect(resultado).toBeDefined();
      expect(resultado.success).toBe(true);
      expect(resultado.id).toBeDefined();
    });
  });

  describe("Clientes", () => {
    it("deve listar clientes", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const clientes = await caller.clientes.list();

      expect(Array.isArray(clientes)).toBe(true);
    });

    it("deve criar um novo cliente", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const novoCliente = {
        tipo: "fisica" as const,
        nome: "Cliente Teste",
        cpfCnpj: "12345678900",
        email: "cliente@teste.com",
        telefone: "(11) 98765-4321",
      };

      const resultado = await caller.clientes.create(novoCliente);

      expect(resultado).toBeDefined();
      expect(resultado.success).toBe(true);
      expect(resultado.id).toBeDefined();
    });
  });

  describe("Orçamentos", () => {
    it("deve listar orçamentos", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const orcamentos = await caller.orcamentos.list();

      expect(Array.isArray(orcamentos)).toBe(true);
    });
  });

  describe("Vendas", () => {
    it("deve listar vendas", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const vendas = await caller.vendas.list();

      expect(Array.isArray(vendas)).toBe(true);
    });
  });

  describe("Financeiro", () => {
    it("deve listar lançamentos financeiros", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const lancamentos = await caller.financeiro.lancamentos();

      expect(Array.isArray(lancamentos)).toBe(true);
    });

    it("deve listar contas vencidas", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const vencidos = await caller.financeiro.vencidos();

      expect(Array.isArray(vencidos)).toBe(true);
    });

    it("deve listar contas bancárias", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const contas = await caller.financeiro.contas();

      expect(Array.isArray(contas)).toBe(true);
    });
  });

  describe("Fiscal", () => {
    it("deve listar notas fiscais", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const notas = await caller.fiscal.notas();

      expect(Array.isArray(notas)).toBe(true);
    });
  });

  describe("Estoque", () => {
    it("deve buscar movimentações de estoque", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      // Primeiro criar um produto para testar
      const novoProduto = {
        codigo: `EST-${Date.now()}`,
        nome: "Produto Estoque Teste",
        unidade: "UN",
        precoCusto: "5.00",
        precoVenda: "10.00",
        estoque: 100,
        estoqueMinimo: 10,
      };

      const produtoCriado = await caller.produtos.create(novoProduto);
      
      if (produtoCriado.id) {
        const movimentacoes = await caller.estoque.movimentacoes({ produtoId: produtoCriado.id });
        expect(Array.isArray(movimentacoes)).toBe(true);
      }
    });
  });

  describe("Logs", () => {
    it("deve listar logs de auditoria", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const logs = await caller.logs.auditoria({ limit: 10 });

      expect(Array.isArray(logs)).toBe(true);
    });

    it("deve listar logs de integrações", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const logs = await caller.logs.integracoes({ limit: 10 });

      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe("Empresa", () => {
    it("deve buscar dados da empresa", async () => {
      const { ctx } = createTestContext();
      const caller = appRouter.createCaller(ctx);

      const empresa = await caller.empresa.get();

      // Pode ser null se ainda não foi configurada
      expect(empresa === null || typeof empresa === "object").toBe(true);
    });
  });
});
