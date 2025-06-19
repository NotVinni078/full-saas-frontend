
import React from 'react';
import ChatInterno from '@/components/ChatInterno';
import SidebarLayout from '@/components/SidebarLayout';

/**
 * Página principal do Chat Interno
 * Esta página renderiza o componente ChatInterno dentro do layout padrão com sidebar
 * Utiliza as cores dinâmicas configuradas na gestão de marca
 * Totalmente responsiva para desktop, tablet e mobile
 */
const ChatInternoPage = () => {
  return (
    <SidebarLayout>
      <ChatInterno />
    </SidebarLayout>
  );
};

export default ChatInternoPage;
