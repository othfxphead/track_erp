import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "gerente", "operador", "user"]).default("user").notNull(),
  permissions: text("permissions"), // JSON array of module permissions
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Empresas - dados cadastrais da empresa
 */
export const empresas = mysqlTable("empresas", {
  id: int("id").autoincrement().primaryKey(),
  razaoSocial: varchar("razaoSocial", { length: 255 }).notNull(),
  nomeFantasia: varchar("nomeFantasia", { length: 255 }),
  cnpj: varchar("cnpj", { length: 18 }).notNull().unique(),
  inscricaoEstadual: varchar("inscricaoEstadual", { length: 50 }),
  inscricaoMunicipal: varchar("inscricaoMunicipal", { length: 50 }),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  logoUrl: text("logoUrl"),
  certificadoDigitalUrl: text("certificadoDigitalUrl"),
  certificadoSenha: text("certificadoSenha"),
  regimeTributario: mysqlEnum("regimeTributario", ["simples", "lucro_presumido", "lucro_real"]),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Empresa = typeof empresas.$inferSelect;
export type InsertEmpresa = typeof empresas.$inferInsert;

/**
 * Clientes
 */
export const clientes = mysqlTable("clientes", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["fisica", "juridica"]).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  celular: varchar("celular", { length: 20 }),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").default(true).notNull(),
  consultaSerasaData: timestamp("consultaSerasaData"),
  consultaSerasaResultado: text("consultaSerasaResultado"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Cliente = typeof clientes.$inferSelect;
export type InsertCliente = typeof clientes.$inferInsert;

/**
 * Fornecedores
 */
export const fornecedores = mysqlTable("fornecedores", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["fisica", "juridica"]).notNull(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cpfCnpj: varchar("cpfCnpj", { length: 18 }).notNull(),
  email: varchar("email", { length: 320 }),
  telefone: varchar("telefone", { length: 20 }),
  endereco: text("endereco"),
  cidade: varchar("cidade", { length: 100 }),
  estado: varchar("estado", { length: 2 }),
  cep: varchar("cep", { length: 10 }),
  observacoes: text("observacoes"),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Fornecedor = typeof fornecedores.$inferSelect;
export type InsertFornecedor = typeof fornecedores.$inferInsert;

/**
 * Produtos
 */
export const produtos = mysqlTable("produtos", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  unidade: varchar("unidade", { length: 10 }).default("UN").notNull(),
  precoCusto: decimal("precoCusto", { precision: 10, scale: 2 }).default("0").notNull(),
  precoVenda: decimal("precoVenda", { precision: 10, scale: 2 }).default("0").notNull(),
  margemLucro: decimal("margemLucro", { precision: 5, scale: 2 }),
  estoque: int("estoque").default(0).notNull(),
  estoqueMinimo: int("estoqueMinimo").default(0).notNull(),
  ncm: varchar("ncm", { length: 10 }),
  categoria: varchar("categoria", { length: 100 }),
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Produto = typeof produtos.$inferSelect;
export type InsertProduto = typeof produtos.$inferInsert;

/**
 * Serviços
 */
export const servicos = mysqlTable("servicos", {
  id: int("id").autoincrement().primaryKey(),
  codigo: varchar("codigo", { length: 50 }).notNull().unique(),
  nome: varchar("nome", { length: 255 }).notNull(),
  descricao: text("descricao"),
  valorUnitario: decimal("valorUnitario", { precision: 10, scale: 2 }).default("0").notNull(),
  categoria: varchar("categoria", { length: 100 }),
  codigoServico: varchar("codigoServico", { length: 20 }), // Código de serviço municipal
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Servico = typeof servicos.$inferSelect;
export type InsertServico = typeof servicos.$inferInsert;

/**
 * Orçamentos
 */
export const orcamentos = mysqlTable("orcamentos", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  clienteId: int("clienteId").notNull(),
  status: mysqlEnum("status", ["pendente", "aprovado", "rejeitado", "convertido"]).default("pendente").notNull(),
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  dataValidade: timestamp("dataValidade").notNull(),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).default("0").notNull(),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0").notNull(),
  observacoes: text("observacoes"),
  itens: text("itens").notNull(), // JSON array of items
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Orcamento = typeof orcamentos.$inferSelect;
export type InsertOrcamento = typeof orcamentos.$inferInsert;

/**
 * Vendas
 */
export const vendas = mysqlTable("vendas", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  clienteId: int("clienteId").notNull(),
  orcamentoId: int("orcamentoId"), // Referência ao orçamento se foi convertido
  status: mysqlEnum("status", ["pendente", "confirmada", "faturada", "cancelada"]).default("pendente").notNull(),
  dataVenda: timestamp("dataVenda").defaultNow().notNull(),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).default("0").notNull(),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  itens: text("itens").notNull(), // JSON array of items
  notaFiscalId: int("notaFiscalId"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Venda = typeof vendas.$inferSelect;
export type InsertVenda = typeof vendas.$inferInsert;

/**
 * Compras
 */
export const compras = mysqlTable("compras", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  fornecedorId: int("fornecedorId").notNull(),
  dataCompra: timestamp("dataCompra").defaultNow().notNull(),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).default("0").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  itens: text("itens").notNull(), // JSON array of items
  notaFiscalXml: text("notaFiscalXml"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Compra = typeof compras.$inferSelect;
export type InsertCompra = typeof compras.$inferInsert;

/**
 * Movimentações de Estoque
 */
export const movimentacoesEstoque = mysqlTable("movimentacoesEstoque", {
  id: int("id").autoincrement().primaryKey(),
  produtoId: int("produtoId").notNull(),
  tipo: mysqlEnum("tipo", ["entrada", "saida", "ajuste", "inventario"]).notNull(),
  quantidade: int("quantidade").notNull(),
  estoqueAnterior: int("estoqueAnterior").notNull(),
  estoqueAtual: int("estoqueAtual").notNull(),
  valorUnitario: decimal("valorUnitario", { precision: 10, scale: 2 }),
  motivo: text("motivo"),
  documentoReferencia: varchar("documentoReferencia", { length: 100 }), // Número da compra, venda, etc
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MovimentacaoEstoque = typeof movimentacoesEstoque.$inferSelect;
export type InsertMovimentacaoEstoque = typeof movimentacoesEstoque.$inferInsert;

/**
 * Contas Bancárias
 */
export const contasBancarias = mysqlTable("contasBancarias", {
  id: int("id").autoincrement().primaryKey(),
  banco: varchar("banco", { length: 100 }).notNull(),
  agencia: varchar("agencia", { length: 20 }).notNull(),
  conta: varchar("conta", { length: 30 }).notNull(),
  tipo: mysqlEnum("tipo", ["corrente", "poupanca", "investimento"]).default("corrente").notNull(),
  saldoInicial: decimal("saldoInicial", { precision: 10, scale: 2 }).default("0").notNull(),
  saldoAtual: decimal("saldoAtual", { precision: 10, scale: 2 }).default("0").notNull(),
  integracaoAsaas: boolean("integracaoAsaas").default(false).notNull(),
  integracaoSicredi: boolean("integracaoSicredi").default(false).notNull(),
  dadosIntegracao: text("dadosIntegracao"), // JSON with API credentials
  ativo: boolean("ativo").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContaBancaria = typeof contasBancarias.$inferSelect;
export type InsertContaBancaria = typeof contasBancarias.$inferInsert;

/**
 * Lançamentos Financeiros
 */
export const lancamentosFinanceiros = mysqlTable("lancamentosFinanceiros", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["receita", "despesa"]).notNull(),
  categoria: varchar("categoria", { length: 100 }).notNull(),
  descricao: text("descricao").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  status: mysqlEnum("status", ["pendente", "pago", "vencido", "cancelado"]).default("pendente").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  contaBancariaId: int("contaBancariaId"),
  clienteId: int("clienteId"),
  fornecedorId: int("fornecedorId"),
  vendaId: int("vendaId"),
  compraId: int("compraId"),
  recorrente: boolean("recorrente").default(false).notNull(),
  observacoes: text("observacoes"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LancamentoFinanceiro = typeof lancamentosFinanceiros.$inferSelect;
export type InsertLancamentoFinanceiro = typeof lancamentosFinanceiros.$inferInsert;

/**
 * Notas Fiscais
 */
export const notasFiscais = mysqlTable("notasFiscais", {
  id: int("id").autoincrement().primaryKey(),
  tipo: mysqlEnum("tipo", ["produto", "servico"]).notNull(),
  numero: varchar("numero", { length: 50 }),
  serie: varchar("serie", { length: 10 }),
  chaveAcesso: varchar("chaveAcesso", { length: 44 }),
  clienteId: int("clienteId").notNull(),
  vendaId: int("vendaId"),
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  valorTotal: decimal("valorTotal", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pendente", "emitida", "cancelada", "erro"]).default("pendente").notNull(),
  xmlUrl: text("xmlUrl"),
  pdfUrl: text("pdfUrl"),
  focusApiReferencia: varchar("focusApiReferencia", { length: 100 }),
  mensagemErro: text("mensagemErro"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotaFiscal = typeof notasFiscais.$inferSelect;
export type InsertNotaFiscal = typeof notasFiscais.$inferInsert;

/**
 * Logs de Auditoria
 */
export const logsAuditoria = mysqlTable("logsAuditoria", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  acao: varchar("acao", { length: 100 }).notNull(),
  modulo: varchar("modulo", { length: 50 }).notNull(),
  descricao: text("descricao").notNull(),
  dadosAntes: text("dadosAntes"), // JSON
  dadosDepois: text("dadosDepois"), // JSON
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LogAuditoria = typeof logsAuditoria.$inferSelect;
export type InsertLogAuditoria = typeof logsAuditoria.$inferInsert;

/**
 * Logs de Integrações
 */
export const logsIntegracoes = mysqlTable("logsIntegracoes", {
  id: int("id").autoincrement().primaryKey(),
  servico: varchar("servico", { length: 50 }).notNull(), // focus, asaas, sicredi, serasa
  tipo: varchar("tipo", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["sucesso", "erro"]).notNull(),
  request: text("request"),
  response: text("response"),
  mensagemErro: text("mensagemErro"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LogIntegracao = typeof logsIntegracoes.$inferSelect;
export type InsertLogIntegracao = typeof logsIntegracoes.$inferInsert;

/**
 * Notificações do sistema
 */
export const notificacoes = mysqlTable("notificacoes", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  tipo: mysqlEnum("tipo", ["info", "warning", "danger"]).notNull(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  mensagem: text("mensagem").notNull(),
  link: varchar("link", { length: 255 }),
  lida: boolean("lida").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notificacao = typeof notificacoes.$inferSelect;
export type InsertNotificacao = typeof notificacoes.$inferInsert;
