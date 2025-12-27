CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('fisica','juridica') NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpfCnpj` varchar(18) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(20),
	`celular` varchar(20),
	`endereco` text,
	`cidade` varchar(100),
	`estado` varchar(2),
	`cep` varchar(10),
	`observacoes` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`consultaSerasaData` timestamp,
	`consultaSerasaResultado` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `compras` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`fornecedorId` int NOT NULL,
	`dataCompra` timestamp NOT NULL DEFAULT (now()),
	`valorTotal` decimal(10,2) NOT NULL DEFAULT '0',
	`formaPagamento` varchar(50),
	`observacoes` text,
	`itens` text NOT NULL,
	`notaFiscalXml` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `compras_id` PRIMARY KEY(`id`),
	CONSTRAINT `compras_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `contasBancarias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`banco` varchar(100) NOT NULL,
	`agencia` varchar(20) NOT NULL,
	`conta` varchar(30) NOT NULL,
	`tipo` enum('corrente','poupanca','investimento') NOT NULL DEFAULT 'corrente',
	`saldoInicial` decimal(10,2) NOT NULL DEFAULT '0',
	`saldoAtual` decimal(10,2) NOT NULL DEFAULT '0',
	`integracaoAsaas` boolean NOT NULL DEFAULT false,
	`integracaoSicredi` boolean NOT NULL DEFAULT false,
	`dadosIntegracao` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contasBancarias_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `empresas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`razaoSocial` varchar(255) NOT NULL,
	`nomeFantasia` varchar(255),
	`cnpj` varchar(18) NOT NULL,
	`inscricaoEstadual` varchar(50),
	`inscricaoMunicipal` varchar(50),
	`email` varchar(320),
	`telefone` varchar(20),
	`logoUrl` text,
	`certificadoDigitalUrl` text,
	`certificadoSenha` text,
	`regimeTributario` enum('simples','lucro_presumido','lucro_real'),
	`endereco` text,
	`cidade` varchar(100),
	`estado` varchar(2),
	`cep` varchar(10),
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `empresas_id` PRIMARY KEY(`id`),
	CONSTRAINT `empresas_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `fornecedores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('fisica','juridica') NOT NULL,
	`nome` varchar(255) NOT NULL,
	`cpfCnpj` varchar(18) NOT NULL,
	`email` varchar(320),
	`telefone` varchar(20),
	`endereco` text,
	`cidade` varchar(100),
	`estado` varchar(2),
	`cep` varchar(10),
	`observacoes` text,
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fornecedores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lancamentosFinanceiros` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('receita','despesa') NOT NULL,
	`categoria` varchar(100) NOT NULL,
	`descricao` text NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`dataVencimento` timestamp NOT NULL,
	`dataPagamento` timestamp,
	`status` enum('pendente','pago','vencido','cancelado') NOT NULL DEFAULT 'pendente',
	`formaPagamento` varchar(50),
	`contaBancariaId` int,
	`clienteId` int,
	`fornecedorId` int,
	`vendaId` int,
	`compraId` int,
	`recorrente` boolean NOT NULL DEFAULT false,
	`observacoes` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lancamentosFinanceiros_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logsAuditoria` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuarioId` int NOT NULL,
	`acao` varchar(100) NOT NULL,
	`modulo` varchar(50) NOT NULL,
	`descricao` text NOT NULL,
	`dadosAntes` text,
	`dadosDepois` text,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logsAuditoria_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `logsIntegracoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`servico` varchar(50) NOT NULL,
	`tipo` varchar(50) NOT NULL,
	`status` enum('sucesso','erro') NOT NULL,
	`request` text,
	`response` text,
	`mensagemErro` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `logsIntegracoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `movimentacoesEstoque` (
	`id` int AUTO_INCREMENT NOT NULL,
	`produtoId` int NOT NULL,
	`tipo` enum('entrada','saida','ajuste','inventario') NOT NULL,
	`quantidade` int NOT NULL,
	`estoqueAnterior` int NOT NULL,
	`estoqueAtual` int NOT NULL,
	`valorUnitario` decimal(10,2),
	`motivo` text,
	`documentoReferencia` varchar(100),
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movimentacoesEstoque_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notasFiscais` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipo` enum('produto','servico') NOT NULL,
	`numero` varchar(50),
	`serie` varchar(10),
	`chaveAcesso` varchar(44),
	`clienteId` int NOT NULL,
	`vendaId` int,
	`dataEmissao` timestamp NOT NULL DEFAULT (now()),
	`valorTotal` decimal(10,2) NOT NULL,
	`status` enum('pendente','emitida','cancelada','erro') NOT NULL DEFAULT 'pendente',
	`xmlUrl` text,
	`pdfUrl` text,
	`focusApiReferencia` varchar(100),
	`mensagemErro` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notasFiscais_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orcamentos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`clienteId` int NOT NULL,
	`status` enum('pendente','aprovado','rejeitado','convertido') NOT NULL DEFAULT 'pendente',
	`dataEmissao` timestamp NOT NULL DEFAULT (now()),
	`dataValidade` timestamp NOT NULL,
	`valorTotal` decimal(10,2) NOT NULL DEFAULT '0',
	`desconto` decimal(10,2) NOT NULL DEFAULT '0',
	`observacoes` text,
	`itens` text NOT NULL,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orcamentos_id` PRIMARY KEY(`id`),
	CONSTRAINT `orcamentos_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `produtos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`unidade` varchar(10) NOT NULL DEFAULT 'UN',
	`precoCusto` decimal(10,2) NOT NULL DEFAULT '0',
	`precoVenda` decimal(10,2) NOT NULL DEFAULT '0',
	`margemLucro` decimal(5,2),
	`estoque` int NOT NULL DEFAULT 0,
	`estoqueMinimo` int NOT NULL DEFAULT 0,
	`ncm` varchar(10),
	`categoria` varchar(100),
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `produtos_id` PRIMARY KEY(`id`),
	CONSTRAINT `produtos_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `servicos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`codigo` varchar(50) NOT NULL,
	`nome` varchar(255) NOT NULL,
	`descricao` text,
	`valorUnitario` decimal(10,2) NOT NULL DEFAULT '0',
	`categoria` varchar(100),
	`codigoServico` varchar(20),
	`ativo` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `servicos_id` PRIMARY KEY(`id`),
	CONSTRAINT `servicos_codigo_unique` UNIQUE(`codigo`)
);
--> statement-breakpoint
CREATE TABLE `vendas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`clienteId` int NOT NULL,
	`orcamentoId` int,
	`status` enum('pendente','confirmada','faturada','cancelada') NOT NULL DEFAULT 'pendente',
	`dataVenda` timestamp NOT NULL DEFAULT (now()),
	`valorTotal` decimal(10,2) NOT NULL DEFAULT '0',
	`desconto` decimal(10,2) NOT NULL DEFAULT '0',
	`formaPagamento` varchar(50),
	`observacoes` text,
	`itens` text NOT NULL,
	`notaFiscalId` int,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vendas_id` PRIMARY KEY(`id`),
	CONSTRAINT `vendas_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','gerente','operador','user') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `permissions` text;