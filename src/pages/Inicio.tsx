
import React, { useState } from 'react';
import AppSidebar from '@/components/AppSidebar';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';
import PageContent from '@/components/PageContent';

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
