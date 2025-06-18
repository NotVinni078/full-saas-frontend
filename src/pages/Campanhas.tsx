
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

const Campanhas = () => {
  return (
    <SidebarLayout>
      <div className="p-6 brand-background min-h-full">
        <h1 className="text-2xl font-bold brand-text-foreground mb-4">Campanhas</h1>
        <p className="brand-text-gray-600">Criação e gerenciamento de campanhas de marketing.</p>
      </div>
    </SidebarLayout>
  );
};

export default Campanhas;
