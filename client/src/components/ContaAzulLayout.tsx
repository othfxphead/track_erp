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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      { label: "Dados da Empresa", path: "/configuracoes/dados-empresa" },
      { label: "Usuários", path: "/configuracoes/usuarios" },
      { label: "Integrações", path: "/configuracoes/integracoes" },
    ],
  },
];

export default function ContaAzulLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isExpanded = sidebarOpen || sidebarHovered;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    window.location.href = "/";
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-[#1e3a5f] text-white transition-all duration-300 z-40 ${
            isExpanded ? "w-64" : "w-16"
          }`}
          onMouseEnter={() => setSidebarHovered(true)}
          onMouseLeave={() => {
            setSidebarHovered(false);
            setHoveredItem(null);
          }}
        >
          {/* Botão de toggle fixo e sobreposto */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-6 z-50 w-6 h-6 bg-white border-2 border-[#1e3a5f] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-[#1e3a5f]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#1e3a5f]" />
            )}
          </button>

          <nav className="flex flex-col h-full overflow-y-auto py-4">
            {menuItems.map((item) => (
              <div key={item.id} className="relative">
                {item.submenu ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {/* Item principal com submenu */}
                    {!isExpanded ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`w-full flex items-center justify-center h-12 hover:bg-[#2c5282] transition-colors ${
                              location.startsWith(item.submenu[0].path.split("/")[1])
                                ? "bg-[#2c5282] border-l-4 border-blue-400"
                                : ""
                            }`}
                          >
                            {item.icon}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-4 h-12 hover:bg-[#2c5282] transition-colors ${
                          expandedMenus.includes(item.id) ? "bg-[#2c5282]" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedMenus.includes(item.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}

                    {/* Submenu - aparece com hover quando recolhido */}
                    {hoveredItem === item.id && !isExpanded && (
                      <div className="absolute left-16 top-0 w-56 bg-white text-gray-900 shadow-lg rounded-r-lg py-2 z-50">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                          {item.label}
                        </div>
                        {item.submenu.map((subitem) => (
                          <Link key={subitem.path} href={subitem.path}>
                            <a
                              className={`block px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                                location === subitem.path ? "bg-blue-50 text-blue-600 font-medium" : ""
                              }`}
                            >
                              {subitem.label}
                            </a>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Submenu expandido quando sidebar está aberta */}
                    {isExpanded && expandedMenus.includes(item.id) && (
                      <div className="bg-[#152a45] py-1">
                        {item.submenu.map((subitem) => (
                          <Link key={subitem.path} href={subitem.path}>
                            <a
                              className={`block px-12 py-2 text-sm hover:bg-[#2c5282] transition-colors ${
                                location === subitem.path
                                  ? "bg-[#2c5282] text-white font-medium border-l-4 border-blue-400"
                                  : "text-gray-300"
                              }`}
                            >
                              {subitem.label}
                            </a>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Item simples sem submenu
                  <Link href={item.path!}>
                    {!isExpanded ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            className={`flex items-center justify-center h-12 hover:bg-[#2c5282] transition-colors ${
                              location === item.path ? "bg-[#2c5282] border-l-4 border-blue-400" : ""
                            }`}
                          >
                            {item.icon}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <a
                        className={`flex items-center gap-3 px-4 h-12 hover:bg-[#2c5282] transition-colors ${
                          location === item.path ? "bg-[#2c5282] border-l-4 border-blue-400" : ""
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </a>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isExpanded ? "ml-64" : "ml-16"}`}>
          {/* Topbar */}
          <header className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30">
            <div className="flex items-center gap-6">
              {/* Logo TRACK */}
              <Link href="/">
                <a className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">T</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">TRACK</span>
                </a>
              </Link>

              {/* Search */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Pesquisar"
                  className="pl-10 h-9 bg-gray-50 border-gray-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Novo registro */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-9 bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo registro
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <FileText className="w-4 h-4 mr-2" />
                    Novo Orçamento
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Nova Venda
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Novo Contrato
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="w-4 h-4 mr-2" />
                    Novo Produto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notificações */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Ajuda */}
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </Button>

              {/* Menu do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{user?.name || "Usuário"}</div>
                      <div className="text-xs text-gray-500">Configurações e plano</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building className="w-4 h-4 mr-2" />
                    Empresa
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content */}
          <main className="mt-16 flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
