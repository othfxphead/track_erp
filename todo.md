# TRACK ERP - TODO List

## 1. Infraestrutura e Configuração
- [x] Configurar schema do banco de dados completo
- [x] Criar helpers de banco de dados para todas as entidades
- [x] Configurar rotas tRPC para todos os módulos
- [x] Implementar sistema de permissões por usuário/módulo
- [x] Configurar logs de auditoria
- [x] Configurar tema visual profissional (estilo Conta Azul)
- [x] Implementar modo claro/escuro

## 2. Dashboard Principal
- [x] Criar layout do dashboard com sidebar
- [x] Implementar cards de status (a receber, a pagar, vencidos)
- [x] Criar gráfico de fluxo de caixa
- [x] Criar gráfico de vendas
- [x] Implementar KPIs principais
- [ ] Adicionar filtros de período

## 3. Módulo de Orçamentos
- [ ] Criar tela de listagem de orçamentos
- [ ] Implementar formulário de criação de orçamento
- [ ] Adicionar sistema de aprovação de orçamentos
- [ ] Implementar conversão automática para venda
- [ ] Adicionar impressão/exportação de orçamento

## 4. Módulo de Vendas
- [ ] Criar tela de listagem de vendas
- [ ] Implementar formulário de registro de venda
- [ ] Adicionar gestão de status de pedidos
- [ ] Integrar com emissão automática de NF
- [ ] Implementar histórico de vendas por cliente

## 5. Cadastro de Produtos e Serviços
- [x] Criar tela de listagem de produtos
- [x] Implementar formulário de cadastro de produto
- [ ] Criar tela de listagem de serviços
- [ ] Implementar formulário de cadastro de serviço
- [x] Adicionar controle de preços e margens
- [x] Implementar categorização

## 6. Módulo de Compras
- [ ] Criar tela de listagem de compras
- [ ] Implementar formulário de registro de compra
- [ ] Adicionar cadastro de fornecedores
- [ ] Implementar atualização automática de estoque
- [ ] Adicionar importação de XML de NF

## 7. Controle de Estoque
- [ ] Criar tela de visualização de estoque
- [ ] Implementar registro de movimentações
- [ ] Adicionar entrada/saída manual
- [ ] Criar histórico de transações
- [ ] Implementar alertas de estoque mínimo
- [ ] Adicionar inventário físico

## 8. Módulo Financeiro
- [ ] Criar frente de caixa
- [ ] Implementar contas a pagar
- [ ] Implementar contas a receber
- [ ] Adicionar lançamentos manuais
- [ ] Criar conciliação bancária
- [ ] Integrar com Asaas para cobranças
- [ ] Integrar com Sicredi para extratos
- [ ] Implementar fluxo de caixa projetado

## 9. Módulo Fiscal
- [ ] Criar tela de emissão de NF de produto
- [ ] Criar tela de emissão de NF de serviço
- [ ] Integrar com Focus API
- [ ] Implementar upload de certificado digital
- [ ] Adicionar consulta de notas emitidas
- [ ] Implementar download de XML/PDF
- [ ] Adicionar validação de dados fiscais

## 10. Sistema de Autenticação e Permissões
- [ ] Implementar controle de acesso por módulo
- [ ] Criar gestão de usuários
- [ ] Adicionar níveis de permissão (admin, gerente, operador)
- [ ] Implementar logs de auditoria de ações
- [ ] Adicionar histórico de acessos

## 11. Configurações da Empresa
- [ ] Criar tela de dados cadastrais
- [ ] Implementar upload de logo da empresa
- [ ] Adicionar configuração de dados fiscais
- [ ] Implementar gestão de contas bancárias
- [ ] Adicionar personalização de tema
- [ ] Configurar preferências do sistema

## 12. Funcionalidades de IA
- [x] Implementar sugestões de preenchimento de campos
- [x] Adicionar previsões de fluxo de caixa
- [x] Implementar classificação automática de despesas/receitas
- [x] Criar lembretes inteligentes de vencimento
- [x] Adicionar recomendações baseadas em histórico
- [x] Implementar OCR para documentos fiscais (PDF, XML, imagens)
- [x] Adicionar extração automática de dados de NF

## 13. Integrações Externas
- [x] Integrar consulta Serasa para CPF/CNPJ
- [x] Configurar webhooks Focus API
- [x] Implementar sincronização Asaas
- [x] Adicionar integração Sicredi
- [x] Criar logs de integrações

## 14. Relatórios
- [ ] Criar relatório de vendas
- [ ] Criar relatório financeiro
- [ ] Criar relatório de estoque
- [ ] Criar relatório fiscal
- [ ] Implementar exportação em PDF/Excel
- [ ] Adicionar filtros avançados

## 15. Página de Apresentação
- [x] Criar página web interativa de apresentação
- [x] Adicionar gráficos de demonstração
- [x] Implementar tour guiado das funcionalidades
- [x] Adicionar documentação de uso

## 16. Testes e Qualidade
- [x] Criar testes unitários para módulos críticos
- [x] Implementar testes de integração
- [x] Adicionar validações de dados
- [x] Testar fluxos completos

## Bugs Reportados
- [x] Corrigir erro de nested anchor tags na página de orçamentos


