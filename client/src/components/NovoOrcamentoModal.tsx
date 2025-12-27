import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Search, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface NovoOrcamentoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NovoOrcamentoModal({
  open,
  onOpenChange,
}: NovoOrcamentoModalProps) {
  const [tipoVenda, setTipoVenda] = useState("orcamento");
  const [situacao, setSituacao] = useState("em_negociacao");
  const [descontoTipo, setDescontoTipo] = useState<"percent" | "reais">("percent");
  const [desconto, setDesconto] = useState("0");
  const [itens, setItens] = useState<any[]>([]);
  const [novoItem, setNovoItem] = useState({
    produto: "",
    quantidade: "1",
    precoUnitario: "0",
  });

  const [formData, setFormData] = useState({
    numero: "AUTO",
    cliente: "",
    dataEmissao: new Date().toISOString().split("T")[0],
    validade: "",
    vendedor: "",
    descricao: "",
    previsaoEntrega: "",
    observacoesPagamento: "",
    complementoNF: "",
  });

  const calcularSubtotalItens = () => {
    return itens.reduce((sum, item) => {
      return sum + parseFloat(item.quantidade) * parseFloat(item.precoUnitario);
    }, 0);
  };

  const calcularDesconto = () => {
    const subtotal = calcularSubtotalItens();
    if (descontoTipo === "percent") {
      return (subtotal * parseFloat(desconto)) / 100;
    }
    return parseFloat(desconto);
  };

  const calcularTotalLiquido = () => {
    return calcularSubtotalItens() - calcularDesconto();
  };

  const adicionarItem = () => {
    if (!novoItem.produto || !novoItem.quantidade || !novoItem.precoUnitario) {
      toast.error("Preencha todos os campos do item");
      return;
    }

    setItens([...itens, { ...novoItem, id: Date.now() }]);
    setNovoItem({ produto: "", quantidade: "1", precoUnitario: "0" });
    toast.success("Item adicionado");
  };

  const removerItem = (id: number) => {
    setItens(itens.filter((item) => item.id !== id));
    toast.success("Item removido");
  };

  const handleConsultarSerasa = () => {
    toast.info("Consultando cliente no Serasa...");
    // Implementar integração com Serasa
  };

  const handleSubmit = () => {
    if (!formData.cliente) {
      toast.error("Selecione um cliente");
      return;
    }

    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item");
      return;
    }

    toast.success("Orçamento criado com sucesso!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Novo Orçamento</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <Tabs defaultValue="informacoes" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="informacoes">Informações</TabsTrigger>
              <TabsTrigger value="itens">Itens</TabsTrigger>
              <TabsTrigger value="valor">Valor</TabsTrigger>
              <TabsTrigger value="observacoes">Observações de pagamento</TabsTrigger>
              <TabsTrigger value="complemento">Complemento NF</TabsTrigger>
            </TabsList>

            {/* Aba Informações */}
            <TabsContent value="informacoes" className="space-y-4">
              {/* Tipo da Venda */}
              <Card className="p-4">
                <Label className="text-sm font-medium mb-3 block">
                  Tipo da venda <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "orcamento", label: "Orçamento" },
                    { value: "venda_avulsa", label: "Venda avulsa" },
                    { value: "venda_recorrente", label: "Venda recorrente/contrato" },
                  ].map((tipo) => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => setTipoVenda(tipo.value)}
                      className={`p-3 border-2 rounded-lg text-sm font-medium transition-colors ${
                        tipoVenda === tipo.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {tipo.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Situação da Negociação */}
              <div>
                <Label htmlFor="situacao" className="text-sm font-medium">
                  Situação da negociação <span className="text-red-500">*</span>
                </Label>
                <Select value={situacao} onValueChange={setSituacao}>
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_negociacao">Em negociação</SelectItem>
                    <SelectItem value="proposta_enviada">Proposta enviada</SelectItem>
                    <SelectItem value="aguardando_aprovacao">Aguardando aprovação</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Número do Orçamento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numero" className="text-sm font-medium">
                    Número do orçamento
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) =>
                        setFormData({ ...formData, numero: e.target.value })
                      }
                      className="h-9"
                      disabled={formData.numero === "AUTO"}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          numero: formData.numero === "AUTO" ? "" : "AUTO",
                        })
                      }
                    >
                      {formData.numero === "AUTO" ? "Manual" : "Auto"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cliente com botão Serasa */}
              <div>
                <Label htmlFor="cliente" className="text-sm font-medium">
                  Cliente <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2 mt-1">
                  <Select
                    value={formData.cliente}
                    onValueChange={(value) =>
                      setFormData({ ...formData, cliente: value })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cliente1">Cliente Teste 1</SelectItem>
                      <SelectItem value="cliente2">Cliente Teste 2</SelectItem>
                      <SelectItem value="cliente3">Cliente Teste 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 whitespace-nowrap"
                    onClick={handleConsultarSerasa}
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Consultar no Serasa
                  </Button>
                </div>
              </div>

              {/* Datas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dataEmissao" className="text-sm font-medium">
                    Data do orçamento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dataEmissao"
                    type="date"
                    value={formData.dataEmissao}
                    onChange={(e) =>
                      setFormData({ ...formData, dataEmissao: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="validade" className="text-sm font-medium">
                    Validade do orçamento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="validade"
                    type="date"
                    value={formData.validade}
                    onChange={(e) =>
                      setFormData({ ...formData, validade: e.target.value })
                    }
                    className="mt-1 h-9"
                  />
                </div>
              </div>

              {/* Vendedor */}
              <div>
                <Label htmlFor="vendedor" className="text-sm font-medium">
                  Vendedor responsável
                </Label>
                <Select
                  value={formData.vendedor}
                  onValueChange={(value) =>
                    setFormData({ ...formData, vendedor: value })
                  }
                >
                  <SelectTrigger className="mt-1 h-9">
                    <SelectValue placeholder="Selecione um vendedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendedor1">Thiago Figueredo</SelectItem>
                    <SelectItem value="vendedor2">Vendedor 2</SelectItem>
                    <SelectItem value="vendedor3">Vendedor 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Descrição */}
              <div>
                <Label htmlFor="descricao" className="text-sm font-medium">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Adicione uma descrição do orçamento..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              {/* Previsão de Entrega */}
              <div>
                <Label htmlFor="previsaoEntrega" className="text-sm font-medium">
                  Previsão de entrega do produto ou serviço
                </Label>
                <Input
                  id="previsaoEntrega"
                  type="date"
                  value={formData.previsaoEntrega}
                  onChange={(e) =>
                    setFormData({ ...formData, previsaoEntrega: e.target.value })
                  }
                  className="mt-1 h-9"
                />
              </div>
            </TabsContent>

            {/* Aba Itens */}
            <TabsContent value="itens" className="space-y-4">
              <Card className="p-4">
                <Label className="text-sm font-medium mb-3 block">
                  Adicionar item <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-12 gap-3">
                  <div className="col-span-6">
                    <Select
                      value={novoItem.produto}
                      onValueChange={(value) =>
                        setNovoItem({ ...novoItem, produto: value })
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produto1">Produto Teste 1</SelectItem>
                        <SelectItem value="produto2">Produto Teste 2</SelectItem>
                        <SelectItem value="produto3">Serviço Teste 1</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Qtd"
                      value={novoItem.quantidade}
                      onChange={(e) =>
                        setNovoItem({ ...novoItem, quantidade: e.target.value })
                      }
                      className="h-9"
                      min="1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Preço unitário"
                      value={novoItem.precoUnitario}
                      onChange={(e) =>
                        setNovoItem({ ...novoItem, precoUnitario: e.target.value })
                      }
                      className="h-9"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      onClick={adicionarItem}
                      className="h-9 w-full"
                      size="sm"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {itens.length > 0 && (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.produto}</TableCell>
                          <TableCell className="text-right">
                            {item.quantidade}
                          </TableCell>
                          <TableCell className="text-right">
                            R$ {parseFloat(item.precoUnitario).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            R${" "}
                            {(
                              parseFloat(item.quantidade) *
                              parseFloat(item.precoUnitario)
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </TabsContent>

            {/* Aba Valor */}
            <TabsContent value="valor" className="space-y-4">
              <Card className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Desconto
                    </Label>
                    <div className="flex gap-3">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={descontoTipo === "percent" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDescontoTipo("percent")}
                          className="h-9"
                        >
                          %
                        </Button>
                        <Button
                          type="button"
                          variant={descontoTipo === "reais" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDescontoTipo("reais")}
                          className="h-9"
                        >
                          R$
                        </Button>
                      </div>
                      <Input
                        type="number"
                        value={desconto}
                        onChange={(e) => setDesconto(e.target.value)}
                        placeholder="0"
                        className="h-9 max-w-[200px]"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <Card className="bg-blue-50 border-blue-200 p-4">
                    <h3 className="font-semibold text-lg mb-3">
                      Total do Orçamento
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Itens (R$):</span>
                        <span className="font-medium">
                          R$ {calcularSubtotalItens().toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Desconto (R$):</span>
                        <span className="font-medium text-red-600">
                          - R$ {calcularDesconto().toFixed(2)}
                        </span>
                      </div>
                      <div className="border-t border-blue-300 pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="font-semibold text-lg">
                            Total líquido (R$):
                          </span>
                          <span className="font-bold text-xl text-blue-700">
                            R$ {calcularTotalLiquido().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </Card>
            </TabsContent>

            {/* Aba Observações de Pagamento */}
            <TabsContent value="observacoes" className="space-y-4">
              <div>
                <Label htmlFor="observacoesPagamento" className="text-sm font-medium">
                  Observações de pagamento
                </Label>
                <Textarea
                  id="observacoesPagamento"
                  value={formData.observacoesPagamento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observacoesPagamento: e.target.value,
                    })
                  }
                  placeholder="Adicione informações sobre formas de pagamento, condições, etc."
                  className="mt-1"
                  rows={6}
                />
              </div>
            </TabsContent>

            {/* Aba Complemento NF */}
            <TabsContent value="complemento" className="space-y-4">
              <div>
                <Label htmlFor="complementoNF" className="text-sm font-medium flex items-center gap-2">
                  Complemento da Nota Fiscal
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </Label>
                <Textarea
                  id="complementoNF"
                  value={formData.complementoNF}
                  onChange={(e) =>
                    setFormData({ ...formData, complementoNF: e.target.value })
                  }
                  placeholder="Informações adicionais que aparecerão na nota fiscal..."
                  className="mt-1"
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer com botões */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleSubmit}
          >
            Salvar Orçamento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
