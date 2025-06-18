
import React from 'react';
import Dashboard from '@/components/Dashboard';
import SidebarLayout from '@/components/SidebarLayout';

const DashboardGerencial = () => {
  return (
    <SidebarLayout>
      <div className="brand-background min-h-full">
        <Dashboard currentPage="dashboard-gerencial" />
      </div>
    </SidebarLayout>
  );
};

export default DashboardGerencial;