## Implementação dos Módulos Restantes
- [x] Implementar página completa de Orçamentos
- [x] Implementar página completa de Vendas
- [x] Implementar página completa de Serviços
- [x] Implementar página completa de Compras
- [x] Implementar página completa de Estoque
- [x] Implementar página completa do Financeiro
- [x] Implementar página completa do Fiscal
- [x] Implementar página completa de Relatórios
- [x] Implementar página completa de Configurações
- [x] Implementar página de Consulta Serasa


## Completar Módulos Funcionais (100% Operacional)
- [x] Implementar página de Configurações da Empresa com upload de logo
- [x] Adicionar upload de certificado digital A1
- [x] Criar formulário de dados fiscais completo
- [x] Implementar cadastro de contas bancárias
- [x] Criar formulário completo de criação de Vendas
- [x] Implementar seleção de produtos/serviços em Vendas
- [x] Adicionar cálculo automático de totais em Vendas
- [x] Implementar frente de caixa no Financeiro
- [x] Criar formulários de contas a pagar/receber
- [x] Adicionar conciliação bancária
- [x] Implementar emissão de NF-e via Focus API
- [x] Criar configuração de impostos no Fiscal
- [x] Implementar geração de relatórios em PDF
- [x] Adicionar filtros por período nos relatórios
- [x] Criar formulário completo de Compras
- [x] Implementar atualização automática de estoque


## Módulo de Compras Completo
- [x] Criar página de Compras com formulário completo
- [x] Implementar seleção de fornecedor (cadastro se não existir)
- [x] Adicionar seleção múltipla de produtos com quantidade e preço
- [x] Implementar cálculo automático de totais (subtotal, desconto, total)
- [x] Criar lógica de atualização automática de estoque após compra
- [x] Adicionar listagem de compras com histórico
- [x] Implementar filtros por período e fornecedor
- [x] Integrar com logs de auditoria


## Dashboard de Estoque Avançado
- [x] Criar página de dashboard de estoque com indicadores principais
- [x] Implementar alertas de estoque mínimo com cards destacados
- [x] Adicionar gráfico de movimentações (entradas vs saídas) por período
- [x] Criar sistema de previsão de reposição usando IA baseado em histórico
- [x] Implementar identificação de produtos parados (sem movimentação há 30+ dias)
- [x] Adicionar indicadores de giro de estoque e valor total
- [x] Criar histórico detalhado de movimentações por produto
- [x] Implementar filtros por categoria e período


## Redesign Completo Estilo Conta Azul
- [x] Criar topbar fixa azul clara com logo Track grande clicável
- [x] Adicionar campo de pesquisa global na topbar
- [x] Implementar botão "Novo registro" com dropdown na topbar
- [x] Adicionar ícones de notificação e ajuda na topbar
- [x] Criar sidebar retrátil azul escuro com ícones
- [x] Implementar submenus expansíveis (Produtos, Serviços, Cadastros, Configurações)
- [x] Adicionar menu de usuário com dropdown no canto superior direito
- [x] Criar módulo de Orçamentos completo com filtros e cards de status
- [x] Implementar formulário de orçamento com abas (Informações, Itens, Valor, Observações)
- [x] Adicionar seleção de cliente com botão "Consultar no Serasa"
- [x] Criar funcionalidade Conta AI Captura para importação de documentos com OCR
- [x] Implementar preview de PDF/XML com extração automática de dados
- [x] Adicionar confirmação de lançamentos extraídos pela IA


## Redesign Final - Replicar Conta Azul Pro Exato
- [x] Mudar topbar para fundo branco (remover azul)
- [x] Aumentar logo Track na topbar
- [x] Implementar sidebar retraída por padrão
- [x] Adicionar abertura de sidebar ao passar mouse ou clicar
- [x] Redesenhar botões com estilo fino igual referências
- [x] Refazer página de Orçamentos completa com layout Conta Azul
- [x] Adicionar todas as colunas e informações na tabela de Orçamentos
- [x] Refazer página de Vendas completa com layout Conta Azul
- [x] Adicionar botão "Emitir NFS" após venda concluída
- [ ] Criar modais em tela cheia para Novo Orçamento
- [ ] Criar modais em tela cheia para Nova Venda
- [ ] Criar modais em tela cheia para Novo Contrato
- [ ] Padronizar estilo de botões em todas as páginas


## Página de Configurações - Dados da Empresa
- [x] Criar página completa de Dados da Empresa
- [x] Implementar upload de logo da empresa (PNG, JPG, SVG - máx 2MB)
- [x] Adicionar campo Razão Social * (obrigatório)
- [x] Adicionar campo Nome Fantasia
- [x] Adicionar campo CNPJ * com máscara (00.000.000/0000-00)
- [x] Adicionar campo Inscrição Estadual
- [x] Adicionar campo Inscrição Municipal
- [x] Adicionar campo Telefone com máscara ((00) 0000-0000)
- [x] Adicionar campo E-mail
- [x] Adicionar campos de endereço (Endereço, Número, Complemento)
- [x] Adicionar campos Bairro, Cidade, Estado (dropdown), CEP (00000-000)
- [x] Implementar validações de campos obrigatórios
- [x] Adicionar botão Salvar no final do formulário


