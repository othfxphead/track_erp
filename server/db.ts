import { eq, desc, and, gte, lte, lt, sql, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  empresas, InsertEmpresa,
  clientes, InsertCliente,
  fornecedores, InsertFornecedor,
  produtos, InsertProduto,
  servicos, InsertServico,
  orcamentos, InsertOrcamento,
  vendas, InsertVenda,
  compras, InsertCompra,
  movimentacoesEstoque, InsertMovimentacaoEstoque,
  contasBancarias, InsertContaBancaria,
  lancamentosFinanceiros, InsertLancamentoFinanceiro,
  notasFiscais, InsertNotaFiscal,
  logsAuditoria, InsertLogAuditoria,
  logsIntegracoes, InsertLogIntegracao
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============= USERS =============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserPermissions(userId: number, permissions: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ permissions }).where(eq(users.id, userId));
}

// ============= EMPRESAS =============
export async function getEmpresa() {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(empresas).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertEmpresa(data: InsertEmpresa) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await getEmpresa();
  if (existing) {
    await db.update(empresas).set(data).where(eq(empresas.id, existing.id));
    return existing.id;
  } else {
    const result = await db.insert(empresas).values(data);
    return result[0].insertId;
  }
}

// ============= CLIENTES =============
export async function getAllClientes() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clientes).orderBy(desc(clientes.createdAt));
}

export async function getClienteById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(clientes).where(eq(clientes.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createCliente(data: InsertCliente) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(clientes).values(data);
  return result[0].insertId;
}

export async function updateCliente(id: number, data: Partial<InsertCliente>) {
  const db = await getDb();
  if (!db) return;
  await db.update(clientes).set(data).where(eq(clientes.id, id));
}

// ============= FORNECEDORES =============
export async function getAllFornecedores() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(fornecedores).orderBy(desc(fornecedores.createdAt));
}

export async function createFornecedor(data: InsertFornecedor) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(fornecedores).values(data);
  return result[0].insertId;
}

// ============= PRODUTOS =============
export async function getAllProdutos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(produtos).orderBy(desc(produtos.createdAt));
}

export async function getProdutoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(produtos).where(eq(produtos.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createProduto(data: InsertProduto) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(produtos).values(data);
  return result[0].insertId;
}

export async function updateProduto(id: number, data: Partial<InsertProduto>) {
  const db = await getDb();
  if (!db) return;
  await db.update(produtos).set(data).where(eq(produtos.id, id));
}

export async function updateEstoqueProduto(id: number, quantidade: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(produtos).set({ estoque: quantidade }).where(eq(produtos.id, id));
}

// ============= SERVIÇOS =============
export async function getAllServicos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(servicos).orderBy(desc(servicos.createdAt));
}

export async function createServico(data: InsertServico) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(servicos).values(data);
  return result[0].insertId;
}

// ============= ORÇAMENTOS =============
export async function getAllOrcamentos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orcamentos).orderBy(desc(orcamentos.createdAt));
}

export async function getOrcamentoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(orcamentos).where(eq(orcamentos.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createOrcamento(data: InsertOrcamento) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(orcamentos).values(data);
  return result[0].insertId;
}

export async function updateOrcamento(id: number, data: Partial<InsertOrcamento>) {
  const db = await getDb();
  if (!db) return;
  await db.update(orcamentos).set(data).where(eq(orcamentos.id, id));
}

// ============= VENDAS =============
export async function getAllVendas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(vendas).orderBy(desc(vendas.createdAt));
}

export async function getVendaById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(vendas).where(eq(vendas.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createVenda(data: InsertVenda) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(vendas).values(data);
  return result[0].insertId;
}

export async function updateVenda(id: number, data: Partial<InsertVenda>) {
  const db = await getDb();
  if (!db) return;
  await db.update(vendas).set(data).where(eq(vendas.id, id));
}

// ============= COMPRAS =============
export async function getAllCompras() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(compras).orderBy(desc(compras.createdAt));
}

export async function createCompra(data: InsertCompra) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(compras).values(data);
  return result[0].insertId;
}

// ============= MOVIMENTAÇÕES ESTOQUE =============
export async function createMovimentacaoEstoque(data: InsertMovimentacaoEstoque) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(movimentacoesEstoque).values(data);
  return result[0].insertId;
}

