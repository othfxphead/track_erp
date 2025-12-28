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
import { Star, Package, ShoppingCart, DollarSign, Users, Wrench } from "lucide-react";
import { ActionButton, ActionIcons } from "@/components/ActionButton";
import { toast } from "sonner";
import { useState } from "react";

export default function Favoritos() {
  // Mock data - em produção viria do backend
  const [favoritos] = useState([
    {
      id: 1,
      tipo: "produto",
      nome: "Notebook Dell Inspiron 15",
      categoria: "Produtos",
      ultimoAcesso: new Date("2025-01-15"),
    },
    {
      id: 2,
      tipo: "cliente",
      nome: "João Silva Comércio LTDA",
      categoria: "Clientes",
      ultimoAcesso: new Date("2025-01-14"),
    },
    {
      id: 3,
      tipo: "venda",
      nome: "Venda #1234",
      categoria: "Vendas",
      ultimoAcesso: new Date("2025-01-13"),
    },
  ]);

  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case "produto":
        return <Package className="h-4 w-4" />;
      case "cliente":
        return <Users className="h-4 w-4" />;
      case "venda":
        return <ShoppingCart className="h-4 w-4" />;
      case "servico":
        return <Wrench className="h-4 w-4" />;
      case "financeiro":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Favoritos</h1>
          <p className="text-muted-foreground mt-1">
            Acesso rápido aos seus itens mais usados
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Produtos</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendas</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Star className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Favoritos */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle>Itens Favoritados</CardTitle>
        </CardHeader>
        <CardContent>
          {favoritos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {favoritos.map((favorito) => (
                  <TableRow key={favorito.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getIconByType(favorito.tipo)}
                        <span className="font-medium">{favorito.nome}</span>
                      </div>
                    </TableCell>
                    <TableCell>{favorito.categoria}</TableCell>
                    <TableCell>{formatDate(favorito.ultimoAcesso)}</TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Abrir",
                            icon: ActionIcons.View,
                            onClick: () => toast.info(`Abrindo ${favorito.nome}...`),
                          },
                          {
                            label: "Remover dos Favoritos",
                            icon: <Star className="h-4 w-4" />,
                            onClick: () => toast.success("Removido dos favoritos!"),
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
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum item favoritado ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Clique no ícone de estrela em produtos, clientes ou vendas para adicioná-los aos favoritos.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
