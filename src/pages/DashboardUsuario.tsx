
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Construction } from 'lucide-react';

const DashboardUsuario = () => {
  return (
    <SidebarLayout>
      <div className="p-6 bg-background min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <Construction className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Dashboard Usuário</h1>
          <p className="text-muted-foreground max-w-md">
            Esta página está em construção. Em breve teremos novidades!
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default DashboardUsuario;
