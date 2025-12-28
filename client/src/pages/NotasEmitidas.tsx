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
  Search,
  FileText,
  Download,
  XCircle,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { ActionButton, ActionIcons } from "@/components/ActionButton";

export default function NotasEmitidas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelarDialog, setShowCancelarDialog] = useState(false);
  const [notaToCancel, setNotaToCancel] = useState<any>(null);
  const [justificativa, setJustificativa] = useState("");
  const itemsPerPage = 10;

  // Queries
  const { data: notas = [], isLoading } = trpc.fiscal.notas.useQuery();

  // Mutations
  const cancelarNotaMutation = trpc.fiscal.cancelarNFe.useMutation({
    onSuccess: () => {
      toast.success("NF-e cancelada com sucesso!");
      setShowCancelarDialog(false);
      setJustificativa("");
      setNotaToCancel(null);
    },
    onError: (error) => {
      toast.error(`Erro ao cancelar NF-e: ${error.message}`);
    },
  });

  const downloadXMLMutation = trpc.fiscal.downloadXML.useMutation({
    onSuccess: (data) => {
      // Criar link de download
      const blob = new Blob([data.xml], { type: "application/xml" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NFe-${data.numero}.xml`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("XML baixado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao baixar XML: ${error.message}`);
    },
  });

  const downloadPDFMutation = trpc.fiscal.downloadPDF.useMutation({
    onSuccess: (data) => {
      // Criar link de download
      const blob = new Blob([data.pdf], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NFe-${data.numero}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF baixado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao baixar PDF: ${error.message}`);
    },
  });

  // Filtrar notas
  const filteredNotas = notas.filter((nota) => {
    const matchesSearch =
      nota.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nota.chaveAcesso?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || nota.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginação
  const totalPages = Math.ceil(filteredNotas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotas = filteredNotas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: "bg-yellow-100 text-yellow-800 border-yellow-300",
      emitida: "bg-green-100 text-green-800 border-green-300",
      cancelada: "bg-red-100 text-red-800 border-red-300",
      erro: "bg-red-100 text-red-800 border-red-300",
    };

    const icons = {
      pendente: <Clock className="w-3 h-3" />,
      emitida: <CheckCircle2 className="w-3 h-3" />,
      cancelada: <XCircle className="w-3 h-3" />,
      erro: <AlertCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-[5px] h-[22px] rounded-sm text-xs font-medium border ${
          styles[status as keyof typeof styles] || styles.pendente
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCancelarNota = (nota: any) => {
    setNotaToCancel(nota);
    setShowCancelarDialog(true);
  };

  const confirmCancelar = () => {
    if (!justificativa || justificativa.length < 15) {
      toast.error("A justificativa deve ter no mínimo 15 caracteres");
      return;
    }

    if (notaToCancel && notaToCancel.focusApiReferencia) {
      cancelarNotaMutation.mutate({
        referencia: notaToCancel.focusApiReferencia,
        justificativa,
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notas Fiscais Emitidas</h1>
        <p className="text-muted-foreground mt-1">
          Consulte, visualize e gerencie suas notas fiscais
        </p>
      </div>

      <Card>
        {/* Filtros */}
        <div className="p-4 border-b flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por número ou chave de acesso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="emitida">Emitida</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
              <SelectItem value="erro">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Número</TableHead>
                <TableHead className="font-semibold">Série</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Data Emissão</TableHead>
                <TableHead className="font-semibold">Valor</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
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
              ) : paginatedNotas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <FileText className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">
                        Nenhuma nota fiscal encontrada
                      </p>
                      <p className="text-sm text-gray-400">
                        As notas emitidas aparecerão aqui
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNotas.map((nota) => (
                  <TableRow
                    key={nota.id}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell className="font-medium">{nota.numero || "-"}</TableCell>
                    <TableCell>{nota.serie || "-"}</TableCell>
                    <TableCell className="capitalize">{nota.tipo}</TableCell>
                    <TableCell>
                      {nota.dataEmissao
                        ? new Date(nota.dataEmissao).toLocaleDateString("pt-BR")
                        : "-"}
                    </TableCell>
                    <TableCell className="font-semibold">
                      R$ {parseFloat(nota.valorTotal || "0").toFixed(2)}
                    </TableCell>
                    <TableCell>{getStatusBadge(nota.status)}</TableCell>
                    <TableCell className="text-right">
                      <ActionButton
                        actions={[
                          {
                            label: "Visualizar XML",
                            icon: ActionIcons.View,
                            onClick: () => {
                              if (nota.xmlUrl) {
                                window.open(nota.xmlUrl, "_blank");
                              } else {
                                toast.error("XML não disponível");
                              }
                            },
                          },
                          {
                            label: "Download XML",
                            icon: ActionIcons.Download,
                            onClick: () => {
                              if (nota.focusApiReferencia) {
                                downloadXMLMutation.mutate({
                                  referencia: nota.focusApiReferencia,
                                });
                              } else {
                                toast.error("Referência não disponível");
                              }
                            },
                          },
                          {
                            label: "Download PDF",
                            icon: ActionIcons.Download,
                            onClick: () => {
                              if (nota.focusApiReferencia) {
                                downloadPDFMutation.mutate({
                                  referencia: nota.focusApiReferencia,
                                });
                              } else {
                                toast.error("Referência não disponível");
                              }
                            },
                          },
                          ...(nota.status === "emitida"
                            ? [
                                {
                                  label: "Cancelar NF-e",
                                  icon: ActionIcons.Delete,
                                  onClick: () => handleCancelarNota(nota),
                                  variant: "destructive" as const,
                                  separator: true,
                                },
                              ]
                            : []),
                        ]}
                      />
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
              {Math.min(startIndex + itemsPerPage, filteredNotas.length)} de{" "}
              {filteredNotas.length} resultados
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

      {/* Dialog Cancelar Nota */}
      <Dialog open={showCancelarDialog} onOpenChange={setShowCancelarDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancelar NF-e</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Você está prestes a cancelar a NF-e <strong>{notaToCancel?.numero}</strong>.
              Esta ação não pode ser desfeita.
            </p>
            <div>
              <label className="text-sm font-medium">
                Justificativa <span className="text-red-500">*</span>
              </label>
              <textarea
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Digite a justificativa do cancelamento (mínimo 15 caracteres)"
                className="w-full mt-1 p-2 border rounded-md text-sm"
                rows={4}
                minLength={15}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {justificativa.length}/15 caracteres mínimos
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelarDialog(false);
                setJustificativa("");
                setNotaToCancel(null);
              }}
              disabled={cancelarNotaMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelar}
              disabled={
                cancelarNotaMutation.isPending ||
                !justificativa ||
                justificativa.length < 15
              }
            >
              {cancelarNotaMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Cancelando...
                </>
              ) : (
                "Confirmar Cancelamento"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
