import { useState } from "react";
import { trpc } from "@/lib/trpc";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarIcon,
  X,
  Printer,
  Send,
  MoreVertical,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import ContaAICaptura from "@/components/ContaAICaptura";

export default function OrcamentosContaAzul() {
  const [showDialog, setShowDialog] = useState(false);
  const [tipoVenda, setTipoVenda] = useState<"orcamento" | "venda_avulsa" | "venda_recorrente">("orcamento");
  const [selectedPeriod, setSelectedPeriod] = useState("Dezembro de 2025");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "vendas" | "orcamentos">("orcamentos");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAICaptura, setShowAICaptura] = useState(false);

  // Queries
  const { data: orcamentos = [], isLoading } = trpc.orcamentos.list.useQuery();
  const { data: clientes = [] } = trpc.clientes.list.useQuery();
  const { data: produtos = [] } = trpc.produtos.list.useQuery();
  const createMutation = trpc.orcamentos.create.useMutation();

  // Form state
  const [formData, setFormData] = useState({
    numero: "",
    clienteId: "",
    dataOrcamento: new Date(),
    validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    vendedorResponsavel: "Thiago Figueredo",
    descricao: "",
    previsaoEntrega: "",
    itens: [] as { produtoId: number; quantidade: number; precoUnitario: number }[],
    descontoReais: 0,
    descontoPercentual: 0,
    observacoesPagamento: "",
  });

  // Calcular totais
  const subtotal = formData.itens.reduce(
    (acc, item) => acc + item.quantidade * item.precoUnitario,
    0
  );
  const desconto =
    formData.descontoReais || (subtotal * formData.descontoPercentual) / 100;
  const total = subtotal - desconto;

  // Estatísticas
  const cancelados = orcamentos.filter((o) => o.status === "rejeitado");
  const previstos = orcamentos.filter((o) => o.status === "pendente");
  const aprovados = orcamentos.filter((o) => o.status === "convertido");
  const totalOrcamentos = orcamentos;

  const somaValor = (lista: typeof orcamentos) =>
    lista.reduce((acc, o) => acc + parseFloat(o.valorTotal?.toString() || "0"), 0);

  const handleSubmit = async () => {
    try {
      await createMutation.mutateAsync({
        numero: formData.numero || `ORC-${Date.now()}`,
        clienteId: parseInt(formData.clienteId),
        dataValidade: formData.validade,
        valorTotal: total.toString(),
        desconto: desconto.toString(),
        observacoes: formData.descricao,
        itens: JSON.stringify(formData.itens),
      });
      toast.success("Orçamento criado com sucesso!");
      setShowDialog(false);
      setFormData({
        numero: "",
        clienteId: "",
        dataOrcamento: new Date(),
        validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        vendedorResponsavel: "Thiago Figueredo",
        descricao: "",
        previsaoEntrega: "",
        itens: [],
        descontoReais: 0,
        descontoPercentual: 0,
        observacoesPagamento: "",
      });
    } catch (error) {
      toast.error("Erro ao criar orçamento");
    }
  };

  const adicionarItem = () => {
    setFormData({
      ...formData,
      itens: [
        ...formData.itens,
        { produtoId: 0, quantidade: 1, precoUnitario: 0 },
      ],
    });
  };

  const removerItem = (index: number) => {
    setFormData({
      ...formData,
      itens: formData.itens.filter((_, i) => i !== index),
    });
  };

  const atualizarItem = (
    index: number,
    field: "produtoId" | "quantidade" | "precoUnitario",
    value: number
  ) => {
    const novosItens = [...formData.itens];
    novosItens[index] = { ...novosItens[index], [field]: value };
    setFormData({ ...formData, itens: novosItens });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-bold">Orçamentos</h1>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-2 flex-wrap">
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => {
          setTipoVenda("venda_avulsa");
          setShowDialog(true);
        }}>
          Nova venda de produto
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => {
          setTipoVenda("venda_recorrente");
          setShowDialog(true);
        }}>
          Nova venda de serviço
        </Button>
        <Button variant="outline" onClick={() => {
          setTipoVenda("orcamento");
          setShowDialog(true);
        }}>
          Novo orçamento
        </Button>
        <Button variant="outline">
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button
          variant="outline"
          className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
          onClick={() => setShowAICaptura(true)}
        >
          <Zap className="w-4 h-4 mr-2" />
          Conta AI Captura
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            {/* Período */}
            <div className="flex items-center gap-2">
              <Label>Período</Label>
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dezembro de 2025">Dezembro de 2025</SelectItem>
                  <SelectItem value="Novembro de 2025">Novembro de 2025</SelectItem>
                  <SelectItem value="Outubro de 2025">Outubro de 2025</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Pesquisa */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Pesquisar no período selecionado"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tipo de negociação */}
            <div className="flex gap-2">
              <Button
                variant={filtroTipo === "todos" ? "default" : "outline"}
                onClick={() => setFiltroTipo("todos")}
              >
                Todos
              </Button>
              <Button
                variant={filtroTipo === "vendas" ? "default" : "outline"}
                onClick={() => setFiltroTipo("vendas")}
              >
                Vendas
              </Button>
              <Button
                variant={filtroTipo === "orcamentos" ? "default" : "outline"}
                onClick={() => setFiltroTipo("orcamentos")}
              >
                Orçamentos
              </Button>
            </div>

            <Button variant="outline">
              Mais filtros
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Filtros ativos */}
          {filtroTipo !== "todos" && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mais filtros selecionados</span>
              <Badge variant="secondary" className="gap-2">
                Tipo de item: Serviço
                <X className="w-3 h-3 cursor-pointer" onClick={() => setFiltroTipo("todos")} />
              </Badge>
              <Button variant="link" size="sm" onClick={() => setFiltroTipo("todos")}>
                Limpar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards de status */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Cancelados ({cancelados.length})</div>
              <div className="text-2xl font-bold text-red-600">
                R$ {somaValor(cancelados).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Previstos ({previstos.length})</div>
              <div className="text-2xl font-bold text-yellow-600">
                R$ {somaValor(previstos).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">Aprovados ({aprovados.length})</div>
              <div className="text-2xl font-bold text-green-600">
                R$ {somaValor(aprovados).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">
                Total do período ({totalOrcamentos.length})
              </div>
              <div className="text-2xl font-bold text-blue-600">
                R$ {somaValor(totalOrcamentos).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de orçamentos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                0 registro(s) selecionado(s)
              </span>
              <Button variant="outline" size="sm">
                Gerar notas fiscais de serviço
              </Button>
              <Button variant="outline" size="sm">
                Imprimir
              </Button>
              <Button variant="outline" size="sm">
                Excluir
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : orcamentos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum orçamento encontrado
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input type="checkbox" />
                  </TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor (R$)</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead>Nota Fiscal</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orcamentos.map((orc) => (
                  <TableRow key={orc.id}>
                    <TableCell>
                      <input type="checkbox" />
                    </TableCell>
                    <TableCell>
                      {format(new Date(orc.dataEmissao), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell>{orc.id}</TableCell>
                    <TableCell>
                      {clientes.find((c) => c.id === orc.clienteId)?.nome || "N/A"}
                      <div className="text-xs text-muted-foreground">Orçamento</div>
                    </TableCell>
                    <TableCell>{parseFloat(orc.valorTotal?.toString() || "0").toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          orc.status === "convertido"
                            ? "default"
                            : orc.status === "rejeitado"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          orc.status === "pendente" ? "bg-yellow-100 text-yellow-800" : ""
                        }
                      >
                        {orc.status === "pendente"
                          ? "Em andamento"
                          : orc.status === "convertido"
                          ? "Aprovado"
                          : "Cancelado"}
                      </Badge>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Total */}
          <div className="mt-4 pt-4 border-t flex justify-between items-center">
            <span className="font-semibold">Total dos orçamentos</span>
            <span className="text-xl font-bold text-blue-600">
              R$ {somaValor(orcamentos).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Dialog de novo orçamento */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Novo orçamento {formData.numero && `#${formData.numero}`}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="informacoes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="itens">Itens</TabsTrigger>
              <TabsTrigger value="valor">Valor</TabsTrigger>
              <TabsTrigger value="observacoes">Observações de pagamento</TabsTrigger>
            </TabsList>

            {/* Aba Informações */}
            <TabsContent value="informacoes" className="space-y-4">
              <div className="space-y-4">
                {/* Tipo da venda */}
                <div>
                  <Label>Tipo da venda</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={tipoVenda === "orcamento" ? "default" : "outline"}
                      onClick={() => setTipoVenda("orcamento")}
                    >
                      Orçamento
                    </Button>
                    <Button
                      type="button"
                      variant={tipoVenda === "venda_avulsa" ? "default" : "outline"}
                      onClick={() => setTipoVenda("venda_avulsa")}
                    >
                      Venda avulsa
                    </Button>
                    <Button
                      type="button"
                      variant={tipoVenda === "venda_recorrente" ? "default" : "outline"}
                      onClick={() => setTipoVenda("venda_recorrente")}
                    >
                      Venda recorrente (contrato)
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Número do orçamento */}
                  <div>
                    <Label>Número do orçamento *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={formData.numero}
                        onChange={(e) =>
                          setFormData({ ...formData, numero: e.target.value })
                        }
                        placeholder="Auto"
                      />
                      <Button variant="outline" size="icon">
                        <Zap className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Cliente */}
                  <div>
                    <Label>Cliente *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.clienteId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, clienteId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clientes.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id.toString()}>
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline">Consultar cliente no Serasa</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Data do orçamento */}
                  <div>
                    <Label>Data do orçamento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.dataOrcamento, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dataOrcamento}
                          onSelect={(date) =>
                            date && setFormData({ ...formData, dataOrcamento: date })
                          }
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Validade do orçamento */}
                  <div>
                    <Label>Validade do orçamento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.validade, "dd/MM/yyyy", { locale: ptBR })}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.validade}
                          onSelect={(date) =>
                            date && setFormData({ ...formData, validade: date })
                          }
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Vendedor responsável */}
                <div>
                  <Label>Vendedor responsável</Label>
                  <Input
                    value={formData.vendedorResponsavel}
                    onChange={(e) =>
                      setFormData({ ...formData, vendedorResponsavel: e.target.value })
                    }
                  />
                </div>

                {/* Descrição */}
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    placeholder="Faça uma breve descrição sobre a sua empresa e os produtos que você vende."
                    rows={4}
                  />
                </div>

                {/* Previsão de entrega */}
                <div>
                  <Label>Previsão de entrega do produto ou serviço</Label>
                  <Textarea
                    value={formData.previsaoEntrega}
                    onChange={(e) =>
                      setFormData({ ...formData, previsaoEntrega: e.target.value })
                    }
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Aba Itens */}
            <TabsContent value="itens" className="space-y-4">
              <div>
                <Label>Selecione ou crie um novo item *</Label>
                <Select onValueChange={(value) => {
                  const produto = produtos.find(p => p.id === parseInt(value));
                  if (produto) {
                    setFormData({
                      ...formData,
                      itens: [
                        ...formData.itens,
                        {
                          produtoId: produto.id,
                          quantidade: 1,
                          precoUnitario: parseFloat(produto.precoVenda) || 0,
                        },
                      ],
                    });
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id.toString()}>
                        {produto.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Lista de itens */}
              {formData.itens.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead>Quantidade</TableHead>
                      <TableHead>Preço Unitário</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.itens.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {produtos.find((p) => p.id === item.produtoId)?.nome || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantidade}
                            onChange={(e) =>
                              atualizarItem(index, "quantidade", parseFloat(e.target.value))
                            }
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.precoUnitario}
                            onChange={(e) =>
                              atualizarItem(index, "precoUnitario", parseFloat(e.target.value))
                            }
                            className="w-32"
                          />
                        </TableCell>
                        <TableCell>
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removerItem(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* Aba Valor */}
            <TabsContent value="valor" className="space-y-4">
              <div>
                <Label>Desconto</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant="default"
                    className="bg-blue-600"
                  >
                    R$
                  </Button>
                  <Button type="button" variant="outline">
                    %
                  </Button>
                  <Input
                    type="number"
                    value={formData.descontoReais}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descontoReais: parseFloat(e.target.value),
                        descontoPercentual: 0,
                      })
                    }
                    placeholder="0,00"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Total do Orçamento */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle>Total do Orçamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Itens (R$)</span>
                      <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Desconto (R$)</span>
                      <span className="text-red-600">-{desconto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t">
                      <span>Total líquido (R$)</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Aba Observações */}
            <TabsContent value="observacoes" className="space-y-4">
              <div>
                <Label>Observações de pagamento</Label>
                <Textarea
                  value={formData.observacoesPagamento}
                  onChange={(e) =>
                    setFormData({ ...formData, observacoesPagamento: e.target.value })
                  }
                  placeholder="Adicione informações sobre formas de pagamento, condições, etc."
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancelar
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Conta AI Captura */}
      <ContaAICaptura
        open={showAICaptura}
        onOpenChange={setShowAICaptura}
        onSuccess={() => {
          // Recarregar lista de orçamentos
          window.location.reload();
        }}
      />
    </div>
  );
}
