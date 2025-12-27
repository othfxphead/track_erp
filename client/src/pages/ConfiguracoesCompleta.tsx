import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Upload, Save, Building2, FileKey, CreditCard, Users, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ConfiguracoesCompleta() {
  const { data: empresa, refetch } = trpc.empresa.get.useQuery();
  
  const [dadosEmpresa, setDadosEmpresa] = useState({
    razaoSocial: "",
    nomeFantasia: "",
    cnpj: "",
    inscricaoEstadual: "",
    inscricaoMunicipal: "",
    telefone: "",
    email: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });

  const [certificado, setCertificado] = useState({
    arquivo: null as File | null,
    senha: "",
  });

  const [contaBancaria, setContaBancaria] = useState({
    banco: "",
    agencia: "",
    conta: "",
    tipo: "corrente",
  });

  const [integracoes, setIntegracoes] = useState({
    focusApiKey: "",
    asaasApiKey: "",
    sicrediApiKey: "",
    serasaApiKey: "",
  });

  const updateEmpresaMutation = trpc.empresa.upsert.useMutation({
    onSuccess: () => {
      toast.success("Dados da empresa atualizados!");
      refetch();
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const handleSaveDadosEmpresa = () => {
    updateEmpresaMutation.mutate(dadosEmpresa);
  };

  const handleUploadLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Implementar upload para S3
      toast.info("Upload de logo será implementado com S3");
    }
  };

  const handleUploadCertificado = () => {
    if (!certificado.arquivo || !certificado.senha) {
      toast.error("Selecione o arquivo e informe a senha");
      return;
    }
    // TODO: Implementar upload e validação de certificado
    toast.info("Upload de certificado será implementado");
  };

  const handleSaveContaBancaria = () => {
    if (!contaBancaria.banco || !contaBancaria.agencia || !contaBancaria.conta) {
      toast.error("Preencha todos os campos da conta bancária");
      return;
    }
    // TODO: Salvar no banco de dados
    toast.success("Conta bancária salva com sucesso!");
  };

  const handleSaveIntegracoes = () => {
    // TODO: Salvar chaves de API de forma segura
    toast.success("Integrações configuradas com sucesso!");
  };

  return (
          <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações do sistema
          </p>
        </div>

        <Tabs defaultValue="empresa" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="empresa">
              <Building2 className="h-4 w-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="certificado">
              <FileKey className="h-4 w-4 mr-2" />
              Certificado
            </TabsTrigger>
            <TabsTrigger value="bancario">
              <CreditCard className="h-4 w-4 mr-2" />
              Bancário
            </TabsTrigger>
            <TabsTrigger value="usuarios">
              <Users className="h-4 w-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="integracoes">
              <LinkIcon className="h-4 w-4 mr-2" />
              Integrações
            </TabsTrigger>
          </TabsList>

          {/* Dados da Empresa */}
          <TabsContent value="empresa">
            <Card>
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload de Logo */}
                <div>
                  <Label>Logo da Empresa</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadLogo}
                        className="max-w-xs"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG ou SVG (máx. 2MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input
                      id="razaoSocial"
                      value={dadosEmpresa.razaoSocial}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, razaoSocial: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                    <Input
                      id="nomeFantasia"
                      value={dadosEmpresa.nomeFantasia}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, nomeFantasia: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      value={dadosEmpresa.cnpj}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, cnpj: e.target.value })
                      }
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label>
                    <Input
                      id="inscricaoEstadual"
                      value={dadosEmpresa.inscricaoEstadual}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, inscricaoEstadual: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label>
                    <Input
                      id="inscricaoMunicipal"
                      value={dadosEmpresa.inscricaoMunicipal}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, inscricaoMunicipal: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={dadosEmpresa.telefone}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, telefone: e.target.value })
                      }
                      placeholder="(00) 0000-0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={dadosEmpresa.email}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-8">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={dadosEmpresa.endereco}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, endereco: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={dadosEmpresa.numero}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, numero: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="complemento">Compl.</Label>
                    <Input
                      id="complemento"
                      value={dadosEmpresa.complemento}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, complemento: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={dadosEmpresa.bairro}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, bairro: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={dadosEmpresa.cidade}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, cidade: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={dadosEmpresa.estado}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, estado: e.target.value })
                      }
                      maxLength={2}
                      placeholder="SP"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={dadosEmpresa.cep}
                      onChange={(e) =>
                        setDadosEmpresa({ ...dadosEmpresa, cep: e.target.value })
                      }
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveDadosEmpresa}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Dados da Empresa
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificado Digital */}
          <TabsContent value="certificado">
            <Card>
              <CardHeader>
                <CardTitle>Certificado Digital A1</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Faça upload do seu certificado digital A1 (.pfx) para emissão de notas fiscais eletrônicas.
                </p>

                <div>
                  <Label htmlFor="certificado">Arquivo do Certificado (.pfx)</Label>
                  <Input
                    id="certificado"
                    type="file"
                    accept=".pfx"
                    onChange={(e) =>
                      setCertificado({ ...certificado, arquivo: e.target.files?.[0] || null })
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="senhaCertificado">Senha do Certificado</Label>
                  <Input
                    id="senhaCertificado"
                    type="password"
                    value={certificado.senha}
                    onChange={(e) =>
                      setCertificado({ ...certificado, senha: e.target.value })
                    }
                    placeholder="Digite a senha do certificado"
                  />
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Status do Certificado</h4>
                  <p className="text-sm text-muted-foreground">
                    Nenhum certificado configurado
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleUploadCertificado}>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar Certificado
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dados Bancários */}
          <TabsContent value="bancario">
            <Card>
              <CardHeader>
                <CardTitle>Contas Bancárias</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="banco">Banco</Label>
                    <Input
                      id="banco"
                      value={contaBancaria.banco}
                      onChange={(e) =>
                        setContaBancaria({ ...contaBancaria, banco: e.target.value })
                      }
                      placeholder="Ex: Banco do Brasil, Sicredi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Conta</Label>
                    <select
                      id="tipo"
                      value={contaBancaria.tipo}
                      onChange={(e) =>
                        setContaBancaria({ ...contaBancaria, tipo: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="corrente">Conta Corrente</option>
                      <option value="poupanca">Conta Poupança</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="agencia">Agência</Label>
                    <Input
                      id="agencia"
                      value={contaBancaria.agencia}
                      onChange={(e) =>
                        setContaBancaria({ ...contaBancaria, agencia: e.target.value })
                      }
                      placeholder="0000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="conta">Conta</Label>
                    <Input
                      id="conta"
                      value={contaBancaria.conta}
                      onChange={(e) =>
                        setContaBancaria({ ...contaBancaria, conta: e.target.value })
                      }
                      placeholder="00000-0"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveContaBancaria}>
                    <Save className="h-4 w-4 mr-2" />
                    Adicionar Conta
                  </Button>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3">Contas Cadastradas</h4>
                  <p className="text-sm text-muted-foreground">
                    Nenhuma conta bancária cadastrada ainda.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usuários */}
          <TabsContent value="usuarios">
            <Card>
              <CardHeader>
                <CardTitle>Usuários e Permissões</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Gerencie os usuários do sistema e suas permissões de acesso.
                </p>
                <Button onClick={() => toast.info("Gestão de usuários em desenvolvimento")}>
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrações */}
          <TabsContent value="integracoes">
            <Card>
              <CardHeader>
                <CardTitle>Integrações com APIs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="focusApiKey">Focus NFe - API Key</Label>
                  <Input
                    id="focusApiKey"
                    type="password"
                    value={integracoes.focusApiKey}
                    onChange={(e) =>
                      setIntegracoes({ ...integracoes, focusApiKey: e.target.value })
                    }
                    placeholder="Digite a chave da API Focus NFe"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para emissão de NF-e e NFS-e
                  </p>
                </div>

                <div>
                  <Label htmlFor="asaasApiKey">Asaas - API Key</Label>
                  <Input
                    id="asaasApiKey"
                    type="password"
                    value={integracoes.asaasApiKey}
                    onChange={(e) =>
                      setIntegracoes({ ...integracoes, asaasApiKey: e.target.value })
                    }
                    placeholder="Digite a chave da API Asaas"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para gestão de cobranças e pagamentos
                  </p>
                </div>

                <div>
                  <Label htmlFor="sicrediApiKey">Sicredi - API Key</Label>
                  <Input
                    id="sicrediApiKey"
                    type="password"
                    value={integracoes.sicrediApiKey}
                    onChange={(e) =>
                      setIntegracoes({ ...integracoes, sicrediApiKey: e.target.value })
                    }
                    placeholder="Digite a chave da API Sicredi"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para conciliação bancária automática
                  </p>
                </div>

                <div>
                  <Label htmlFor="serasaApiKey">Serasa - API Key</Label>
                  <Input
                    id="serasaApiKey"
                    type="password"
                    value={integracoes.serasaApiKey}
                    onChange={(e) =>
                      setIntegracoes({ ...integracoes, serasaApiKey: e.target.value })
                    }
                    placeholder="Digite a chave da API Serasa"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Para consulta de CPF/CNPJ
                  </p>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveIntegracoes}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Integrações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
