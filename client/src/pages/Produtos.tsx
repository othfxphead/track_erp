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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { Plus, AlertTriangle, Package } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";
import { NovoProdutoModal } from "@/components/NovoProdutoModal";
import { EditarProdutoModal } from "@/components/EditarProdutoModal";

export default function Produtos() {
  const [novoModalOpen, setNovoModalOpen] = useState(false);
  const [editarModalOpen, setEditarModalOpen] = useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = useState<number | null>(null);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: produtos, isLoading } = trpc.produtos.list.useQuery();
  const utils = trpc.useUtils();

  const deleteMutation = trpc.produtos.delete.useMutation({
    onSuccess: () => {
      toast.success("Produto excluído com sucesso!");
      utils.produtos.list.invalidate();
      setDeleteDialogOpen(false);
      setProdutoParaExcluir(null);
    },
    onError: (error) => {
      toast.error(`Erro ao excluir produto: ${error.message}`);
    },
  });

  const handleEdit = (produtoId: number) => {
    setProdutoParaEditar(produtoId);
    setEditarModalOpen(true);
  };

  const handleDelete = (produtoId: number) => {
    setProdutoParaExcluir(produtoId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (produtoParaExcluir) {
      deleteMutation.mutate({ id: produtoParaExcluir });
    }
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
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seu catálogo de produtos
          </p>
        </div>
        <Button onClick={() => setNovoModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
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
                        className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${
                          produto.ativo
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {produto.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Editar",
                            icon: ActionIcons.Edit,
                            onClick: () => handleEdit(produto.id),
                          },
                          {
                            label: "Ajustar Estoque",
                            icon: <Package className="h-4 w-4" />,
                            onClick: () => toast.info("Funcionalidade em desenvolvimento"),
                            separator: true,
                          },
                          {
                            label: "Excluir",
                            icon: ActionIcons.Delete,
                            onClick: () => handleDelete(produto.id),
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
                Nenhum produto cadastrado ainda.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setNovoModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Produto
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <NovoProdutoModal
        open={novoModalOpen}
        onOpenChange={setNovoModalOpen}
      />

      <EditarProdutoModal
        open={editarModalOpen}
        onOpenChange={setEditarModalOpen}
        produtoId={produtoParaEditar}
      />

      {/* Dialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProdutoParaExcluir(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
