
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';

const ChatBot = () => {
  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">ChatBot</h1>
        <p className="text-gray-600">Configuração e gerenciamento do chatbot automático.</p>
      </div>
    </SidebarLayout>
  );
};

export default ChatBot;
