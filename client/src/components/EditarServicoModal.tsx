import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EditarServicoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  servicoId: number | null;
}

export function EditarServicoModal({ open, onOpenChange, servicoId }: EditarServicoModalProps) {
  const [formData, setFormData] = useState({
    codigo: "",
    nome: "",
    descricao: "",
    valorUnitario: "",
    categoria: "",
    codigoServico: "",
  });

  const utils = trpc.useUtils();

  const { data: servico, isLoading } = trpc.servicos.get.useQuery(
    { id: servicoId! },
    { enabled: open && servicoId !== null }
  );

  useEffect(() => {
    if (servico) {
      setFormData({
        codigo: servico.codigo || "",
        nome: servico.nome || "",
        descricao: servico.descricao || "",
        valorUnitario: servico.valorUnitario || "",
        categoria: servico.categoria || "",
        codigoServico: servico.codigoServico || "",
      });
    }
  }, [servico]);

  const updateMutation = trpc.servicos.update.useMutation({
    onSuccess: () => {
      toast.success("Serviço atualizado com sucesso!");
      utils.servicos.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar serviço");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.codigo || !formData.nome || !formData.valorUnitario) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (!servicoId) return;
    updateMutation.mutate({
      id: servicoId,
      data: {
        codigo: formData.codigo,
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        valorUnitario: formData.valorUnitario,
        categoria: formData.categoria || undefined,
        codigoServico: formData.codigoServico || undefined,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input id="codigo" value={formData.codigo} onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))} required />
              </div>
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" value={formData.descricao} onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))} rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorUnitario">Valor Unitário (R$) *</Label>
                <Input id="valorUnitario" type="number" step="0.01" min="0" value={formData.valorUnitario} onChange={(e) => setFormData(prev => ({ ...prev, valorUnitario: e.target.value }))} required />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria</Label>
                <Input id="categoria" value={formData.categoria} onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={updateMutation.isPending}>{updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}</Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