export async function getMovimentacoesByProduto(produtoId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(movimentacoesEstoque)
    .where(eq(movimentacoesEstoque.produtoId, produtoId))
    .orderBy(desc(movimentacoesEstoque.createdAt));
}

// ============= CONTAS BANCÁRIAS =============
export async function getAllContasBancarias() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(contasBancarias).orderBy(desc(contasBancarias.createdAt));
}

export async function createContaBancaria(data: InsertContaBancaria) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(contasBancarias).values(data);
  return result[0].insertId;
}

export async function updateSaldoConta(id: number, novoSaldo: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(contasBancarias).set({ saldoAtual: novoSaldo }).where(eq(contasBancarias.id, id));
}

// ============= LANÇAMENTOS FINANCEIROS =============
export async function getAllLancamentos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(lancamentosFinanceiros).orderBy(desc(lancamentosFinanceiros.dataVencimento));
}

export async function getLancamentosByPeriodo(dataInicio: Date, dataFim: Date) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(lancamentosFinanceiros)
    .where(and(
      gte(lancamentosFinanceiros.dataVencimento, dataInicio),
      lte(lancamentosFinanceiros.dataVencimento, dataFim)
    ))
    .orderBy(desc(lancamentosFinanceiros.dataVencimento));
}

export async function getLancamentosVencidos() {
  const db = await getDb();
  if (!db) return [];
  const hoje = new Date();
  return await db.select().from(lancamentosFinanceiros)
    .where(and(
      eq(lancamentosFinanceiros.status, "pendente"),
      lte(lancamentosFinanceiros.dataVencimento, hoje)
    ))
    .orderBy(desc(lancamentosFinanceiros.dataVencimento));
}

export async function createLancamento(data: InsertLancamentoFinanceiro) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(lancamentosFinanceiros).values(data);
  return result[0].insertId;
}

export async function updateLancamento(id: number, data: Partial<InsertLancamentoFinanceiro>) {
  const db = await getDb();
  if (!db) return;
  await db.update(lancamentosFinanceiros).set(data).where(eq(lancamentosFinanceiros.id, id));
}

// ============= NOTAS FISCAIS =============
export async function getAllNotasFiscais() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notasFiscais).orderBy(desc(notasFiscais.createdAt));
}

export async function createNotaFiscal(data: InsertNotaFiscal) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(notasFiscais).values(data);
  return result[0].insertId;
}

export async function updateNotaFiscal(id: number, data: Partial<InsertNotaFiscal>) {
  const db = await getDb();
  if (!db) return;
  await db.update(notasFiscais).set(data).where(eq(notasFiscais.id, id));
}

// ============= LOGS AUDITORIA =============
export async function createLogAuditoria(data: InsertLogAuditoria) {
  const db = await getDb();
  if (!db) return;
  await db.insert(logsAuditoria).values(data);
}

export async function getLogsAuditoria(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(logsAuditoria).orderBy(desc(logsAuditoria.createdAt)).limit(limit);
}

// ============= LOGS INTEGRAÇÕES =============
export async function createLogIntegracao(data: InsertLogIntegracao) {
  const db = await getDb();
  if (!db) return;
  await db.insert(logsIntegracoes).values(data);
}

export async function getLogsIntegracoes(servico?: string, limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  
  if (servico) {
    return await db.select().from(logsIntegracoes)
      .where(eq(logsIntegracoes.servico, servico))
      .orderBy(desc(logsIntegracoes.createdAt))
      .limit(limit);
  }
  
  return await db.select().from(logsIntegracoes)
    .orderBy(desc(logsIntegracoes.createdAt))
    .limit(limit);
}

