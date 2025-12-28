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
import { Fiscal, ConsultaSerasa } from "./pages/ModulosSimples";
import RelatoriosIA from "./pages/RelatoriosIA";
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
import ContasPagar from "./pages/ContasPagar";
import ContasReceber from "./pages/ContasReceber";
import ExtratoBancario from "./pages/ExtratoBancario";
import DDA from "./pages/DDA";
import Inadimplentes from "./pages/Inadimplentes";
import ConfiguracoesFiscais from "./pages/ConfiguracoesFiscais";
import NotasEmitidas from "./pages/NotasEmitidas";

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
      <Route path={"/financeiro/contas-pagar"} component={ContasPagar} />
      <Route path={"/financeiro/contas-receber"} component={ContasReceber} />
      <Route path={"/financeiro/extrato"} component={ExtratoBancario} />
      <Route path={"/financeiro/dda"} component={DDA} />
      <Route path={"/financeiro/inadimplentes"} component={Inadimplentes} />      <Route path={"/fiscal"} component={Fiscal} />
      <Route path={"/notas-emitidas"} component={NotasEmitidas} />
      <Route path={"/relatorios"} component={RelatoriosIA} />
      <Route path={"/integracoes"} component={Integracoes} />
      <Route path={"/serasa"} component={ConsultaSerasa} />
      <Route path={"/configuracoes"} component={ConfiguracoesCompleta} />
      <Route path={"/configuracoes/dados-empresa"} component={DadosEmpresa} />
      <Route path={"/configuracoes/fiscal"} component={ConfiguracoesFiscais} />
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