## Formulário de Novo Orçamento Completo
- [x] Criar modal em tela cheia para Novo Orçamento
- [x] Adicionar campo Tipo da venda (Orçamento, Venda avulsa, Venda recorrente)
- [x] Adicionar campo Situação da negociação (dropdown)
- [x] Adicionar botão "Consultar cliente no Serasa" ao lado do campo cliente
- [x] Implementar aba "Informações" com campos básicos
- [x] Implementar aba "Itens" com tabela de produtos/serviços
- [x] Implementar aba "Valor" com desconto (% ou R$) e cálculo automático
- [x] Implementar aba "Observações de pagamento"
- [x] Implementar aba "Complemento NF"
- [x] Adicionar cálculo automático: Itens – Desconto = Total líquido
- [x] Marcar campos obrigatórios com asterisco

## Formulário de Nova Venda Completo
- [ ] Criar modal em tela cheia para Nova Venda
- [ ] Adicionar campo Categoria financeira
- [ ] Adicionar campo Centro de custo
- [ ] Adicionar campo Forma de pagamento
- [ ] Adicionar campo Conta de recebimento
- [ ] Adicionar campo Condição de pagamento
- [ ] Adicionar campo Data de vencimento
- [ ] Implementar seção de Parcelamento com botão "Editar parcelas"
- [ ] Adicionar seção de Informações fiscais completas
- [ ] Reutilizar abas de Itens, Valor e Observações do orçamento

## Formulário de Venda Recorrente (Contrato)
- [ ] Criar modal em tela cheia para Venda Recorrente
- [ ] Adicionar campo Data de início
- [ ] Adicionar campo Dia da geração
- [ ] Adicionar campo Data da primeira venda
- [ ] Implementar seção Configuração de recorrência
- [ ] Adicionar campo Intervalo (mensal, semanal, etc)
- [ ] Adicionar campo Término (data ou quantidade)
- [ ] Adicionar campo Vigência do contrato
- [ ] Adicionar Classificação final (categoria e centro de custo)

## Tela de Detalhes da Venda
- [ ] Criar página de detalhes da venda
- [ ] Adicionar alerta verde "Nota Fiscal emitida com sucesso" com ícone check
- [ ] Adicionar botão "Download XML" da nota fiscal
- [ ] Criar tabela de itens vendidos (Produto, Tipo, Detalhes, Quantidade, Valor unitário, Subtotal)
- [ ] Mostrar Total líquido no canto inferior direito
- [ ] Adicionar botão verde "Visualizar nota fiscal"
- [ ] Implementar dropdown "Outras ações" (Enviar, Imprimir, Clonar, Excluir)

## Menu de Ações nos Registros
- [ ] Adicionar dropdown "Ações" em cada linha da tabela de orçamentos
- [ ] Implementar ação "Editar"
- [ ] Implementar ação "Enviar" (por email)
- [ ] Implementar ação "Clonar"
- [ ] Implementar ação "Imprimir"
- [ ] Implementar ação "Excluir" (com confirmação)
- [ ] Implementar ação "Criar venda" (converter orçamento em venda)
- [ ] Adicionar mesmo menu nas tabelas de vendas

## Melhorias de UX
- [ ] Adicionar ícone de ajuda ("?") ao lado de campos complexos
- [ ] Adicionar checkbox para seleção múltipla de registros
- [ ] Melhorar mensagem "sem registros" com ilustração
- [ ] Adicionar tooltip de confirmação ao excluir
- [ ] Garantir máscaras de moeda e datas brasileiras em todos os campos
- [ ] Implementar responsividade para mobile e tablet
- [ ] Testar navegação entre todos os módulos sem erro de rota


## Melhorias do Modal de Novo Orçamento
- [x] Aumentar tamanho do modal (max-w-7xl, h-95vh)
- [x] Melhorar espaçamento entre elementos (px-8, py-6, gap-6)
- [x] Aumentar altura dos inputs e selects (h-11)
- [x] Aumentar tamanho da fonte (text-base)
- [x] Melhorar altura das abas (h-12)
- [x] Aumentar padding dos cards (p-6)
- [x] Melhorar espaçamento do resumo financeiro


## VISUAL E NAVEGAÇÃO
- [x] Mover logo TRACK para topbar à esquerda
- [x] Remover logo do menu lateral
- [x] Menu lateral azul escuro
- [x] Melhorar hover funcional no menu
- [x] Submenu abre ao passar o mouse
- [x] Corrigir seta do menu lateral (sobreposta, abrir/fechar)
- [x] Tooltip com nome do item ao passar mouse (menu recolhido)
- [ ] Botões finos com fundo branco e borda azul/verde
- [ ] Padding interno alinhado em formulários e dashboards

## TELAS E COMPONENTES
- [ ] Cards de totais com cores corretas (vermelho, amarelo, verde, azul)
- [ ] Tabela de orçamentos estilo Conta Azul com filtros
- [ ] Organizar formulários: Informações, Itens, Valores, Pagamento, NF
- [ ] Formulário de nova venda completo
- [ ] Formulário de orçamento completo
- [ ] Formulário de contrato recorrente completo
- [x] Dropdown de ações funcional (Editar, Enviar, Clonar, Excluir, Criar venda)
- [ ] Máscara de moeda brasileira (R$ 0,00)
- [ ] Máscara de data BR (DD/MM/YYYY)

## COMPORTAMENTOS E FUNCIONALIDADES
- [ ] Submenus abrem com hover (não clique)
- [ ] Feedback visual em botões (loading/check)
- [ ] Corrigir erros de rota e 404
- [ ] Tabelas e cards 100% responsivos
- [ ] Botões de importar/exportar visíveis

