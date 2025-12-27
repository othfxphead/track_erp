import ERPLayout from "@/components/ERPLayout";
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
import { trpc } from "@/lib/trpc";
import { Plus, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Vendas() {
  const { data: vendas, isLoading } = trpc.vendas.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? "R$ 0,00" : new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pendente: { label: "Pendente", color: "bg-warning/10 text-warning" },
      pago: { label: "Pago", color: "bg-success/10 text-success" },
      cancelado: { label: "Cancelado", color: "bg-destructive/10 text-destructive" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas vendas e pedidos
            </p>
          </div>
          <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Venda
          </Button>
        </div>

        {/* Lista de Vendas */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : vendas && vendas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendas.map((venda) => {
                    const cliente = clientes?.find(c => c.id === venda.clienteId);
                    return (
                      <TableRow key={venda.id}>
                        <TableCell className="font-medium">
                          #{venda.numero}
                        </TableCell>
                        <TableCell>{cliente?.nome || "-"}</TableCell>
                        <TableCell>{formatDate(venda.dataVenda)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(venda.valorTotal)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(venda.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast.info("Emissão de NF em desenvolvimento")}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhuma venda registrada ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  As vendas são criadas automaticamente quando você aprova um orçamento.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}