// ============= DASHBOARD KPIs =============
export async function getDashboardKPIs() {
  const db = await getDb();
  if (!db) return null;

  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const ultimoDiaMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  // Contas a receber
  const contasReceber = await db.select().from(lancamentosFinanceiros)
    .where(and(
      eq(lancamentosFinanceiros.tipo, "receita"),
      eq(lancamentosFinanceiros.status, "pendente")
    ));

  // Contas a pagar
  const contasPagar = await db.select().from(lancamentosFinanceiros)
    .where(and(
      eq(lancamentosFinanceiros.tipo, "despesa"),
      eq(lancamentosFinanceiros.status, "pendente")
    ));

  // Contas vencidas
  const contasVencidas = await getLancamentosVencidos();

  // Vendas do mês
  const vendasMes = await db.select().from(vendas)
    .where(and(
      gte(vendas.dataVenda, primeiroDiaMes),
      lte(vendas.dataVenda, ultimoDiaMes)
    ));

  const totalReceber = contasReceber.reduce((sum, c) => sum + parseFloat(c.valor as any), 0);
  const totalPagar = contasPagar.reduce((sum, c) => sum + parseFloat(c.valor as any), 0);
  const totalVencido = contasVencidas.reduce((sum, c) => sum + parseFloat(c.valor as any), 0);
  const totalVendasMes = vendasMes.reduce((sum, v) => sum + parseFloat(v.valorTotal as any), 0);

  return {
    contasReceber: totalReceber,
    contasPagar: totalPagar,
    contasVencidas: totalVencido,
    vendasMes: totalVendasMes,
    quantidadeVencidas: contasVencidas.length,
  };
}

