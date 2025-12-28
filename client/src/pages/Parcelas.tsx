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
import { DollarSign, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";

export default function Parcelas() {
  // Mock data - em produção viria do backend
  const [parcelas] = useState([
    {
      id: 1,
      numero: "001/003",
      venda: "Venda #1234",
      cliente: "João Silva Comércio LTDA",
      dataVencimento: new Date("2025-02-15"),
      valor: 500.00,
      status: "pendente",
    },
    {
      id: 2,
      numero: "002/003",
      venda: "Venda #1234",
      cliente: "João Silva Comércio LTDA",
      dataVencimento: new Date("2025-03-15"),
      valor: 500.00,
      status: "pendente",
    },
    {
      id: 3,
      numero: "001/001",
      venda: "Venda #1235",
      cliente: "Maria Santos ME",
      dataVencimento: new Date("2025-01-20"),
      valor: 1200.00,
      status: "pago",
    },
    {
      id: 4,
      numero: "001/002",
      venda: "Venda #1236",
      cliente: "Tech Solutions LTDA",
      dataVencimento: new Date("2025-01-10"),
      valor: 800.00,
      status: "vencido",
    },
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: "Pendente", color: "bg-warning/10 text-warning" },
      pago: { label: "Pago", color: "bg-success/10 text-success" },
      vencido: { label: "Vencido", color: "bg-destructive/10 text-destructive" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const totalPendente = parcelas
    .filter(p => p.status === "pendente")
    .reduce((acc, p) => acc + p.valor, 0);

  const totalVencido = parcelas
    .filter(p => p.status === "vencido")
    .reduce((acc, p) => acc + p.valor, 0);

  const totalRecebido = parcelas
    .filter(p => p.status === "pago")
    .reduce((acc, p) => acc + p.valor, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Parcelas a Receber</h1>
          <p className="text-muted-foreground mt-1">
            Controle de parcelas de vendas
          </p>
        </div>
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
                <p className="text-2xl font-bold">{formatCurrency(totalPendente)}</p>
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
                <p className="text-sm text-muted-foreground">Vencidas</p>
                <p className="text-2xl font-bold">{formatCurrency(totalVencido)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Recebidas</p>
                <p className="text-2xl font-bold">{formatCurrency(totalRecebido)}</p>
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
                <p className="text-2xl font-bold">{parcelas.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Parcelas */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Parcelas</CardTitle>
        </CardHeader>
        <CardContent>
          {parcelas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parcela</TableHead>
                  <TableHead>Venda</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parcelas.map((parcela) => (
                  <TableRow key={parcela.id}>
                    <TableCell className="font-medium">
                      {parcela.numero}
                    </TableCell>
                    <TableCell>{parcela.venda}</TableCell>
                    <TableCell>{parcela.cliente}</TableCell>
                    <TableCell>{formatDate(parcela.dataVencimento)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(parcela.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(parcela.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Visualizar",
                            icon: ActionIcons.View,
                            onClick: () => toast.info("Visualizando parcela..."),
                          },
                          {
                            label: "Editar",
                            icon: ActionIcons.Edit,
                            onClick: () => toast.info("Editando parcela..."),
                          },
                          ...(parcela.status !== "pago" ? [{
                            label: "Registrar Recebimento",
                            icon: <CheckCircle2 className="h-4 w-4" />,
                            onClick: () => toast.success("Recebimento registrado!"),
                            separator: true,
                          }] : []),
                          {
                            label: "Excluir",
                            icon: ActionIcons.Delete,
                            onClick: () => {
                              if (confirm("Tem certeza que deseja excluir esta parcela?")) {
                                toast.success("Parcela excluída!");
                              }
                            },
                            variant: "destructive" as const,
                            separator: true,
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
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma parcela cadastrada ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Parcelas são criadas automaticamente em vendas parceladas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
