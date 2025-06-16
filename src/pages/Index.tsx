
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import AppSidebar from '@/components/AppSidebar';
import NavBar from '@/components/NavBar';
import Dashboard from '@/components/Dashboard';
import PageContent from '@/components/PageContent';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard-gerencial');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard-gerencial');
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

  if (!isAuthenticated) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex w-full ${isDarkMode ? 'dark' : ''}`}>
      <AppSidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <NavBar
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          currentLanguage={currentLanguage}
          onLanguageChange={handleLanguageChange}
        />
        
        <main className="flex-1 overflow-auto">
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

export default Index;
