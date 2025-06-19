
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import Conexoes from '@/components/Conexoes';

/**
 * Página principal de Gerenciamento de Conexões
 * Utiliza o SidebarLayout para manter a estrutura padrão da aplicação
 * Integra com as cores dinâmicas definidas na gestão de marca
 */
const ConexoesPage = () => {
  return (
    <SidebarLayout>
      {/* Container principal com fundo dinâmico da marca */}
      <div className="brand-background min-h-screen">
        <Conexoes />
      </div>
    </SidebarLayout>
  );
};

export default ConexoesPage;
