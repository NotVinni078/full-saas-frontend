
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

const AdminEmpresas = () => {
  return (
    <SidebarLayout>
      <div className="p-6 brand-background min-h-full">
        <h1 className="text-2xl font-bold brand-text-foreground mb-4">Administração de Empresas</h1>
        <p className="brand-text-gray-600">Gerenciamento e administração de empresas cadastradas.</p>
      </div>
    </SidebarLayout>
  );
};

export default AdminEmpresas;
