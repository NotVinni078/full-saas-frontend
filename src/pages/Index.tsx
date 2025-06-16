
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import PageContent from '@/components/PageContent';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (!isAuthenticated) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebar}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' ? (
          <Dashboard />
        ) : (
          <PageContent page={currentPage} />
        )}
      </main>
    </div>
  );
};

export default Index;
