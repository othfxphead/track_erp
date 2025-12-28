import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, CheckCircle, XCircle, Settings } from "lucide-react";
import { toast } from "sonner";

export default function Integracoes() {
  const integracoes = [
    {
      id: 1,
      nome: "Focus NFe",
      descricao: "Emissão de notas fiscais eletrônicas",
      categoria: "Fiscal",
      status: "ativa",
      logo: "🧾",
    },
    {
      id: 2,
      nome: "Asaas",
      descricao: "Gateway de pagamento e cobranças",
      categoria: "Financeiro",
      status: "inativa",
      logo: "💳",
    },
    {
      id: 3,
      nome: "Sicredi",
      descricao: "Integração bancária e boletos",
      categoria: "Financeiro",
      status: "inativa",
      logo: "🏦",
    },
    {
      id: 4,
      nome: "Serasa",
      descricao: "Consulta de CPF/CNPJ",
      categoria: "Consultas",
      status: "inativa",
      logo: "🔍",
    },
    {
      id: 5,
      nome: "Correios",
      descricao: "Cálculo de frete e rastreamento",
      categoria: "Logística",
      status: "inativa",
      logo: "📦",
    },
    {
      id: 6,
      nome: "Google Maps",
      descricao: "Geolocalização e rotas",
      categoria: "Localização",
      status: "ativa",
      logo: "🗺️",
    },
    {
      id: 7,
      nome: "WhatsApp Business",
      descricao: "Envio de mensagens e notificações",
      categoria: "Comunicação",
      status: "inativa",
      logo: "💬",
    },
    {
      id: 8,
      nome: "Mercado Livre",
      descricao: "Integração com marketplace",
      categoria: "E-commerce",
      status: "inativa",
      logo: "🛒",
    },
  ];

  const categorias = Array.from(new Set(integracoes.map(i => i.categoria)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integrações</h1>
          <p className="text-muted-foreground mt-1">
            Conecte seu ERP com serviços externos
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-2xl font-bold">
                  {integracoes.filter(i => i.status === "ativa").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <XCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Inativas</p>
                <p className="text-2xl font-bold">
                  {integracoes.filter(i => i.status === "inativa").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Link2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{integracoes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrações por Categoria */}
      {categorias.map((categoria) => (
        <div key={categoria} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">{categoria}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integracoes
              .filter((i) => i.categoria === categoria)
              .map((integracao) => (
                <Card
                  key={integracao.id}
                  className="card-shadow hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{integracao.logo}</div>
                        <div>
                          <CardTitle className="text-base">
                            {integracao.nome}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {integracao.descricao}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          integracao.status === "ativa" ? "default" : "secondary"
                        }
                        className={`${
                          integracao.status === "ativa"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {integracao.status === "ativa" ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inativa
                          </>
                        )}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toast.info("Funcionalidade em desenvolvimento")
                        }
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {/* Informações Adicionais */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Precisa de uma integração específica?
              </h3>
              <p className="text-sm text-muted-foreground">
                Entre em contato com nosso suporte para solicitar novas integrações.
                Estamos sempre expandindo nossas conexões com serviços externos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
