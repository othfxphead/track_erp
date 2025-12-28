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
import { Plus, Phone, Mail, History } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";

export default function Fornecedores() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: "juridica" as "fisica" | "juridica",
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

  // Mock data - em produção viria do backend
  const fornecedores = [
    {
      id: 1,
      tipo: "juridica",
      nome: "Tech Distribuidora LTDA",
      cpfCnpj: "12.345.678/0001-90",
      email: "contato@techdist.com.br",
      telefone: "(11) 3456-7890",
      celular: "(11) 98765-4321",
      cidade: "São Paulo",
      estado: "SP",
      ativo: true,
    },
    {
      id: 2,
      tipo: "juridica",
      nome: "Eletrônicos Brasil S.A.",
      cpfCnpj: "98.765.432/0001-10",
      email: "vendas@eletronicosb.com",
      telefone: "(21) 2345-6789",
      celular: "(21) 99876-5432",
      cidade: "Rio de Janeiro",
      estado: "RJ",
      ativo: true,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Fornecedor criado com sucesso!");
    setOpen(false);
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fornecedores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus fornecedores
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Fornecedor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: "fisica" | "juridica") =>
                    setFormData({ ...formData, tipo: value })
                  }
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">
                    {formData.tipo === "fisica" ? "Nome Completo" : "Razão Social"} *
                  </Label>
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
                  <Label htmlFor="cpfCnpj">
                    {formData.tipo === "fisica" ? "CPF" : "CNPJ"} *
                  </Label>
                  <Input
                    id="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={(e) =>
                      setFormData({ ...formData, cpfCnpj: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) =>
                    setFormData({ ...formData, celular: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) =>
                    setFormData({ ...formData, endereco: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) =>
                      setFormData({ ...formData, cidade: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="estado">Estado</Label>
                  <Input
                    id="estado"
                    value={formData.estado}
                    onChange={(e) =>
                      setFormData({ ...formData, estado: e.target.value })
                    }
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({ ...formData, cep: e.target.value })
                    }
                  />
                </div>
              </div>

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
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de Fornecedores */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          {fornecedores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Cidade/UF</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div>{fornecedor.nome}</div>
                        <div className="text-xs text-muted-foreground">
                          {fornecedor.tipo === "fisica"
                            ? "Pessoa Física"
                            : "Pessoa Jurídica"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCpfCnpj(fornecedor.cpfCnpj)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {fornecedor.email && (
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {fornecedor.email}
                          </div>
                        )}
                        {fornecedor.celular && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {fornecedor.celular}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {fornecedor.cidade && fornecedor.estado
                        ? `${fornecedor.cidade}/${fornecedor.estado}`
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${
                          fornecedor.ativo
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {fornecedor.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Visualizar",
                            icon: ActionIcons.View,
                            onClick: () => toast.info("Visualizando fornecedor..."),
                          },
                          {
                            label: "Editar",
                            icon: ActionIcons.Edit,
                            onClick: () => toast.info("Editando fornecedor..."),
                          },
                          {
                            label: "Ver Histórico de Compras",
                            icon: <History className="h-4 w-4" />,
                            onClick: () => toast.info("Carregando histórico..."),
                            separator: true,
                          },
                          {
                            label: "Excluir",
                            icon: ActionIcons.Delete,
                            onClick: () => {
                              if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
                                toast.success("Fornecedor excluído!");
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
              <p className="text-muted-foreground">
                Nenhum fornecedor cadastrado ainda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
