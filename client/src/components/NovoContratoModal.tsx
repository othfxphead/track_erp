import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface NovoContratoModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function NovoContratoModal({
  open,
  onOpenChange,
  onClose,
  onSuccess,
}: NovoContratoModalProps) {
  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };
  
  const [activeTab, setActiveTab] = useState("informacoes");
  
  const [formData, setFormData] = useState({
    situacaoNegociacao: "ativo",
    numeroContrato: "",
    clienteId: "",
    dataInicio: new Date().toISOString().split("T")[0],
    dataTermino: "",
    periodicidade: "mensal",
    diaVencimento: "1",
    categoriaFinanceira: "",
    centroCusto: "",
    vendedorResponsavel: "",
    itens: [] as Array<{ produtoId: number; quantidade: number; valorUnitario: number; nome?: string }>,
    descontoTipo: "reais" as "reais" | "percentual",
    descontoValor: "0",
    formaPagamento: "",
    contaRecebimento: "",
    observacoesContrato: "",
    naturezaOperacao: "",
    observacoesComplementares: "",
  });

  const [itemTemp, setItemTemp] = useState({
    produtoId: "",
    quantidade: "1",
    valorUnitario: "0",
  });

  const { data: clientes } = trpc.clientes.list.useQuery();
  const { data: produtos } = trpc.produtos.list.useQuery();
  
  // TODO: Implementar mutation de contratos no backend
  const createMutation = {
    mutate: (data: any) => {
      console.log("Criar contrato:", data);
      toast.success("Contrato criado com sucesso!");
      if (onSuccess) onSuccess();
      handleClose();
    },
    isPending: false,
  };

  const handleAddItem = () => {
    if (!itemTemp.produtoId) {
      toast.error("Selecione um produto/serviço");
      return;
    }
    const produto = produtos?.find(p => p.id === parseInt(itemTemp.produtoId));
    if (!produto) return;
    
    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, {
        produtoId: parseInt(itemTemp.produtoId),
        quantidade: parseFloat(itemTemp.quantidade),
        valorUnitario: parseFloat(itemTemp.valorUnitario) || parseFloat(produto.precoVenda),
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
    const { total, desconto } = calcularTotais();
    createMutation.mutate({
      numero: formData.numeroContrato || `CTR-${Date.now()}`,
      clienteId: parseInt(formData.clienteId),
      dataInicio: new Date(formData.dataInicio),
      dataTermino: formData.dataTermino ? new Date(formData.dataTermino) : undefined,
      periodicidade: formData.periodicidade,
      diaVencimento: parseInt(formData.diaVencimento),
      valorTotal: total.toFixed(2),
      desconto: desconto.toFixed(2),
      observacoes: formData.observacoesContrato,
      itens: JSON.stringify(formData.itens),
    });
  };

  const { subtotal, desconto, total } = calcularTotais();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Novo contrato {formData.numeroContrato}</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b bg-gray-50">
        <div className="px-6 flex gap-8">
          {["informacoes", "itens", "valor", "info_pagamento", "obs_contrato", "fiscal", "obs_complementares"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "informacoes" && "Informações"}
              {tab === "itens" && "Itens"}
              {tab === "valor" && "Valor"}
              {tab === "info_pagamento" && "Informações de pagamento"}
              {tab === "obs_contrato" && "Observações do contrato"}
              {tab === "fiscal" && "Informações fiscais"}
              {tab === "obs_complementares" && "Observações complementares"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit} className="flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Aba Informações */}
          {activeTab === "informacoes" && (
            <div className="max-w-6xl space-y-6">
              {/* Situação */}
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Situação <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.situacaoNegociacao}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, situacaoNegociacao: value }))}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Grid de campos */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Número do contrato <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.numeroContrato}
                    onChange={(e) => setFormData(prev => ({ ...prev, numeroContrato: e.target.value }))}
                    placeholder="Gerado automaticamente"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Cliente <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.clienteId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, clienteId: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes?.map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Data de início <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Periodicidade e vencimento */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Data de término</Label>
                  <Input
                    type="date"
                    value={formData.dataTermino}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataTermino: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Periodicidade <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.periodicidade}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, periodicidade: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                      <SelectItem value="semestral">Semestral</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Dia do vencimento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.diaVencimento}
                    onChange={(e) => setFormData(prev => ({ ...prev, diaVencimento: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Categoria financeira e centro de custo */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Categoria financeira</Label>
                  <Select
                    value={formData.categoriaFinanceira}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoriaFinanceira: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receitas_servicos">Receitas de Serviços</SelectItem>
                      <SelectItem value="receitas_produtos">Receitas de Produtos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Centro de custo</Label>
                  <Select
                    value={formData.centroCusto}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, centroCusto: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="002_oficina">002 - OFICINA</SelectItem>
                      <SelectItem value="001_administrativo">001 - ADMINISTRATIVO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Vendedor responsável</Label>
                  <Select
                    value={formData.vendedorResponsavel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vendedorResponsavel: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thiago">Thiago Figueredo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Aba Itens */}
          {activeTab === "itens" && (
            <div className="max-w-6xl space-y-6">
              {/* Adicionar item */}
              <div className="flex gap-3">
                <Select
                  value={itemTemp.produtoId}
                  onValueChange={(value) => {
                    const produto = produtos?.find(p => p.id === parseInt(value));
                    setItemTemp({
                      produtoId: value,
                      quantidade: "1",
                      valorUnitario: produto?.precoVenda || "0",
                    });
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um produto ou serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos?.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.nome} - R$ {parseFloat(p.precoVenda).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Qtd"
                  value={itemTemp.quantidade}
                  onChange={(e) => setItemTemp(prev => ({ ...prev, quantidade: e.target.value }))}
                  className="w-24"
                />
                <Button type="button" onClick={handleAddItem} className="bg-blue-600 hover:bg-blue-700">
                  Adicionar
                </Button>
              </div>

              {/* Lista de itens */}
              {formData.itens.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase">Item</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Quantidade</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Valor Unitário</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {formData.itens.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.nome}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantidade}</td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">R$ {item.valorUnitario.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                            R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Aba Valor */}
          {activeTab === "valor" && (
            <div className="max-w-6xl space-y-6">
              {/* Desconto */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Desconto</Label>
                <div className="flex gap-3 items-start">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, descontoTipo: "reais" }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                        formData.descontoTipo === "reais"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      R$
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, descontoTipo: "percentual" }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium ${
                        formData.descontoTipo === "percentual"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      %
                    </button>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.descontoValor}
                    onChange={(e) => setFormData(prev => ({ ...prev, descontoValor: e.target.value }))}
                    placeholder="0,00"
                    className="w-40"
                  />
                </div>
              </div>

              {/* Total do Contrato */}
              <div className="bg-gray-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Total do Contrato ({formData.periodicidade})</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Itens (R$)</span>
                    <span className="font-medium text-gray-900">{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Desconto (R$)</span>
                    <span className="font-medium text-red-600">{desconto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-base font-semibold text-gray-900">Total líquido (R$)</span>
                    <span className="text-xl font-bold text-gray-900">{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Aba Informações de Pagamento */}
          {activeTab === "info_pagamento" && (
            <div className="max-w-6xl space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Forma de pagamento</Label>
                  <Select
                    value={formData.formaPagamento}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, formaPagamento: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Conta de recebimento</Label>
                  <Select
                    value={formData.contaRecebimento}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, contaRecebimento: value }))}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="caixa">Caixa</SelectItem>
                      <SelectItem value="banco">Banco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Aba Observações do Contrato */}
          {activeTab === "obs_contrato" && (
            <div className="max-w-6xl">
              <Label className="text-sm font-medium text-gray-700">Observações</Label>
              <Textarea
                value={formData.observacoesContrato}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoesContrato: e.target.value }))}
                rows={6}
                className="mt-1.5 resize-none"
              />
            </div>
          )}

          {/* Aba Informações Fiscais */}
          {activeTab === "fiscal" && (
            <div className="max-w-6xl">
              <Label className="text-sm font-medium text-gray-700">
                Natureza de operação <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.naturezaOperacao}
                onValueChange={(value) => setFormData(prev => ({ ...prev, naturezaOperacao: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda de mercadoria</SelectItem>
                  <SelectItem value="servico">Prestação de serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Aba Observações Complementares */}
          {activeTab === "obs_complementares" && (
            <div className="max-w-6xl">
              <Label className="text-sm font-medium text-gray-700">Observações</Label>
              <Textarea
                value={formData.observacoesComplementares}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoesComplementares: e.target.value }))}
                rows={6}
                className="mt-1.5 resize-none"
                placeholder="Inclua informações relevantes para seu cliente. Elas aparecerão na nota fiscal, nos campos 'Descrição do serviço' ou 'Informações Complementares Contribuinte', visíveis no XML, PDF e DANFE."
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Salvando..." : "Salvar Contrato"}
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
}
