
import React, { useState } from 'react';
import { Bell, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarLayout from '@/components/SidebarLayout';
import AnunciosSlider from '@/components/AnunciosSlider';
import CardModal from '@/components/CardModal';
import NovoAnuncioModal from '@/components/NovoAnuncioModal';
import { useAnuncios } from '@/contexts/AnunciosContext';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

const AnunciosContent = () => {
  const { notasAtualizacao, anuncios } = useAnuncios();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isNovoAnuncioModalOpen, setIsNovoAnuncioModalOpen] = useState(false);

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsCardModalOpen(true);
  };

  const handleCloseCardModal = () => {
    setIsCardModalOpen(false);
    setSelectedCard(null);
  };

  const handleNovoAnuncio = () => {
    setIsNovoAnuncioModalOpen(true);
  };

  const handleCloseNovoAnuncioModal = () => {
    setIsNovoAnuncioModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header com botão Novo Anúncio */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Anúncios</h1>
          <p className="text-muted-foreground">Crie e gerencie anúncios e notas de atualização do sistema</p>
        </div>
        <Button 
          onClick={handleNovoAnuncio}
          className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Anúncio
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-medium">Notas de Atualização</span>
          </div>
          <p className="text-2xl font-bold mt-2">{notasAtualizacao.length}</p>
          <p className="text-sm text-muted-foreground">Total de notas publicadas</p>
        </div>
        
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-green-600" />
            <span className="font-medium">Anúncios</span>
          </div>
          <p className="text-2xl font-bold mt-2">{anuncios.length}</p>
          <p className="text-sm text-muted-foreground">Total de anúncios publicados</p>
        </div>
      </div>

      {/* Notas de Atualização */}
      <AnunciosSlider
        items={notasAtualizacao}
        onCardClick={handleCardClick}
        title="Notas de Atualização"
        icon={<FileText className="h-6 w-6 text-blue-600" />}
      />

      {/* Anúncios */}
      <AnunciosSlider
        items={anuncios}
        onCardClick={handleCardClick}
        title="Anúncios"
        icon={<Bell className="h-6 w-6 text-green-600" />}
      />

      {/* Modal de visualização de card */}
      <CardModal
        isOpen={isCardModalOpen}
        onClose={handleCloseCardModal}
        card={selectedCard}
      />

      {/* Modal de novo anúncio */}
      <NovoAnuncioModal
        isOpen={isNovoAnuncioModalOpen}
        onClose={handleCloseNovoAnuncioModal}
      />
    </div>
  );
};

const Anuncios = () => {
  return (
    <SidebarLayout>
      <AnunciosContent />
    </SidebarLayout>
  );
};

export default Anuncios;
