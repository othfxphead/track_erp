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

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/apresentacao"} component={Apresentacao} />
      <Route path={"/orcamentos"} component={() => <div>Orçamentos - Em desenvolvimento</div>} />
      <Route path={"/vendas"} component={() => <div>Vendas - Em desenvolvimento</div>} />
      <Route path={"/produtos"} component={Produtos} />
      <Route path={"/clientes"} component={Clientes} />
      <Route path={"/servicos"} component={() => <div>Serviços - Em desenvolvimento</div>} />
      <Route path={"/compras"} component={() => <div>Compras - Em desenvolvimento</div>} />
      <Route path={"/estoque"} component={() => <div>Estoque - Em desenvolvimento</div>} />
      <Route path={"/financeiro"} component={() => <div>Financeiro - Em desenvolvimento</div>} />
      <Route path={"/fiscal"} component={() => <div>Fiscal - Em desenvolvimento</div>} />
      <Route path={"/relatorios"} component={() => <div>Relatórios - Em desenvolvimento</div>} />
      <Route path={"/serasa"} component={() => <div>Consulta Serasa - Em desenvolvimento</div>} />
      <Route path={"/configuracoes"} component={() => <div>Configurações - Em desenvolvimento</div>} />
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
