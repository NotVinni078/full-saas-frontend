
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import TenantManagement from '@/components/TenantManagement';

/**
 * Página de Gerenciamento de Tenants
 * Renderiza o layout da sidebar com o componente de gerenciamento de tenants
 */
const TenantManagementPage = () => {
  return (
    <SidebarLayout>
      <TenantManagement />
    </SidebarLayout>
  );
};

export default TenantManagementPage;
