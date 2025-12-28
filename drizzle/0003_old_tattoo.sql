CREATE TABLE `contratos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`clienteId` int NOT NULL,
	`tipo` enum('mensal','trimestral','semestral','anual') NOT NULL,
	`dataInicio` timestamp NOT NULL,
	`dataFim` timestamp NOT NULL,
	`valor` decimal(10,2) NOT NULL,
	`diaVencimento` int NOT NULL,
	`status` enum('ativo','pendente','expirado','cancelado') NOT NULL DEFAULT 'ativo',
	`observacoes` text,
	`itens` text NOT NULL,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contratos_id` PRIMARY KEY(`id`),
	CONSTRAINT `contratos_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `favoritos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`usuarioId` int NOT NULL,
	`tipo` enum('produto','cliente','fornecedor','venda','servico','orcamento') NOT NULL,
	`referenciaId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favoritos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ordensServico` (
	`id` int AUTO_INCREMENT NOT NULL,
	`numero` varchar(50) NOT NULL,
	`clienteId` int NOT NULL,
	`servicoId` int NOT NULL,
	`tecnicoId` int,
	`dataAbertura` timestamp NOT NULL DEFAULT (now()),
	`dataPrevista` timestamp NOT NULL,
	`dataConclusao` timestamp,
	`valor` decimal(10,2) NOT NULL,
	`status` enum('pendente','em_andamento','concluida','cancelada') NOT NULL DEFAULT 'pendente',
	`descricaoProblema` text,
	`descricaoSolucao` text,
	`observacoes` text,
	`usuarioId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ordensServico_id` PRIMARY KEY(`id`),
	CONSTRAINT `ordensServico_numero_unique` UNIQUE(`numero`)
);
--> statement-breakpoint
CREATE TABLE `parcelas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vendaId` int NOT NULL,
	`contratoId` int,
	`numero` varchar(20) NOT NULL,
	`dataVencimento` timestamp NOT NULL,
	`dataPagamento` timestamp,
	`valor` decimal(10,2) NOT NULL,
	`status` enum('pendente','pago','vencido') NOT NULL DEFAULT 'pendente',
	`formaPagamento` varchar(50),
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parcelas_id` PRIMARY KEY(`id`)
);
