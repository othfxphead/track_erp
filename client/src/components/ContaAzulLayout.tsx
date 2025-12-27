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
  const [location, setLocation] = useLocation();
  const { user } = useAuth();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const isExpanded = sidebarOpen;

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
          className={`fixed left-0 top-24 h-[calc(100vh-6rem)] bg-[#00A3E0] text-white transition-all duration-300 z-40 rounded-r-2xl shadow-lg ${
            isExpanded ? "w-64" : "w-16"
          }`}
          onMouseLeave={() => {
            setHoveredItem(null);
          }}
        >
          {/* Botão de toggle fixo e sobreposto */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-6 z-50 w-6 h-6 bg-white border-2 border-[#00A3E0] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-md"
          >
            {isExpanded ? (
              <ChevronLeft className="w-4 h-4 text-[#00A3E0]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[#00A3E0]" />
            )}
          </button>

          <nav className="flex flex-col h-full overflow-y-auto py-4 scrollbar-hide">
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
                            className={`w-full flex items-center justify-center h-12 hover:bg-[#0088C0] transition-colors ${
                              location.startsWith(item.submenu[0].path.split("/")[1])
                                ? "bg-[#0088C0] border-l-4 border-white"
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
                        className={`w-full flex items-center justify-between px-4 h-12 hover:bg-[#0088C0] transition-colors ${
                          expandedMenus.includes(item.id) ? "bg-[#0088C0]" : ""
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

                    {/* Submenu - aparece com hover (SEMPRE lateral, mesmo expandido) */}
                    {hoveredItem === item.id && (
                      <div className={`fixed ${isExpanded ? 'left-64' : 'left-16'} top-24 h-[calc(100vh-6rem)] w-80 bg-[#003d7a] text-white shadow-2xl z-50 overflow-y-auto rounded-r-2xl`}>
                        {/* Cabeçalho do submenu com seta de voltar */}
                        <div className="flex items-center gap-3 px-4 py-4 bg-[#002a5c] border-b border-[#004d8a] rounded-tr-2xl">
                          <button 
                            onClick={() => setHoveredItem(null)}
                            className="hover:bg-[#003d7a] p-1 rounded transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <span className="text-lg font-semibold">{item.label}</span>
                        </div>
                        
                        {/* Itens do submenu */}
                        <div className="py-2">
                          {item.submenu.map((subitem) => (
                            <Link key={subitem.path} href={subitem.path}>
                              <div
                                className={`flex items-center justify-between px-6 py-3 text-base hover:bg-[#004d8a] transition-colors cursor-pointer ${
                                  location === subitem.path ? "bg-[#004d8a] text-white font-medium border-l-4 border-white" : ""
                                }`}
                              >
                                <span>{subitem.label}</span>
                                {/* Estrela de favorito */}
                                <button className="hover:text-yellow-400 transition-colors">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                  </svg>
                                </button>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}


                  </div>
                ) : (
                  // Item simples sem submenu
                  <Link href={item.path!}>
                    {!isExpanded ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={`flex items-center justify-center h-12 hover:bg-[#0088C0] transition-colors cursor-pointer ${
                              location === item.path ? "bg-[#0088C0] border-l-4 border-white" : ""
                            }`}
                          >
                            {item.icon}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-gray-900 text-white">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div
                        className={`flex items-center gap-3 px-4 h-12 hover:bg-[#0088C0] transition-colors cursor-pointer ${
                          location === item.path ? "bg-[#0088C0] border-l-4 border-white" : ""
                        }`}
                      >
                        {item.icon}
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
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
            <div className="flex items-center gap-12">
              {/* Logo TRACK */}
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <img 
                    src="/logo-track-erp.png" 
                    alt="Track ERP" 
                    className="h-32 transition-all duration-300 hover:scale-[1.5] hover:z-50" 
                  />
                </div>
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
                  <Button className="h-8 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo registro
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setLocation("/orcamentos")}>
                    <FileText className="w-4 h-4 mr-2" />
                    Novo Orçamento
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/vendas")}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Nova Venda
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/contratos")}>
                    <FileCheck className="w-4 h-4 mr-2" />
                    Novo Contrato
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation("/clientes")}>
                    <User className="w-4 h-4 mr-2" />
                    Novo Cliente
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/produtos")}>
                    <Package className="w-4 h-4 mr-2" />
                    Novo Produto
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notificações */}
              <Button variant="ghost" size="icon" className="relative h-8 w-8">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* Ajuda */}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="w-5 h-5 text-gray-600" />
              </Button>

              {/* Menu do usuário */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 gap-2 px-2">
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
                  <DropdownMenuItem onClick={() => setLocation("/perfil")}>
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/configuracoes/dados-empresa")}>
                    <Building className="w-4 h-4 mr-2" />
                    Empresa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLocation("/configuracoes")}>
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
          <main className="mt-24 flex-1 overflow-auto">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
