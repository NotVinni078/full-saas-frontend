
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Bell, BellRing, Sun, Moon, CreditCard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavBarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const NavBar = ({ isDarkMode, onToggleTheme, currentLanguage, onLanguageChange }: NavBarProps) => {
  const [notifications] = useState({
    atendimentos: 3,
    chatInterno: 1,
    faturas: 2
  });

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (USA)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-end space-x-4">
        {/* Notificações */}
        <div className="flex items-center space-x-3">
          {/* Notificações de Atendimentos */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications.atendimentos > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications.atendimentos}
                </Badge>
              )}
            </Button>
          </div>

          {/* Notificações de Chat Interno */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <BellRing className="h-5 w-5" />
              {notifications.chatInterno > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications.chatInterno}
                </Badge>
              )}
            </Button>
          </div>

          {/* Notificações de Faturas */}
          <div className="relative">
            <Button variant="ghost" size="icon" className="relative">
              <CreditCard className="h-5 w-5" />
              {notifications.faturas > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {notifications.faturas}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

        {/* Controles de tema e idioma */}
        <div className="flex items-center space-x-2">
          {/* Toggle de tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-9 w-9"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Seletor de idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
              >
                <span className="text-sm">{currentLang?.flag}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-gray-800 border dark:border-gray-700">
              {languages.map((language) => (
                <DropdownMenuItem
                  key={language.code}
                  onClick={() => onLanguageChange(language.code)}
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="text-sm dark:text-white">{language.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
