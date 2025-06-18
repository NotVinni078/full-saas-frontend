
import React from 'react';
import AtendimentosOmnichannel from './AtendimentosOmnichannel';
import GestaoContatos from './GestaoContatos';
import GestaoUsuarios from './GestaoUsuarios';
import Agendamentos from './Agendamentos';
import Tarefas from './Tarefas';
import RespostasRapidas from './RespostasRapidas';
import ChatInterno from './ChatInterno';
import PainelAtendimentos from './PainelAtendimentos';
import Tags from './Tags';
import Conexoes from './Conexoes';

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
      
      case 'gestao-usuarios':
        return <GestaoUsuarios />;
      
      case 'agendamentos':
        return <Agendamentos />;
      
      case 'tarefas':
        return <Tarefas />;
      
      case 'respostas-rapidas':
        return <RespostasRapidas />;
      
      case 'chat-interno':
        return <ChatInterno />;

      case 'painel-atendimentos':
        return <PainelAtendimentos />;

      case 'tags':
        return <Tags />;

      case 'conexoes':
        return <Conexoes />;

      case 'campanhas':
        return (
          <div className="p-6 brand-background min-h-full">
            <h1 className="text-2xl font-bold brand-text-foreground mb-4">Campanhas</h1>
            <p className="brand-text-gray-600">Criação e gerenciamento de campanhas de marketing.</p>
          </div>
        );

      default:
        return (
          <div className="p-6 brand-background min-h-full">
            <h1 className="text-2xl font-bold brand-text-foreground mb-4">Página em Desenvolvimento</h1>
            <p className="brand-text-gray-600">Esta página está sendo desenvolvida.</p>
          </div>
        );
    }
  };

  return (
    <div className="h-full brand-background">
      {renderContent()}
    </div>
  );
};

export default PageContent;
