import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Home,
  Star,
  Package,
  Wrench,
  ShoppingCart,
  DollarSign,
  CreditCard,
  Warehouse,
  FileText,
  Link as LinkIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Bell,
  HelpCircle,
  Plus,
  User,
  Building,
  LogOut,
  FileCheck,
  Users,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path?: string;
  submenu?: { label: string; path: string; icon?: React.ReactNode }[];
}

const menuItems: MenuItem[] = [
  { id: "inicio", label: "Início", icon: <Home className="w-5 h-5" />, path: "/" },
  { id: "favoritos", label: "Favoritos", icon: <Star className="w-5 h-5" />, path: "/favoritos" },
  {
    id: "produtos",
    label: "Produtos",
    icon: <Package className="w-5 h-5" />,
    submenu: [
      { label: "Orçamentos", path: "/orcamentos" },
      { label: "Vendas de produtos", path: "/vendas" },
      { label: "Contratos", path: "/contratos" },
      { label: "Parcelas a receber", path: "/parcelas" },
      { label: "Notas fiscais de produto", path: "/fiscal" },
      { label: "Consulta Serasa", path: "/serasa" },
    ],
  },
  {
    id: "servicos",
    label: "Serviços",
    icon: <Wrench className="w-5 h-5" />,
    submenu: [
      { label: "Orçamentos", path: "/orcamentos" },
      { label: "Vendas de serviços", path: "/vendas" },
      { label: "Contratos", path: "/contratos" },
      { label: "Ordens de serviço", path: "/ordens-servico" },
      { label: "Parcelas a receber", path: "/parcelas" },
      { label: "Notas fiscais de serviço", path: "/fiscal" },
      { label: "Consulta Serasa", path: "/serasa" },
    ],
  },
  { id: "compras", label: "Compras", icon: <ShoppingCart className="w-5 h-5" />, path: "/compras" },
  { id: "financeiro", label: "Financeiro", icon: <DollarSign className="w-5 h-5" />, path: "/financeiro" },
  { id: "credito", label: "Crédito", icon: <CreditCard className="w-5 h-5" />, path: "/credito" },
  { id: "estoque", label: "Estoque", icon: <Warehouse className="w-5 h-5" />, path: "/estoque" },
  { id: "relatorios", label: "Relatórios", icon: <FileText className="w-5 h-5" />, path: "/relatorios" },
  { id: "integracoes", label: "Integrações", icon: <LinkIcon className="w-5 h-5" />, path: "/integracoes" },
  {
    id: "cadastros",
    label: "CADASTROS",
    icon: <Users className="w-5 h-5" />,
    submenu: [
      { label: "Clientes", path: "/clientes" },
      { label: "Fornecedores", path: "/fornecedores" },
      { label: "Produtos", path: "/produtos" },
      { label: "Serviços", path: "/servicos" },
    ],
  },
  {
    id: "configuracoes",
    label: "CONFIGURAÇÕES",
    icon: <Settings className="w-5 h-5" />,
    submenu: [
      { label: "Dados da empresa", path: "/configuracoes" },
      { label: "Certificado digital", path: "/configuracoes#certificado" },
      { label: "Usuários", path: "/configuracoes#usuarios" },
      { label: "Integrações", path: "/configuracoes#integracoes" },
    ],
  },
];

export default function ContaAzulLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["produtos", "servicos"]);
  const logoutMutation = trpc.auth.logout.useMutation();

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar fixa */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-sm z-50 flex items-center px-4 gap-4">
        {/* Logo Track */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              T
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent tracking-tight">TRACK</span>
          </div>
        </Link>

        {/* Campo de pesquisa */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
            <Input
              type="text"
              placeholder="Pesquisar"
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white focus:text-gray-900"
            />
          </div>
        </div>

        {/* Botão Novo registro */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo registro
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/orcamentos?novo=produto">Nova venda de produto</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orcamentos?novo=servico">Nova venda de serviço</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orcamentos?novo=orcamento">Novo orçamento</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/compras?novo=true">Nova compra</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/financeiro?novo=receita">Nova receita</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/financeiro?novo=despesa">Nova despesa</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Ícones de notificação e ajuda */}
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <Bell className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-100">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Menu de usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-gray-700 hover:bg-gray-100 gap-2">
              <div className="text-right">
                <div className="text-sm font-semibold">{user?.name || "Usuário"}</div>
                <div className="text-xs text-gray-500">Configurações e plano</div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <div>
                  <div className="font-semibold">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.email}</div>
                  <div className="text-xs text-muted-foreground">ID suporte: {user?.id}</div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Conta PJ
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Empresa</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Plano e faturamento</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Dados da empresa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Marca da empresa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Meus usuários</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Meus parceiros</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Configurações gerais</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Certificado digital</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Configurações de notas fiscais</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Importar dados</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Sidebar retrátil */}
      <aside
        className={`fixed top-16 left-0 bottom-0 bg-[#003d5c] text-white transition-all duration-300 z-40 overflow-y-auto ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Botão de toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-4 bg-white text-blue-900 rounded-full p-1 shadow-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Menu items */}
        <nav className="py-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                      item.label.includes("CADASTROS") || item.label.includes("CONFIGURAÇÕES")
                        ? "text-white/60 text-xs font-semibold mt-4"
                        : ""
                    }`}
                  >
                    {item.icon}
                    {(sidebarOpen || sidebarHovered) && (
                      <>
                        <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                        {expandedMenus.includes(item.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </>
                    )}
                  </button>
                  {expandedMenus.includes(item.id) && (sidebarOpen || sidebarHovered) && (
                    <div className="bg-[#002a3f]">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          href={subitem.path}
                          className={`block px-4 py-2 pl-12 hover:bg-white/10 transition-colors whitespace-nowrap ${
                            location === subitem.path ? "bg-white/20 border-l-4 border-blue-400" : ""
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.path || "#"}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                    location === item.path ? "bg-white/20 border-l-4 border-blue-400" : ""
                  }`}
                >
                  {item.icon}
                  {(sidebarOpen || sidebarHovered) && <span className="whitespace-nowrap">{item.label}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

            {/* Content area */}
      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarOpen || sidebarHovered ? "ml-64" : "ml-16"
        }`}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
