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
import { Plus, FileText, Trash2, ShoppingCart } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { toast } from "sonner";

export default function VendasCompleta() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clienteId: "",
    dataVenda: new Date(),
    observacoes: "",
    itens: [] as Array<{ 
      tipo: "produto" | "servico";
      itemId: number; 
      quantidade: number; 
      valorUnitario: number;
      nome: string;
    }>,
  });

  const [itemTemp, setItemTemp] = useState({
    tipo: "produto" as "produto" | "servico",
    itemId: "",
    quantidade: "1",
    valorUnitario: "0",
  });

  const { data: vendas, isLoading, refetch } = trpc.vendas.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: produtos } = trpc.produtos.list.useQuery();
  const { data: servicos } = trpc.servicos.list.useQuery();

  const createMutation = trpc.vendas.create.useMutation({
    onSuccess: () => {
      toast.success("Venda criada com sucesso!");
      refetch();
      setOpen(false);
      setFormData({
        clienteId: "",
        dataVenda: new Date(),
        observacoes: "",
        itens: [],
      });
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar venda: ${error.message}`);
    },
  });

  const handleAddItem = () => {
    if (!itemTemp.itemId || !itemTemp.quantidade) {
      toast.error("Selecione um item e quantidade");
      return;
    }

    let item;
    let nome = "";
    let valorUnitario = parseFloat(itemTemp.valorUnitario);

    if (itemTemp.tipo === "produto") {
      const produto = produtos?.find(p => p.id === parseInt(itemTemp.itemId));
      if (!produto) return;
      nome = produto.nome;
      if (valorUnitario === 0) valorUnitario = parseFloat(produto.precoVenda);
    } else {
      const servico = servicos?.find(s => s.id === parseInt(itemTemp.itemId));
      if (!servico) return;
      nome = servico.nome;
      if (valorUnitario === 0) valorUnitario = parseFloat(servico.valorUnitario);
    }

    const novoItem = {
      tipo: itemTemp.tipo,
      itemId: parseInt(itemTemp.itemId),
      quantidade: parseFloat(itemTemp.quantidade),
      valorUnitario,
      nome,
    };

    setFormData({
      ...formData,
      itens: [...formData.itens, novoItem],
    });

    setItemTemp({
      tipo: "produto",
      itemId: "",
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
      toast.error("Adicione pelo menos um item à venda");
      return;
    }

    const valorTotal = formData.itens.reduce(
      (acc, item) => acc + item.quantidade * item.valorUnitario,
      0
    );

    createMutation.mutate({
      numero: `VEN-${Date.now()}`,
      clienteId: parseInt(formData.clienteId),
      valorTotal: valorTotal.toString(),
      desconto: "0",
      observacoes: formData.observacoes,
      itens: JSON.stringify(formData.itens),
    });
  };

  const formatCurrency = (value: string | number) => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num)
      ? "R$ 0,00"
      : new Intl.NumberFormat("pt-BR", {
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

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const valorTotalItens = formData.itens.reduce(
    (acc, item) => acc + item.quantidade * item.valorUnitario,
    0
  );

  return (
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie suas vendas e pedidos
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white" style={{height: '22px', paddingLeft: '5px', paddingRight: '5px'}}>
                <Plus className="h-3 w-3 mr-1" />
                Nova Venda
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Venda</DialogTitle>
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
                    <Label htmlFor="dataVenda">Data da Venda</Label>
                    <DatePicker
                      date={formData.dataVenda}
                      onDateChange={(date) =>
                        setFormData({ ...formData, dataVenda: date || new Date() })
                      }
                      placeholder="Selecione a data da venda"
                    />
                  </div>
                </div>

                {/* Adicionar Itens */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Itens da Venda</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-2">
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select
                          value={itemTemp.tipo}
                          onValueChange={(value: "produto" | "servico") => {
                            setItemTemp({
                              ...itemTemp,
                              tipo: value,
                              itemId: "",
                              valorUnitario: "0",
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="produto">Produto</SelectItem>
                            <SelectItem value="servico">Serviço</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor="itemId">
                          {itemTemp.tipo === "produto" ? "Produto" : "Serviço"}
                        </Label>
                        <Select
                          value={itemTemp.itemId}
                          onValueChange={(value) => {
                            let valorUnit = "0";
                            if (itemTemp.tipo === "produto") {
                              const prod = produtos?.find(p => p.id === parseInt(value));
                              valorUnit = prod?.precoVenda || "0";
                            } else {
                              const serv = servicos?.find(s => s.id === parseInt(value));
                              valorUnit = serv?.valorUnitario || "0";
                            }
                            setItemTemp({
                              ...itemTemp,
                              itemId: value,
                              valorUnitario: valorUnit,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {itemTemp.tipo === "produto"
                              ? produtos?.map((produto) => (
                                  <SelectItem
                                    key={produto.id}
                                    value={produto.id.toString()}
                                  >
                                    {produto.nome}
                                  </SelectItem>
                                ))
                              : servicos?.map((servico) => (
                                  <SelectItem
                                    key={servico.id}
                                    value={servico.id.toString()}
                                  >
                                    {servico.nome}
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
                      <div className="col-span-1 flex items-end">
                        <Button
                          type="button"
                          onClick={handleAddItem}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {formData.itens.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-right">Qtd</TableHead>
                            <TableHead className="text-right">Valor Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {formData.itens.map((item, index) => (
                            <TableRow key={index}>
                              <TableCell className="capitalize">{item.tipo}</TableCell>
                              <TableCell>{item.nome}</TableCell>
                              <TableCell className="text-right">
                                {item.quantidade}
                              </TableCell>
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
                          ))}
                          <TableRow>
                            <TableCell colSpan={4} className="text-right font-bold">
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
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} className="bg-green-600 hover:bg-green-700 text-white">
                    {createMutation.isPending ? "Salvando..." : "Salvar Venda"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
                    const cliente = clientes?.find((c) => c.id === venda.clienteId);
                    return (
                      <TableRow key={venda.id}>
                        <TableCell className="font-medium">#{venda.numero}</TableCell>
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
                            onClick={() =>
                              toast.info("Emissão de NF em desenvolvimento")
                            }
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
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma venda registrada ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Crie vendas manualmente ou aprove orçamentos para gerar vendas automaticamente.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Venda
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
