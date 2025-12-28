import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface EditarClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId: number | null;
}

export function EditarClienteModal({ open, onOpenChange, clienteId }: EditarClienteModalProps) {
  const [formData, setFormData] = useState({
    tipo: "fisica" as "fisica" | "juridica",
    nome: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    celular: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  });

  const utils = trpc.useUtils();

  // Buscar dados do cliente quando o modal abrir
  const { data: cliente, isLoading } = trpc.clientes.get.useQuery(
    { id: clienteId! },
    { enabled: open && clienteId !== null }
  );

  // Preencher formulário com dados do cliente
  useEffect(() => {
    if (cliente) {
      setFormData({
        tipo: cliente.tipo || "fisica",
        nome: cliente.nome || "",
        cpfCnpj: cliente.cpfCnpj || "",
        email: cliente.email || "",
        telefone: cliente.telefone || "",
        celular: cliente.celular || "",
        endereco: cliente.endereco || "",
        cidade: cliente.cidade || "",
        estado: cliente.estado || "",
        cep: cliente.cep || "",
        observacoes: cliente.observacoes || "",
      });
    }
  }, [cliente]);

  const updateMutation = trpc.clientes.update.useMutation({
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso!");
      utils.clientes.list.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar cliente");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cpfCnpj) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (!clienteId) return;

    updateMutation.mutate({
      id: clienteId,
      data: {
        tipo: formData.tipo,
        nome: formData.nome,
        cpfCnpj: formData.cpfCnpj,
        email: formData.email || undefined,
        telefone: formData.telefone || undefined,
        celular: formData.celular || undefined,
        endereco: formData.endereco || undefined,
        cidade: formData.cidade || undefined,
        estado: formData.estado || undefined,
        cep: formData.cep || undefined,
        observacoes: formData.observacoes || undefined,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p>Carregando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo */}
            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: "fisica" | "juridica") => setFormData(prev => ({ ...prev, tipo: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fisica">Pessoa Física</SelectItem>
                  <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nome e CPF/CNPJ */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">
                  {formData.tipo === "fisica" ? "Nome Completo" : "Razão Social"} *
                </Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cpfCnpj">
                  {formData.tipo === "fisica" ? "CPF" : "CNPJ"} *
                </Label>
                <Input
                  id="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={(e) => setFormData(prev => ({ ...prev, cpfCnpj: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Email e Telefone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
              />
            </div>

            {/* Cidade, Estado e CEP */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={formData.cidade}
                  onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  maxLength={2}
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  value={formData.cep}
                  onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
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
