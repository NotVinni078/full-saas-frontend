
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar com overlay em mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-50 
        ${sidebarCollapsed ? '-translate-x-full' : 'translate-x-0'} 
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
      `}>
        <AppSidebar
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isCollapsed={false} // Sempre expandida em mobile
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

      {/* Botão flutuante para abrir sidebar em mobile */}
      {sidebarCollapsed && (
        <Button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 md:hidden bg-gray-800 dark:bg-gray-200 text-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-300 shadow-lg rounded-full w-12 h-12 p-0 flex items-center justify-center"
        >
          <Menu className="h-6 w-6" />
        </Button>
      )}
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <NavBar
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
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
