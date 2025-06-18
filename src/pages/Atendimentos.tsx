
import React from 'react';
import AtendimentosOmnichannel from '@/components/AtendimentosOmnichannel';
import SidebarLayout from '@/components/SidebarLayout';

const Atendimentos = () => {
  return (
    <SidebarLayout>
      <div className="brand-background min-h-full">
        <AtendimentosOmnichannel />
      </div>
    </SidebarLayout>
  );
};

export default Atendimentos;
