
import React from 'react';
import Conexoes from '@/components/Conexoes';
import SidebarLayout from '@/components/SidebarLayout';

const ConexoesPage = () => {
  return (
    <SidebarLayout>
      <div className="brand-background min-h-full">
        <Conexoes />
      </div>
    </SidebarLayout>
  );
};

export default ConexoesPage;