// ============= DASHBOARD CHARTS =============
export async function getVendasPorMes(dataInicio?: Date, dataFim?: Date) {
  const db = await getDb();
  if (!db) return [];

  const hoje = new Date();
  const inicio = dataInicio || new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
  const fim = dataFim || hoje;

  const vendasData = await db.select().from(vendas)
    .where(and(
      gte(vendas.dataVenda, inicio),
      lte(vendas.dataVenda, fim)
    ))
    .orderBy(vendas.dataVenda);

  // Agrupar por mês
  const vendasPorMes: Record<string, number> = {};
  
  vendasData.forEach((venda) => {
    const data = new Date(venda.dataVenda);
    const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    
    if (!vendasPorMes[mesAno]) {
      vendasPorMes[mesAno] = 0;
    }
    vendasPorMes[mesAno] += parseFloat(venda.valorTotal as any);
  });

  // Criar array de meses no período
  const resultado = [];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const dataAtual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const dataFinal = new Date(fim.getFullYear(), fim.getMonth(), 1);
  
  while (dataAtual <= dataFinal) {
    const mesAno = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;
    resultado.push({
      mes: meses[dataAtual.getMonth()],
      valor: vendasPorMes[mesAno] || 0,
    });
    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return resultado;
}

export async function getFluxoCaixaPorMes(dataInicio?: Date, dataFim?: Date) {
  const db = await getDb();
  if (!db) return [];

  const hoje = new Date();
  const inicio = dataInicio || new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
  const fim = dataFim || hoje;

  const lancamentos = await db.select().from(lancamentosFinanceiros)
    .where(and(
      gte(lancamentosFinanceiros.dataVencimento, inicio),
      lte(lancamentosFinanceiros.dataVencimento, fim)
    ))
    .orderBy(lancamentosFinanceiros.dataVencimento);

  // Agrupar por mês e tipo
  const receitasPorMes: Record<string, number> = {};
  const despesasPorMes: Record<string, number> = {};
  
  lancamentos.forEach((lancamento) => {
    const data = new Date(lancamento.dataVencimento);
    const mesAno = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    
    if (lancamento.tipo === 'receita') {
      if (!receitasPorMes[mesAno]) {
        receitasPorMes[mesAno] = 0;
      }
      receitasPorMes[mesAno] += parseFloat(lancamento.valor as any);
    } else {
      if (!despesasPorMes[mesAno]) {
        despesasPorMes[mesAno] = 0;
      }
      despesasPorMes[mesAno] += parseFloat(lancamento.valor as any);
    }
  });

  // Criar array de meses no período
  const resultado = [];
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const dataAtual = new Date(inicio.getFullYear(), inicio.getMonth(), 1);
  const dataFinal = new Date(fim.getFullYear(), fim.getMonth(), 1);
  
  while (dataAtual <= dataFinal) {
    const mesAno = `${dataAtual.getFullYear()}-${String(dataAtual.getMonth() + 1).padStart(2, '0')}`;
    resultado.push({
      mes: meses[dataAtual.getMonth()],
      receitas: receitasPorMes[mesAno] || 0,
      despesas: despesasPorMes[mesAno] || 0,
    });
    dataAtual.setMonth(dataAtual.getMonth() + 1);
  }

  return resultado;
}


// ============= NOTIFICAÇÕES =============
export async function getNotificacoes() {
  const db = await getDb();
  if (!db) return [];

  const hoje = new Date();
  const seteDiasDepois = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);

  const notificacoes: Array<{
    id: string;
    tipo: 'warning' | 'danger' | 'info';
    titulo: string;
    mensagem: string;
    link?: string;
    data: Date;
  }> = [];

  // 1. Orçamentos vencidos
  const orcamentosVencidos = await db.select().from(orcamentos)
    .where(and(
      lt(orcamentos.dataValidade, hoje),
      eq(orcamentos.status, 'pendente')
    ));

  orcamentosVencidos.forEach((orc) => {
    notificacoes.push({
      id: `orcamento-${orc.id}`,
      tipo: 'warning',
      titulo: 'Orçamento vencido',
      mensagem: `Orçamento #${orc.numero} venceu em ${new Date(orc.dataValidade).toLocaleDateString('pt-BR')}`,
      link: `/orcamentos/${orc.id}`,
      data: new Date(orc.dataValidade),
    });
  });

  // 2. Contas a pagar próximas do vencimento (próximos 7 dias)
  const contasPagar = await db.select().from(lancamentosFinanceiros)
    .where(and(
      eq(lancamentosFinanceiros.tipo, 'despesa'),
      eq(lancamentosFinanceiros.status, 'pendente'),
      gte(lancamentosFinanceiros.dataVencimento, hoje),
      lte(lancamentosFinanceiros.dataVencimento, seteDiasDepois)
    ));

  contasPagar.forEach((conta) => {
    const diasRestantes = Math.ceil((new Date(conta.dataVencimento).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    notificacoes.push({
      id: `conta-pagar-${conta.id}`,
      tipo: diasRestantes <= 3 ? 'danger' : 'warning',
      titulo: 'Conta a pagar próxima do vencimento',
      mensagem: `${conta.descricao} - R$ ${parseFloat(conta.valor as any).toFixed(2)} vence em ${diasRestantes} dia(s)`,
      link: `/financeiro`,
      data: new Date(conta.dataVencimento),
    });
  });

  // 3. Contas a receber próximas do vencimento (próximos 7 dias)
  const contasReceber = await db.select().from(lancamentosFinanceiros)
    .where(and(
      eq(lancamentosFinanceiros.tipo, 'receita'),
      eq(lancamentosFinanceiros.status, 'pendente'),
      gte(lancamentosFinanceiros.dataVencimento, hoje),
      lte(lancamentosFinanceiros.dataVencimento, seteDiasDepois)
    ));

  contasReceber.forEach((conta) => {
    const diasRestantes = Math.ceil((new Date(conta.dataVencimento).getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    notificacoes.push({
      id: `conta-receber-${conta.id}`,
      tipo: 'info',
      titulo: 'Conta a receber próxima do vencimento',
      mensagem: `${conta.descricao} - R$ ${parseFloat(conta.valor as any).toFixed(2)} vence em ${diasRestantes} dia(s)`,
      link: `/financeiro`,
      data: new Date(conta.dataVencimento),
    });
  });

  // 4. Produtos com estoque baixo
  const produtosEstoqueBaixo = await db.select().from(produtos)
    .where(sql`${produtos.estoque} <= ${produtos.estoqueMinimo}`);

  produtosEstoqueBaixo.forEach((produto) => {
    notificacoes.push({
      id: `estoque-${produto.id}`,
      tipo: 'danger',
      titulo: 'Estoque baixo',
      mensagem: `${produto.nome} - Estoque: ${produto.estoque} (mínimo: ${produto.estoqueMinimo})`,
      link: `/produtos`,
      data: hoje,
    });
  });

  // Ordenar por data (mais recentes primeiro)
  return notificacoes.sort((a, b) => b.data.getTime() - a.data.getTime());
}
