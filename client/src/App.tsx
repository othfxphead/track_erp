import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Apresentacao from "./pages/Apresentacao";
import Orcamentos from "./pages/Orcamentos";
import VendasCompleta from "./pages/VendasCompleta";
import Servicos from "./pages/Servicos";
import { Compras, Estoque, Fiscal, Relatorios, ConsultaSerasa } from "./pages/ModulosSimples";
import FinanceiroCompleto from "./pages/FinanceiroCompleto";
import ConfiguracoesCompleta from "./pages/ConfiguracoesCompleta";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/apresentacao"} component={Apresentacao} />
      <Route path={"/orcamentos"} component={Orcamentos} />
      <Route path={"/vendas"} component={VendasCompleta} />
      <Route path={"/produtos"} component={Produtos} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/servicos"} component={Servicos} />
      <Route path={"/compras"} component={Compras} />
      <Route path={"/estoque"} component={Estoque} />
      <Route path={"/financeiro"} component={FinanceiroCompleto} />
      <Route path={"/fiscal"} component={Fiscal} />
      <Route path={"/relatorios"} component={Relatorios} />
      <Route path={"/serasa"} component={ConsultaSerasa} />
      <Route path={"/configuracoes"} component={ConfiguracoesCompleta} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
