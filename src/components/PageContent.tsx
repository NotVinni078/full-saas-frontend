
import React from 'react';
import AtendimentosOmnichannel from './AtendimentosOmnichannel';
import GestaoContatos from './GestaoContatos';

interface PageContentProps {
  page: string;
}

const PageContent = ({ page }: PageContentProps) => {
  const renderContent = () => {
    switch (page) {
      case 'atendimentos':
        return <AtendimentosOmnichannel />;
      
      case 'gestao-contatos':
        return <GestaoContatos />;
      
      case 'chat-interno':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Chat Interno</h1>
            <p className="text-gray-600">Sistema de chat interno entre colaboradores.</p>
          </div>
        );

      case 'painel-atendimentos':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Painel de Atendimentos</h1>
            <p className="text-gray-600">Painel para monitoramento de atendimentos.</p>
          </div>
        );

      case 'agendamentos':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Agendamentos</h1>
            <p className="text-gray-600">Sistema de agendamento de consultas e reuniões.</p>
          </div>
        );

      case 'respostas-rapidas':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Respostas Rápidas</h1>
            <p className="text-gray-600">Modelos de respostas pré-definidas para agilizar o atendimento.</p>
          </div>
        );

      case 'tarefas':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Tarefas</h1>
            <p className="text-gray-600">Gerenciamento de tarefas e atividades.</p>
          </div>
        );

      case 'campanhas':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Campanhas</h1>
            <p className="text-gray-600">Criação e gerenciamento de campanhas de marketing.</p>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Página em Desenvolvimento</h1>
            <p className="text-gray-600">Esta página está sendo desenvolvida.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
    </div>
  );
};

export default PageContent;
