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
import { Plus, AlertTriangle, Users, DollarSign } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Inadimplentes() {
  const { data: inadimplentes = [], isLoading } = trpc.inadimplentes.list.useQuery();
  const deleteMutation = trpc.inadimplentes.delete.useMutation({
    onSuccess: () => {
      toast.success("Registro excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir registro: " + error.message);
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
      ativo: { label: "Ativo", color: "bg-red-100 text-red-800" },
      negociando: { label: "Negociando", color: "bg-yellow-100 text-yellow-800" },
      parcelado: { label: "Parcelado", color: "bg-blue-100 text-blue-800" },
      quitado: { label: "Quitado", color: "bg-green-100 text-green-800" },
      protesto: { label: "Protesto", color: "bg-purple-100 text-purple-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.ativo;

    return (
      <span className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalDevido = inadimplentes
    .filter(i => i.status === "ativo")
    .reduce((acc, i) => acc + parseFloat(i.valorDevido), 0);

  const totalAtivos = inadimplentes.filter(i => i.status === "ativo").length;
  const totalNegociando = inadimplentes.filter(i => i.status === "negociando").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inadimplentes</h1>
          <p className="text-muted-foreground mt-1">
            Controle de clientes com pagamentos em atraso
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Registro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inadimplentes Ativos</p>
                <p className="text-2xl font-bold">{totalAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Negociação</p>
                <p className="text-2xl font-bold">{totalNegociando}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Devido</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDevido.toString())}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Inadimplentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : inadimplentes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente ID</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Dias em Atraso</TableHead>
                  <TableHead className="text-right">Valor Devido</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inadimplentes.map((inadimplente) => (
                  <TableRow key={inadimplente.id}>
                    <TableCell className="font-medium">
                      Cliente #{inadimplente.clienteId}
                    </TableCell>
                    <TableCell>{formatDate(inadimplente.dataVencimento)}</TableCell>
                    <TableCell>
                      <span className="font-medium text-red-600">{inadimplente.diasAtraso} dias</span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {formatCurrency(inadimplente.valorDevido)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(inadimplente.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            icon: ActionIcons.View,
                            label: "Visualizar",
                            onClick: () => toast.info("Visualizar inadimplente #" + inadimplente.id),
                          },
                          {
                            icon: ActionIcons.Edit,
                            label: "Negociar",
                            onClick: () => toast.info("Negociar com inadimplente #" + inadimplente.id),
                          },
                          {
                            icon: ActionIcons.Delete,
                            label: "Excluir",
                            variant: "destructive",
                            onClick: () => {
                              if (confirm("Deseja realmente excluir este registro?")) {
                                deleteMutation.mutate({ id: inadimplente.id });
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
              <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum inadimplente registrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primeiro Inadimplente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
