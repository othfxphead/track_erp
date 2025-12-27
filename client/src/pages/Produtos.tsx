import ERPLayout from "@/components/ERPLayout";
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
import { Plus, Edit, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Produtos() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    unidade: "UN",
    precoCusto: "",
    precoVenda: "",
    estoqueMinimo: "0",
    ncm: "",
    categoria: "",
  });

  const { data: produtos, isLoading, refetch } = trpc.produtos.list.useQuery();
  const createMutation = trpc.produtos.create.useMutation({
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      refetch();
      setOpen(false);
      setFormData({
        codigo: "",
        nome: "",
        descricao: "",
        unidade: "UN",
        precoCusto: "",
        precoVenda: "",
        estoqueMinimo: "0",
        ncm: "",
        categoria: "",
      });
    },
    onError: (error) => {
      toast.error(`Erro ao criar produto: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calcular margem de lucro
    const custo = parseFloat(formData.precoCusto) || 0;
    const venda = parseFloat(formData.precoVenda) || 0;
    const margem = custo > 0 ? ((venda - custo) / custo * 100).toFixed(2) : "0";
    
    createMutation.mutate({
      ...formData,
      estoqueMinimo: parseInt(formData.estoqueMinimo) || 0,
      margemLucro: margem,
    });
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? "R$ 0,00" : new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  return (
    <ERPLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie seu catálogo de produtos
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Produto</DialogTitle>
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

                <div>
                  <Label htmlFor="nome">Nome do Produto *</Label>
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

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="unidade">Unidade</Label>
                    <Input
                      id="unidade"
                      value={formData.unidade}
                      onChange={(e) =>
                        setFormData({ ...formData, unidade: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="precoCusto">Preço de Custo *</Label>
                    <Input
                      id="precoCusto"
                      type="number"
                      step="0.01"
                      value={formData.precoCusto}
                      onChange={(e) =>
                        setFormData({ ...formData, precoCusto: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="precoVenda">Preço de Venda *</Label>
                    <Input
                      id="precoVenda"
                      type="number"
                      step="0.01"
                      value={formData.precoVenda}
                      onChange={(e) =>
                        setFormData({ ...formData, precoVenda: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                    <Input
                      id="estoqueMinimo"
                      type="number"
                      value={formData.estoqueMinimo}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estoqueMinimo: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="ncm">NCM</Label>
                    <Input
                      id="ncm"
                      value={formData.ncm}
                      onChange={(e) =>
                        setFormData({ ...formData, ncm: e.target.value })
                      }
                    />
                  </div>
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
                    {createMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Produtos */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : produtos && produtos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Preço Custo</TableHead>
                    <TableHead className="text-right">Preço Venda</TableHead>
                    <TableHead className="text-right">Estoque</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">
                        {produto.codigo}
                      </TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.categoria || "-"}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(produto.precoCusto)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(produto.precoVenda)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {produto.estoque}
                          {produto.estoque <= produto.estoqueMinimo && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            produto.ativo
                              ? "bg-success/10 text-success"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Nenhum produto cadastrado ainda.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Produto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ERPLayout>
  );
}
