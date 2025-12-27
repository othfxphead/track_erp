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
