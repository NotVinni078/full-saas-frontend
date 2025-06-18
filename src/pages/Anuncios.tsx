
import React, { useState } from 'react';
import { Bell, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SidebarLayout from '@/components/SidebarLayout';
import AnunciosSlider from '@/components/AnunciosSlider';
import CardModal from '@/components/CardModal';
import { useAnuncios } from '@/contexts/AnunciosContext';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

const AnunciosContent = () => {
  const { notasAtualizacao, anuncios, addAnuncio } = useAnuncios();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleNovoAnuncio = () => {
    // Implementar ação do novo anúncio
    console.log('Novo anúncio clicado');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header com botão Novo Anúncio */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Anúncios e Atualizações</h1>
          <p className="text-muted-foreground">Fique por dentro das últimas novidades e atualizações do sistema</p>
        </div>
        <Button 
          onClick={handleNovoAnuncio}
          className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Anúncio
        </Button>
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

      {/* Modal */}
      <CardModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        card={selectedCard}
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
