
import React from 'react';
import InfrastructureDashboard from '@/components/InfrastructureDashboard';
import SidebarLayout from '@/components/SidebarLayout';

const DashboardInfraestrutura = () => {
  return (
    <SidebarLayout>
      <div className="min-h-full bg-background">
        <InfrastructureDashboard />
      </div>
    </SidebarLayout>
  );
};

export default DashboardInfraestrutura;
