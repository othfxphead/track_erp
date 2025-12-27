import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface NovoServicoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServicoCriado?: (servicoId: number) => void;
}

export function NovoServicoModal({ open, onOpenChange, onServicoCriado }: NovoServicoModalProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    valorUnitario: "",
    categoria: "",
  });

  const utils = trpc.useUtils();

  const createMutation = trpc.servicos.create.useMutation({
    onSuccess: (data) => {
      toast.success("Serviço criado com sucesso!");
      utils.servicos.list.invalidate();
      if (data.id) onServicoCriado?.(data.id);
      onOpenChange(false);
      // Reset form
      setFormData({
        codigo: "",
        nome: "",
        descricao: "",
        valorUnitario: "",
        categoria: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar serviço");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.codigo || !formData.nome || !formData.valorUnitario) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    createMutation.mutate({
      codigo: formData.codigo,
      nome: formData.nome,
      descricao: formData.descricao || "",
      valorUnitario: formData.valorUnitario,
      categoria: formData.categoria || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Serviço</DialogTitle>
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
                placeholder="Digite o código do serviço"
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
                placeholder="Digite o nome do serviço"
                required
              />
            </div>
          </div>

          {/* Linha 2: Descrição */}
          <div>
            <Label htmlFor="descricao">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Descreva o serviço prestado"
              rows={3}
            />
          </div>

          {/* Linha 3: Valor Unitário e Categoria */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valorUnitario">
                Valor Unitário (R$) *
              </Label>
              <Input
                id="valorUnitario"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorUnitario}
                onChange={(e) => setFormData(prev => ({ ...prev, valorUnitario: e.target.value }))}
                placeholder="0,00"
                required
              />
            </div>
            <div>
              <Label htmlFor="categoria">
                Categoria
              </Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                placeholder="Ex: Consultoria, Manutenção, Instalação"
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
              {createMutation.isPending ? "Salvando..." : "Salvar Serviço"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
