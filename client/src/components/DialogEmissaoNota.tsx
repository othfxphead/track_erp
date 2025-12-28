import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, AlertTriangle, FileText, Download } from "lucide-react";

interface DialogEmissaoNotaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendaId: number;
  tipoNota: "nfe" | "nfse";
  onSuccess?: () => void;
}

type EstadoEmissao = "pendente" | "emitindo" | "emitida" | "erro" | "contingencia";

export function DialogEmissaoNota({
  open,
  onOpenChange,
  vendaId,
  tipoNota,
  onSuccess,
}: DialogEmissaoNotaProps) {
  const [estado, setEstado] = useState<EstadoEmissao>("pendente");
  const [observacoes, setObservacoes] = useState("");
  const [mensagemErro, setMensagemErro] = useState("");
  const [dadosNota, setDadosNota] = useState<{
    numero?: string;
    chaveAcesso?: string;
    referencia?: string;
  }>({});

  const emitirNFeMutation = trpc.fiscal.emitirNFe.useMutation({
    onSuccess: (data) => {
      setEstado("emitida");
      setDadosNota({
        numero: data.numero,
        chaveAcesso: data.chaveAcesso,
        referencia: data.referencia,
      });
      toast.success("Nota fiscal emitida com sucesso!");
      onSuccess?.();
    },
    onError: (error: any) => {
      setEstado("erro");
      setMensagemErro(error.message || "Erro ao emitir nota fiscal");
      toast.error("Erro ao emitir nota fiscal");
    },
  });

  const baixarXMLMutation = trpc.fiscal.downloadXML.useMutation({
    onSuccess: (data) => {
      // Criar link para download
      const blob = new Blob([Buffer.from(data.xml, "base64")], {
        type: "application/xml",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NFe-${dadosNota.numero}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("XML baixado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao baixar XML");
    },
  });

  const baixarPDFMutation = trpc.fiscal.downloadPDF.useMutation({
    onSuccess: (data) => {
      // Criar link para download
      const blob = new Blob([Buffer.from(data.pdf, "base64")], {
        type: "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `NFe-${dadosNota.numero}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("PDF baixado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao baixar PDF");
    },
  });

  const handleEmitir = () => {
    setEstado("emitindo");
    emitirNFeMutation.mutate({ vendaId });
  };

  const handleBaixarXML = () => {
    if (dadosNota.referencia) {
      baixarXMLMutation.mutate({ referencia: dadosNota.referencia });
    }
  };

  const handleBaixarPDF = () => {
    if (dadosNota.referencia) {
      baixarPDFMutation.mutate({ referencia: dadosNota.referencia });
    }
  };

  const handleFechar = () => {
    setEstado("pendente");
    setObservacoes("");
    setMensagemErro("");
    setDadosNota({});
    onOpenChange(false);
  };

  const renderConteudo = () => {
    switch (estado) {
      case "pendente":
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Confirme os dados antes de emitir
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Após a emissão, a nota será enviada para a SEFAZ e não poderá ser
                    alterada. Certifique-se de que todos os dados da venda estão corretos.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informações adicionais para a nota fiscal..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleFechar}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleEmitir}
              >
                <FileText className="h-4 w-4 mr-2" />
                Confirmar e Emitir {tipoNota === "nfe" ? "NF-e" : "NFS-e"}
              </Button>
            </div>
          </div>
        );

      case "emitindo":
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Emitindo nota fiscal...
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Aguarde enquanto processamos a emissão da nota fiscal junto à SEFAZ.
              Isso pode levar alguns segundos.
            </p>
          </div>
        );

      case "emitida":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nota fiscal emitida com sucesso!
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                A nota foi autorizada pela SEFAZ e está disponível para download.
              </p>
            </div>

            {dadosNota.numero && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Número:</span>
                  <span className="font-medium">{dadosNota.numero}</span>
                </div>
                {dadosNota.chaveAcesso && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Chave de Acesso:</span>
                    <span className="font-mono text-xs">{dadosNota.chaveAcesso}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBaixarXML}
                disabled={baixarXMLMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                {baixarXMLMutation.isPending ? "Baixando..." : "Baixar XML"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleBaixarPDF}
                disabled={baixarPDFMutation.isPending}
              >
                <Download className="h-4 w-4 mr-2" />
                {baixarPDFMutation.isPending ? "Baixando..." : "Baixar PDF"}
              </Button>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleFechar}
              >
                Concluir
              </Button>
            </div>
          </div>
        );

      case "erro":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Erro ao emitir nota fiscal
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Ocorreu um erro durante a emissão da nota fiscal.
              </p>
            </div>

            {mensagemErro && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">{mensagemErro}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleFechar}
              >
                Fechar
              </Button>
              <Button
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  setEstado("pendente");
                  setMensagemErro("");
                }}
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        );

      case "contingencia":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <AlertTriangle className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Emissão em contingência
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                A SEFAZ está indisponível. A nota será emitida em modo de contingência.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                A nota será transmitida automaticamente quando a SEFAZ voltar a funcionar.
                Você pode imprimir o DANFE e realizar a operação normalmente.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleFechar}
              >
                Entendi
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {estado === "pendente" && `Emitir ${tipoNota === "nfe" ? "NF-e" : "NFS-e"}`}
            {estado === "emitindo" && "Processando..."}
            {estado === "emitida" && "Nota Emitida"}
            {estado === "erro" && "Erro na Emissão"}
            {estado === "contingencia" && "Modo Contingência"}
          </DialogTitle>
          {estado === "pendente" && (
            <DialogDescription>
              Revise os dados e confirme a emissão da nota fiscal eletrônica.
            </DialogDescription>
          )}
        </DialogHeader>
        {renderConteudo()}
      </DialogContent>
    </Dialog>
  );
}
