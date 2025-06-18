
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

const Faturas = () => {
  return (
    <SidebarLayout>
      <div className="p-6 brand-background min-h-full">
        <h1 className="text-2xl font-bold brand-text-foreground mb-4">Faturas</h1>
        <p className="brand-text-gray-600">Gerenciamento de faturas e cobrança.</p>
      </div>
    </SidebarLayout>
  );
};

export default Faturas;
