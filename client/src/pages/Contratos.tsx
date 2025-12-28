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
import { Plus, FileText, Calendar, Copy } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";

export default function Contratos() {
  // Mock data - em produção viria do backend
  const [contratos] = useState([
    {
      id: 1,
      numero: "CTR-2025-001",
      cliente: "João Silva Comércio LTDA",
      tipo: "Mensal",
      dataInicio: new Date("2025-01-01"),
      dataFim: new Date("2025-12-31"),
      valor: 1500.00,
      status: "ativo",
    },
    {
      id: 2,
      numero: "CTR-2025-002",
      cliente: "Maria Santos ME",
      tipo: "Anual",
      dataInicio: new Date("2025-01-15"),
      dataFim: new Date("2026-01-14"),
      valor: 15000.00,
      status: "ativo",
    },
    {
      id: 3,
      numero: "CTR-2024-089",
      cliente: "Tech Solutions LTDA",
      tipo: "Trimestral",
      dataInicio: new Date("2024-10-01"),
      dataFim: new Date("2024-12-31"),
      valor: 4500.00,
      status: "expirado",
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
      ativo: { label: "Ativo", color: "bg-success/10 text-success" },
      pendente: { label: "Pendente", color: "bg-warning/10 text-warning" },
      expirado: { label: "Expirado", color: "bg-muted text-muted-foreground" },
      cancelado: { label: "Cancelado", color: "bg-destructive/10 text-destructive" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contratos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie contratos recorrentes
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Contrato
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">A Vencer (30d)</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expirados</p>
                <p className="text-2xl font-bold">1</p>
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
                <p className="text-sm text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold">{formatCurrency(1500)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Contratos */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          {contratos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Início</TableHead>
                  <TableHead>Término</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratos.map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell className="font-medium">
                      {contrato.numero}
                    </TableCell>
                    <TableCell>{contrato.cliente}</TableCell>
                    <TableCell>{contrato.tipo}</TableCell>
                    <TableCell>{formatDate(contrato.dataInicio)}</TableCell>
                    <TableCell>{formatDate(contrato.dataFim)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(contrato.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(contrato.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Visualizar",
                            icon: ActionIcons.View,
                            onClick: () => toast.info("Visualizando contrato..."),
                          },
                          {
                            label: "Editar",
                            icon: ActionIcons.Edit,
                            onClick: () => toast.info("Editando contrato..."),
                          },
                          {
                            label: "Gerar Fatura",
                            icon: <FileText className="h-4 w-4" />,
                            onClick: () => toast.info("Gerando fatura..."),
                            separator: true,
                          },
                          {
                            label: "Renovar",
                            icon: <Copy className="h-4 w-4" />,
                            onClick: () => toast.info("Renovando contrato..."),
                          },
                          {
                            label: "Cancelar Contrato",
                            icon: ActionIcons.Delete,
                            onClick: () => {
                              if (confirm("Tem certeza que deseja cancelar este contrato?")) {
                                toast.success("Contrato cancelado!");
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
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum contrato cadastrado ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Contratos permitem faturamento recorrente automático.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
