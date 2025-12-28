import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Link2, Save, TestTube } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function IntegracoesConfig() {
  const [focusConfig, setFocusConfig] = useState({
    ativo: false,
    token: "",
    ambiente: "homologacao" as "homologacao" | "producao",
  });

  const [asaasConfig, setAsaasConfig] = useState({
    ativo: false,
    apiKey: "",
    ambiente: "sandbox" as "sandbox" | "producao",
  });

  const [serasaConfig, setSerasaConfig] = useState({
    ativo: false,
    usuario: "",
    senha: "",
  });

  const handleSaveFocus = () => {
    toast.success("Configurações do Focus NFe salvas!");
  };

  const handleSaveAsaas = () => {
    toast.success("Configurações do Asaas salvas!");
  };

  const handleSaveSerasa = () => {
    toast.success("Configurações do Serasa salvas!");
  };

  const handleTest = (integracao: string) => {
    toast.info(`Testando conexão com ${integracao}...`);
    setTimeout(() => {
      toast.success(`Conexão com ${integracao} bem-sucedida!`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Configurações de Integrações
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure as integrações com serviços externos
          </p>
        </div>
      </div>

      {/* Tabs de Integrações */}
      <Tabs defaultValue="focus" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="focus">Focus NFe</TabsTrigger>
          <TabsTrigger value="asaas">Asaas</TabsTrigger>
          <TabsTrigger value="serasa">Serasa</TabsTrigger>
        </TabsList>

        {/* Focus NFe */}
        <TabsContent value="focus" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Focus NFe</CardTitle>
                  <CardDescription>
                    Emissão de notas fiscais eletrônicas
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="focus-ativo">Ativo</Label>
                  <Switch
                    id="focus-ativo"
                    checked={focusConfig.ativo}
                    onCheckedChange={(checked) =>
                      setFocusConfig({ ...focusConfig, ativo: checked })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="focus-token">Token de Acesso</Label>
                <Input
                  id="focus-token"
                  type="password"
                  value={focusConfig.token}
                  onChange={(e) =>
                    setFocusConfig({ ...focusConfig, token: e.target.value })
                  }
                  placeholder="Digite o token fornecido pelo Focus NFe"
                />
              </div>

              <div>
                <Label htmlFor="focus-ambiente">Ambiente</Label>
                <select
                  id="focus-ambiente"
                  value={focusConfig.ambiente}
                  onChange={(e) =>
                    setFocusConfig({
                      ...focusConfig,
                      ambiente: e.target.value as "homologacao" | "producao",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="homologacao">Homologação</option>
                  <option value="producao">Produção</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => handleTest("Focus NFe")}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button onClick={handleSaveFocus} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Link2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Como obter o token?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse o painel do Focus NFe, vá em Configurações → API e copie
                    seu token de acesso. Para mais informações, consulte a{" "}
                    <a
                      href="https://focusnfe.com.br/doc/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      documentação oficial
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asaas */}
        <TabsContent value="asaas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Asaas</CardTitle>
                  <CardDescription>
                    Gateway de pagamento e cobranças
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="asaas-ativo">Ativo</Label>
                  <Switch
                    id="asaas-ativo"
                    checked={asaasConfig.ativo}
                    onCheckedChange={(checked) =>
                      setAsaasConfig({ ...asaasConfig, ativo: checked })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="asaas-apikey">API Key</Label>
                <Input
                  id="asaas-apikey"
                  type="password"
                  value={asaasConfig.apiKey}
                  onChange={(e) =>
                    setAsaasConfig({ ...asaasConfig, apiKey: e.target.value })
                  }
                  placeholder="Digite a API Key fornecida pelo Asaas"
                />
              </div>

              <div>
                <Label htmlFor="asaas-ambiente">Ambiente</Label>
                <select
                  id="asaas-ambiente"
                  value={asaasConfig.ambiente}
                  onChange={(e) =>
                    setAsaasConfig({
                      ...asaasConfig,
                      ambiente: e.target.value as "sandbox" | "producao",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="producao">Produção</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => handleTest("Asaas")}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button onClick={handleSaveAsaas} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Link2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Como obter a API Key?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Acesse o painel do Asaas, vá em Integrações → API Key e gere
                    uma nova chave. Para mais informações, consulte a{" "}
                    <a
                      href="https://docs.asaas.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      documentação oficial
                    </a>
                    .
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Serasa */}
        <TabsContent value="serasa" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Serasa</CardTitle>
                  <CardDescription>Consulta de CPF/CNPJ</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="serasa-ativo">Ativo</Label>
                  <Switch
                    id="serasa-ativo"
                    checked={serasaConfig.ativo}
                    onCheckedChange={(checked) =>
                      setSerasaConfig({ ...serasaConfig, ativo: checked })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="serasa-usuario">Usuário</Label>
                <Input
                  id="serasa-usuario"
                  value={serasaConfig.usuario}
                  onChange={(e) =>
                    setSerasaConfig({ ...serasaConfig, usuario: e.target.value })
                  }
                  placeholder="Digite o usuário fornecido pelo Serasa"
                />
              </div>

              <div>
                <Label htmlFor="serasa-senha">Senha</Label>
                <Input
                  id="serasa-senha"
                  type="password"
                  value={serasaConfig.senha}
                  onChange={(e) =>
                    setSerasaConfig({ ...serasaConfig, senha: e.target.value })
                  }
                  placeholder="Digite a senha fornecida pelo Serasa"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => handleTest("Serasa")}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Testar Conexão
                </Button>
                <Button onClick={handleSaveSerasa} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Link2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Como obter as credenciais?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Entre em contato com o Serasa para contratar o serviço de
                    consultas e obter suas credenciais de acesso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
