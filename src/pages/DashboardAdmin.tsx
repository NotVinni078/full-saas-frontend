
import React from 'react';
import Dashboard from '@/components/Dashboard';
import SidebarLayout from '@/components/SidebarLayout';

const DashboardAdmin = () => {
  return (
    <SidebarLayout>
      <Dashboard currentPage="dashboard-admin" />
    </SidebarLayout>
  );
};

export default DashboardAdmin;
