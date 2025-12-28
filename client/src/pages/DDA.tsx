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
import { Plus, FileText, CheckCircle, Clock } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function DDA() {
  const { data: ddas = [], isLoading } = trpc.dda.list.useQuery();
  const deleteMutation = trpc.dda.delete.useMutation({
    onSuccess: () => {
      toast.success("DDA excluído com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao excluir DDA: " + error.message);
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
      pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
      autorizado: { label: "Autorizado", color: "bg-blue-100 text-blue-800" },
      pago: { label: "Pago", color: "bg-green-100 text-green-800" },
      rejeitado: { label: "Rejeitado", color: "bg-red-100 text-red-800" },
      cancelado: { label: "Cancelado", color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalPendentes = ddas.filter(d => d.status === "pendente").length;
  const totalAutorizados = ddas.filter(d => d.status === "autorizado").length;
  const totalPagos = ddas.filter(d => d.status === "pago").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DDA - Débito Direto Autorizado</h1>
          <p className="text-muted-foreground mt-1">
            Gestão de boletos e autorizações de débito
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo DDA
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{totalPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Autorizados</p>
                <p className="text-2xl font-bold">{totalAutorizados}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pagos</p>
                <p className="text-2xl font-bold">{totalPagos}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de DDAs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Carregando...</p>
          ) : ddas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código de Barras</TableHead>
                  <TableHead>Beneficiário</TableHead>
                  <TableHead>Pagador</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ddas.map((dda) => (
                  <TableRow key={dda.id}>
                    <TableCell className="font-mono text-xs">{dda.codigoBarras}</TableCell>
                    <TableCell>{dda.beneficiario}</TableCell>
                    <TableCell>{dda.pagador}</TableCell>
                    <TableCell>{formatDate(dda.dataVencimento)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(dda.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(dda.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            icon: ActionIcons.View,
                            label: "Visualizar",
                            onClick: () => toast.info("Visualizar DDA #" + dda.id),
                          },
                          {
                            icon: ActionIcons.Edit,
                            label: "Autorizar",
                            onClick: () => toast.info("Autorizar DDA #" + dda.id),
                          },
                          {
                            icon: ActionIcons.Delete,
                            label: "Excluir",
                            variant: "destructive",
                            onClick: () => {
                              if (confirm("Deseja realmente excluir este DDA?")) {
                                deleteMutation.mutate({ id: dda.id });
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
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Nenhum DDA cadastrado</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast.info("Funcionalidade em desenvolvimento")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro DDA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
