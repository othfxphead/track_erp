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
import { Plus, Wrench, Clock, CheckCircle, XCircle } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";

export default function OrdensServico() {
  // Mock data - em produção viria do backend
  const [ordens] = useState([
    {
      id: 1,
      numero: "OS-2025-001",
      cliente: "João Silva Comércio LTDA",
      servico: "Manutenção Preventiva",
      dataAbertura: new Date("2025-01-15"),
      dataPrevista: new Date("2025-01-20"),
      valor: 350.00,
      status: "em_andamento",
      tecnico: "Carlos Souza",
    },
    {
      id: 2,
      numero: "OS-2025-002",
      cliente: "Maria Santos ME",
      servico: "Instalação de Sistema",
      dataAbertura: new Date("2025-01-18"),
      dataPrevista: new Date("2025-01-25"),
      valor: 800.00,
      status: "pendente",
      tecnico: "Ana Paula",
    },
    {
      id: 3,
      numero: "OS-2025-003",
      cliente: "Tech Solutions LTDA",
      servico: "Reparo de Equipamento",
      dataAbertura: new Date("2025-01-10"),
      dataPrevista: new Date("2025-01-15"),
      valor: 450.00,
      status: "concluida",
      tecnico: "Roberto Lima",
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
      em_andamento: { label: "Em Andamento", color: "bg-blue-100 text-blue-800" },
      concluida: { label: "Concluída", color: "bg-success/10 text-success" },
      cancelada: { label: "Cancelada", color: "bg-destructive/10 text-destructive" },
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
          <h1 className="text-3xl font-bold text-foreground">Ordens de Serviço</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie ordens de serviço e atendimentos
          </p>
        </div>
        <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
          <Plus className="h-4 w-4 mr-2" />
          Nova OS
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">1</p>
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
                <p className="text-sm text-muted-foreground">Concluídas</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Wrench className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Mês</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Ordens de Serviço */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Ordens de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          {ordens.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Abertura</TableHead>
                  <TableHead>Previsão</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordens.map((ordem) => (
                  <TableRow key={ordem.id}>
                    <TableCell className="font-medium">
                      {ordem.numero}
                    </TableCell>
                    <TableCell>{ordem.cliente}</TableCell>
                    <TableCell>{ordem.servico}</TableCell>
                    <TableCell>{ordem.tecnico}</TableCell>
                    <TableCell>{formatDate(ordem.dataAbertura)}</TableCell>
                    <TableCell>{formatDate(ordem.dataPrevista)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(ordem.valor)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getStatusBadge(ordem.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Visualizar",
                            icon: ActionIcons.View,
                            onClick: () => toast.info("Visualizando OS..."),
                          },
                          {
                            label: "Editar",
                            icon: ActionIcons.Edit,
                            onClick: () => toast.info("Editando OS..."),
                          },
                          ...(ordem.status === "pendente" ? [{
                            label: "Iniciar Atendimento",
                            icon: <Wrench className="h-4 w-4" />,
                            onClick: () => toast.success("Atendimento iniciado!"),
                            separator: true,
                          }] : []),
                          ...(ordem.status === "em_andamento" ? [{
                            label: "Concluir OS",
                            icon: <CheckCircle className="h-4 w-4" />,
                            onClick: () => toast.success("OS concluída!"),
                            separator: true,
                          }] : []),
                          {
                            label: "Cancelar OS",
                            icon: <XCircle className="h-4 w-4" />,
                            onClick: () => {
                              if (confirm("Tem certeza que deseja cancelar esta OS?")) {
                                toast.success("OS cancelada!");
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
              <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma ordem de serviço cadastrada ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Crie ordens de serviço para gerenciar atendimentos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
