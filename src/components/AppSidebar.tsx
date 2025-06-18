
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  PanelLeft,
  LayoutDashboard,
  ChartColumn,
  Users, 
  Settings, 
  MessageSquare,
  Calendar,
  Zap,
  ListTodo,
  Megaphone,
  Contact,
  Star,
  Tag,
  Computer,
  Building2,
  Building,
  CreditCard,
  Package,
  Sliders,
  Bot,
  Plug,
  FileText,
  Wrench,
  Palette,
  LogOut,
  ChevronDown,
  ChevronUp,
  MessageSquareCode,
  SquareUser,
  UserPen,
  Network,
  Newspaper,
  Receipt,
  SquareChartGantt,
  Waypoints,
  UserCheck,
  UserX,
  MessagesSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AppSidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const menuGroups = [
  {
    id: 'dashboards',
    label: 'Dashboards',
    icon: LayoutDashboard,
    items: [
      { id: 'dashboard-gerencial', label: 'Dashboard de Infraestrutura', icon: ChartColumn, route: '/dashboard-gerencial' },
      { id: 'dashboard-admin', label: 'Dashboard Administrativo', icon: ChartColumn, route: '/dashboard-admin' },
      { id: 'dashboard-usuario', label: 'Dashboard Usuário', icon: ChartColumn, route: '/dashboard-usuario' },
    ]
  },
  {
    id: 'gestao',
    label: 'Gestão',
    icon: Computer,
    items: [
      { id: 'gestao-contatos', label: 'Gestão de Contatos', icon: SquareUser, route: '/gestao-contatos' },
      { id: 'avaliacao', label: 'Avaliação (NPS)', icon: Star, route: '/avaliacao' },
      { id: 'tags', label: 'Tags', icon: Tag, route: '/tags' },
    ]
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: UserPen,
    items: [
      { id: 'gestao-usuarios', label: 'Gestão de Usuários', icon: UserPen, route: '/gestao-usuarios' },
      { id: 'gestao-setores', label: 'Gestão de Setores', icon: Network, route: '/gestao-setores' },
      { id: 'anuncios', label: 'Anúncios', icon: Newspaper, route: '/anuncios' },
      { id: 'admin-empresas', label: 'Administração de Empresas', icon: Building2, route: '/admin-empresas' },
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CreditCard,
    items: [
      { id: 'faturas', label: 'Faturas', icon: Receipt, route: '/faturas' },
      { id: 'planos', label: 'Planos', icon: SquareChartGantt, route: '/planos' },
      { id: 'gestao-planos', label: 'Gestão de Planos', icon: Sliders, route: '/gestao-planos' },
    ]
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    items: [
      { id: 'ajustes', label: 'Ajustes', icon: Wrench, route: '/ajustes' },
      { id: 'gerenciar-marca', label: 'Gerenciar Marca', icon: Palette, route: '/gerenciar-marca' },
      { id: 'integracoes', label: 'Integrações', icon: Plug, route: '/integracoes' },
    ]
  }
];

const singleItems = [
  { id: 'inicio', label: 'Início', icon: Home, route: '/inicio' },
  { id: 'atendimentos', label: 'Atendimentos', icon: MessageSquare, route: '/atendimentos' },
  { id: 'chat-interno', label: 'Chat Interno', icon: MessagesSquare, route: '/chat-interno' },
  { id: 'painel-atendimentos', label: 'Painel de Atendimentos', icon: MessageSquareCode, route: '/painel-atendimentos' },
  { id: 'agendamentos', label: 'Agendamentos', icon: Calendar, route: '/agendamentos' },
  { id: 'respostas-rapidas', label: 'Respostas Rápidas', icon: Zap, route: '/respostas-rapidas' },
  { id: 'tarefas', label: 'Tarefas', icon: ListTodo, route: '/tarefas' },
  { id: 'campanhas', label: 'Campanhas', icon: Megaphone, route: '/campanhas' },
  { id: 'chatbot', label: 'ChatBot', icon: Bot, route: '/chatbot' },
  { id: 'conexoes', label: 'Conexões', icon: Waypoints, route: '/conexoes' },
  { id: 'documentacao', label: 'Documentação', icon: FileText, route: '/documentacao' },
];

const AppSidebar = ({ currentPage, onPageChange, isCollapsed, onToggleCollapse, onLogout }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openGroups, setOpenGroups] = React.useState<string[]>(['dashboards']);
  const [userStatus, setUserStatus] = React.useState(true);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const toggleUserStatus = () => {
    setUserStatus(!userStatus);
  };

  const handleNavigation = (route: string, pageId: string) => {
    navigate(route);
    onPageChange(pageId);
  };

  const renderMenuItems = () => {
    const orderedItems = [];

    // 1. Início (item individual)
    const inicioItem = singleItems.find(item => item.id === 'inicio');
    if (inicioItem) {
      orderedItems.push({ type: 'single', data: inicioItem });
    }

    // 2. Dashboards (grupo)
    const dashboardsGroup = menuGroups.find(group => group.id === 'dashboards');
    if (dashboardsGroup) {
      orderedItems.push({ type: 'group', data: dashboardsGroup });
    }

    // 3-9. Itens individuais na ordem especificada
    const orderedSingleItems = [
      'atendimentos',
      'chat-interno', 
      'painel-atendimentos',
      'agendamentos',
      'respostas-rapidas',
      'tarefas',
      'campanhas'
    ];

    orderedSingleItems.forEach(itemId => {
      const item = singleItems.find(single => single.id === itemId);
      if (item) {
        orderedItems.push({ type: 'single', data: item });
      }
    });

    // 10-12. Grupos na ordem especificada
    const orderedGroups = ['gestao', 'administracao', 'financeiro'];
    orderedGroups.forEach(groupId => {
      const group = menuGroups.find(g => g.id === groupId);
      if (group) {
        orderedItems.push({ type: 'group', data: group });
      }
    });

    // 13-15. Itens individuais finais
    const finalSingleItems = ['chatbot', 'conexoes', 'documentacao'];
    finalSingleItems.forEach(itemId => {
      const item = singleItems.find(single => single.id === itemId);
      if (item) {
        orderedItems.push({ type: 'single', data: item });
      }
    });

    // 16. Configurações (grupo)
    const configGroup = menuGroups.find(group => group.id === 'configuracoes');
    if (configGroup) {
      orderedItems.push({ type: 'group', data: configGroup });
    }

    return orderedItems;
  };

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300 h-screen relative z-50",
      // Em mobile, sempre ocupa a largura total quando visível
      "w-full md:w-64",
      // Em desktop, respeita o estado collapsed
      isCollapsed && "md:w-16"
    )}>
      {/* Header - matching navbar height */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between h-20 bg-card">
        {(!isCollapsed || window.innerWidth < 768) && (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-black dark:from-gray-200 dark:to-white rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-black font-bold text-base">NE</span>
            </div>
            <h1 className="text-lg font-bold text-card-foreground">
              Nome da Empresa
            </h1>
          </div>
        )}
        {/* Botão de toggle apenas visível no desktop */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className={cn(
            "p-2 hidden md:flex", 
            isCollapsed && "w-full justify-center"
          )}
        >
          <PanelLeft className="h-4 w-4 text-card-foreground" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto bg-card">
        {renderMenuItems().map((item, index) => {
          if (item.type === 'group') {
            const group = item.data;
            const isOpen = openGroups.includes(group.id);
            const GroupIcon = group.icon;
            
            return (
              <Collapsible key={group.id} open={isOpen} onOpenChange={() => toggleGroup(group.id)}>
                <CollapsibleTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-colors hover:bg-accent",
                      isCollapsed && "md:justify-center",
                      "text-card-foreground"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <GroupIcon className="h-3.5 w-3.5 flex-shrink-0 text-card-foreground" />
                      {(!isCollapsed || window.innerWidth < 768) && <span className="font-medium text-xs text-card-foreground">{group.label}</span>}
                    </div>
                    {(!isCollapsed || window.innerWidth < 768) && (
                      isOpen ? <ChevronUp className="h-3 w-3 text-card-foreground" /> : <ChevronDown className="h-3 w-3 text-card-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
                
                {(!isCollapsed || window.innerWidth < 768) && (
                  <CollapsibleContent className="space-y-1 mt-1">
                    {group.items.map((subItem) => {
                      const ItemIcon = subItem.icon;
                      const isActive = location.pathname === subItem.route;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleNavigation(subItem.route, subItem.id)}
                          className={cn(
                            "w-full flex items-center space-x-2 px-2 py-1.5 ml-5 rounded-lg text-left transition-colors text-xs",
                            isActive 
                              ? "bg-black text-white dark:bg-white dark:text-black" 
                              : "text-card-foreground hover:bg-accent"
                          )}
                        >
                          <ItemIcon className={cn("h-3 w-3 flex-shrink-0", isActive ? "text-white dark:text-black" : "text-card-foreground")} />
                          <span className={cn("text-xs", isActive ? "text-white dark:text-black" : "text-card-foreground")}>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          } else {
            const singleItem = item.data;
            const Icon = singleItem.icon;
            const isActive = location.pathname === singleItem.route;
            
            return (
              <button
                key={singleItem.id}
                onClick={() => handleNavigation(singleItem.route, singleItem.id)}
                className={cn(
                  "w-full flex items-center space-x-2 px-2 py-1.5 rounded-lg text-left transition-colors",
                  isActive 
                    ? "bg-black text-white dark:bg-white dark:text-black" 
                    : "text-card-foreground hover:bg-accent",
                  isCollapsed && "md:justify-center"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 flex-shrink-0", isActive ? "text-white dark:text-black" : "text-card-foreground")} />
                {(!isCollapsed || window.innerWidth < 768) && <span className={cn("font-medium text-xs", isActive ? "text-white dark:text-black" : "text-card-foreground")}>{singleItem.label}</span>}
              </button>
            );
          }
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-border bg-card">
        {(!isCollapsed || window.innerWidth < 768) && (
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 bg-gradient-to-r from-gray-700 to-black dark:from-gray-200 dark:to-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold">
              <span className="text-xs">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-card-foreground truncate">Usuário</p>
              <p className="text-xs text-muted-foreground truncate">Administração</p>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleUserStatus}
                className="p-1 hover:bg-accent rounded flex items-center justify-center"
              >
                {userStatus ? (
                  <UserCheck className="h-3 w-3 text-green-600" />
                ) : (
                  <UserX className="h-3 w-3 text-red-600" />
                )}
              </button>
              
              <Button
                variant="ghost"
                onClick={onLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-6 w-6 p-1"
              >
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
        
        {isCollapsed && window.innerWidth >= 768 && (
          <div className="flex flex-col space-y-1">
            <button
              onClick={toggleUserStatus}
              className="p-1.5 hover:bg-accent rounded flex items-center justify-center"
            >
              {userStatus ? (
                <UserCheck className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <UserX className="h-3.5 w-3.5 text-red-600" />
              )}
            </button>
            
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 text-xs h-7 justify-center p-1"
            >
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppSidebar;
