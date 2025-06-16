
import React, { useState } from 'react';
import { PanelLeft } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';
import PageContent from '@/components/PageContent';
import { Button } from '@/components/ui/button';

const Inicio = () => {
  const [currentPage, setCurrentPage] = useState('dashboard-gerencial');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

  const handleLogout = () => {
    window.location.href = '/auth';
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  return (
    <div className={`h-screen bg-gray-50 dark:bg-gray-900 flex w-full overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar - comportamento responsivo corrigido */}
      <div className={`
        fixed inset-y-0 left-0 z-50 md:relative md:z-auto
        ${sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'} 
        transition-transform duration-300 ease-in-out
      `}>
        <AppSidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          onLogout={handleLogout}
        />
      </div>

      {/* Overlay para fechar sidebar em mobile */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Botão discreto para abrir sidebar em mobile - reposicionado */}
      {sidebarCollapsed && (
        <Button
          onClick={toggleSidebar}
          className="fixed bottom-20 left-4 z-50 md:hidden bg-transparent text-black hover:bg-gray-100 backdrop-blur-sm shadow-md rounded-md w-8 h-8 p-0 flex items-center justify-center"
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <NavBar
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 min-h-0">
          {currentPage.includes('dashboard') ? (
            <Dashboard />
          ) : (
            <PageContent page={currentPage} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Inicio;
