import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EditarProdutoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produtoId: number | null;
}

export function EditarProdutoModal({ open, onOpenChange, produtoId }: EditarProdutoModalProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    unidade: "UN",
    precoVenda: "",
    precoCusto: "",
    estoqueMinimo: "0",
  });

  const utils = trpc.useUtils();

  // Buscar dados do produto quando o modal abrir
  const { data: produto, isLoading } = trpc.produtos.get.useQuery(
    { id: produtoId! },
    { enabled: open && produtoId !== null }
  );

  // Preencher formulário com dados do produto
  useEffect(() => {
    if (produto) {
      setFormData({
        codigo: produto.codigo || "",
        nome: produto.nome || "",
        unidade: produto.unidade || "UN",
        precoVenda: produto.precoVenda || "",
        precoCusto: produto.precoCusto || "",
        estoqueMinimo: produto.estoqueMinimo?.toString() || "0",
      });
    }
  }, [produto]);

  const updateMutation = trpc.produtos.update.useMutation({
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      utils.produtos.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar produto");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nome || !formData.precoVenda) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!produtoId) return;

    updateMutation.mutate({
      id: produtoId,
      data: {
        codigo: formData.codigo,
        nome: formData.nome,
        unidade: formData.unidade,
        precoVenda: formData.precoVenda,
        precoCusto: formData.precoCusto || "0",
        estoqueMinimo: parseInt(formData.estoqueMinimo) || 0,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Linha 1: Código e Nome */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">
                  Código *
                </Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Digite o código do produto"
                  required
                />
              </div>
              <div>
                <Label htmlFor="nome">
                  Nome *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome do produto"
                  required
                />
              </div>
            </div>

            {/* Linha 2: Unidade e Preço de Venda */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unidade">
                  Unidade *
                </Label>
                <Select
                  value={formData.unidade}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, unidade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UN">Unidade (UN)</SelectItem>
                    <SelectItem value="KG">Quilograma (KG)</SelectItem>
                    <SelectItem value="L">Litro (L)</SelectItem>
                    <SelectItem value="M">Metro (M)</SelectItem>
                    <SelectItem value="M2">Metro Quadrado (M²)</SelectItem>
                    <SelectItem value="M3">Metro Cúbico (M³)</SelectItem>
                    <SelectItem value="CX">Caixa (CX)</SelectItem>
                    <SelectItem value="PC">Peça (PC)</SelectItem>
                    <SelectItem value="PAR">Par (PAR)</SelectItem>
                    <SelectItem value="DUZIA">Dúzia (DZ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="precoVenda">
                  Preço de Venda (R$) *
                </Label>
                <Input
                  id="precoVenda"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoVenda}
                  onChange={(e) => setFormData(prev => ({ ...prev, precoVenda: e.target.value }))}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            {/* Linha 3: Preço de Custo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="precoCusto">
                  Preço de Custo (R$)
                </Label>
                <Input
                  id="precoCusto"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.precoCusto}
                  onChange={(e) => setFormData(prev => ({ ...prev, precoCusto: e.target.value }))}
                  placeholder="0,00"
                />
              </div>
              <div>
                <Label htmlFor="estoqueMinimo">
                  Estoque Mínimo
                </Label>
                <Input
                  id="estoqueMinimo"
                  type="number"
                  min="0"
                  value={formData.estoqueMinimo}
                  onChange={(e) => setFormData(prev => ({ ...prev, estoqueMinimo: e.target.value }))}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
