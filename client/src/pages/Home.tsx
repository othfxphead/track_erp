
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ShoppingCart,
  Calendar,
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PeriodoPreset = '7d' | '30d' | '3m' | '6m' | '1a' | 'custom';

export default function Home() {
  const [periodoAtivo, setPeriodoAtivo] = useState<PeriodoPreset>('6m');
  const [dataInicio, setDataInicio] = useState<Date | undefined>();
  const [dataFim, setDataFim] = useState<Date | undefined>();

  // Calcular datas baseado no período selecionado
  const calcularPeriodo = (periodo: PeriodoPreset) => {
    const hoje = new Date();
    let inicio: Date | undefined;
    let fim: Date | undefined = hoje;

    switch (periodo) {
      case '7d':
        inicio = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        inicio = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1);
        break;
      case '6m':
        inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);
        break;
      case '1a':
        inicio = new Date(hoje.getFullYear() - 1, hoje.getMonth(), 1);
        break;
      case 'custom':
        inicio = dataInicio;
        fim = dataFim;
        break;
    }

    return { dataInicio: inicio, dataFim: fim };
  };

  const periodo = calcularPeriodo(periodoAtivo);

  const { data: kpis, isLoading } = trpc.dashboard.kpis.useQuery();
  const { data: vendasData } = trpc.dashboard.vendasPorMes.useQuery(periodo);
  const { data: fluxoCaixaData } = trpc.dashboard.fluxoCaixaPorMes.useQuery(periodo);

  const handlePeriodoChange = (novoPeriodo: PeriodoPreset) => {
    setPeriodoAtivo(novoPeriodo);
    if (novoPeriodo !== 'custom') {
      setDataInicio(undefined);
      setDataFim(undefined);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Dados dos gráficos vindo do backend via tRPC
  const vendasChartData = vendasData?.map(item => ({
    mes: item.mes,
    vendas: item.valor,
  })) || [];

  const fluxoCaixaChartData = fluxoCaixaData || [];

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu negócio
          </p>
        </div>

        {/* Filtros de Período */}
        <Card className="card-shadow">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Período de análise:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={periodoAtivo === '7d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodoChange('7d')}
                >
                  Últimos 7 dias
                </Button>
                <Button
                  variant={periodoAtivo === '30d' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodoChange('30d')}
                >
                  Últimos 30 dias
                </Button>
                <Button
                  variant={periodoAtivo === '3m' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodoChange('3m')}
                >
                  Últimos 3 meses
                </Button>
                <Button
                  variant={periodoAtivo === '6m' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodoChange('6m')}
                >
                  Últimos 6 meses
                </Button>
                <Button
                  variant={periodoAtivo === '1a' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodoChange('1a')}
                >
                  Último ano
                </Button>
                <Button
                  variant={periodoAtivo === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePeriodoChange('custom')}
                >
                  Período personalizado
                </Button>
              </div>
              {periodoAtivo === 'custom' && (
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">De:</span>
                    <DatePicker
                      date={dataInicio}
                      onDateChange={setDataInicio}
                      placeholder="Data inicial"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Até:</span>
                    <DatePicker
                      date={dataFim}
                      onDateChange={setDataFim}
                      placeholder="Data final"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contas a Receber
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(kpis?.contasReceber || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valores pendentes de recebimento
              </p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contas a Pagar
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {formatCurrency(kpis?.contasPagar || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valores pendentes de pagamento
              </p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Contas Vencidas
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {formatCurrency(kpis?.contasVencidas || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpis?.quantidadeVencidas || 0} conta(s) vencida(s)
              </p>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vendas do Mês
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(kpis?.vendasMes || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total de vendas no mês atual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Fluxo de Caixa */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
              <p className="text-sm text-muted-foreground">
                Receitas vs Despesas (últimos 6 meses)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fluxoCaixaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="receitas"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    name="Receitas"
                  />
                  <Line
                    type="monotone"
                    dataKey="despesas"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={2}
                    name="Despesas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vendas */}
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Evolução de Vendas</CardTitle>
              <p className="text-sm text-muted-foreground">
                Total de vendas (últimos 6 meses)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendasChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar
                    dataKey="vendas"
                    fill="hsl(var(--primary))"
                    name="Vendas"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
                <DollarSign className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold">Novo Orçamento</h3>
                <p className="text-sm text-muted-foreground">
                  Criar novo orçamento para cliente
                </p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
                <ShoppingCart className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold">Nova Venda</h3>
                <p className="text-sm text-muted-foreground">
                  Registrar uma nova venda
                </p>
              </button>
              <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
                <TrendingUp className="h-6 w-6 text-primary mb-2" />
                <h3 className="font-semibold">Lançamento Financeiro</h3>
                <p className="text-sm text-muted-foreground">
                  Adicionar receita ou despesa
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
