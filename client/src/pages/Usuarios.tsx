import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Shield, User } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { useState } from "react";
import { toast } from "sonner";

export default function Usuarios() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    role: "user" as "admin" | "user",
    ativo: true,
  });

  // Mock data - em produção viria do backend
  const usuarios = [
    {
      id: 1,
      nome: "Thiago Figueredo",
      email: "thiago@example.com",
      role: "admin",
      ativo: true,
      ultimoAcesso: new Date("2025-01-27"),
    },
    {
      id: 2,
      nome: "Maria Silva",
      email: "maria@example.com",
      role: "user",
      ativo: true,
      ultimoAcesso: new Date("2025-01-26"),
    },
    {
      id: 3,
      nome: "João Santos",
      email: "joao@example.com",
      role: "user",
      ativo: false,
      ultimoAcesso: new Date("2025-01-20"),
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Usuário criado com sucesso!");
    setOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Usuários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários e permissões
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo *</Label>
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
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="senha">Senha *</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Perfil *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "admin" | "user") =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="user">Usuário</SelectItem>
                  </SelectContent>
                </Select>
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{usuarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.ativo).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold">
                  {usuarios.filter(u => u.role === "admin").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Usuários */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {usuario.role === "admin" ? (
                          <Shield className="h-4 w-4 text-purple-600" />
                        ) : (
                          <User className="h-4 w-4 text-gray-600" />
                        )}
                        {usuario.nome}
                      </div>
                    </TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${
                          usuario.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {usuario.role === "admin" ? "Administrador" : "Usuário"}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(usuario.ultimoAcesso)}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-[5px] h-[22px] rounded-sm text-xs font-medium ${
                          usuario.ativo
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {usuario.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Visualizar",
                            icon: ActionIcons.View,
                            onClick: () => toast.info("Visualizando usuário..."),
                          },
                          {
                            label: "Editar",
                            icon: ActionIcons.Edit,
                            onClick: () => toast.info("Editando usuário..."),
                          },
                          {
                            label: usuario.ativo ? "Desativar" : "Ativar",
                            icon: <User className="h-4 w-4" />,
                            onClick: () =>
                              toast.success(
                                usuario.ativo
                                  ? "Usuário desativado!"
                                  : "Usuário ativado!"
                              ),
                            separator: true,
                          },
                          {
                            label: "Excluir",
                            icon: ActionIcons.Delete,
                            onClick: () => {
                              if (confirm("Tem certeza que deseja excluir este usuário?")) {
                                toast.success("Usuário excluído!");
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
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum usuário cadastrado ainda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
