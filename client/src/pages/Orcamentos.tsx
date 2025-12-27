import ERPLayout from "@/components/ERPLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Plus, Edit, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Orcamentos() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: "",
    dataValidade: "",
    observacoes: "",
    itens: [] as Array<{ produtoId: number; quantidade: number; valorUnitario: number }>,
  });

  const [itemTemp, setItemTemp] = useState({
    produtoId: "",
    quantidade: "1",
    valorUnitario: "0",
  });

  const { data: orcamentos, isLoading, refetch } = trpc.orcamentos.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: produtos } = trpc.produtos.list.useQuery();
  
  const createMutation = trpc.orcamentos.create.useMutation({
    onSuccess: () => {
      toast.success("Orçamento criado com sucesso!");
      refetch();
      setOpen(false);
      setFormData({
        clienteId: "",
        dataValidade: "",
        observacoes: "",
        itens: [],
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar orçamento: ${error.message}`);
    },
  });

  const aprovarMutation = trpc.orcamentos.aprovar.useMutation({
    onSuccess: () => {
      toast.success("Orçamento aprovado e convertido em venda!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao aprovar orçamento: ${error.message}`);
    },
  });

  const rejeitarMutation = trpc.orcamentos.rejeitar.useMutation({
    onSuccess: () => {
      toast.success("Orçamento rejeitado!");
      refetch();
    },
  });

  const handleAddItem = () => {
    if (!itemTemp.produtoId || !itemTemp.quantidade) {
      toast.error("Selecione um produto e quantidade");
      return;
    }

    const produto = produtos?.find(p => p.id === parseInt(itemTemp.produtoId));
    if (!produto) return;

    const novoItem = {
      produtoId: parseInt(itemTemp.produtoId),
      quantidade: parseFloat(itemTemp.quantidade),
      valorUnitario: parseFloat(itemTemp.valorUnitario) || parseFloat(produto.precoVenda),
    };

    setFormData({
      ...formData,
      itens: [...formData.itens, novoItem],
    });

    setItemTemp({
      produtoId: "",
      quantidade: "1",
      valorUnitario: "0",
    });
  };

  const handleRemoveItem = (index: number) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.clienteId) {
      toast.error("Selecione um cliente");
      return;
    }

    if (formData.itens.length === 0) {
      toast.error("Adicione pelo menos um item ao orçamento");
      return;
    }

    const valorTotal = formData.itens.reduce(
      (acc, item) => acc + item.quantidade * item.valorUnitario,
      0
    );

    createMutation.mutate({
      clienteId: parseInt(formData.clienteId),
      dataValidade: formData.dataValidade ? new Date(formData.dataValidade) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      valorTotal: valorTotal.toString(),
      observacoes: formData.observacoes,
      itens: formData.itens,
    });
  };

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
      aprovado: { label: "Aprovado", color: "bg-success/10 text-success" },
      rejeitado: { label: "Rejeitado", color: "bg-destructive/10 text-destructive" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const valorTotalItens = formData.itens.reduce(
    (acc, item) => acc + item.quantidade * item.valorUnitario,
    0
  );

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Orçamentos</h1>
            <p className="text-muted-foreground mt-1">
              Crie orçamentos e converta em vendas
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Orçamento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Orçamento</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="clienteId">Cliente *</Label>
                    <Select
                      value={formData.clienteId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, clienteId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes?.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataValidade">Data de Validade</Label>
                    <Input
                      id="dataValidade"
                      type="date"
                      value={formData.dataValidade}
                      onChange={(e) =>
                        setFormData({ ...formData, dataValidade: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Adicionar Itens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Itens do Orçamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-5">
                        <Label htmlFor="produtoId">Produto</Label>
                        <Select
                          value={itemTemp.produtoId}
                          onValueChange={(value) => {
                            const produto = produtos?.find(p => p.id === parseInt(value));
                            setItemTemp({
                              ...itemTemp,
                              produtoId: value,
                              valorUnitario: produto?.precoVenda || "0",
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {produtos?.map((produto) => (
                              <SelectItem key={produto.id} value={produto.id.toString()}>
                                {produto.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="quantidade">Qtd</Label>
                        <Input
                          id="quantidade"
                          type="number"
                          step="0.01"
                          value={itemTemp.quantidade}
                          onChange={(e) =>
                            setItemTemp({ ...itemTemp, quantidade: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="valorUnitario">Valor Unit.</Label>
                        <Input
                          id="valorUnitario"
                          type="number"
                          step="0.01"
                          value={itemTemp.valorUnitario}
                          onChange={(e) =>
                            setItemTemp({ ...itemTemp, valorUnitario: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-span-2 flex items-end">
                        <Button type="button" onClick={handleAddItem} className="w-full">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {formData.itens.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Qtd</TableHead>
                            <TableHead className="text-right">Valor Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.itens.map((item, index) => {
                            const produto = produtos?.find(p => p.id === item.produtoId);
                            return (
                              <TableRow key={index}>
                                <TableCell>{produto?.nome}</TableCell>
                                <TableCell className="text-right">{item.quantidade}</TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.valorUnitario)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(item.quantidade * item.valorUnitario)}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(index)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell colSpan={3} className="text-right font-bold">
                              Total:
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(valorTotalItens)}
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({ ...formData, observacoes: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? "Salvando..." : "Salvar Orçamento"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Orçamentos */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : orcamentos && orcamentos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentos.map((orcamento) => {
                    const cliente = clientes?.find(c => c.id === orcamento.clienteId);
                    return (
                      <TableRow key={orcamento.id}>
                        <TableCell className="font-medium">
                          #{orcamento.numero}
                        </TableCell>
                        <TableCell>{cliente?.nome || "-"}</TableCell>
                        <TableCell>{formatDate(orcamento.dataEmissao)}</TableCell>
                        <TableCell>{formatDate(orcamento.dataValidade)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(orcamento.valorTotal)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(orcamento.status)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            {orcamento.status === "pendente" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => aprovarMutation.mutate({ id: orcamento.id })}
                                  title="Aprovar e converter em venda"
                                >
                                  <CheckCircle className="h-4 w-4 text-success" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => rejeitarMutation.mutate({ id: orcamento.id })}
                                  title="Rejeitar"
                                >
                                  <XCircle className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                            {orcamento.status !== "pendente" && (
                              <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum orçamento cadastrado ainda.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Orçamento
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}