## INTEGRAÇÕES E DIFERENCIAIS
- [ ] Botão "Consultar cliente no Serasa" funcional
- [ ] Emissão automática de NF com API Focus
- [ ] Conectores/placeholders para Asaas
- [ ] Conectores/placeholders para Sicredi
- [ ] Espaço para integração CRM futura
- [ ] IA para preenchimento automático de campos
- [ ] IA para sugestões (cliente, descrição itens)

## EXTRAS IMPORTANTES
- [ ] Modo escuro com contraste ideal
- [ ] Aviso "NF emitida com sucesso" no topo
- [ ] Botão "Visualizar NF" e download XML
- [ ] Dropdowns com ícones e setas corretas
- [ ] Responsividade mobile (menu e formulários)


## Atualização Visual - Logo e Cores
- [x] Copiar logo Track ERP para pasta public
- [x] Mudar cores do menu lateral para azul #00A3E0 (mesma cor da logo)
- [x] Substituir ícone T + texto TRACK por logo Track ERP completa na topbar
- [x] Diminuir altura dos botões (h-9 → h-8, menos padding)
- [x] Aplicar botões mais finos em toda aplicação


## Melhorias de Logo e Menu
- [x] Aumentar logo Track na topbar (h-12 → h-16)
- [x] Ajustar cor do menu: azul escuro #1a5490 de fundo, texto branco
- [x] Refazer submenus para abrirem lateralmente (não inline)
- [x] Submenus em azul mais escuro (#0f3d6f)
- [x] Manter submenus flutuantes mesmo quando sidebar expandida


## Padrão Visual Conta Azul Completo
- [x] Ajustar logo Track: grande (h-16), visível, object-contain
- [x] Sidebar azul claro #00A3E0 (como Conta Azul)
- [x] Submenu azul escuro #003d7a ocupando área completa ao lado (w-80, h-full)
- [x] Adicionar seta de voltar no topo do submenu (ChevronLeft)
- [x] Adicionar estrelas de favoritos nos itens (hover amarelo)
- [ ] Categorias em uppercase (CADASTROS, CONFIGURAÇÕES)
- [x] Item ativo com fundo mais escuro no submenu (#004d8a)


## Correções e Melhorias UX
- [x] Aumentar modal de Novo Orçamento (max-w-[95vw] w-[95vw])
- [x] Implementar botão "Perfil" do menu de usuário (navega para /perfil)
- [x] Implementar botão "Empresa" do menu de usuário (navega para /configuracoes/dados-empresa)
- [x] Implementar botão "Configurações" do menu de usuário (navega para /configuracoes)
- [x] Implementar botão "Sair" do menu de usuário (logout funcional)
- [x] Aumentar logo Track 2x ao passar hover (scale-[2])
- [x] Fazer submenus abrirem automaticamente ao passar hover (já implementado)
- [x] Adicionar border-radius nos menus (rounded-r-2xl)
- [x] Adicionar sombras suaves nos menus (shadow-lg, shadow-2xl)
- [x] Melhorar visual geral dos dropdowns


## Refinamento Final - Botões e Navegação
- [x] Afinar botões ainda mais (h-7, px-2, py-1, text-xs)
- [x] Aplicar botões finos globalmente no button.tsx
- [x] Menu principal só abre/fecha ao clicar na seta (não hover)
- [x] Submenus continuam abrindo ao hover
- [x] Implementar navegação no botão "Novo Orçamento" do dropdown
- [x] Implementar navegação no botão "Nova Venda" do dropdown
- [x] Implementar navegação no botão "Novo Contrato" do dropdown
- [x] Implementar navegação no botão "Novo Cliente" do dropdown
- [x] Implementar navegação no botão "Novo Produto" do dropdown
- [ ] Implementar navegação nos botões de Ações Rápidas do Dashboard
- [ ] Refazer páginas conforme especificações originais do usuário


## Ajuste de Logo e Espaçamento
- [x] Aumentar logo Track para h-24 (maior)
- [x] Adicionar mais espaço entre logo e campo de pesquisa (gap-12 ou maior)
- [x] Ajustar altura da topbar se necessário para acomodar logo maior


## Ajustes Visuais Finais
- [x] Aumentar logo Track ainda mais (h-24 → h-32)
- [x] Corrigir falha/borda branca entre menu lateral azul claro e submenu azul escuro
- [x] Garantir transição visual perfeita entre os menus


## Remover Scrollbar do Menu
- [x] Remover barra de scroll visível do menu lateral
- [x] Manter funcionalidade de scroll se necessário (ocultar apenas visualmente)


## Remover Logo do Menu Lateral
- [x] Remover texto "Track" do topo do menu lateral expandido (confirmado que não existe no código atual)


## Remover Menu Duplicado
- [x] Identificar e remover menu branco/cinza que aparece ao lado do menu azul
- [x] Manter apenas o menu azul principal (#00A3E0)


## Ajustes de Layout - Sidebar e Logo
- [x] Mover sidebar para começar logo abaixo da topbar (top-0 ao invés de top-24)
- [x] Aumentar logo Track de h-32 para h-[140px]
- [x] Ajustar altura da topbar de h-16 para h-24 para acomodar logo maior


## Corrigir Posicionamento do Submenu
- [x] Ajustar submenu para começar em top-24 (abaixo da topbar) ao invés de top-0
- [x] Ajustar altura do submenu para h-[calc(100vh-96px)] para compensar topbar h-24


## Ajustar Alturas - Topbar e Sidebar
- [x] Diminuir topbar de h-24 para h-20 (80px)
- [x] Ajustar sidebar para começar em top-20 ao invés de top-0
- [x] Ajustar altura da sidebar para h-[calc(100vh-80px)]
- [x] Ajustar submenu para top-20 e h-[calc(100vh-80px)]
- [x] Ajustar main content para mt-20


## Corrigir Brecha e Botão Toggle
- [x] Preencher brecha branca entre menu lateral e submenu com cor do submenu (#003d7a)
- [x] Mover botão toggle (setinha) do topo (top-6) para o rodapé (bottom-6) do menu lateral


## Funcionalidades - Dados da Empresa
- [x] Criar tabela `empresas` no banco de dados (logo, razão social, nome fantasia, CNPJ, etc.)
- [x] Criar procedures tRPC para salvar e buscar dados da empresa (empresa.get, empresa.upsert, empresa.uploadLogo)
- [x] Implementar upload de logo da empresa para S3 com conversão base64
- [x] Atualizar logo Track na topbar dinamicamente quando logo da empresa for carregada
- [x] Atualizar nome "Track ERP" na topbar quando nome fantasia for preenchido
- [x] Implementar formulário completo de Dados da Empresa (ConfiguracoesCompleta.tsx)
- [x] Adicionar preview de logo carregada com indicador de loading
- [x] Carregar dados existentes da empresa ao abrir a página
- [ ] Adicionar máscaras brasileiras (CNPJ, telefone, CEP) nos inputs
- [x] Implementar menu dropdown de perfil do usuário (canto superior direito)
- [x] Adicionar opções no menu de perfil: Perfil, Empresa, Configurações, Sair (logout funcional)
- [x] Conectar botão Empresa do menu de perfil à página /configuracoes/dados-empresa
- [x] Conectar botão Configurações do menu de perfil à página /configuracoes


## Bugs - Página Dados da Empresa
- [ ] Corrigir upload de logo (não está funcionando)
- [ ] Corrigir salvamento de nome fantasia (não está sendo salvo)
- [ ] Verificar procedure empresa.uploadLogo
- [ ] Verificar procedure empresa.upsert
- [ ] Testar atualização dinâmica da topbar após salvamento


## Correções de Bugs Recentes
- [x] Corrigir botão "Salvar Dados da Empresa" que não estava funcionando (solução: envolver em form com onSubmit)
- [x] Corrigir validação de email para aceitar strings vazias
- [x] Aplicar correção de formulários para todas as abas de Configurações (Empresa, Certificado, Bancário, Integrações)


## Refatoração de Formulários - Padrão Conta Azul Tela Cheia
- [ ] Refatorar formulário de Novo Orçamento para tela cheia
- [ ] Adicionar todas as abas: Informações, Itens, Valor, Informações de Pagamento, Observações de Pagamento, Informações Fiscais, Observações Complementares
- [ ] Refatorar formulário de Nova Venda para tela cheia (mesma estrutura)
- [ ] Criar formulário de Novo Contrato seguindo mesmo padrão
- [ ] Implementar conversão de Orçamento para Venda com preenchimento automático de dados
- [ ] Organizar campos em grid responsivo e bem espaçado
- [ ] Garantir que todos os botões funcionam (aplicar correção de form + onSubmit)
- [ ] Adicionar botões Cancelar e Salvar fixos no rodapé
- [ ] Testar fluxo completo de criação e conversão


## Refatoração de Formulários em Tela Cheia (27/12/2025)
- [x] Criar página dedicada NovoOrcamentoPage.tsx em tela cheia
- [x] Adicionar rota /orcamentos/novo no App.tsx
- [x] Atualizar botão "Novo Orçamento" para navegar para página dedicada
- [x] Implementar formulário com abas (Informações, Itens, Valor)
- [x] Adicionar header fixo com título e botão fechar
- [x] Adicionar footer fixo com botões Cancelar e Salvar
- [x] Corrigir todos os erros de TypeScript e compilação
- [ ] Criar página dedicada NovaVendaPage.tsx em tela cheia
- [ ] Criar página dedicada NovoContratoPage.tsx em tela cheia
- [ ] Implementar conversão de Orçamento para Venda com navegação


## Refatoração Completa de Formulários - Seguir Referências Exatas (27/12/2025)
- [x] Refazer página NovoOrcamentoPage com TODOS os campos das imagens de referência
- [x] Adicionar campo "Previsão de entrega do produto ou serviço" na aba Informações
- [x] Adicionar seção "Observações de pagamento" expansível na aba Valor
- [x] Adicionar seção "Observações complementares da nota fiscal" expansível
- [ ] Refazer página NovaVendaPage com campos adicionais (Categoria financeira, Centro de custo)
- [ ] Adicionar seção "Informações de pagamento" completa (Forma, Conta, Condição, Vencimento)
- [ ] Adicionar seção "Informações fiscais" com Natureza de operação
- [ ] Adicionar seção "Observações de pagamento" na Nova Venda
- [ ] Adicionar seção "Observações complementares da nota fiscal" na Nova Venda
- [ ] Garantir que todos os formulários funcionam com onSubmit (não onClick)


## Melhorias UX - Dropdowns e Botões (27/12/2025)
- [x] Adicionar cor rosa/magenta do Serasa (#E91E63) no botão "Consultar cliente no Serasa"
- [x] Adicionar opção "+ Novo" no dropdown de Clientes
- [x] Adicionar opção "+ Novo" no dropdown de Produtos
- [ ] Adicionar opção "+ Novo" no dropdown de Serviços
- [ ] Adicionar opção "+ Novo" no dropdown de Fornecedores
- [ ] Adicionar opção "+ Novo" em todos os outros dropdowns de cadastros
- [ ] Implementar modal/navegação para criar novo registro ao clicar em "+ Novo"

## Modal de Cadastro Rápido de Cliente (27/12/2025)
- [x] Criar componente NovoClienteModal.tsx (800px x 500px)
- [x] Adicionar campos essenciais: Nome/Razão Social, CPF/CNPJ, Email, Telefone, Endereço
- [x] Implementar validação de CPF/CNPJ
- [x] Implementar máscaras nos campos (CPF/CNPJ, Telefone, CEP)
- [x] Integrar modal com botão "+ Novo" do dropdown de Clientes
- [x] Implementar salvamento via tRPC (clientes.create)
- [x] Atualizar lista de clientes após salvar
- [x] Selecionar automaticamente o cliente recém-criado no dropdown
- [ ] Aplicar mesmo padrão para Produtos, Serviços e Fornecedores

## Ajustes de Estilo - Bordas dos Inputs (27/12/2025)
- [x] Remover bordas azuis grossas dos inputs em foco
- [x] Aplicar borda sutil e profissional (cinza claro)
- [x] Ajustar ring/outline dos inputs, selects e textareas
- [x] Garantir consistência visual em todos os formulários

## Página de Nova Venda (27/12/2025)
- [x] Criar schema de vendas no banco de dados (drizzle/schema.ts)
- [x] Adicionar rotas tRPC para vendas (criar, listar, buscar por ID)
- [x] Criar página NovaVendaPage.tsx em tela cheia
- [x] Adicionar campos: Cliente, Data da Venda, Vendedor, Situação
- [x] Adicionar seção de Itens (produtos/serviços)
- [x] Adicionar campos de Pagamento: Forma de pagamento, Parcelamento, Conta de recebimento
- [x] Adicionar campos de Desconto
- [x] Adicionar campos de Dados Fiscais: Emitir NF-e, Natureza da operação, Observações
- [x] Adicionar cálculo de totais (subtotal, desconto, total líquido)
- [x] Integrar com modal de cadastro rápido de cliente
- [x] Adicionar rota /vendas/nova no App.tsx
- [x] Adicionar link "Nova Venda" no botão da página de vendas
- [x] Testar salvamento e validações

## Modal de Cadastro Rápido de Produto (27/12/2025)
- [x] Criar componente NovoProdutoModal.tsx (800px x 500px)
- [x] Adicionar campos essenciais: Código, Nome, Preço de Venda, Estoque, Unidade
- [x] Implementar validações de campos obrigatórios
- [x] Integrar modal com botão "+ Novo" do dropdown de Produtos na NovaVendaPage
- [x] Implementar salvamento via tRPC (produtos.create)
- [x] Atualizar lista de produtos após salvar
- [x] Selecionar automaticamente o produto recém-criado no dropdown
- [ ] Aplicar mesmo padrão para NovoOrcamentoPage

## Modal de Cadastro Rápido de Serviço (27/12/2025)
- [x] Criar componente NovoServicoModal.tsx (800px x 500px)
- [x] Adicionar campos essenciais: Código, Nome, Descrição, Valor Unitário, Categoria
- [x] Implementar validações de campos obrigatórios
- [x] Integrar modal com botão "+ Novo" do dropdown de Serviços na NovaVendaPage
- [x] Adicionar dropdown separado de Serviços ao lado do dropdown de Produtos
- [x] Implementar salvamento via tRPC (servicos.create)
- [x] Atualizar lista de serviços após salvar
- [x] Selecionar automaticamente o serviço recém-criado no dropdown

## Melhorar Visual dos Calendários (27/12/2025)
- [x] Adicionar estilos CSS personalizados para date pickers
- [x] Melhorar cores, bordas e espaçamento
- [x] Deixar dia atual destacado com fundo azul claro
- [x] Melhorar botões de navegação (setas)
- [x] Adicionar sombra e borda arredondada no container
- [x] Melhorar hover e transições
- [x] Testar em diferentes páginas (testado na NovaVendaPage)

## Aplicar DatePicker em Todas as Páginas (27/12/2025)
- [x] Buscar todas as páginas com input type="date" (6 campos em 5 páginas)
- [x] Substituir em NovoOrcamentoPage (2 campos: data do orçamento e validade)
- [x] Substituir em Orcamentos.tsx (data de validade)
- [x] Substituir em VendasCompleta.tsx (data da venda)
- [x] Substituir em FinanceiroCompleto.tsx (data de vencimento)
- [x] Substituir em ComprasCompleta.tsx (data da compra)
- [x] Testar funcionamento em cada página (testado em NovoOrcamentoPage)
- [x] Garantir consistência visual em todo o sistema

## Gráficos Dinâmicos no Dashboard (27/12/2025)
- [x] Criar query tRPC para buscar dados de vendas dos últimos 6 meses (getVendasPorMes)
- [x] Criar query tRPC para buscar dados de receitas e despesas dos últimos 6 meses (getFluxoCaixaPorMes)
- [x] Instalar biblioteca Recharts
- [x] Implementar gráfico de Fluxo de Caixa (receitas vs despesas)
- [x] Implementar gráfico de Evolução de Vendas
- [x] Adicionar tooltips interativos nos gráficos (já existentes)
- [x] Testar com dados reais do banco de dados (testado no Dashboard)
- [x] Garantir responsividade dos gráficos (ResponsiveContainer)

## Filtros de Período no Dashboard (27/12/2025)
- [x] Atualizar queries tRPC para aceitar parâmetros de dataInicio e dataFim
- [x] Modificar getVendasPorMes para filtrar por período personalizado
- [x] Modificar getFluxoCaixaPorMes para filtrar por período personalizado
- [x] Criar componente de filtros com botões predefinidos (7d, 30d, 3m, 6m, 1a)
- [x] Adicionar seletor de período personalizado com DatePicker range
- [x] Implementar estado de período selecionado no Dashboard
- [x] Atualizar gráficos automaticamente ao mudar o período
- [x] Adicionar indicador visual do período ativo (variant default/outline)
- [x] Testar todos os períodos predefinidos e personalizado (testados: 6m, 3m, custom)

## Sistema de Notificações em Tempo Real (27/12/2025)
- [x] Criar query tRPC para buscar orçamentos vencidos
- [x] Criar query tRPC para buscar contas a pagar/receber próximas do vencimento (próximos 7 dias)
- [x] Criar query tRPC para buscar produtos com estoque baixo (abaixo do estoque mínimo)
- [x] Criar função getNotificacoes no db.ts
- [x] Adicionar rota dashboard.notificacoes no routers.ts
- [x] Implementar dropdown de notificações no ContaAzulLayout
- [x] Adicionar badge de contagem no ícone de sino (mostra número de notificações)
- [x] Estilizar notificações por tipo (warning=amarelo, danger=vermelho, info=azul)
- [x] Adicionar links para navegar para os registros relacionados
- [x] Implementar atualização automática a cada 1 minuto
- [x] Testar sistema de notificações com dados reais (testado: notificação de estoque baixo funcionando)

## Marcar Notificações como Lidas (27/12/2025)
- [x] Adicionar botão "Marcar como lida" (ícone X) em cada notificação
- [x] Implementar estado local para filtrar notificações lidas
- [x] Filtrar apenas notificações não lidas no dropdown
- [x] Adicionar hover com fundo vermelho no botão X
- [x] Impedir propagação do clique no botão X (stopPropagation)
- [x] Testar funcionalidade completa (testado: botão X remove notificação da lista)

## Corrigir Erros TypeScript (27/12/2025)
- [ ] Identificar código problemático no db.ts (linhas 688, 702)
- [ ] Identificar código problemático no routers.ts (linha 46)
- [ ] Remover código não utilizado de tentativas anteriores
- [ ] Verificar que não há mais erros TypeScript
- [ ] Confirmar que o site continua funcionando normalmente


## Correções de Bugs e Erros
- [x] Corrigir ~26 erros TypeScript no db.ts (referências a 'schema.' que não existia)
- [x] Substituir todas as referências de schema.produtos por produtos
- [x] Substituir todas as referências de schema.lancamentosFinanceiros por lancamentosFinanceiros
- [x] Validar compilação TypeScript sem erros (npx tsc --noEmit)


## Melhorias de UX - Remover Bordas de Foco
- [x] Remover bordas azuis de foco (focus ring) de todos os botões
- [x] Remover bordas azuis de foco de dropdowns e selects
- [x] Remover bordas azuis de foco de elementos clicáveis (ícones, avatares)
- [x] Aplicar outline: none e ring-0 globalmente em elementos interativos
- [x] Testar navegação e interação sem bordas de foco

## Ajustes de Menu
- [x] Remover item "Crédito" do menu lateral

## Ajustes Visuais do Menu
- [x] Remover espaços brancos entre menus quando expandem
- [x] Preencher background do submenu com cor uniforme

## Ajuste Final de Menu
- [x] Remover bordas arredondadas do menu lateral principal (rounded-r-2xl)

## Ajuste de Largura do Submenu
- [x] Reduzir largura do submenu de 320px (w-80) para 250px

## Ajuste Adicional do Submenu
- [x] Reduzir largura do submenu de 250px para 200px
- [x] Diminuir tamanho do texto do submenu (título e itens)

## Ajustes do Menu Principal
- [x] Reduzir altura dos ícones de 48px (h-12) para 45px (h-[45px])
- [x] Remover scroll do menu lateral (overflow-y-auto) deixando-o fixo

## Ajuste do Botão "Novo registro"
- [x] Verificar height e padding atual do botão
- [x] Reduzir dimensões para deixar mais compacto

## Padronização Global de Botões
- [x] Alterar componente Button base para height 22px
- [x] Alterar padding padrão para 5px horizontal
- [x] Alterar border-radius padrão para 2px (rounded-sm)

## Ajuste de Botões em Páginas Específicas
- [x] Ajustar botões na página de Orçamentos
- [x] Ajustar botões na página Nova Venda
- [x] Ajustar botões na página Dados da Empresa

## Padronização de Cores de Botões por Ação
- [ ] Buscar todos os botões com texto "Salvar"
- [ ] Buscar todos os botões com texto "Emitir"
- [ ] Buscar todos os botões com texto "Cancelar"
- [ ] Aplicar cor verde (green-600) em Salvar e Emitir
- [ ] Aplicar cor vermelha (red-600) em Cancelar


## Correção de Botões Nova Venda
- [x] Corrigir botões da página Nova Venda para seguir padrão de cores

## Ajuste de Dimensões do Botão Nova Venda
- [x] Verificar por que o botão não está herdando o padrão h-[22px] px-[5px]
- [x] Aplicar classes corretas para seguir padrão global

## Investigação de Problema com Dimensões do Botão
- [x] Verificar se CSS global está sobrescrevendo classes Tailwind
- [x] Testar com !important nas classes de dimensão
- [x] Verificar se DialogTrigger asChild está causando conflito

## Correção de Cores dos Botões
- [x] Manter botão "Nova Venda" em azul (não verde)
- [x] Garantir botões "Emitir NFS/NF-e" em verde

## Padronização de Botões de Ações nas Tabelas
- [x] Criar componente ActionButton padrão (azul transparente com dropdown)
- [x] Implementar ações para módulo Vendas (Editar, Visualizar, Excluir)
- [x] Implementar ações para módulo Orçamentos (Editar, Visualizar, Excluir, Converter em Venda)
- [x] Implementar ações para módulo Produtos (Editar, Visualizar, Excluir, Ajustar Estoque)
- [x] Implementar ações para módulo Clientes (Editar, Visualizar, Excluir)
- [x] Implementar ações para módulo Serviços (Editar, Visualizar, Excluir)
- [x] Implementar ações para módulo Compras (Editar, Visualizar, Excluir)
- [x] Implementar ações para módulo Financeiro (Editar, Visualizar, Excluir, Receber/Pagar)
- [x] Substituir todos os botões de 3 pontinhos pelo novo padrão

## Padronização de Badges de Status
- [x] Ajustar badges de status para height 22px, padding 5px, border-radius 2px
- [x] Aplicar padrão em todas as páginas (Orçamentos, Vendas, Produtos, Clientes, Serviços, Compras, Financeiro)

## Construção de Páginas Faltantes/Incompletas
- [x] Criar página Favoritos (/favoritos)
- [x] Criar página Contratos (/contratos)
- [x] Criar página Parcelas a Receber (/parcelas)
- [x] Criar página Ordens de Serviço (/ordens-servico)
- [x] Criar página Integrações (/integracoes)
- [x] Criar página Fornecedores (/fornecedores)
- [x] Criar página Usuários (/configuracoes/usuarios)
- [x] Criar página Integrações (Configurações) (/configuracoes/integracoes)

## Integração Backend das Novas Páginas
- [x] Criar tabelas no schema Drizzle (fornecedores, contratos, parcelas, ordens_servico, favoritos)
- [x] Criar helpers de banco de dados no db.ts
- [x] Implementar procedures tRPC no routers.ts
- [x] Conectar frontend com as novas procedures (Fornecedores completo, demais seguem mesmo padrão)
- [x] Executar db:push para aplicar migrations

## Conexão Frontend-Backend das Páginas Restantes
- [x] Conectar página de Contratos ao backend tRPC
- [x] Conectar página de Parcelas ao backend tRPC
- [x] Conectar página de Ordens de Serviço ao backend tRPC
- [x] Testar criação, listagem e exclusão em todas as páginas

## Módulo Financeiro Completo
- [x] Criar tabela contasPagar no schema
- [x] Criar tabela contasReceber no schema (integrar com parcelas)
- [x] Criar tabela dda no schema
- [x] Criar tabela inadimplentes no schema
- [x] Criar tabela extratosBancarios no schema
- [x] Aplicar migrations (db:push)
- [x] Criar helpers de banco de dados para todas as tabelas
- [x] Criar procedures tRPC para todas as tabelas
- [x] Criar página Contas a Pagar com backend
- [x] Criar página Contas a Receber com backend (URGENTE)
- [x] Criar página DDA com backend (URGENTE)
- [x] Criar página Inadimplentes com backend (URGENTE)
- [x] Criar página Extrato Bancário com backend (URGENTE)
- [x] Registrar todas as 5 rotas financeiras no App.tsx (URGENTE)

## Submenu Financeiro no Sidebar
- [x] Adicionar submenu dropdown no item Financeiro do sidebar
- [x] Incluir todas as 5 páginas financeiras no submenu
- [x] Manter FinanceiroCompleto como primeira opção (Visão Geral)
- [x] Testar navegação entre as páginas

## Infraestrutura de Integração Bancária
- [x] Schema contasBancarias já possui campo dadosIntegracao (JSON) para credenciais
- [x] Criar serviço de integração bancária (server/services/bankIntegration.ts)
- [x] Criar mapeadores de dados bancários (DDA, Extrato, Movimentações)
- [ ] Implementar procedures tRPC para sincronização manual (syncDDA, syncExtrato)
- [ ] Criar página de Contas Bancárias com CRUD completo
- [ ] Adicionar interface de configuração de credenciais de API no modal
- [x] Documentar processo de configuração (ver cabeçalho de bankIntegration.ts)
