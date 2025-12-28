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

interface NovoOrcamentoModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function NovoOrcamentoModal({
  open,
  onOpenChange,
  onClose,
  onSuccess,
}: NovoOrcamentoModalProps) {
  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };
  const [activeTab, setActiveTab] = useState("informacoes");
  const [tipoVenda, setTipoVenda] = useState("orcamento");
  
  const [formData, setFormData] = useState({
    situacaoNegociacao: "em_negociacao",
    numeroOrcamento: "",
    clienteId: "",
    dataOrcamento: new Date().toISOString().split("T")[0],
    validadeOrcamento: "",
    descricao: "",
    itens: [] as Array<{ produtoId: number; quantidade: number; valorUnitario: number; nome?: string }>,
    descontoTipo: "reais" as "reais" | "percentual",
    descontoValor: "0",
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
      toast.success("Orçamento criado!");
      if (onSuccess) onSuccess();
      handleClose();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
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
    const { subtotal, desconto, total } = calcularTotais();
    createMutation.mutate({
      clienteId: parseInt(formData.clienteId),
      dataValidade: new Date(formData.validadeOrcamento),
      valorTotal: total.toFixed(2),
      desconto: desconto.toFixed(2),
      observacoes: formData.descricao,
      itens: formData.itens,
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
    <div 
      className="fixed inset-0 z-[9999] bg-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <div className="border-b bg-white px-6 py-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Novo orçamento {formData.numeroOrcamento}</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b bg-gray-50">
        <div className="px-6 flex gap-8">
          {["informacoes", "itens", "valor"].map(tab => (
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
              {/* Tipo da venda */}
              <div>
                <Label className="mb-3 block text-sm font-medium text-gray-700">Tipo da venda</Label>
                <div className="flex gap-3">
                  {[
                    { value: "orcamento", label: "Orçamento" },
                    { value: "venda_avulsa", label: "Venda avulsa" },
                    { value: "venda_recorrente", label: "Venda recorrente/contrato" }
                  ].map(tipo => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => setTipoVenda(tipo.value)}
                      className={`px-6 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        tipoVenda === tipo.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {tipo.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de campos */}
              <div className="grid grid-cols-3 gap-6">
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
                    Data do orçamento <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.dataOrcamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, dataOrcamento: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Validade <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.validadeOrcamento}
                    onChange={(e) => setFormData(prev => ({ ...prev, validadeOrcamento: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
                  className="mt-1.5 resize-none"
                  placeholder="Faça uma breve descrição sobre a sua empresa e os produtos que você vende."
                />
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

              {/* Total do Orçamento */}
              <div className="bg-gray-50 border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Total do Orçamento</h3>
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
        </div>

        {/* Footer */}
        <div className="border-t bg-white px-6 py-4 flex items-center justify-between">
          <Button type="button" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-8"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Salvando..." : "Salvar Orçamento"}
          </Button>
        </div>
      </form>
    </div>,
    document.body
  );
}
