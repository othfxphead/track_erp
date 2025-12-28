CREATE TABLE `contasPagar` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`fornecedorId` int,
	`compraId` int,
	`descricao` text NOT NULL,
	`categoria` varchar(100),
	`dataEmissao` timestamp NOT NULL DEFAULT (now()),
	`dataVencimento` timestamp NOT NULL,
	`dataPagamento` timestamp,
	`valor` decimal(10,2) NOT NULL,
	`valorPago` decimal(10,2),
	`juros` decimal(10,2) DEFAULT '0.00',
	`desconto` decimal(10,2) DEFAULT '0.00',
	`status` enum('pendente','pago','vencido','cancelado') NOT NULL DEFAULT 'pendente',
	`formaPagamento` varchar(50),
	`contaBancariaId` int,
	`observacoes` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contasPagar_id` PRIMARY KEY(`id`),
	CONSTRAINT `contasPagar_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `contasReceber` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`clienteId` int NOT NULL,
	`vendaId` int,
	`parcelaId` int,
	`descricao` text NOT NULL,
	`categoria` varchar(100),
	`dataEmissao` timestamp NOT NULL DEFAULT (now()),
	`dataVencimento` timestamp NOT NULL,
	`dataRecebimento` timestamp,
	`valor` decimal(10,2) NOT NULL,
	`valorRecebido` decimal(10,2),
	`juros` decimal(10,2) DEFAULT '0.00',
	`desconto` decimal(10,2) DEFAULT '0.00',
	`status` enum('pendente','recebido','vencido','cancelado') NOT NULL DEFAULT 'pendente',
	`formaPagamento` varchar(50),
	`contaBancariaId` int,
	`observacoes` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contasReceber_id` PRIMARY KEY(`id`),
	CONSTRAINT `contasReceber_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `dda` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contaPagarId` int,
	`codigoBarras` varchar(100) NOT NULL,
	`linhaDigitavel` varchar(100),
	`beneficiario` varchar(255) NOT NULL,
	`pagador` varchar(255) NOT NULL,
	`dataEmissao` timestamp NOT NULL,
	`dataVencimento` timestamp NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`status` enum('pendente','autorizado','pago','rejeitado','cancelado') NOT NULL DEFAULT 'pendente',
	`dataAutorizacao` timestamp,
	`dataPagamento` timestamp,
	`contaBancariaId` int NOT NULL,
	`observacoes` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dda_id` PRIMARY KEY(`id`),
	CONSTRAINT `dda_codigoBarras_unique` UNIQUE(`codigoBarras`)
);
--> statement-breakpoint
CREATE TABLE `extratosBancarios` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contaBancariaId` int NOT NULL,
	`tipo` enum('entrada','saida','transferencia') NOT NULL,
	`categoria` varchar(100),
	`descricao` text NOT NULL,
	`data` timestamp NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`saldoAnterior` decimal(10,2) NOT NULL,
	`saldoPosterior` decimal(10,2) NOT NULL,
	`contaPagarId` int,
	`contaReceberId` int,
	`ddaId` int,
	`documento` varchar(100),
	`conciliado` boolean NOT NULL DEFAULT false,
	`observacoes` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `extratosBancarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inadimplentes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int NOT NULL,
	`contaReceberId` int,
	`parcelaId` int,
	`valorDevido` decimal(10,2) NOT NULL,
	`diasAtraso` int NOT NULL,
	`dataVencimento` timestamp NOT NULL,
	`dataInadimplencia` timestamp NOT NULL,
	`status` enum('ativo','negociando','parcelado','quitado','protesto') NOT NULL DEFAULT 'ativo',
	`observacoes` text,
	`acoesTomadas` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inadimplentes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `contasBancarias` MODIFY COLUMN `saldoInicial` decimal(10,2) NOT NULL DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `contasBancarias` MODIFY COLUMN `saldoAtual` decimal(10,2) NOT NULL DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE `contasBancarias` ADD `codigoBanco` varchar(10);--> statement-breakpoint
ALTER TABLE `contasBancarias` ADD `digito` varchar(5);--> statement-breakpoint
ALTER TABLE `contasBancarias` ADD `principal` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `contasBancarias` ADD `observacoes` text;