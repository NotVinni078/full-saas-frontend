
import React from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  CreditCard, 
  FileText, 
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'analytics', label: 'Análises', icon: BarChart3 },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'billing', label: 'Faturamento', icon: CreditCard },
  { id: 'reports', label: 'Relatórios', icon: FileText },
  { id: 'notifications', label: 'Notificações', icon: Bell },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

const Sidebar = ({ currentPage, onPageChange, isCollapsed, onToggleCollapse, onLogout }: SidebarProps) => {
  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            SaasFlow
          </h1>
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
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                isActive 
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                  : "text-gray-600 hover:bg-gray-100",
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
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              U
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Usuário</p>
              <p className="text-xs text-gray-500 truncate">usuario@exemplo.com</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={onLogout}
          className={cn(
            "w-full text-red-600 hover:text-red-700 hover:bg-red-50",
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

export default Sidebar;
