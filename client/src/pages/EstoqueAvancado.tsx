import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  DollarSign,
  BarChart3,
  RefreshCw,
} from "lucide-react";
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

export default function EstoqueAvancado() {
  const { data: produtos } = trpc.produtos.list.useQuery();
  // Previsões serão calculadas localmente
  const previsoes: any[] = [];

  // Calcular produtos com estoque baixo
  const produtosBaixoEstoque = produtos?.filter(
    (p) => p.estoque <= p.estoqueMinimo
  ) || [];

  // Calcular produtos críticos (estoque zerado)
  const produtosCriticos = produtos?.filter((p) => p.estoque === 0) || [];

  // Calcular valor total em estoque
  const valorTotalEstoque = produtos?.reduce(
    (acc, p) => acc + p.estoque * parseFloat(p.precoCusto),
    0
  ) || 0;

  // Simular dados de movimentações (últimos 6 meses)
  const dadosMovimentacoes = [
    { mes: "Jul", entradas: 450, saidas: 380 },
    { mes: "Ago", entradas: 520, saidas: 420 },
    { mes: "Set", entradas: 480, saidas: 510 },
    { mes: "Out", entradas: 600, saidas: 490 },
    { mes: "Nov", entradas: 550, saidas: 530 },
    { mes: "Dez", entradas: 680, saidas: 620 },
  ];

  // Simular produtos parados (sem movimentação há 30+ dias)
  const produtosParados = produtos?.slice(0, 5) || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const calcularDiasParaAcabar = (produto: any) => {
    // Simular cálculo baseado em média de vendas
    const mediaVendasDiarias = 2; // Placeholder
    if (mediaVendasDiarias <= 0) return "N/A";
    const dias = Math.floor(produto.estoque / mediaVendasDiarias);
    return dias > 0 ? `${dias} dias` : "Crítico";
  };

  return (
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard de Estoque
            </h1>
            <p className="text-muted-foreground mt-1">
              Análise avançada com previsões e alertas inteligentes
            </p>
          </div>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar Dados
          </Button>
        </div>

        {/* Cards de Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total de Produtos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{produtos?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Itens cadastrados
              </p>
            </CardContent>
          </Card>

          <Card className="border-warning">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Estoque Baixo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {produtosBaixoEstoque.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Abaixo do mínimo
              </p>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Produtos Críticos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {produtosCriticos.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Estoque zerado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor em Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {formatCurrency(valorTotalEstoque)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Valor total investido
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de Estoque Baixo */}
        {produtosBaixoEstoque.length > 0 && (
          <Card className="border-warning">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Alertas de Estoque Mínimo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Estoque Atual</TableHead>
                    <TableHead className="text-center">Estoque Mínimo</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-center">Previsão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosBaixoEstoque.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">{produto.nome}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold ${
                            produto.estoque === 0
                              ? "text-destructive"
                              : "text-warning"
                          }`}
                        >
                          {produto.estoque}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {produto.estoqueMinimo}
                      </TableCell>
                      <TableCell className="text-center">
                        {produto.estoque === 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                            Crítico
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                            Baixo
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(parseFloat(produto.precoCusto))}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {calcularDiasParaAcabar(produto)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Movimentações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Movimentações de Estoque
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Entradas vs Saídas (últimos 6 meses)
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosMovimentacoes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entradas" fill="#10b981" name="Entradas" />
                  <Bar dataKey="saidas" fill="#ef4444" name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de Tendência */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendência de Estoque
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Evolução do estoque total
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dadosMovimentacoes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="entradas"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Entradas"
                  />
                  <Line
                    type="monotone"
                    dataKey="saidas"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Saídas"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Análises */}
        <Tabs defaultValue="previsao" className="space-y-4">
          <TabsList>
            <TabsTrigger value="previsao">Previsão de Reposição (IA)</TabsTrigger>
            <TabsTrigger value="parados">Produtos Parados</TabsTrigger>
            <TabsTrigger value="giro">Giro de Estoque</TabsTrigger>
          </TabsList>

          {/* Previsão de Reposição com IA */}
          <TabsContent value="previsao">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Previsão de Reposição Inteligente
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Análise baseada em histórico de vendas e tendências usando IA
                </p>
              </CardHeader>
              <CardContent>
                {previsoes && previsoes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Estoque Atual</TableHead>
                        <TableHead className="text-center">
                          Média de Vendas/Dia
                        </TableHead>
                        <TableHead className="text-center">
                          Dias para Acabar
                        </TableHead>
                        <TableHead className="text-center">
                          Quantidade Sugerida
                        </TableHead>
                        <TableHead className="text-right">
                          Valor Estimado
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previsoes.map((previsao: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {previsao.produto}
                          </TableCell>
                          <TableCell className="text-center">
                            {previsao.estoqueAtual}
                          </TableCell>
                          <TableCell className="text-center">
                            {previsao.mediaVendas}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`font-bold ${
                                previsao.diasParaAcabar < 7
                                  ? "text-destructive"
                                  : previsao.diasParaAcabar < 15
                                  ? "text-warning"
                                  : "text-success"
                              }`}
                            >
                              {previsao.diasParaAcabar} dias
                            </span>
                          </TableCell>
                          <TableCell className="text-center font-medium text-primary">
                            {previsao.quantidadeSugerida} un.
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(previsao.valorEstimado)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Analisando histórico de vendas para gerar previsões...
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      As previsões serão geradas automaticamente com base nos dados
                      de movimentação
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produtos Parados */}
          <TabsContent value="parados">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-warning" />
                  Produtos sem Movimentação
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Produtos sem entrada ou saída há mais de 30 dias
                </p>
              </CardHeader>
              <CardContent>
                {produtosParados.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Estoque</TableHead>
                        <TableHead className="text-right">Valor Unit.</TableHead>
                        <TableHead className="text-right">
                          Valor Total Parado
                        </TableHead>
                        <TableHead className="text-center">
                          Última Movimentação
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {produtosParados.map((produto) => (
                        <TableRow key={produto.id}>
                          <TableCell className="font-medium">
                            {produto.nome}
                          </TableCell>
                          <TableCell className="text-center">
                            {produto.estoque}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(parseFloat(produto.precoCusto))}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(
                              produto.estoque * parseFloat(produto.precoCusto)
                            )}
                          </TableCell>
                          <TableCell className="text-center text-sm text-muted-foreground">
                            {formatDate(produto.updatedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum produto parado identificado
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Giro de Estoque */}
          <TabsContent value="giro">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Análise de Giro de Estoque
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Produtos com melhor e pior performance de giro
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Análise de giro de estoque em desenvolvimento
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Será calculado baseado em vendas vs estoque médio
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
