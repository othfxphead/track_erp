// Arquivo com páginas simplificadas para módulos restantes
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Package, DollarSign, FileText, BarChart3, Settings } from "lucide-react";
import { toast } from "sonner";

// Página de Compras
export function Compras() {
  return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Compras</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie compras de fornecedores
            </p>
          </div>
          <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Compra
          </Button>
        </div>
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Compras Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma compra registrada ainda.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Registre compras para atualizar automaticamente o estoque.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

// Página de Estoque
export function Estoque() {
  return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Estoque</h1>
            <p className="text-muted-foreground mt-1">
              Controle de movimentações e saldos
            </p>
          </div>
          <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Movimentação
          </Button>
        </div>
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Movimentações de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma movimentação registrada.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                As movimentações são criadas automaticamente em compras e vendas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

// Página Financeiro
export function Financeiro() {
  return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
            <p className="text-muted-foreground mt-1">
              Contas a pagar, receber e fluxo de caixa
            </p>
          </div>
          <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lançamento
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                0 contas pendentes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                A Pagar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                0 contas pendentes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 0,00</div>
              <p className="text-xs text-muted-foreground mt-1">
                Saldo atual
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Lançamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum lançamento financeiro ainda.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

// Página Fiscal
export function Fiscal() {
  return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fiscal</h1>
            <p className="text-muted-foreground mt-1">
              Emissão de notas fiscais e gestão tributária
            </p>
          </div>
          <Button onClick={() => toast.info("Funcionalidade em desenvolvimento")}>
            <Plus className="h-4 w-4 mr-2" />
            Emitir NF-e
          </Button>
        </div>
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Notas Fiscais Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhuma nota fiscal emitida.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Configure a integração com Focus NFe para emitir notas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}

// Página de Relatórios
export function Relatorios() {
  return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground mt-1">
              Análises e relatórios gerenciais
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Vendas por Período", icon: BarChart3 },
            { title: "Fluxo de Caixa", icon: DollarSign },
            { title: "Produtos Mais Vendidos", icon: Package },
            { title: "Clientes Top", icon: BarChart3 },
            { title: "Relatório Fiscal", icon: FileText },
            { title: "Análise de Estoque", icon: Package },
          ].map((relatorio, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <relatorio.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{relatorio.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Clique para gerar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}

// Página de Configurações
export function Configuracoes() {
  return (
          <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações do sistema
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Dados da Empresa", description: "Logo, razão social, CNPJ" },
            { title: "Certificado Digital", description: "Upload de certificado A1" },
            { title: "Contas Bancárias", description: "Integração bancária" },
            { title: "Usuários e Permissões", description: "Controle de acesso" },
            { title: "Integrações", description: "Focus, Asaas, Sicredi, Serasa" },
            { title: "Preferências", description: "Tema, notificações" },
          ].map((config, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-base">{config.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => toast.info("Funcionalidade em desenvolvimento")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
  );
}

// Página de Consulta Serasa
export function ConsultaSerasa() {
  return (
          <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consulta Serasa</h1>
          <p className="text-muted-foreground mt-1">
            Consulte CPF/CNPJ antes de realizar transações
          </p>
        </div>
        
        <Card className="card-shadow max-w-2xl">
          <CardHeader>
            <CardTitle>Nova Consulta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">CPF ou CNPJ</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-lg"
                  placeholder="Digite o CPF ou CNPJ"
                />
              </div>
              <Button onClick={() => toast.info("Integração Serasa em desenvolvimento")}>
                Consultar
              </Button>
            </div>
            
            <div className="mt-8 text-center py-8 border-t">
              <p className="text-muted-foreground">
                Configure a integração com Serasa para habilitar consultas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
