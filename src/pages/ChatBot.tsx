
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import FluxosList from '@/components/chatbot/FluxosList';
import FluxoEditor from '@/components/chatbot/FluxoEditor';

export interface Fluxo {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const ChatBot = () => {
  const [currentView, setCurrentView] = useState<'list' | 'editor'>('list');
  const [selectedFluxo, setSelectedFluxo] = useState<Fluxo | null>(null);
  const [fluxos, setFluxos] = useState<Fluxo[]>([
    {
      id: '1',
      name: 'Atendimento Inicial',
      description: 'Fluxo principal de boas-vindas',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
  ]);

  const handleCreateFluxo = () => {
    const newFluxo: Fluxo = {
      id: Date.now().toString(),
      name: 'Novo Fluxo',
      description: 'Descrição do fluxo',
      nodes: [],
      edges: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false
    };
    setFluxos([...fluxos, newFluxo]);
    setSelectedFluxo(newFluxo);
    setCurrentView('editor');
  };

  const handleEditFluxo = (fluxo: Fluxo) => {
    setSelectedFluxo(fluxo);
    setCurrentView('editor');
  };

  const handleSaveFluxo = (updatedFluxo: Fluxo) => {
    setFluxos(fluxos.map(f => f.id === updatedFluxo.id ? updatedFluxo : f));
    setCurrentView('list');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedFluxo(null);
  };

  return (
    <SidebarLayout>
      <div className="brand-background min-h-full">
        {currentView === 'list' ? (
          <FluxosList 
            fluxos={fluxos} 
            onCreateFluxo={handleCreateFluxo}
            onEditFluxo={handleEditFluxo}
            onDeleteFluxo={(id) => setFluxos(fluxos.filter(f => f.id !== id))}
          />
        ) : (
          <FluxoEditor 
            fluxo={selectedFluxo}
            onSave={handleSaveFluxo}
            onBack={handleBackToList}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default ChatBot;
