import { int, mysqlEnum, mysqlTable, text, mediumtext, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

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
  certificadoValidadeInicio: timestamp("certificadoValidadeInicio"),
  certificadoValidadeFim: timestamp("certificadoValidadeFim"),
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
  codigoBanco: varchar("codigoBanco", { length: 10 }),
  agencia: varchar("agencia", { length: 20 }).notNull(),
  conta: varchar("conta", { length: 30 }).notNull(),
  digito: varchar("digito", { length: 5 }),
  tipo: mysqlEnum("tipo", ["corrente", "poupanca", "investimento"]).default("corrente").notNull(),
  saldoInicial: decimal("saldoInicial", { precision: 10, scale: 2 }).default("0.00").notNull(),
  saldoAtual: decimal("saldoAtual", { precision: 10, scale: 2 }).default("0.00").notNull(),
  principal: boolean("principal").default(false).notNull(),
  integracaoAsaas: boolean("integracaoAsaas").default(false).notNull(),
  integracaoSicredi: boolean("integracaoSicredi").default(false).notNull(),
  dadosIntegracao: text("dadosIntegracao"), // JSON: {tipoBanco, apiClientId, apiClientSecret, apiCertificado, apiAmbiente, ultimaSincronizacao, sincronizacaoAutomatica}
  observacoes: text("observacoes"),
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
  descricao: text("descricao"),
  dadosAntes: mediumtext("dadosAntes"), // JSON
  dadosDepois: mediumtext("dadosDepois"), // JSON
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

/**
 * Contratos
 */
export const contratos = mysqlTable("contratos", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  clienteId: int("clienteId").notNull(),
  tipo: mysqlEnum("tipo", ["mensal", "trimestral", "semestral", "anual"]).notNull(),
  dataInicio: timestamp("dataInicio").notNull(),
  dataFim: timestamp("dataFim").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  diaVencimento: int("diaVencimento").notNull(), // Dia do mês para vencimento
  status: mysqlEnum("status", ["ativo", "pendente", "expirado", "cancelado"]).default("ativo").notNull(),
  observacoes: text("observacoes"),
  itens: text("itens").notNull(), // JSON array of services/products
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contrato = typeof contratos.$inferSelect;
export type InsertContrato = typeof contratos.$inferInsert;

/**
 * Parcelas a Receber
 */
export const parcelas = mysqlTable("parcelas", {
  id: int("id").autoincrement().primaryKey(),
  vendaId: int("vendaId").notNull(),
  contratoId: int("contratoId"), // Se vier de contrato
  numero: varchar("numero", { length: 20 }).notNull(), // Ex: 001/003
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pendente", "pago", "vencido"]).default("pendente").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Parcela = typeof parcelas.$inferSelect;
export type InsertParcela = typeof parcelas.$inferInsert;

/**
 * Ordens de Serviço
 */
export const ordensServico = mysqlTable("ordensServico", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  clienteId: int("clienteId").notNull(),
  servicoId: int("servicoId").notNull(),
  tecnicoId: int("tecnicoId"), // Usuário responsável
  dataAbertura: timestamp("dataAbertura").defaultNow().notNull(),
  dataPrevista: timestamp("dataPrevista").notNull(),
  dataConclusao: timestamp("dataConclusao"),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pendente", "em_andamento", "concluida", "cancelada"]).default("pendente").notNull(),
  descricaoProblema: text("descricaoProblema"),
  descricaoSolucao: text("descricaoSolucao"),
  observacoes: text("observacoes"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrdemServico = typeof ordensServico.$inferSelect;
export type InsertOrdemServico = typeof ordensServico.$inferInsert;

/**
 * Favoritos
 */
export const favoritos = mysqlTable("favoritos", {
  id: int("id").autoincrement().primaryKey(),
  usuarioId: int("usuarioId").notNull(),
  tipo: mysqlEnum("tipo", ["produto", "cliente", "fornecedor", "venda", "servico", "orcamento"]).notNull(),
  referenciaId: int("referenciaId").notNull(), // ID do item favoritado
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorito = typeof favoritos.$inferSelect;
export type InsertFavorito = typeof favoritos.$inferInsert;

/**
 * Contas a Pagar - Gestão de despesas e pagamentos
 */
export const contasPagar = mysqlTable("contasPagar", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  fornecedorId: int("fornecedorId"),
  compraId: int("compraId"), // Referência à compra que gerou a conta
  descricao: text("descricao").notNull(),
  categoria: varchar("categoria", { length: 100 }), // Ex: Fornecedores, Impostos, Salários, Aluguel
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataPagamento: timestamp("dataPagamento"),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  valorPago: decimal("valorPago", { precision: 10, scale: 2 }),
  juros: decimal("juros", { precision: 10, scale: 2 }).default("0.00"),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["pendente", "pago", "vencido", "cancelado"]).default("pendente").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  contaBancariaId: int("contaBancariaId"), // Conta usada para pagamento
  observacoes: text("observacoes"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContaPagar = typeof contasPagar.$inferSelect;
export type InsertContaPagar = typeof contasPagar.$inferInsert;

/**
 * Contas a Receber - Gestão de receitas (integra com parcelas)
 */
export const contasReceber = mysqlTable("contasReceber", {
  id: int("id").autoincrement().primaryKey(),
  numero: varchar("numero", { length: 50 }).notNull().unique(),
  clienteId: int("clienteId").notNull(),
  vendaId: int("vendaId"), // Referência à venda que gerou a conta
  parcelaId: int("parcelaId"), // Referência à parcela
  descricao: text("descricao").notNull(),
  categoria: varchar("categoria", { length: 100 }), // Ex: Vendas, Serviços, Outros
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataRecebimento: timestamp("dataRecebimento"),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  valorRecebido: decimal("valorRecebido", { precision: 10, scale: 2 }),
  juros: decimal("juros", { precision: 10, scale: 2 }).default("0.00"),
  desconto: decimal("desconto", { precision: 10, scale: 2 }).default("0.00"),
  status: mysqlEnum("status", ["pendente", "recebido", "vencido", "cancelado"]).default("pendente").notNull(),
  formaPagamento: varchar("formaPagamento", { length: 50 }),
  contaBancariaId: int("contaBancariaId"), // Conta que recebeu o pagamento
  observacoes: text("observacoes"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContaReceber = typeof contasReceber.$inferSelect;
export type InsertContaReceber = typeof contasReceber.$inferInsert;

/**
 * DDA - Débito Direto Autorizado
 */
export const dda = mysqlTable("dda", {
  id: int("id").autoincrement().primaryKey(),
  contaPagarId: int("contaPagarId"), // Referência à conta a pagar
  codigoBarras: varchar("codigoBarras", { length: 100 }).notNull().unique(),
  linhaDigitavel: varchar("linhaDigitavel", { length: 100 }),
  beneficiario: varchar("beneficiario", { length: 255 }).notNull(), // Quem vai receber
  pagador: varchar("pagador", { length: 255 }).notNull(), // Quem vai pagar
  dataEmissao: timestamp("dataEmissao").notNull(),
  dataVencimento: timestamp("dataVencimento").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pendente", "autorizado", "pago", "rejeitado", "cancelado"]).default("pendente").notNull(),
  dataAutorizacao: timestamp("dataAutorizacao"),
  dataPagamento: timestamp("dataPagamento"),
  contaBancariaId: int("contaBancariaId").notNull(), // Conta que vai debitar
  observacoes: text("observacoes"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DDA = typeof dda.$inferSelect;
export type InsertDDA = typeof dda.$inferInsert;

/**
 * Inadimplentes - Controle de clientes inadimplentes
 */
export const inadimplentes = mysqlTable("inadimplentes", {
  id: int("id").autoincrement().primaryKey(),
  clienteId: int("clienteId").notNull(),
  contaReceberId: int("contaReceberId"), // Conta que gerou a inadimplência
  parcelaId: int("parcelaId"), // Parcela que gerou a inadimplência
  valorDevido: decimal("valorDevido", { precision: 10, scale: 2 }).notNull(),
  diasAtraso: int("diasAtraso").notNull(),
  dataVencimento: timestamp("dataVencimento").notNull(),
  dataInadimplencia: timestamp("dataInadimplencia").notNull(), // Quando ficou inadimplente
  status: mysqlEnum("status", ["ativo", "negociando", "parcelado", "quitado", "protesto"]).default("ativo").notNull(),
  observacoes: text("observacoes"),
  acoesTomadas: text("acoesTomadas"), // JSON: [{data, acao, responsavel}]
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inadimplente = typeof inadimplentes.$inferSelect;
export type InsertInadimplente = typeof inadimplentes.$inferInsert;

/**
 * Extratos Bancários - Movimentações das contas PJ
 */
export const extratosBancarios = mysqlTable("extratosBancarios", {
  id: int("id").autoincrement().primaryKey(),
  contaBancariaId: int("contaBancariaId").notNull(),
  tipo: mysqlEnum("tipo", ["entrada", "saida", "transferencia"]).notNull(),
  categoria: varchar("categoria", { length: 100 }), // Ex: Venda, Pagamento Fornecedor, Taxa Bancária
  descricao: text("descricao").notNull(),
  data: timestamp("data").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  saldoAnterior: decimal("saldoAnterior", { precision: 10, scale: 2 }).notNull(),
  saldoPosterior: decimal("saldoPosterior", { precision: 10, scale: 2 }).notNull(),
  contaPagarId: int("contaPagarId"), // Se foi pagamento de conta
  contaReceberId: int("contaReceberId"), // Se foi recebimento de conta
  ddaId: int("ddaId"), // Se foi pagamento via DDA
  documento: varchar("documento", { length: 100 }), // Número do documento/cheque
  conciliado: boolean("conciliado").default(false).notNull(), // Se foi conciliado com o extrato bancário real
  observacoes: text("observacoes"),
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExtratoBancario = typeof extratosBancarios.$inferSelect;
export type InsertExtratoBancario = typeof extratosBancarios.$inferInsert;

/**
 * Configurações Fiscais - Configurações para emissão de notas fiscais
 */
export const configFiscais = mysqlTable("configFiscais", {
  id: int("id").autoincrement().primaryKey(),
  
  // NFS-e (Nota Fiscal de Serviço)
  nfseAtivo: boolean("nfseAtivo").default(false).notNull(),
  nfseInscricaoMunicipal: varchar("nfseInscricaoMunicipal", { length: 20 }),
  nfseUltimoRps: int("nfseUltimoRps").default(0),
  nfseSerieRps: varchar("nfseSerieRps", { length: 10 }).default("1"),
  nfseRegimeTributario: mysqlEnum("nfseRegimeTributario", [
    "mei",
    "simples_nacional",
    "lucro_presumido",
    "lucro_real"
  ]),
  nfseNaturezaOperacao: varchar("nfseNaturezaOperacao", { length: 255 }),
  nfseUsuarioAcesso: varchar("nfseUsuarioAcesso", { length: 255 }), // Credenciais prefeitura
  nfseSenhaAcesso: varchar("nfseSenhaAcesso", { length: 255 }),
  nfseCertificadoValido: boolean("nfseCertificadoValido").default(false),
  nfseCertificadoVencimento: timestamp("nfseCertificadoVencimento"),
  
  // NF-e (Nota Fiscal de Produto)
  nfeAtivo: boolean("nfeAtivo").default(false).notNull(),
  nfeInscricaoEstadual: varchar("nfeInscricaoEstadual", { length: 20 }),
  nfeSerie: int("nfeSerie").default(1),
  nfeUltimoNumero: int("nfeUltimoNumero").default(0),
  nfeExcluirIcmsBaseCalculo: boolean("nfeExcluirIcmsBaseCalculo").default(false),
  nfeEstadoSubstituto: varchar("nfeEstadoSubstituto", { length: 2 }), // UF
  nfeInscricaoEstadualSubstituto: varchar("nfeInscricaoEstadualSubstituto", { length: 20 }),
  
  // NFC-e (Nota Fiscal de Consumidor)
  nfceAtivo: boolean("nfceAtivo").default(false).notNull(),
  nfceIdCsc: varchar("nfceIdCsc", { length: 10 }), // ID do CSC
  nfceCodigoCsc: varchar("nfceCodigoCsc", { length: 50 }), // Código CSC
  
  usuarioId: int("usuarioId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConfigFiscal = typeof configFiscais.$inferSelect;
export type InsertConfigFiscal = typeof configFiscais.$inferInsert;
