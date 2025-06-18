
import React from 'react';
import Agendamentos from '@/components/Agendamentos';
import SidebarLayout from '@/components/SidebarLayout';

const AgendamentosPage = () => {
  return (
    <SidebarLayout>
      <div className="brand-background min-h-full">
        <Agendamentos />
      </div>
    </SidebarLayout>
  );
};

export default AgendamentosPage;
