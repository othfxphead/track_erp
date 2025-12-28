import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  MoreVertical,
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export default function VendasNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVenda, setSelectedVenda] = useState<any>(null);
  const [, setLocation] = useState("");
  const navigate = (path: string) => window.location.href = path;
  const [showEmitirNFS, setShowEmitirNFS] = useState(false);
  const itemsPerPage = 10;

  // Queries
  const { data: vendas = [], isLoading } = trpc.vendas.list.useQuery();

  // Filtrar vendas
  const filteredVendas = vendas.filter((venda) => {
    const matchesSearch = venda.numero
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || venda.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filteredVendas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendas = filteredVendas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmada: "bg-blue-100 text-blue-800 border-blue-300",
      faturada: "bg-green-100 text-green-800 border-green-300",
      cancelada: "bg-red-100 text-red-800 border-red-300",
    };

    const icons = {
      pendente: <Clock className="w-3 h-3" />,
      confirmada: <Clock className="w-3 h-3" />,
      faturada: <CheckCircle2 className="w-3 h-3" />,
      cancelada: <XCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles] || styles.pendente
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleEmitirNFS = (venda: any) => {
    setSelectedVenda(venda);
    setShowEmitirNFS(true);
  };

  const handleConfirmarEmissao = () => {
    toast.success("NFS emitida com sucesso!");
    setShowEmitirNFS(false);
    setSelectedVenda(null);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie suas vendas e pedidos
          </p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 h-9 px-4"
          onClick={() => navigate("/vendas/nova")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Venda
        </Button>
      </div>

      {/* Barra de ações */}
      <Card className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Pesquisa */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Pesquisar por número, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          {/* Filtro de status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmada">Confirmada</SelectItem>
              <SelectItem value="faturada">Faturada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>

          {/* Botões de ação */}
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </Card>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {vendas.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {vendas.filter((v) => v.status === "pendente").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Faturadas</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {vendas.filter((v) => v.status === "faturada").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Valor Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                R${" "}
                {vendas
                  .reduce((sum, v) => sum + parseFloat(v.valorTotal || "0"), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Número</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Data</TableHead>
                <TableHead className="font-semibold">Valor Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">NF</TableHead>
                <TableHead className="font-semibold text-right">
                  Ações
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span className="text-gray-500">Carregando...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedVendas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <ShoppingCart className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">Nenhuma venda encontrada</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar primeira venda
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedVendas.map((venda) => (
                  <TableRow
                    key={venda.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell className="font-medium">{venda.numero}</TableCell>
                    <TableCell>Cliente #{venda.clienteId}</TableCell>
                    <TableCell>
                      {new Date(venda.dataVenda).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="font-semibold">
                      R$ {parseFloat(venda.valorTotal || "0").toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(venda.status)}</TableCell>
                    <TableCell>
                      {venda.status === "faturada" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleEmitirNFS(venda)}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Emitir NFS
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <p className="text-sm text-gray-500">
              Mostrando {startIndex + 1} a{" "}
              {Math.min(startIndex + itemsPerPage, filteredVendas.length)} de{" "}
              {filteredVendas.length} resultados
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Modal Emitir NFS */}
      <Dialog open={showEmitirNFS} onOpenChange={setShowEmitirNFS}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Emitir Nota Fiscal de Serviço
            </DialogTitle>
          </DialogHeader>

          {selectedVenda && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-sm mb-3">
                  Dados da Venda
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Número:</span>
                    <p className="font-medium">{selectedVenda.numero}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Cliente:</span>
                    <p className="font-medium">
                      Cliente #{selectedVenda.clienteId}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Data:</span>
                    <p className="font-medium">
                      {new Date(selectedVenda.dataVenda).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Valor Total:</span>
                    <p className="font-medium text-green-600">
                      R${" "}
                      {parseFloat(selectedVenda.valorTotal || "0").toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">
                      Emissão de NFS-e
                    </h4>
                    <p className="text-sm text-blue-800">
                      A nota fiscal será emitida automaticamente através da
                      integração com a Focus API. Você receberá o XML e PDF por
                      e-mail após a emissão.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Observações (opcional)
                </label>
                <Input
                  placeholder="Adicione observações para a nota fiscal..."
                  className="h-9"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              onClick={() => setShowEmitirNFS(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirmarEmissao}
            >
              <Send className="w-4 h-4 mr-2" />
              Confirmar Emissão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
