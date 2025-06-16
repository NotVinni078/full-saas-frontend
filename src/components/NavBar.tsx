
import React from 'react';
import { Bell, Globe, Sun, Moon, User, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavBarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

const NavBar = ({ 
  isDarkMode, 
  onToggleTheme, 
  currentLanguage, 
  onLanguageChange 
}: NavBarProps) => {
  const [isConversationOpen, setIsConversationOpen] = React.useState(false);

  const handleCloseConversation = () => {
    setIsConversationOpen(false);
    // Aqui você pode adicionar a lógica para fechar a conversa
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between h-20">
      <div className="flex items-center space-x-4">
        {/* Botão arrow-left para fechar conversa quando aberta */}
        {isConversationOpen && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseConversation}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4 text-black dark:text-white" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Notificações */}
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Seletor de idioma */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <Globe className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onLanguageChange('pt-BR')}>
              🇧🇷 Português
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange('en-US')}>
              🇺🇸 English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onLanguageChange('es-ES')}>
              🇪🇸 Español
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Toggle de tema */}
        <Button variant="ghost" size="sm" onClick={onToggleTheme} className="p-2">
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </Button>

        {/* Perfil do usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default NavBar;
