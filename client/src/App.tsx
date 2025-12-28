import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import ContaAzulLayout from "./components/ContaAzulLayout";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Apresentacao from "./pages/Apresentacao";
import OrcamentosNew from "./pages/OrcamentosNew";
import NovoOrcamentoPage from "./pages/NovoOrcamentoPage";
import VendasNew from "./pages/VendasNew";
import NovaVendaPage from "./pages/NovaVendaPage";
import Servicos from "./pages/Servicos";
import { Fiscal, Relatorios, ConsultaSerasa } from "./pages/ModulosSimples";
import EstoqueAvancado from "./pages/EstoqueAvancado";
import ComprasCompleta from "./pages/ComprasCompleta";
import FinanceiroCompleto from "./pages/FinanceiroCompleto";
import ConfiguracoesCompleta from "./pages/ConfiguracoesCompleta";
import DadosEmpresa from "./pages/DadosEmpresa";
import Favoritos from "./pages/Favoritos";
import Fornecedores from "./pages/Fornecedores";
import Contratos from "./pages/Contratos";
import Parcelas from "./pages/Parcelas";
import OrdensServico from "./pages/OrdensServico";
import Integracoes from "./pages/Integracoes";
import Usuarios from "./pages/Usuarios";
import IntegracoesConfig from "./pages/IntegracoesConfig";

function Router() {
  return (
    <ContaAzulLayout>
      <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/apresentacao"} component={Apresentacao} />
      <Route path={"/favoritos"} component={Favoritos} />        <Route path="/orcamentos" component={OrcamentosNew} />
        <Route path="/orcamentos/novo" component={NovoOrcamentoPage} />
      <Route path={"/vendas"} component={VendasNew} />
      <Route path={"/vendas/nova"} component={NovaVendaPage} />
      <Route path={"/produtos"} component={Produtos} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/servicos"} component={Servicos} />
      <Route path={"/fornecedores"} component={Fornecedores} />
      <Route path={"/contratos"} component={Contratos} />
      <Route path={"/parcelas"} component={Parcelas} />
      <Route path={"/ordens-servico"} component={OrdensServico} />
      <Route path={"/compras"} component={ComprasCompleta} />
      <Route path={"/estoque"} component={EstoqueAvancado} />
      <Route path={"/financeiro"} component={FinanceiroCompleto} />
      <Route path={"/fiscal"} component={Fiscal} />
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/integracoes"} component={Integracoes} />
      <Route path={"/serasa"} component={ConsultaSerasa} />
      <Route path={"/configuracoes"} component={ConfiguracoesCompleta} />
      <Route path={"/configuracoes/dados-empresa"} component={DadosEmpresa} />
      <Route path={"/configuracoes/usuarios"} component={Usuarios} />
      <Route path={"/configuracoes/integracoes"} component={IntegracoesConfig} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </ContaAzulLayout>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
