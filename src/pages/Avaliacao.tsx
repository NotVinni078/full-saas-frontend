
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

const Avaliacao = () => {
  return (
    <SidebarLayout>
      <div className="p-6 brand-background min-h-full">
        <h1 className="text-2xl font-bold brand-text-foreground mb-4">Avaliação (NPS)</h1>
        <p className="brand-text-gray-600">Sistema de avaliação e Net Promoter Score.</p>
      </div>
    </SidebarLayout>
  );
};

export default Avaliacao;
