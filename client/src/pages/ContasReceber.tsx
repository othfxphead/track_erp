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
import { Plus, DollarSign, TrendingDown, Calendar, AlertCircle } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function ContasReceber() {
  const { data: contas = [], isLoading } = trpc.contasReceber.list.useQuery();
  const deleteMutation = trpc.contasReceber.delete.useMutation({
    onSuccess: () => {
      toast.success("Conta excluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir conta: " + error.message);
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: "Pendente", color: "bg-warning/10 text-warning" },
      recebido: { label: "Recebido", color: "bg-success/10 text-success" },
      vencido: { label: "Vencido", color: "bg-destructive/10 text-destructive" },
      cancelado: { label: "Cancelado", color: "bg-muted text-muted-foreground" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalPendente = contas
    .filter(c => c.status === "pendente")
    .reduce((acc, c) => acc + parseFloat(c.valor), 0);

  const totalVencido = contas
    .filter(c => c.status === "vencido")
    .reduce((acc, c) => acc + parseFloat(c.valor), 0);

  const totalRecebido = contas
    .filter(c => c.status === "recebido")
    .reduce((acc, c) => acc + parseFloat(c.valorRecebido || "0"), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contas a Receber</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de receitas e recebimentos
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPendente.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vencidas</p>
                <p className="text-2xl font-bold">{formatCurrency(totalVencido.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recebidas</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRecebido.toString())}</p>
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
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{contas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contas */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Contas a Receber</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : contas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contas.map((conta) => (
                  <TableRow key={conta.id}>
                    <TableCell className="font-medium">
                      {conta.numero}
                    </TableCell>
                    <TableCell>{conta.descricao}</TableCell>
                    <TableCell>{conta.categoria || "-"}</TableCell>
                    <TableCell>{formatDate(conta.dataVencimento)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(conta.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(conta.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            icon: ActionIcons.View,
                            label: "Visualizar",
                            onClick: () => toast.info("Visualizar conta #" + conta.id),
                          },
                          {
                            icon: ActionIcons.Edit,
                            label: "Editar",
                            onClick: () => toast.info("Editar conta #" + conta.id),
                          },
                          {
                            icon: ActionIcons.Receive,
                            label: "Receber",
                            onClick: () => toast.info("Receber conta #" + conta.id),
                          },
                          {
                            icon: ActionIcons.Delete,
                            label: "Excluir",
                            variant: "destructive",
                            onClick: () => {
                              if (confirm("Deseja realmente excluir esta conta?")) {
                                deleteMutation.mutate({ id: conta.id });
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
              <p className="text-muted-foreground">Nenhuma conta a receber cadastrada</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeira Conta
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
