import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  BarChart3,
  DollarSign,
  Package,
  FileText,
  Loader2,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from "lucide-react";

export default function RelatoriosIA() {
  const [relatorioSelecionado, setRelatorioSelecionado] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [relatorioGerado, setRelatorioGerado] = useState<any>(null);

  const gerarRelatorioMutation = trpc.aiAssistant.gerarRelatorio.useMutation({
    onSuccess: (data) => {
      setRelatorioGerado(data);
      setGerando(false);
      toast.success("Relatório gerado com sucesso!");
    },
    onError: (error: any) => {
      toast.error(`Erro ao gerar relatório: ${error.message}`);
      setGerando(false);
    },
  });

  const tiposRelatorio = [
    {
      id: "vendas",
      title: "Vendas por Período",
      icon: BarChart3,
      descricao: "Análise completa de vendas com IA",
    },
    {
      id: "financeiro",
      title: "Fluxo de Caixa",
      icon: DollarSign,
      descricao: "Análise financeira inteligente",
    },
    {
      id: "produtos",
      title: "Produtos Mais Vendidos",
      icon: Package,
      descricao: "Ranking e análise de produtos",
    },
    {
      id: "clientes",
      title: "Clientes Top",
      icon: BarChart3,
      descricao: "Análise de clientes com IA",
    },
  ];

  const handleGerarRelatorio = (tipo: string) => {
    setRelatorioSelecionado(tipo);
    setGerando(true);
    setRelatorioGerado(null);

    // Gerar relatório com IA
    gerarRelatorioMutation.mutate({
      tipo,
      periodo: {
        inicio: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        fim: new Date(),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Relatórios Inteligentes</h1>
        <p className="text-sm text-gray-500 mt-1">
          Relatórios gerenciais gerados com Inteligência Artificial
        </p>
      </div>

      {/* Grid de Tipos de Relatório */}
      {!relatorioGerado && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiposRelatorio.map((relatorio) => (
            <Card
              key={relatorio.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleGerarRelatorio(relatorio.id)}
            >
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <relatorio.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{relatorio.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {relatorio.descricao}
                    </p>
                  </div>
                  <Button size="sm" className="w-full mt-2">
                    Gerar Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Loading */}
      {gerando && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <div className="text-center">
                <h3 className="font-semibold text-lg">Gerando relatório com IA...</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Analisando dados e gerando insights inteligentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Relatório Gerado */}
      {relatorioGerado && !gerando && (
        <div className="space-y-4">
          {/* Cabeçalho do Relatório */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{relatorioGerado.titulo}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {relatorioGerado.resumo}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setRelatorioGerado(null);
                    setRelatorioSelecionado(null);
                  }}
                >
                  Voltar
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Métricas Principais */}
          {relatorioGerado.metricas && relatorioGerado.metricas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatorioGerado.metricas.map((metrica: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{metrica.label}</p>
                        <p className="text-2xl font-bold mt-1">{metrica.valor}</p>
                        {metrica.variacao && (
                          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {metrica.variacao}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Recomendações */}
          {relatorioGerado.recomendacoes && relatorioGerado.recomendacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Recomendações Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {relatorioGerado.recomendacoes.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <p className="text-sm">{rec}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
