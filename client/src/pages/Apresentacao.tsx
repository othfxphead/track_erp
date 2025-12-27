import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  Package,
  Wrench,
  ShoppingBag,
  Archive,
  DollarSign,
  Receipt,
  Settings,
  FileBarChart,
  Search,
  Sparkles,
  Database,
  Shield,
  Zap,
  Cloud,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";

export default function Apresentacao() {
  const modulos = [
    {
      icon: LayoutDashboard,
      titulo: "Dashboard Inteligente",
      descricao: "KPIs em tempo real, gráficos interativos e visão 360° do seu negócio",
      cor: "text-blue-600",
      bgCor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: FileText,
      titulo: "Orçamentos",
      descricao: "Crie orçamentos profissionais e converta automaticamente em vendas",
      cor: "text-purple-600",
      bgCor: "bg-purple-50 dark:bg-purple-950",
    },
    {
      icon: ShoppingCart,
      titulo: "Gestão de Vendas",
      descricao: "Controle completo de pedidos com emissão automática de notas fiscais",
      cor: "text-green-600",
      bgCor: "bg-green-50 dark:bg-green-950",
    },
    {
      icon: Package,
      titulo: "Produtos",
      descricao: "Catálogo completo com controle de preços, margens e categorias",
      cor: "text-orange-600",
      bgCor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      icon: Wrench,
      titulo: "Serviços",
      descricao: "Gestão de serviços com valores e códigos municipais",
      cor: "text-cyan-600",
      bgCor: "bg-cyan-50 dark:bg-cyan-950",
    },
    {
      icon: ShoppingBag,
      titulo: "Compras",
      descricao: "Registro de compras com atualização automática de estoque",
      cor: "text-pink-600",
      bgCor: "bg-pink-50 dark:bg-pink-950",
    },
    {
      icon: Archive,
      titulo: "Controle de Estoque",
      descricao: "Movimentações, alertas de mínimo e histórico completo",
      cor: "text-indigo-600",
      bgCor: "bg-indigo-50 dark:bg-indigo-950",
    },
    {
      icon: DollarSign,
      titulo: "Financeiro Completo",
      descricao: "Contas a pagar/receber, fluxo de caixa e integração bancária",
      cor: "text-emerald-600",
      bgCor: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      icon: Receipt,
      titulo: "Módulo Fiscal",
      descricao: "Emissão de NF-e e NFS-e via Focus API com certificado digital",
      cor: "text-red-600",
      bgCor: "bg-red-50 dark:bg-red-950",
    },
    {
      icon: FileBarChart,
      titulo: "Relatórios",
      descricao: "Relatórios gerenciais com filtros avançados e exportação",
      cor: "text-violet-600",
      bgCor: "bg-violet-50 dark:bg-violet-950",
    },
    {
      icon: Search,
      titulo: "Consulta Serasa",
      descricao: "Verificação de CPF/CNPJ antes de transações comerciais",
      cor: "text-amber-600",
      bgCor: "bg-amber-50 dark:bg-amber-950",
    },
    {
      icon: Settings,
      titulo: "Configurações",
      descricao: "Personalização completa da empresa, usuários e integrações",
      cor: "text-slate-600",
      bgCor: "bg-slate-50 dark:bg-slate-950",
    },
  ];

  const iaFeatures = [
    {
      icon: Sparkles,
      titulo: "Sugestões Inteligentes",
      descricao: "Preenchimento automático de campos e sugestões de preços baseadas em IA",
    },
    {
      icon: Zap,
      titulo: "Previsões Financeiras",
      descricao: "Análise preditiva de fluxo de caixa e tendências de receitas/despesas",
    },
    {
      icon: FileText,
      titulo: "OCR de Documentos",
      descricao: "Extração automática de dados de notas fiscais (PDF, XML, imagens)",
    },
    {
      icon: Shield,
      titulo: "Classificação Automática",
      descricao: "Categorização inteligente de despesas e receitas com machine learning",
    },
  ];

  const integracoes = [
    {
      nome: "Focus NFe",
      descricao: "Emissão de notas fiscais eletrônicas",
      logo: "🧾",
    },
    {
      nome: "Asaas",
      descricao: "Gestão de cobranças e pagamentos",
      logo: "💳",
    },
    {
      nome: "Sicredi",
      descricao: "Integração bancária e extratos",
      logo: "🏦",
    },
    {
      nome: "Serasa",
      descricao: "Consulta de crédito CPF/CNPJ",
      logo: "🔍",
    },
  ];

  const tecnologias = [
    { nome: "React 19", descricao: "Interface moderna e responsiva" },
    { nome: "tRPC 11", descricao: "API type-safe end-to-end" },
    { nome: "MySQL/TiDB", descricao: "Banco de dados escalável" },
    { nome: "IA Integrada", descricao: "Inteligência artificial nativa" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo-track-erp.png" alt="Track ERP" className="h-8" />
          </div>
          <Link href="/">
            <Button>
              Acessar Sistema
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            ERP Enterprise com Inteligência Artificial
          </div>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Gestão Empresarial
            <br />
            <span className="text-primary">Inteligente e Integrada</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Sistema ERP completo para prestadores de serviço com IA, controle financeiro,
            fiscal, estoque e integrações com as principais APIs do mercado brasileiro.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/">
              <Button size="lg" className="gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Começar Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="gap-2">
              <FileBarChart className="h-5 w-5" />
              Ver Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Módulos */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Módulos Completos</h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa para gerenciar seu negócio em um só lugar
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modulos.map((modulo, index) => {
            const Icon = modulo.icon;
            return (
              <Card key={index} className="card-shadow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`inline-flex p-3 rounded-lg ${modulo.bgCor} w-fit mb-2`}>
                    <Icon className={`h-6 w-6 ${modulo.cor}`} />
                  </div>
                  <CardTitle className="text-lg">{modulo.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{modulo.descricao}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* IA Features */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
              <Sparkles className="h-4 w-4" />
              Inteligência Artificial
            </div>
            <h2 className="text-3xl font-bold mb-4">Automação Inteligente</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              IA integrada para otimizar processos, prever tendências e economizar tempo
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {iaFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="card-shadow text-center">
                  <CardHeader>
                    <div className="mx-auto inline-flex p-4 rounded-full bg-primary/10 mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.titulo}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.descricao}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Integrações */}
      <section className="container py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
            <Cloud className="h-4 w-4" />
            Integrações
          </div>
          <h2 className="text-3xl font-bold mb-4">Conectado ao Ecossistema</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integração nativa com as principais plataformas do mercado brasileiro
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
          {integracoes.map((integracao, index) => (
            <Card key={index} className="card-shadow text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-5xl mb-2">{integracao.logo}</div>
                <CardTitle className="text-lg">{integracao.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{integracao.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tecnologias */}
      <section className="bg-muted/50 py-20">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
              <Database className="h-4 w-4" />
              Tecnologia
            </div>
            <h2 className="text-3xl font-bold mb-4">Stack Moderna e Escalável</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desenvolvido com as melhores tecnologias para performance e segurança
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {tecnologias.map((tech, index) => (
              <Card key={index} className="card-shadow text-center">
                <CardHeader>
                  <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2" />
                  <CardTitle className="text-lg">{tech.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tech.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container py-20">
        <Card className="card-shadow bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Pronto para Transformar sua Gestão?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Comece agora a usar o Track ERP e tenha controle total do seu negócio
              com inteligência artificial e automações.
            </p>
            <Link href="/">
              <Button size="lg" className="gap-2">
                <LayoutDashboard className="h-5 w-5" />
                Acessar Sistema Completo
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 Track ERP. Sistema ERP Enterprise com Inteligência Artificial.</p>
          <p className="mt-2">Desenvolvido com React 19, tRPC 11 e IA integrada.</p>
        </div>
      </footer>
    </div>
  );
}
