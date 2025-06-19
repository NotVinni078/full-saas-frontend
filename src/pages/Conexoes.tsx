
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import Conexoes from '@/components/Conexoes';

/**
 * Página principal de Gerenciamento de Conexões
 * Renderiza o layout da sidebar com o componente de conexões
 * Utiliza cores dinâmicas da gestão de marca automaticamente
 */
const ConexoesPage = () => {
  return (
    <SidebarLayout>
      <Conexoes />
    </SidebarLayout>
  );
};

export default ConexoesPage;
