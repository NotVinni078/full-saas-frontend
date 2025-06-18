
import React from 'react';
import Dashboard from '@/components/Dashboard';
import SidebarLayout from '@/components/SidebarLayout';

const DashboardUsuario = () => {
  return (
    <SidebarLayout>
      <Dashboard currentPage="dashboard-usuario" />
    </SidebarLayout>
  );
};

export default DashboardUsuario;
