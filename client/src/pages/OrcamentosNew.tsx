import { useState } from "react";
import { useLocation } from "wouter";
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
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  MoreVertical,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Edit,
  Mail,
  Copy,
  Trash2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NovoOrcamentoModal from "@/components/NovoOrcamentoModal";
import NovaVendaModal from "@/components/NovaVendaModal";

export default function OrcamentosNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [, setLocation] = useLocation();
  const [showNovaVenda, setShowNovaVenda] = useState(false);
  const [orcamentoParaConverter, setOrcamentoParaConverter] = useState<any>(null);
  const itemsPerPage = 10;

  // Queries
  const { data: orcamentos = [], isLoading } = trpc.orcamentos.list.useQuery();

  // Filtrar orçamentos
  const filteredOrcamentos = orcamentos.filter((orc) => {
    const matchesSearch =
      orc.numero.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "todos" || orc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filteredOrcamentos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrcamentos = filteredOrcamentos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      aprovado: "bg-green-100 text-green-800 border-green-300",
      rejeitado: "bg-red-100 text-red-800 border-red-300",
      expirado: "bg-gray-100 text-gray-800 border-gray-300",
    };

    const icons = {
      pendente: <Clock className="w-3 h-3" />,
      aprovado: <CheckCircle2 className="w-3 h-3" />,
      rejeitado: <XCircle className="w-3 h-3" />,
      expirado: <XCircle className="w-3 h-3" />,
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

  return (
    <>
      <div className="space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie seus orçamentos e propostas comerciais
            </p>
          </div>
          <Button 
          className="bg-blue-600 hover:bg-blue-700 h-9"
          onClick={() => setLocation("/orcamentos/novo")}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Orçamento
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
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="expirado">Expirado</SelectItem>
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
                <p className="text-sm text-gray-500">Total de Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {orcamentos.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {orcamentos.filter((o) => o.status === "pendente").length}
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
                <p className="text-sm text-gray-500">Aprovados</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {orcamentos.filter((o) => o.status === "aprovado").length}
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
                  {orcamentos
                    .reduce((sum, o) => sum + parseFloat(o.valorTotal || "0"), 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
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
                  <TableHead className="font-semibold">Data Emissão</TableHead>
                  <TableHead className="font-semibold">Validade</TableHead>
                  <TableHead className="font-semibold">Vendedor</TableHead>
                  <TableHead className="font-semibold">Valor Total</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-gray-500">Carregando...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedOrcamentos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500">Nenhum orçamento encontrado</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Criar primeiro orçamento
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrcamentos.map((orcamento) => (
                    <TableRow
                      key={orcamento.id}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <TableCell className="font-medium">
                        {orcamento.numero}
                      </TableCell>
                      <TableCell>Cliente #{orcamento.clienteId}</TableCell>
                      <TableCell>
                        {new Date(orcamento.dataEmissao).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        {new Date(orcamento.dataValidade).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="font-semibold">
                        R$ {parseFloat(orcamento.valorTotal || "0").toFixed(2)}
                      </TableCell>
                      <TableCell>{getStatusBadge(orcamento.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info("Editando orçamento...");
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.success("Orçamento enviado por e-mail!");
                              }}
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Enviar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.success("Orçamento clonado!");
                              }}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Clonar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info("Imprimindo orçamento...");
                              }}
                            >
                              <Printer className="w-4 h-4 mr-2" />
                              Imprimir
                            </DropdownMenuItem>
                            {orcamento.status === "aprovado" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setOrcamentoParaConverter(orcamento);
                                    setShowNovaVenda(true);
                                  }}
                                  className="text-green-600"
                                >
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  Criar venda
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm("Tem certeza que deseja excluir este orçamento?")) {
                                  toast.success("Orçamento excluído!");
                                }
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
                {Math.min(startIndex + itemsPerPage, filteredOrcamentos.length)} de{" "}
                {filteredOrcamentos.length} resultados
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>



      {/* Modal Nova Venda (Conversão de Orçamento) */}
      <NovaVendaModal
        open={showNovaVenda}
        onOpenChange={(open) => {
          setShowNovaVenda(open);
          if (!open) setOrcamentoParaConverter(null);
        }}
        orcamentoParaConverter={orcamentoParaConverter}
      />
    </>
  );
}
