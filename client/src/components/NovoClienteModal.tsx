import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface NovoClienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClienteCriado?: (clienteId: number) => void;
}

export function NovoClienteModal({ open, onOpenChange, onClienteCriado }: NovoClienteModalProps) {
  const [formData, setFormData] = useState({
    nome: "",
    cpfCnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const utils = trpc.useUtils();
  const criarCliente = trpc.clientes.create.useMutation({
    onSuccess: (data: any) => {
      toast.success("Cliente cadastrado com sucesso!");
      utils.clientes.list.invalidate();
      onClienteCriado?.(data.id);
      onOpenChange(false);
      // Limpar formulário
      setFormData({
        nome: "",
        cpfCnpj: "",
        email: "",
        telefone: "",
        endereco: "",
        cidade: "",
        estado: "",
        cep: "",
      });
    },
    onError: (error: any) => {
      toast.error(`Erro ao cadastrar cliente: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast.error("Nome/Razão Social é obrigatório");
      return;
    }

    if (!formData.cpfCnpj.trim()) {
      toast.error("CPF/CNPJ é obrigatório");
      return;
    }

    criarCliente.mutate({
      tipo: formData.cpfCnpj.replace(/\D/g, "").length <= 11 ? "fisica" : "juridica",
      nome: formData.nome,
      cpfCnpj: formData.cpfCnpj,
      email: formData.email || undefined,
      telefone: formData.telefone || undefined,
      endereco: formData.endereco || undefined,
      cidade: formData.cidade || undefined,
      estado: formData.estado || undefined,
      cep: formData.cep || undefined,
    });
  };

  const aplicarMascaraCpfCnpj = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 11) {
      // CPF: 000.000.000-00
      return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      // CNPJ: 00.000.000/0000-00
      return numeros
        .replace(/(\d{2})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1/$2")
        .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  };

  const aplicarMascaraTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    if (numeros.length <= 10) {
      // Fixo: (00) 0000-0000
      return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    } else {
      // Celular: (00) 00000-0000
      return numeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
    }
  };

  const aplicarMascaraCep = (valor: string) => {
    const numeros = valor.replace(/\D/g, "");
    return numeros.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="nome">
                Nome / Razão Social <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Digite o nome ou razão social"
                required
              />
            </div>

            <div>
              <Label htmlFor="cpfCnpj">
                CPF / CNPJ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cpfCnpj"
                value={formData.cpfCnpj}
                onChange={(e) => {
                  const valorMascarado = aplicarMascaraCpfCnpj(e.target.value);
                  setFormData({ ...formData, cpfCnpj: valorMascarado });
                }}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                maxLength={18}
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => {
                  const valorMascarado = aplicarMascaraTelefone(e.target.value);
                  setFormData({ ...formData, telefone: valorMascarado });
                }}
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Rua, Avenida, etc."
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                placeholder="Nome da cidade"
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                placeholder="UF"
                maxLength={2}
              />
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => {
                  const valorMascarado = aplicarMascaraCep(e.target.value);
                  setFormData({ ...formData, cep: valorMascarado });
                }}
                placeholder="00000-000"
                maxLength={9}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={criarCliente.isPending} className="bg-green-600 hover:bg-green-700 text-white">
              {criarCliente.isPending ? "Salvando..." : "Salvar Cliente"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
