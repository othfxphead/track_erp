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
import { Plus, Trash2, ShoppingCart, Package, CheckCircle } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { DatePicker } from "@/components/ui/date-picker";
import { useState } from "react";
import { toast } from "sonner";

interface ItemCompra {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
}

export default function ComprasCompleta() {
  const [open, setOpen] = useState(false);
  const [openFornecedor, setOpenFornecedor] = useState(false);
  const [formData, setFormData] = useState({
    fornecedorId: "",
    dataCompra: new Date(),
    desconto: "0",
    observacoes: "",
  });

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
  });

  const [itens, setItens] = useState<ItemCompra[]>([]);
  const [itemAtual, setItemAtual] = useState({
    produtoId: "",
    quantidade: "1",
    valorUnitario: "",
  });

  const { data: compras, refetch } = trpc.compras.list.useQuery();
  const { data: produtos } = trpc.produtos.list.useQuery();
  const { data: clientes } = trpc.clientes.list.useQuery();

  const createMutation = trpc.compras.create.useMutation({
    onSuccess: () => {
      toast.success("Compra registrada com sucesso! Estoque atualizado.");
      refetch();
      setOpen(false);
      setFormData({
        fornecedorId: "",
        dataCompra: new Date(),
        desconto: "0",
        observacoes: "",
      });
      setItens([]);
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const createFornecedorMutation = trpc.clientes.create.useMutation({
    onSuccess: (data) => {
      toast.success("Fornecedor cadastrado com sucesso!");
      if (data.id) {
        setFormData({ ...formData, fornecedorId: data.id.toString() });
      }
      setOpenFornecedor(false);
      setNovoFornecedor({
        nome: "",
        cnpj: "",
        email: "",
        telefone: "",
        endereco: "",
      });
    },
    onError: (error: any) => {
      toast.error(`Erro ao cadastrar fornecedor: ${error.message}`);
    },
  });

  const handleAddItem = () => {
    if (!itemAtual.produtoId || !itemAtual.quantidade || !itemAtual.valorUnitario) {
      toast.error("Preencha todos os campos do item");
      return;
    }

    const produto = produtos?.find((p) => p.id === parseInt(itemAtual.produtoId));
    if (!produto) {
      toast.error("Produto não encontrado");
      return;
    }

    const novoItem: ItemCompra = {
      produtoId: parseInt(itemAtual.produtoId),
      produtoNome: produto.nome,
      quantidade: parseFloat(itemAtual.quantidade),
      valorUnitario: parseFloat(itemAtual.valorUnitario),
    };

    setItens([...itens, novoItem]);
    setItemAtual({
      produtoId: "",
      quantidade: "1",
      valorUnitario: "",
    });
    toast.success("Item adicionado");
  };

  const handleRemoveItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
    toast.info("Item removido");
  };

  const calcularSubtotal = () => {
    return itens.reduce((acc, item) => acc + item.quantidade * item.valorUnitario, 0);
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const desconto = parseFloat(formData.desconto) || 0;
    return subtotal - desconto;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fornecedorId) {
      toast.error("Selecione um fornecedor");
      return;
    }

    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item");
      return;
    }

    createMutation.mutate({
      numero: `CMP-${Date.now()}`,
      fornecedorId: parseInt(formData.fornecedorId),
      valorTotal: calcularTotal().toString(),
      observacoes: formData.observacoes,
      itens: JSON.stringify(
        itens.map((item) => ({
          id: item.produtoId,
          quantidade: item.quantidade,
          valorUnitario: item.valorUnitario.toString(),
        }))
      ),
    });
  };

  const handleCreateFornecedor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!novoFornecedor.nome || !novoFornecedor.cnpj) {
      toast.error("Preencha nome e CNPJ do fornecedor");
      return;
    }

    createFornecedorMutation.mutate({
      nome: novoFornecedor.nome,
      cpfCnpj: novoFornecedor.cnpj,
      email: novoFornecedor.email,
      telefone: novoFornecedor.telefone,
      endereco: novoFornecedor.endereco,
      tipo: "juridica",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
          <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compras</h1>
            <p className="text-muted-foreground mt-1">
              Gestão de compras e atualização de estoque
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Compra
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Nova Compra</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados da Compra */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Dados da Compra</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fornecedorId">Fornecedor *</Label>
                      <div className="flex gap-2">
                        <Select
                          value={formData.fornecedorId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, fornecedorId: value })
                          }
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecione o fornecedor" />
                          </SelectTrigger>
                          <SelectContent>
                            {clientes
                              ?.filter((c) => c.tipo === "juridica")
                              .map((fornecedor) => (
                                <SelectItem
                                  key={fornecedor.id}
                                  value={fornecedor.id.toString()}
                                >
                                  {fornecedor.nome}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setOpenFornecedor(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="dataCompra">Data da Compra</Label>
                      <DatePicker
                        date={formData.dataCompra}
                        onDateChange={(date) =>
                          setFormData({ ...formData, dataCompra: date || new Date() })
                        }
                        placeholder="Selecione a data da compra"
                      />
                    </div>
                  </div>
                </div>

                {/* Adicionar Produtos */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Produtos</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="produtoId">Produto</Label>
                      <Select
                        value={itemAtual.produtoId}
                        onValueChange={(value) => {
                          const produto = produtos?.find((p) => p.id === parseInt(value));
                          setItemAtual({
                            ...itemAtual,
                            produtoId: value,
                            valorUnitario: produto?.precoCusto || "",
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o produto" />
                        </SelectTrigger>
                        <SelectContent>
                          {produtos?.map((produto) => (
                            <SelectItem key={produto.id} value={produto.id.toString()}>
                              {produto.nome} - Estoque: {produto.estoque}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        step="1"
                        min="1"
                        value={itemAtual.quantidade}
                        onChange={(e) =>
                          setItemAtual({ ...itemAtual, quantidade: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="valorUnitario">Valor Unit.</Label>
                      <Input
                        id="valorUnitario"
                        type="number"
                        step="0.01"
                        value={itemAtual.valorUnitario}
                        onChange={(e) =>
                          setItemAtual({ ...itemAtual, valorUnitario: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>

                {/* Lista de Itens */}
                {itens.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">Itens da Compra</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Produto</TableHead>
                          <TableHead className="text-center">Quantidade</TableHead>
                          <TableHead className="text-right">Valor Unit.</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                          <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itens.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {item.produtoNome}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantidade}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(item.valorUnitario)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
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
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Totais */}
                {itens.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="desconto">Desconto (R$)</Label>
                        <Input
                          id="desconto"
                          type="number"
                          step="0.01"
                          value={formData.desconto}
                          onChange={(e) =>
                            setFormData({ ...formData, desconto: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={formData.observacoes}
                          onChange={(e) =>
                            setFormData({ ...formData, observacoes: e.target.value })
                          }
                          rows={1}
                        />
                      </div>
                    </div>

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span className="font-medium">
                          {formatCurrency(calcularSubtotal())}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Desconto:</span>
                        <span className="font-medium text-destructive">
                          - {formatCurrency(parseFloat(formData.desconto) || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2 border-t">
                        <span>Total:</span>
                        <span className="text-primary">
                          {formatCurrency(calcularTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => setOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || itens.length === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {createMutation.isPending ? "Salvando..." : "Registrar Compra"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dialog Novo Fornecedor */}
          <Dialog open={openFornecedor} onOpenChange={setOpenFornecedor}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Fornecedor</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateFornecedor} className="space-y-4">
                <div>
                  <Label htmlFor="nomeFornecedor">Nome *</Label>
                  <Input
                    id="nomeFornecedor"
                    value={novoFornecedor.nome}
                    onChange={(e) =>
                      setNovoFornecedor({ ...novoFornecedor, nome: e.target.value })
                    }
                    placeholder="Nome do fornecedor"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpjFornecedor">CNPJ *</Label>
                  <Input
                    id="cnpjFornecedor"
                    value={novoFornecedor.cnpj}
                    onChange={(e) =>
                      setNovoFornecedor({ ...novoFornecedor, cnpj: e.target.value })
                    }
                    placeholder="00.000.000/0000-00"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emailFornecedor">E-mail</Label>
                    <Input
                      id="emailFornecedor"
                      type="email"
                      value={novoFornecedor.email}
                      onChange={(e) =>
                        setNovoFornecedor({ ...novoFornecedor, email: e.target.value })
                      }
                      placeholder="email@fornecedor.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefoneFornecedor">Telefone</Label>
                    <Input
                      id="telefoneFornecedor"
                      value={novoFornecedor.telefone}
                      onChange={(e) =>
                        setNovoFornecedor({
                          ...novoFornecedor,
                          telefone: e.target.value,
                        })
                      }
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="enderecoFornecedor">Endereço</Label>
                  <Textarea
                    id="enderecoFornecedor"
                    value={novoFornecedor.endereco}
                    onChange={(e) =>
                      setNovoFornecedor({ ...novoFornecedor, endereco: e.target.value })
                    }
                    rows={2}
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                    onClick={() => setOpenFornecedor(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createFornecedorMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {createFornecedorMutation.isPending ? "Salvando..." : "Salvar Fornecedor"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Compras */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Histórico de Compras
            </CardTitle>
          </CardHeader>
          <CardContent>
            {compras && compras.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compras.map((compra: any) => (
                    <TableRow key={compra.id}>
                      <TableCell className="font-medium">{compra.numero}</TableCell>
                      <TableCell>
                        {clientes?.find((c) => c.id === compra.fornecedorId)?.nome ||
                          "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(compra.createdAt)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(parseFloat(compra.valorTotal))}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium bg-success/10 text-success">
                          Concluída
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <ActionButton
                          actions={[
                            {
                              label: "Visualizar",
                              icon: ActionIcons.View,
                              onClick: () => toast.info("Visualizando compra..."),
                            },
                            {
                              label: "Editar",
                              icon: ActionIcons.Edit,
                              onClick: () => toast.info("Editando compra..."),
                            },
                            {
                              label: "Receber",
                              icon: <CheckCircle className="h-4 w-4" />,
                              onClick: () => toast.success("Compra recebida!"),
                              separator: true,
                            },
                            {
                              label: "Excluir",
                              icon: ActionIcons.Delete,
                              onClick: () => {
                                if (confirm("Tem certeza que deseja excluir esta compra?")) {
                                  toast.success("Compra excluída!");
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
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhuma compra registrada ainda.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeira Compra
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
