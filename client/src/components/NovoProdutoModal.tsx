import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface NovoProdutoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProdutoCriado?: (produtoId: number) => void;
}

export function NovoProdutoModal({ open, onOpenChange, onProdutoCriado }: NovoProdutoModalProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    unidade: "UN",
    precoVenda: "",
    precoCusto: "",
    estoque: "0",
    estoqueMinimo: "0",
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.produtos.create.useMutation({
    onSuccess: (data) => {
      toast.success("Produto criado com sucesso!");
      utils.produtos.list.invalidate();
      if (data.id) onProdutoCriado?.(data.id);
      onOpenChange(false);
      // Reset form
      setFormData({
        codigo: "",
        nome: "",
        unidade: "UN",
        precoVenda: "",
        precoCusto: "",
        estoque: "0",
        estoqueMinimo: "0",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar produto");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nome || !formData.precoVenda) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      codigo: formData.codigo,
      nome: formData.nome,
      unidade: formData.unidade,
      precoVenda: formData.precoVenda,
      precoCusto: formData.precoCusto || "0",
      estoque: parseInt(formData.estoque) || 0,
      estoqueMinimo: parseInt(formData.estoqueMinimo) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Produto</DialogTitle>
        </DialogHeader>

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
          </div>

          {/* Linha 4: Estoque e Estoque Mínimo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estoque">
                Estoque Inicial
              </Label>
              <Input
                id="estoque"
                type="number"
                min="0"
                value={formData.estoque}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque: e.target.value }))}
                placeholder="0"
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
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Salvando..." : "Salvar Produto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
