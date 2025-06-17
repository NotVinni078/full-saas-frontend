
import React from 'react';
import Dashboard from '@/components/Dashboard';
import SidebarLayout from '@/components/SidebarLayout';

const DashboardGerencial = () => {
  return (
    <SidebarLayout>
      <Dashboard currentPage="dashboard-gerencial" />
    </SidebarLayout>
  );
};

export default DashboardGerencial;
