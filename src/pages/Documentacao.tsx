
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

const Documentacao = () => {
  return (
    <SidebarLayout>
      <div className="p-6 brand-background min-h-full">
        <h1 className="text-2xl font-bold brand-text-foreground mb-4">Documentação</h1>
        <p className="brand-text-gray-600">Documentação do sistema e guias de uso.</p>
      </div>
    </SidebarLayout>
  );
};

export default Documentacao;
