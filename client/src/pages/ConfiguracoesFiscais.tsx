import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileText, Package, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

export default function ConfiguracoesFiscais() {
  const [activeTab, setActiveTab] = useState<"nfse" | "nfe" | "nfce">("nfse");
  
  // Estados para NFS-e
  const [nfseAtivo, setNfseAtivo] = useState(false);
  const [nfseInscricaoMunicipal, setNfseInscricaoMunicipal] = useState("");
  const [nfseUltimoRps, setNfseUltimoRps] = useState("51");
  const [nfseSerieRps, setNfseSerieRps] = useState("900");
  const [nfseRegimeTributario, setNfseRegimeTributario] = useState("mei");
  const [nfseNaturezaOperacao, setNfseNaturezaOperacao] = useState("Tributação no município");
  
  // Estados para NF-e
  const [nfeAtivo, setNfeAtivo] = useState(false);
  const [nfeInscricaoEstadual, setNfeInscricaoEstadual] = useState("");
  const [nfeSerie, setNfeSerie] = useState("1");
  const [nfeUltimoNumero, setNfeUltimoNumero] = useState("0");
  const [nfeExcluirIcmsBaseCalculo, setNfeExcluirIcmsBaseCalculo] = useState(false);
  
  // Estados para NFC-e
  const [nfceAtivo, setNfceAtivo] = useState(false);
  const [nfceIdCsc, setNfceIdCsc] = useState("");
  const [nfceCodigoCsc, setNfceCodigoCsc] = useState("");
  const [certificadoSenha, setCertificadoSenha] = useState("");
  const [showCertificadoDialog, setShowCertificadoDialog] = useState(false);

  const { data: config, isLoading } = trpc.configFiscais.get.useQuery();
  const { data: empresa } = trpc.empresa.get.useQuery();
  
  const uploadCertificadoMutation = trpc.empresa.uploadCertificado.useMutation({
    onSuccess: () => {
      toast.success("Certificado digital enviado com sucesso!");
      setShowCertificadoDialog(false);
      setCertificadoSenha("");
    },
    onError: (error) => {
      toast.error(`Erro ao enviar certificado: ${error.message}`);
    },
  });
  
  const handleCertificadoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith(".pfx") && !file.name.endsWith(".p12")) {
      toast.error("Formato inválido. Envie um arquivo .pfx ou .p12");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Tamanho máximo: 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      uploadCertificadoMutation.mutate({
        base64,
        fileName: file.name,
        senha: certificadoSenha,
      });
    };
    reader.readAsDataURL(file);
  };
  const upsertMutation = trpc.configFiscais.upsert.useMutation({
    onSuccess: () => {
      toast.success("Configurações fiscais salvas com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao salvar configurações: " + error.message);
    },
  });

  // Carregar dados existentes
  useEffect(() => {
    if (config) {
      setNfseAtivo(config.nfseAtivo || false);
      setNfseInscricaoMunicipal(config.nfseInscricaoMunicipal || "");
      setNfseUltimoRps(config.nfseUltimoRps || "51");
      setNfseSerieRps(config.nfseSerieRps || "900");
      setNfseRegimeTributario(config.nfseRegimeTributario || "mei");
      setNfseNaturezaOperacao(config.nfseNaturezaOperacao || "Tributação no município");
      setNfeAtivo(config.nfeAtivo || false);
      setNfeInscricaoEstadual(config.nfeInscricaoEstadual || "");
      setNfeSerie(config.nfeSerie || "1");
      setNfeUltimoNumero(config.nfeUltimoNumero || "0");
      setNfeExcluirIcmsBaseCalculo(config.nfeExcluirIcmsBaseCalculo || false);
      setNfceAtivo(config.nfceAtivo || false);
      setNfceIdCsc(config.nfceIdCsc || "");
      setNfceCodigoCsc(config.nfceCodigoCsc || "");
    }
  }, [config]);

  const handleSave = () => {
    upsertMutation.mutate({
      nfseAtivo,
      nfseInscricaoMunicipal,
      nfseUltimoRps,
      nfseSerieRps,
      nfseRegimeTributario,
      nfseNaturezaOperacao,
      nfeAtivo,
      nfeInscricaoEstadual,
      nfeSerie,
      nfeUltimoNumero,
      nfeExcluirIcmsBaseCalculo,
      nfceAtivo,
      nfceIdCsc,
      nfceCodigoCsc,
    });
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Configurações Fiscais</h1>
        <p className="text-muted-foreground mt-1">
          Configure a emissão de notas fiscais (NFS-e, NF-e, NFC-e)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("nfse")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "nfse"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-4 h-4" />
          Nota fiscal de serviço (NFS-e)
        </button>
        <button
          onClick={() => setActiveTab("nfe")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "nfe"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="w-4 h-4" />
          Nota fiscal de produto (NF-e)
        </button>
        <button
          onClick={() => setActiveTab("nfce")}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === "nfce"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Nota fiscal de consumidor (NFC-e)
        </button>
      </div>

      {/* Conteúdo das Abas */}
      {activeTab === "nfse" && (
        <div className="space-y-6">
          {/* Status de Emissão */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Emissão de NFS-e</h3>
                <p className="text-sm text-muted-foreground">
                  Configure a emissão de notas fiscais de serviço
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-[5px] h-[22px] rounded-sm text-xs font-medium flex items-center ${
                    nfseAtivo
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {nfseAtivo ? "Configurado" : "Não configurado"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[22px] px-[5px] text-xs"
                  onClick={() => setNfseAtivo(!nfseAtivo)}
                >
                  {nfseAtivo ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Certificado Digital */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Configuração do Certificado Digital</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Para emitir NFS-e pela Conta Azul para a sua cidade é obrigatório importar um Certificado Digital.
              Sem um certificado digital não será possível integrar com a sua Prefeitura.
            </p>
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Importar certificado digital (Modelo A1 e-CNPJ)</p>
                  <p className="text-sm text-muted-foreground">e-CNPJ</p>
                </div>
                <div className="flex items-center gap-3">
                  {empresa?.certificadoDigitalUrl ? (
                    <span className="px-[5px] h-[22px] rounded-sm text-xs font-medium flex items-center bg-green-100 text-green-700">
                      Válido
                    </span>
                  ) : (
                    <span className="px-[5px] h-[22px] rounded-sm text-xs font-medium flex items-center bg-yellow-100 text-yellow-700">
                      Não configurado
                    </span>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-[22px] px-[5px] text-xs"
                    onClick={() => setShowCertificadoDialog(true)}
                  >
                    {empresa?.certificadoDigitalUrl ? "Atualizar" : "Configurar"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Informações para emissão */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informações para emissão da NFS-e</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Utilizaremos estas informações para comunicação com a prefeitura da sua cidade, e assim, emitir sua nota fiscal.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="inscricaoMunicipal">
                  Inscrição Municipal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inscricaoMunicipal"
                  value={nfseInscricaoMunicipal}
                  onChange={(e) => setNfseInscricaoMunicipal(e.target.value)}
                  placeholder="891158"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ultimoRps">
                  Último RPS/DPS <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ultimoRps"
                  value={nfseUltimoRps}
                  onChange={(e) => setNfseUltimoRps(e.target.value)}
                  placeholder="51"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="serieRps">
                  Série do RPS/DPS <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serieRps"
                  value={nfseSerieRps}
                  onChange={(e) => setNfseSerieRps(e.target.value)}
                  placeholder="900"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Informe a série entre 0 e 889
                </p>
              </div>

              <div>
                <Label htmlFor="emitirPadraoNacional">Emitir NFS-e no Padrão Nacional</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox id="emitirPadraoNacional" />
                  <span className="text-sm text-muted-foreground">Sim</span>
                </div>
              </div>

              <div>
                <Label htmlFor="regimeTributario">
                  Regime especial de tributação <span className="text-red-500">*</span>
                </Label>
                <Select value={nfseRegimeTributario} onValueChange={setNfseRegimeTributario}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mei">Micro-empresário Individual (MEI)</SelectItem>
                    <SelectItem value="simples_nacional">Simples Nacional</SelectItem>
                    <SelectItem value="lucro_presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="lucro_real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="naturezaOperacao">
                  Natureza de operação padrão <span className="text-red-500">*</span>
                </Label>
                <Select value={nfseNaturezaOperacao} onValueChange={setNfseNaturezaOperacao}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tributação no município">Tributação no município</SelectItem>
                    <SelectItem value="Tributação fora do município">Tributação fora do município</SelectItem>
                    <SelectItem value="Isenção">Isenção</SelectItem>
                    <SelectItem value="Imune">Imune</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Credenciais de acesso adicionais */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Credenciais de acesso adicionais</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Preencha nos campos abaixo APENAS as credenciais de acesso que são utilizadas na sua prefeitura para
              emitir NFS-e. No caso da sua cidade a Conta Azul não consegue identificar quais são as credenciais
              solicitadas. Em caso de dúvidas, verifique com seu contador.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="usuarioAcesso">Usuário</Label>
                <Input
                  id="usuarioAcesso"
                  placeholder="othfxphead@gmail.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="senhaAcesso">Senha</Label>
                <Input
                  id="senhaAcesso"
                  type="password"
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="h-[22px] px-[5px] text-xs">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="h-[22px] px-[5px] text-xs bg-green-600 hover:bg-green-700">
              Salvar
            </Button>
          </div>
        </div>
      )}

      {activeTab === "nfe" && (
        <div className="space-y-6">
          {/* Status de Emissão */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Emissão de NF-e</h3>
                <p className="text-sm text-muted-foreground">
                  Configure a emissão de notas fiscais de produto
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-[5px] h-[22px] rounded-sm text-xs font-medium flex items-center ${
                    nfeAtivo
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {nfeAtivo ? "Configurado" : "Não configurado"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[22px] px-[5px] text-xs"
                  onClick={() => setNfeAtivo(!nfeAtivo)}
                >
                  {nfeAtivo ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Informações gerais */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informações gerais</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Estas informações são necessárias para a emissão correta da sua nota fiscal. Garanta que todas as
              informações sejam preenchidas corretamente
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label htmlFor="inscricaoEstadual">
                  Inscrição estadual <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="inscricaoEstadual"
                  value={nfeInscricaoEstadual}
                  onChange={(e) => setNfeInscricaoEstadual(e.target.value)}
                  placeholder="202561127"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="serie">
                  Série <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="serie"
                  value={nfeSerie}
                  onChange={(e) => setNfeSerie(e.target.value)}
                  placeholder="1"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Informe a série entre 0 e 889
                </p>
              </div>

              <div>
                <Label htmlFor="numeroUltimaNota">
                  Nº da última NF-e emitida <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="numeroUltimaNota"
                  value={nfeUltimoNumero}
                  onChange={(e) => setNfeUltimoNumero(e.target.value)}
                  placeholder="0"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <div className="text-blue-600 mt-1">ℹ️</div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Vai emitir notas fiscais?</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Antes de iniciar a emissão das suas notas fiscais é importante confirmar se a sua empresa já está
                    habilitada para emissão de notas. Em caso de dúvidas, verifique com seu contador.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Base de cálculo do PIS e COFINS */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Base de cálculo do PIS e COFINS</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A exclusão do ICMS da base do PIS e COFINS não se aplica para todas as empresas. Verifique com seu
              contador se a sua empresa enquadra-se nesta configuração. Ao selecionar a opção abaixo, no cálculo das
              notas fiscais será excluído o valor do ICMS da base de cálculo do PIS e COFINS.
            </p>
            <div className="flex items-center gap-2">
              <Checkbox
                id="excluirIcms"
                checked={nfeExcluirIcmsBaseCalculo}
                onCheckedChange={(checked) => setNfeExcluirIcmsBaseCalculo(checked as boolean)}
              />
              <Label htmlFor="excluirIcms" className="font-normal cursor-pointer">
                Excluir valor do ICMS da base de cálculo do PIS e Cofins.
              </Label>
            </div>
          </Card>

          {/* Inscrição estadual do substituto tributário */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inscrição estadual do substituto tributário</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Adicione no(s) estado(s) que deseja configurar
            </p>
            <Button variant="outline" size="sm" className="h-[22px] px-[5px] text-xs">
              + Adicionar novo estado
            </Button>
          </Card>

          {/* DIFAL */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">DIFAL – Diferencial de alíquota do ICMS</h3>
            <p className="text-sm text-muted-foreground">
              Configure o diferencial de alíquota do ICMS para operações interestaduais
            </p>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="h-[22px] px-[5px] text-xs">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="h-[22px] px-[5px] text-xs bg-green-600 hover:bg-green-700">
              Salvar
            </Button>
          </div>
        </div>
      )}

      {activeTab === "nfce" && (
        <div className="space-y-6">
          {/* Status de Emissão */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Emissão de NFC-e</h3>
                <p className="text-sm text-muted-foreground">
                  Configure a emissão de notas fiscais de consumidor
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-[5px] h-[22px] rounded-sm text-xs font-medium flex items-center ${
                    nfceAtivo
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {nfceAtivo ? "Configurado" : "Não configurado"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-[22px] px-[5px] text-xs"
                  onClick={() => setNfceAtivo(!nfceAtivo)}
                >
                  {nfceAtivo ? "Desativar" : "Configurar"}
                </Button>
              </div>
            </div>
          </Card>

          {/* Dados para emissão em produção */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dados para emissão de NFC-e em produção</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Estas informações são importantes para garantir a segurança e autenticidade da sua NFC-e. Todas estão
              disponíveis para consulta no site da Sefaz do seu estado, e devem ser utilizadas somente em um sistema
              para o sequenciamento correto das suas notas fiscais.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="idCsc">
                  Identificação – ID CSC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idCsc"
                  value={nfceIdCsc}
                  onChange={(e) => setNfceIdCsc(e.target.value)}
                  placeholder="Digite o ID CSC"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="codigoCsc">
                  Código de contribuinte – CSC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="codigoCsc"
                  value={nfceCodigoCsc}
                  onChange={(e) => setNfceCodigoCsc(e.target.value)}
                  placeholder="Digite o código CSC"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="h-[22px] px-[5px] text-xs">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="h-[22px] px-[5px] text-xs bg-green-600 hover:bg-green-700">
              Salvar
            </Button>
          </div>
        </div>
      )}

      {/* Dialog Upload Certificado */}
      <Dialog open={showCertificadoDialog} onOpenChange={setShowCertificadoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload de Certificado Digital A1</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="senha-certificado">
                Senha do Certificado <span className="text-red-500">*</span>
              </Label>
              <Input
                id="senha-certificado"
                type="password"
                value={certificadoSenha}
                onChange={(e) => setCertificadoSenha(e.target.value)}
                placeholder="Digite a senha do certificado"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="arquivo-certificado">
                Arquivo (.pfx ou .p12) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="arquivo-certificado"
                type="file"
                accept=".pfx,.p12"
                onChange={handleCertificadoUpload}
                disabled={!certificadoSenha || uploadCertificadoMutation.isPending}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tamanho máximo: 5MB
              </p>
            </div>
            {uploadCertificadoMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Enviando certificado...
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCertificadoDialog(false);
                setCertificadoSenha("");
              }}
              disabled={uploadCertificadoMutation.isPending}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
