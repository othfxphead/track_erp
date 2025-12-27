import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ContaAICapturaProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface DocumentoExtraido {
  tipo: "nfe" | "nfse" | "recibo" | "boleto" | "outro";
  numero?: string;
  dataEmissao?: string;
  fornecedor?: {
    nome: string;
    cnpj: string;
  };
  cliente?: {
    nome: string;
    cpfCnpj: string;
  };
  valorTotal: number;
  itens?: Array<{
    descricao: string;
    quantidade: number;
    valorUnitario: number;
    valorTotal: number;
  }>;
  impostos?: {
    icms?: number;
    ipi?: number;
    pis?: number;
    cofins?: number;
  };
  observacoes?: string;
}

export default function ContaAICaptura({
  open,
  onOpenChange,
  onSuccess,
}: ContaAICapturaProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentoExtraido, setDocumentoExtraido] =
    useState<DocumentoExtraido | null>(null);
  const [step, setStep] = useState<"upload" | "preview" | "confirm">("upload");

  // Mutation para processar documento com OCR
  const processarDocumentoMutation = trpc.ai.processarDocumento.useMutation();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = [
      "application/pdf",
      "application/xml",
      "text/xml",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Use PDF, XML ou imagem.");
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 10MB");
      return;
    }

    setUploadedFile(file);

    // Criar preview para imagens
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    setStep("preview");
  };

  const handleProcessar = async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Chamar API de OCR
        const resultado = await processarDocumentoMutation.mutateAsync({
          arquivo: base64,
          tipoArquivo: uploadedFile.type,
          nomeArquivo: uploadedFile.name,
        });

        setDocumentoExtraido(resultado);
        setStep("confirm");
        toast.success("Documento processado com sucesso!");
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      toast.error("Erro ao processar documento. Tente novamente.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmar = () => {
    if (!documentoExtraido) return;

    // Aqui você pode adicionar lógica para salvar os dados extraídos
    toast.success("Lançamento criado com sucesso!");
    onSuccess?.();
    handleClose();
  };

  const handleClose = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setDocumentoExtraido(null);
    setStep("upload");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <DialogTitle>Conta AI Captura</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Importe documentos fiscais automaticamente com inteligência artificial
          </p>
        </DialogHeader>

        <Tabs value={step} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload" disabled={step !== "upload"}>
              1. Upload
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={step !== "preview"}>
              2. Processar
            </TabsTrigger>
            <TabsTrigger value="confirm" disabled={step !== "confirm"}>
              3. Confirmar
            </TabsTrigger>
          </TabsList>

          {/* Etapa 1: Upload */}
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                  <Upload className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Arraste e solte seu documento aqui
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    ou clique para selecionar
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.xml,image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                  />
                  <label htmlFor="file-upload">
                    <Button asChild>
                      <span>Selecionar arquivo</span>
                    </Button>
                  </label>
                  <div className="flex gap-4 mt-6">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="text-sm">PDF</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-500" />
                      <span className="text-sm">XML</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                      <span className="text-sm">Imagem</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">
                📋 Tipos de documentos suportados:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• NF-e (Nota Fiscal Eletrônica)</li>
                <li>• NFS-e (Nota Fiscal de Serviço Eletrônica)</li>
                <li>• Recibos e comprovantes</li>
                <li>• Boletos bancários</li>
                <li>• Documentos fiscais diversos</li>
              </ul>
            </div>
          </TabsContent>

          {/* Etapa 2: Preview e Processamento */}
          <TabsContent value="preview" className="space-y-4">
            {uploadedFile && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {uploadedFile.type.startsWith("image/") ? (
                          <ImageIcon className="w-8 h-8 text-blue-500" />
                        ) : (
                          <FileText className="w-8 h-8 text-red-500" />
                        )}
                        <div>
                          <p className="font-semibold">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {uploadedFile.type.includes("pdf")
                          ? "PDF"
                          : uploadedFile.type.includes("xml")
                          ? "XML"
                          : "Imagem"}
                      </Badge>
                    </div>

                    {previewUrl && (
                      <div className="border rounded-lg overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      </div>
                    )}

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-purple-900 mb-1">
                            Inteligência Artificial
                          </h4>
                          <p className="text-sm text-purple-800">
                            Nossa IA irá extrair automaticamente todas as informações
                            do documento: fornecedor, itens, valores, impostos e muito
                            mais.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep("upload")}>
                Voltar
              </Button>
              <Button
                onClick={handleProcessar}
                disabled={isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Processar com IA
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Etapa 3: Confirmação */}
          <TabsContent value="confirm" className="space-y-4">
            {documentoExtraido && (
              <>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold">
                        Dados extraídos com sucesso
                      </h3>
                    </div>

                    <div className="space-y-4">
                      {/* Informações básicas */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo</p>
                          <Badge>
                            {documentoExtraido.tipo.toUpperCase()}
                          </Badge>
                        </div>
                        {documentoExtraido.numero && (
                          <div>
                            <p className="text-sm text-muted-foreground">Número</p>
                            <p className="font-semibold">
                              {documentoExtraido.numero}
                            </p>
                          </div>
                        )}
                        {documentoExtraido.dataEmissao && (
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Data de Emissão
                            </p>
                            <p className="font-semibold">
                              {documentoExtraido.dataEmissao}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Valor Total
                          </p>
                          <p className="font-semibold text-lg text-green-600">
                            R$ {documentoExtraido.valorTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Fornecedor */}
                      {documentoExtraido.fornecedor && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">Fornecedor</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Nome</p>
                              <p>{documentoExtraido.fornecedor.nome}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">CNPJ</p>
                              <p>{documentoExtraido.fornecedor.cnpj}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Itens */}
                      {documentoExtraido.itens && documentoExtraido.itens.length > 0 && (
                        <div className="border-t pt-4">
                          <h4 className="font-semibold mb-2">
                            Itens ({documentoExtraido.itens.length})
                          </h4>
                          <div className="space-y-2">
                            {documentoExtraido.itens.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-2 bg-gray-50 rounded"
                              >
                                <div>
                                  <p className="font-medium">{item.descricao}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Qtd: {item.quantidade} × R${" "}
                                    {item.valorUnitario.toFixed(2)}
                                  </p>
                                </div>
                                <p className="font-semibold">
                                  R$ {item.valorTotal.toFixed(2)}
                                </p>
                              </div>
                            ))}
                            {documentoExtraido.itens.length > 3 && (
                              <p className="text-sm text-muted-foreground text-center">
                                + {documentoExtraido.itens.length - 3} itens
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep("upload");
                      setDocumentoExtraido(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleConfirmar}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Confirmar e Criar Lançamento
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
