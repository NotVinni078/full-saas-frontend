
import React from 'react';
import { Globe, Sun, Moon, ArrowLeft, MessageSquare, MessagesSquare, Receipt, PanelLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onLanguageChange,
  onToggleSidebar,
  isSidebarCollapsed
}: NavBarProps) => {
  const [isConversationOpen, setIsConversationOpen] = React.useState(false);

  const handleCloseConversation = () => {
    setIsConversationOpen(false);
    // Aqui você pode adicionar a lógica para fechar a conversa
  };

  return (
    <TooltipProvider>
      <nav className="bg-card border-b border-border px-6 py-4 flex items-center justify-between h-20">
        <div className="flex items-center space-x-4">
          {/* Botão da sidebar no header */}
          {isSidebarCollapsed && onToggleSidebar && (
            <Button
              onClick={onToggleSidebar}
              variant="ghost"
              size="sm"
              className="md:hidden p-2 text-foreground hover:bg-accent"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Botão arrow-left para fechar conversa quando aberta */}
          {isConversationOpen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseConversation}
              className="p-2 text-foreground hover:bg-accent"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notificações de Atendimentos */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border-border">
              <p>Notificações de Atendimentos</p>
            </TooltipContent>
          </Tooltip>

          {/* Notificações de Chat Interno */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <MessagesSquare className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  1
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border-border">
              <p>Notificações de Chat Interno</p>
            </TooltipContent>
          </Tooltip>

          {/* Notificações de Faturas */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Receipt className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  5
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border-border">
              <p>Notificações de Faturas</p>
            </TooltipContent>
          </Tooltip>

          {/* Seletor de idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => onLanguageChange('pt-BR')} className="text-foreground hover:bg-accent">
                🇧🇷 Português
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLanguageChange('en-US')} className="text-foreground hover:bg-accent">
                🇺🇸 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLanguageChange('es-ES')} className="text-foreground hover:bg-accent">
                🇪🇸 Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Toggle de tema */}
          <Button variant="ghost" size="sm" onClick={onToggleTheme} className="p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>
    </TooltipProvider>
  );
};

export default NavBar;
