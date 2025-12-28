import { useState } from "react";
import { useLocation } from "wouter";
import { X, HelpCircle } from "lucide-react";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { NovoClienteModal } from "@/components/NovoClienteModal";
import { DatePicker } from "@/components/ui/date-picker";

export default function NovoOrcamentoPage() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [activeTab, setActiveTab] = useState("informacoes");
  const [tipoVenda, setTipoVenda] = useState("orcamento");
  const [modalNovoClienteOpen, setModalNovoClienteOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    situacaoNegociacao: "em_negociacao",
    numeroOrcamento: "",
    clienteId: "",
    dataOrcamento: new Date(),
    validadeOrcamento: undefined as Date | undefined,
    vendedorResponsavel: "",
    descricao: "",
    previsaoEntrega: "",
    itens: [] as Array<{ produtoId: number; quantidade: number; valorUnitario: number; nome?: string }>,
    descontoTipo: "reais" as "reais" | "percentual",
    descontoValor: "0",
    observacoesPagamento: "",
    observacoesNF: "",
  });

  const [itemTemp, setItemTemp] = useState({
    produtoId: "",
    quantidade: "1",
    valorUnitario: "0",
  });

  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: produtos } = trpc.produtos.list.useQuery();
  
  const createMutation = trpc.orcamentos.create.useMutation({
    onSuccess: () => {
      toast.success("Orçamento criado com sucesso!");
      navigate("/orcamentos");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar orçamento");
    },
  });

  const handleAddItem = () => {
    if (!itemTemp.produtoId) {
      toast.error("Selecione um produto");
      return;
    }
    const produto = produtos?.find(p => p.id === parseInt(itemTemp.produtoId));
    if (!produto) return;
    
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, {
        produtoId: parseInt(itemTemp.produtoId),
        quantidade: parseFloat(itemTemp.quantidade),
        valorUnitario: parseFloat(itemTemp.valorUnitario),
        nome: produto.nome,
      }],
    }));
    setItemTemp({ produtoId: "", quantidade: "1", valorUnitario: "0" });
  };

  const calcularTotais = () => {
    const subtotal = formData.itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
    const desconto = formData.descontoTipo === "reais" 
      ? parseFloat(formData.descontoValor) 
      : (subtotal * parseFloat(formData.descontoValor)) / 100;
    return { subtotal, desconto, total: subtotal - desconto };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clienteId || formData.itens.length === 0) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const { subtotal, desconto, total } = calcularTotais();
    createMutation.mutate({
      clienteId: parseInt(formData.clienteId),
      dataValidade: formData.validadeOrcamento || new Date(),
      observacoes: formData.descricao,
      valorTotal: total.toString(),
      itens: formData.itens.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
      })),
    });
  };

  const { subtotal, desconto, total } = calcularTotais();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-semibold">Novo orçamento {formData.numeroOrcamento}</h2>
        <Button variant="ghost" size="icon" onClick={() => navigate("/orcamentos")}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-8">
            <button
              type="button"
              className={`py-4 border-b-2 font-medium ${
                activeTab === "informacoes" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("informacoes")}
            >
              Informações
            </button>
            <button
              type="button"
              className={`py-4 border-b-2 font-medium ${
                activeTab === "itens" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("itens")}
            >
              Itens
            </button>
            <button
              type="button"
              className={`py-4 border-b-2 font-medium ${
                activeTab === "valor" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("valor")}
            >
              Valor
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === "informacoes" && (
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg space-y-6">
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

              {/* Grid de campos - Linha 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número do orçamento *</Label>
                  <Input
                    id="numero"
                    value={formData.numeroOrcamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, numeroOrcamento: e.target.value }))}
                    placeholder="Gerado automaticamente"
                  />
                </div>
                <div>
                  <Label htmlFor="cliente">Cliente *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.clienteId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, clienteId: value }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 border-b">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setModalNovoClienteOpen(true)}
                          >
                            <span className="mr-2">+</span> Novo
                          </Button>
                        </div>
                        {clientes?.map((cliente) => (
                          <SelectItem key={cliente.id} value={cliente.id.toString()}>
                            {cliente.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      size="sm"
                      className="bg-[#E91E63] hover:bg-[#C2185B] text-white border-0"
                    >
                      Consultar cliente no Serasa
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <HelpCircle className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="data">Data do orçamento *</Label>
                  <DatePicker
                    date={formData.dataOrcamento}
                    onDateChange={(date) => setFormData(prev => ({ ...prev, dataOrcamento: date || new Date() }))}
                    placeholder="Selecione a data do orçamento"
                  />
                </div>
              </div>

              {/* Grid de campos - Linha 2 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="validade">Validade do orçamento *</Label>
                  <DatePicker
                    date={formData.validadeOrcamento}
                    onDateChange={(date) => setFormData(prev => ({ ...prev, validadeOrcamento: date }))}
                    placeholder="Selecione a validade do orçamento"
                  />
                </div>
                <div>
                  <Label htmlFor="vendedor">Vendedor responsável</Label>
                  <Input
                    id="vendedor"
                    value={formData.vendedorResponsavel}
                    onChange={(e) => setFormData(prev => ({ ...prev, vendedorResponsavel: e.target.value }))}
                    placeholder="Nome do vendedor"
                  />
                </div>
                <div>
                  <Label htmlFor="situacao">Situação da negociação *</Label>
                  <Select
                    value={formData.situacaoNegociacao}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, situacaoNegociacao: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_negociacao">Em negociação</SelectItem>
                      <SelectItem value="aprovado">Aprovado</SelectItem>
                      <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  placeholder="Faça uma breve descrição sobre a sua empresa e os produtos que você vende."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="previsao">Previsão de entrega do produto ou serviço</Label>
                <Input
                  id="previsao"
                  value={formData.previsaoEntrega}
                  onChange={(e) => setFormData(prev => ({ ...prev, previsaoEntrega: e.target.value }))}
                  placeholder="Ex: 5 dias úteis"
                />
              </div>
            </div>
          )}

          {activeTab === "itens" && (
            <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg space-y-6">
              <div>
                <Label className="flex items-center gap-1">
                  Selecione ou crie um novo item *
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </Label>
                <div className="grid grid-cols-4 gap-4 mt-2">
                  <Select
                    value={itemTemp.produtoId}
                    onValueChange={(value) => {
                      const produto = produtos?.find(p => p.id === parseInt(value));
                      setItemTemp(prev => ({
                        ...prev,
                        produtoId: value,
                        valorUnitario: produto?.precoVenda.toString() || "0",
                      }));
                    }}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 border-b">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => window.open('/produtos', '_blank')}
                        >
                          <span className="mr-2">+</span> Novo
                        </Button>
                      </div>
                      {produtos?.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id.toString()}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Quantidade"
                    value={itemTemp.quantidade}
                    onChange={(e) => setItemTemp(prev => ({ ...prev, quantidade: e.target.value }))}
                  />
                  <Button type="button" onClick={handleAddItem} className="w-full">
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de itens */}
              {formData.itens.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Produto</th>
                        <th className="px-4 py-2 text-right">Quantidade</th>
                        <th className="px-4 py-2 text-right">Valor Unitário</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.itens.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">{item.nome}</td>
                          <td className="px-4 py-2 text-right">{item.quantidade}</td>
                          <td className="px-4 py-2 text-right">R$ {item.valorUnitario.toFixed(2)}</td>
                          <td className="px-4 py-2 text-right">R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</td>
                          <td className="px-4 py-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                itens: prev.itens.filter((_, i) => i !== index),
                              }))}
                            >
                              Remover
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === "valor" && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg">
                <div>
                  <Label>Desconto</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={formData.descontoTipo === "reais" ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, descontoTipo: "reais" }))}
                    >
                      R$
                    </Button>
                    <Button
                      type="button"
                      variant={formData.descontoTipo === "percentual" ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, descontoTipo: "percentual" }))}
                    >
                      %
                    </Button>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.descontoValor}
                      onChange={(e) => setFormData(prev => ({ ...prev, descontoValor: e.target.value }))}
                      placeholder="0,00"
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-gray-50 mt-6">
                  <h3 className="font-semibold mb-4">Total do Orçamento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Itens (R$)</span>
                      <span>{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Desconto (R$)</span>
                      <span>- {desconto.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total líquido (R$)</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações de pagamento */}
              <Collapsible className="bg-white rounded-lg">
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between border-b">
                  <span className="font-medium">Observações de pagamento</span>
                  <span className="text-gray-400">▼</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4">
                  <Textarea
                    value={formData.observacoesPagamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoesPagamento: e.target.value }))}
                    placeholder="Adicione observações sobre o pagamento"
                    rows={4}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Observações complementares da NF */}
              <Collapsible className="bg-white rounded-lg">
                <CollapsibleTrigger className="w-full px-6 py-4 flex items-center justify-between border-b">
                  <span className="font-medium">Observações complementares da nota fiscal</span>
                  <span className="text-gray-400">▼</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 py-4">
                  <Label>Observações</Label>
                  <Textarea
                    value={formData.observacoesNF}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoesNF: e.target.value }))}
                    placeholder="Inclua informações relevantes para seu cliente. Elas aparecerão na nota fiscal, nos campos 'Descrição do serviço' ou 'Informações Complementares Contribuinte', visíveis no XML, PDF e DANFE."
                    rows={4}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex items-center justify-between sticky bottom-0">
          <Button type="button" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={() => navigate("/orcamentos")}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>

      {/* Modal de Novo Cliente */}
      <NovoClienteModal
        open={modalNovoClienteOpen}
        onOpenChange={setModalNovoClienteOpen}
        onClienteCriado={(clienteId) => {
          setFormData(prev => ({ ...prev, clienteId: clienteId.toString() }));
        }}
      />
    </div>
  );
}
