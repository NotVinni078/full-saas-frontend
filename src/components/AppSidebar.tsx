
import React from 'react';
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
  UserX
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
      { id: 'dashboard-gerencial', label: 'Dashboard Gerencial', icon: ChartColumn },
      { id: 'dashboard-admin', label: 'Dashboard Administrativo', icon: ChartColumn },
      { id: 'dashboard-usuario', label: 'Dashboard Usuário', icon: ChartColumn },
    ]
  },
  {
    id: 'atendimentos',
    label: 'Atendimentos',
    icon: MessageSquare,
    items: [
      { id: 'chat-interno', label: 'Chat Interno', icon: MessageSquare },
      { id: 'painel-atendimentos', label: 'Painel de Atendimentos', icon: MessageSquareCode },
      { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
      { id: 'respostas-rapidas', label: 'Respostas Rápidas', icon: Zap },
      { id: 'tarefas', label: 'Tarefas', icon: ListTodo },
      { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
    ]
  },
  {
    id: 'gestao',
    label: 'Gestão',
    icon: Computer,
    items: [
      { id: 'gestao-contatos', label: 'Gestão de Contatos', icon: SquareUser },
      { id: 'avaliacao', label: 'Avaliação (NPS)', icon: Star },
      { id: 'tags', label: 'Tags', icon: Tag },
    ]
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: UserPen,
    items: [
      { id: 'gestao-usuarios', label: 'Gestão de Usuários', icon: UserPen },
      { id: 'gestao-setores', label: 'Gestão de Setores', icon: Network },
      { id: 'anuncios', label: 'Anúncios', icon: Newspaper },
      { id: 'admin-empresas', label: 'Administração de Empresas', icon: Building2 },
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CreditCard,
    items: [
      { id: 'faturas', label: 'Faturas', icon: Receipt },
      { id: 'planos', label: 'Planos', icon: SquareChartGantt },
      { id: 'gestao-planos', label: 'Gestão de Planos', icon: Sliders },
    ]
  },
  {
    id: 'configuracoes',
    label: 'Configurações',
    icon: Settings,
    items: [
      { id: 'ajustes', label: 'Ajustes', icon: Wrench },
      { id: 'gerenciar-marca', label: 'Gerenciar Marca', icon: Palette },
      { id: 'integracoes', label: 'Integrações', icon: Plug },
    ]
  }
];

const singleItems = [
  { id: 'chatbot', label: 'ChatBot', icon: Bot },
  { id: 'conexoes', label: 'Conexões', icon: Waypoints },
  { id: 'documentacao', label: 'Documentação', icon: FileText },
];

const AppSidebar = ({ currentPage, onPageChange, isCollapsed, onToggleCollapse, onLogout }: AppSidebarProps) => {
  const [openGroups, setOpenGroups] = React.useState<string[]>(['dashboards']);
  const [userStatus, setUserStatus] = React.useState(true); // true = online (UserCheck), false = offline (UserX)

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

  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 h-screen",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              SaasFlow
            </h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          <PanelLeft className="h-4 w-4 text-black dark:text-white" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {/* Grupos de menu com submenu */}
        {menuGroups.map((group) => {
          const isOpen = openGroups.includes(group.id);
          const GroupIcon = group.icon;
          
          return (
            <Collapsible key={group.id} open={isOpen} onOpenChange={() => toggleGroup(group.id)}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
                    isCollapsed && "justify-center",
                    "text-black dark:text-white"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <GroupIcon className="h-5 w-5 flex-shrink-0 text-black dark:text-white" />
                    {!isCollapsed && <span className="font-medium text-black dark:text-white">{group.label}</span>}
                  </div>
                  {!isCollapsed && (
                    isOpen ? <ChevronUp className="h-4 w-4 text-black dark:text-white" /> : <ChevronDown className="h-4 w-4 text-black dark:text-white" />
                  )}
                </button>
              </CollapsibleTrigger>
              
              {!isCollapsed && (
                <CollapsibleContent className="space-y-1 mt-1">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = currentPage === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => onPageChange(item.id)}
                        className={cn(
                          "w-full flex items-center space-x-3 px-3 py-2 ml-6 rounded-lg text-left transition-colors text-sm",
                          isActive 
                            ? "bg-blue-500 text-white" 
                            : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <ItemIcon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "text-black dark:text-white")} />
                        <span className={isActive ? "text-white" : "text-black dark:text-white"}>{item.label}</span>
                      </button>
                    );
                  })}
                </CollapsibleContent>
              )}
            </Collapsible>
          );
        })}

        {/* Itens individuais */}
        {singleItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                isActive 
                  ? "bg-blue-500 text-white" 
                  : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-white" : "text-black dark:text-white")} />
              {!isCollapsed && <span className={cn("font-medium", isActive ? "text-white" : "text-black dark:text-white")}>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Usuário</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">usuario@exemplo.com</p>
            </div>
            <button
              onClick={toggleUserStatus}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              {userStatus ? (
                <UserCheck className="h-4 w-4 text-black dark:text-white" />
              ) : (
                <UserX className="h-4 w-4 text-red-600" />
              )}
            </button>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950",
            isCollapsed ? "justify-center p-2" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
