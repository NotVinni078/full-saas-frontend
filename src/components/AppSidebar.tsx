
import React from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  MessageCircle,
  Calendar,
  Zap,
  ListTodo,
  Megaphone,
  Contact,
  Star,
  Tag,
  UserCog,
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
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
    icon: BarChart3,
    items: [
      { id: 'dashboard-gerencial', label: 'Dashboard Gerencial', icon: BarChart3 },
      { id: 'dashboard-admin', label: 'Dashboard Administrativo', icon: UserCog },
      { id: 'dashboard-usuario', label: 'Dashboard Usuário', icon: Users },
    ]
  },
  {
    id: 'atendimentos',
    label: 'Atendimentos',
    icon: MessageCircle,
    items: [
      { id: 'chat-interno', label: 'Chat Interno', icon: MessageCircle },
      { id: 'painel-atendimentos', label: 'Painel de Atendimentos', icon: Users },
      { id: 'agendamentos', label: 'Agendamentos', icon: Calendar },
      { id: 'respostas-rapidas', label: 'Respostas Rápidas', icon: Zap },
      { id: 'tarefas', label: 'Tarefas', icon: ListTodo },
      { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
    ]
  },
  {
    id: 'gestao',
    label: 'Gestão',
    icon: Settings,
    items: [
      { id: 'gestao-contatos', label: 'Gestão de Contatos', icon: Contact },
      { id: 'avaliacao', label: 'Avaliação (NPS)', icon: Star },
      { id: 'tags', label: 'Tags', icon: Tag },
    ]
  },
  {
    id: 'administracao',
    label: 'Administração',
    icon: UserCog,
    items: [
      { id: 'gestao-usuarios', label: 'Gestão de Usuários', icon: Users },
      { id: 'gestao-setores', label: 'Gestão de Setores', icon: Building2 },
      { id: 'anuncios', label: 'Anúncios', icon: Megaphone },
      { id: 'admin-empresas', label: 'Administração de Empresas', icon: Building },
    ]
  },
  {
    id: 'financeiro',
    label: 'Financeiro',
    icon: CreditCard,
    items: [
      { id: 'faturas', label: 'Faturas', icon: CreditCard },
      { id: 'planos', label: 'Planos', icon: Package },
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
  { id: 'conexoes', label: 'Conexões', icon: Plug },
  { id: 'documentacao', label: 'Documentação', icon: FileText },
];

const AppSidebar = ({ currentPage, onPageChange, isCollapsed, onToggleCollapse, onLogout }: AppSidebarProps) => {
  const [openGroups, setOpenGroups] = React.useState<string[]>(['dashboards']);

  const toggleGroup = (groupId: string) => {
    setOpenGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
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
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                    "text-gray-700 dark:text-gray-300"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <GroupIcon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{group.label}</span>}
                  </div>
                  {!isCollapsed && (
                    isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
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
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <ItemIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
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
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
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
          {!isCollapsed && <span className="ml-2">Sair</span>}
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
