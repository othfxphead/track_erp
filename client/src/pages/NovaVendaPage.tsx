import { useState } from "react";
import { useLocation } from "wouter";
import { X } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { NovoClienteModal } from "@/components/NovoClienteModal";

export default function NovaVendaPage() {
  const [, setLocation] = useLocation();
  const navigate = (path: string) => setLocation(path);
  const [activeTab, setActiveTab] = useState("informacoes");
  const [modalNovoClienteOpen, setModalNovoClienteOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    numero: "",
    clienteId: "",
    dataVenda: new Date().toISOString().split("T")[0],
    vendedorResponsavel: "",
    status: "pendente",
    formaPagamento: "",
    numeroParcelas: "1",
    contaBancariaId: "",
    itens: [] as Array<{ produtoId: number; quantidade: number; valorUnitario: number; nome?: string; tipo: "produto" | "servico" }>,
    descontoTipo: "reais" as "reais" | "percentual",
    descontoValor: "0",
    emitirNF: false,
    naturezaOperacao: "venda",
    observacoesNF: "",
    observacoes: "",
  });

  const [itemTemp, setItemTemp] = useState({
    produtoId: "",
    quantidade: "1",
    valorUnitario: "0",
  });

  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: produtos } = trpc.produtos.list.useQuery();
  
  const createMutation = trpc.vendas.create.useMutation({
    onSuccess: () => {
      toast.success("Venda criada com sucesso!");
      navigate("/vendas");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar venda");
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
        tipo: "produto",
      }],
    }));
    setItemTemp({ produtoId: "", quantidade: "1", valorUnitario: "0" });
  };

  const handleRemoveItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index),
    }));
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
    const { total, desconto } = calcularTotais();
    
    createMutation.mutate({
      numero: formData.numero || `VD-${Date.now()}`,
      clienteId: parseInt(formData.clienteId),
      valorTotal: total.toString(),
      desconto: desconto.toString(),
      formaPagamento: formData.formaPagamento,
      observacoes: formData.observacoes,
      itens: JSON.stringify(formData.itens.map(item => ({
        id: item.produtoId,
        tipo: item.tipo,
        quantidade: item.quantidade,
        valorUnitario: item.valorUnitario,
      }))),
    });
  };

  const { subtotal, desconto, total } = calcularTotais();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-xl font-semibold">Nova venda {formData.numero}</h2>
        <Button variant="ghost" size="icon" onClick={() => navigate("/vendas")}>
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
                activeTab === "pagamento" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("pagamento")}
            >
              Pagamento
            </button>
            <button
              type="button"
              className={`py-4 border-b-2 font-medium ${
                activeTab === "fiscal" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}
              onClick={() => setActiveTab("fiscal")}
            >
              Dados Fiscais
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "informacoes" && (
            <div className="max-w-5xl space-y-6">
              {/* Grid de campos - Linha 1 */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número da venda</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
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
                  </div>
                </div>
                <div>
                  <Label htmlFor="data">Data da venda *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.dataVenda}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataVenda: e.target.value }))}
                  />
                </div>
              </div>

              {/* Grid de campos - Linha 2 */}
              <div className="grid grid-cols-3 gap-4">
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
                  <Label htmlFor="status">Status da venda *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="faturada">Faturada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Observações */}
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  placeholder="Adicione observações sobre a venda"
                  rows={4}
                />
              </div>
            </div>
          )}

          {activeTab === "itens" && (
            <div className="max-w-5xl space-y-6">
              {/* Adicionar item */}
              <div className="border rounded-lg p-6 bg-gray-50">
                <h3 className="font-semibold mb-4">Adicionar produto/serviço</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="produto">Produto/Serviço</Label>
                    <Select
                      value={itemTemp.produtoId}
                      onValueChange={(value) => {
                        const produto = produtos?.find(p => p.id === parseInt(value));
                        setItemTemp(prev => ({
                          ...prev,
                          produtoId: value,
                          valorUnitario: produto?.precoVenda?.toString() || "0",
                        }));
                      }}
                    >
                      <SelectTrigger>
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
                            {produto.nome} - R$ {produto.precoVenda}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      step="1"
                      min="1"
                      value={itemTemp.quantidade}
                      onChange={(e) => setItemTemp(prev => ({ ...prev, quantidade: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valorUnitario">Valor unitário (R$)</Label>
                    <Input
                      id="valorUnitario"
                      type="number"
                      step="0.01"
                      value={itemTemp.valorUnitario}
                      onChange={(e) => setItemTemp(prev => ({ ...prev, valorUnitario: e.target.value }))}
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleAddItem}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Adicionar item
                </Button>
              </div>

              {/* Lista de itens */}
              {formData.itens.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium">Produto/Serviço</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Quantidade</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Valor unitário</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                        <th className="px-4 py-3 text-right text-sm font-medium">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {formData.itens.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">{item.nome}</td>
                          <td className="px-4 py-3 text-right">{item.quantidade}</td>
                          <td className="px-4 py-3 text-right">R$ {item.valorUnitario.toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">R$ {(item.quantidade * item.valorUnitario).toFixed(2)}</td>
                          <td className="px-4 py-3 text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-700"
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

              {/* Desconto */}
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Desconto</h3>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Tipo de desconto</Label>
                    <Select
                      value={formData.descontoTipo}
                      onValueChange={(value: "reais" | "percentual") => setFormData(prev => ({ ...prev, descontoTipo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reais">Reais (R$)</SelectItem>
                        <SelectItem value="percentual">Percentual (%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label>Valor do desconto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.descontoValor}
                      onChange={(e) => setFormData(prev => ({ ...prev, descontoValor: e.target.value }))}
                      placeholder="0,00"
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-gray-50 mt-6">
                  <h3 className="font-semibold mb-4">Total da Venda</h3>
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
            </div>
          )}

          {activeTab === "pagamento" && (
            <div className="max-w-5xl space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Informações de Pagamento</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formaPagamento">Forma de pagamento *</Label>
                    <Select
                      value={formData.formaPagamento}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, formaPagamento: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                        <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                        <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="numeroParcelas">Número de parcelas</Label>
                    <Select
                      value={formData.numeroParcelas}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, numeroParcelas: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}x {n > 1 ? `de R$ ${(total / n).toFixed(2)}` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="contaBancaria">Conta de recebimento</Label>
                  <Input
                    id="contaBancaria"
                    value={formData.contaBancariaId}
                    onChange={(e) => setFormData(prev => ({ ...prev, contaBancariaId: e.target.value }))}
                    placeholder="Conta bancária para recebimento"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "fiscal" && (
            <div className="max-w-5xl space-y-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-4">Dados Fiscais</h3>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="emitirNF"
                    checked={formData.emitirNF}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emitirNF: checked as boolean }))}
                  />
                  <Label htmlFor="emitirNF" className="cursor-pointer">
                    Emitir Nota Fiscal eletrônica (NF-e)
                  </Label>
                </div>

                {formData.emitirNF && (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="naturezaOperacao">Natureza da operação</Label>
                      <Select
                        value={formData.naturezaOperacao}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, naturezaOperacao: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="venda">Venda de mercadoria</SelectItem>
                          <SelectItem value="venda_servico">Venda de serviço</SelectItem>
                          <SelectItem value="remessa">Remessa para demonstração</SelectItem>
                          <SelectItem value="devolucao">Devolução de mercadoria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="observacoesNF">Observações complementares da nota fiscal</Label>
                      <Textarea
                        id="observacoesNF"
                        value={formData.observacoesNF}
                        onChange={(e) => setFormData(prev => ({ ...prev, observacoesNF: e.target.value }))}
                        placeholder="Inclua informações relevantes para seu cliente. Elas aparecerão na nota fiscal, nos campos 'Descrição do serviço' ou 'Informações Complementares Contribuinte', visíveis no XML, PDF e DANFE."
                        rows={4}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex items-center justify-between sticky bottom-0">
          <Button type="button" variant="outline" onClick={() => navigate("/vendas")}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Salvando..." : "Salvar Venda"}
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
