import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";
import { Plus, Edit } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";

export default function Servicos() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    valorUnitario: "",
    categoria: "",
    codigoServico: "",
  });

  const { data: servicos, isLoading, refetch } = trpc.servicos.list.useQuery();
  const createMutation = trpc.servicos.create.useMutation({
    onSuccess: () => {
      toast.success("Serviço criado com sucesso!");
      refetch();
      setOpen(false);
      setFormData({
        codigo: "",
        nome: "",
        descricao: "",
        valorUnitario: "",
        categoria: "",
        codigoServico: "",
      });
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar serviço: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? "R$ 0,00" : new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  return (
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Serviços</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu catálogo de serviços
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Serviço</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codigo">Código *</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) =>
                        setFormData({ ...formData, codigo: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="codigoServico">Código de Serviço</Label>
                    <Input
                      id="codigoServico"
                      value={formData.codigoServico}
                      onChange={(e) =>
                        setFormData({ ...formData, codigoServico: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="nome">Nome do Serviço *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valorUnitario">Valor Unitário *</Label>
                    <Input
                      id="valorUnitario"
                      type="number"
                      step="0.01"
                      value={formData.valorUnitario}
                      onChange={(e) =>
                        setFormData({ ...formData, valorUnitario: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      value={formData.categoria}
                      onChange={(e) =>
                        setFormData({ ...formData, categoria: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                    {createMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Serviços */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : servicos && servicos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cód. Serviço</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicos.map((servico) => (
                    <TableRow key={servico.id}>
                      <TableCell className="font-medium">
                        {servico.codigo}
                      </TableCell>
                      <TableCell>{servico.nome}</TableCell>
                      <TableCell>{servico.codigoServico || "-"}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(servico.valorUnitario)}
                      </TableCell>
                      <TableCell>{servico.categoria || "-"}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${
                            servico.ativo
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {servico.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButton
                          actions={[
                            {
                              label: "Visualizar",
                              icon: ActionIcons.View,
                              onClick: () => toast.info("Visualizando serviço..."),
                            },
                            {
                              label: "Editar",
                              icon: ActionIcons.Edit,
                              onClick: () => toast.info("Editando serviço..."),
                            },
                            {
                              label: "Excluir",
                              icon: ActionIcons.Delete,
                              onClick: () => {
                                if (confirm("Tem certeza que deseja excluir este serviço?")) {
                                  toast.success("Serviço excluído!");
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
                <p className="text-muted-foreground">
                  Nenhum serviço cadastrado ainda.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Serviço
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
