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
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function ExtratoBancario() {
  const { data: extratos = [], isLoading } = trpc.extratosBancarios.list.useQuery({});
  const deleteMutation = trpc.extratosBancarios.delete.useMutation({
    onSuccess: () => {
      toast.success("Lançamento excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir lançamento: " + error.message);
    },
  });

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(parseFloat(value));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const totalEntradas = extratos
    .filter(e => e.tipo === "entrada")
    .reduce((acc, e) => acc + parseFloat(e.valor), 0);

  const totalSaidas = extratos
    .filter(e => e.tipo === "saida")
    .reduce((acc, e) => acc + parseFloat(e.valor), 0);

  const saldo = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Extrato Bancário</h1>
          <p className="text-muted-foreground mt-1">
            Movimentações da conta PJ
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lançamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Entradas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saídas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(saldo.toString())}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : extratos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extratos.map((extrato) => (
                  <TableRow key={extrato.id}>
                    <TableCell>{formatDate(extrato.data)}</TableCell>
                    <TableCell>{extrato.descricao}</TableCell>
                    <TableCell>{extrato.categoria || "-"}</TableCell>
                    <TableCell>{extrato.documento || "-"}</TableCell>
                    <TableCell className={`text-right font-medium ${extrato.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
                      {extrato.tipo === "entrada" ? "+" : "-"} {formatCurrency(extrato.valor)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(extrato.saldoPosterior)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            icon: ActionIcons.View,
                            label: "Visualizar",
                            onClick: () => toast.info("Visualizar lançamento #" + extrato.id),
                          },
                          {
                            icon: ActionIcons.Delete,
                            label: "Excluir",
                            variant: "destructive",
                            onClick: () => {
                              if (confirm("Deseja realmente excluir este lançamento?")) {
                                deleteMutation.mutate({ id: extrato.id });
                              }
                            },
                          },
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primeira Movimentação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
