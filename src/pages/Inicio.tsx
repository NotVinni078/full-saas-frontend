
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
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

const InicioContent = () => {
  const { notasAtualizacao } = useAnuncios();
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

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao Sistema</h1>
        <p className="text-muted-foreground">Confira as últimas atualizações e novidades</p>
      </div>

      {/* Notas de Atualização */}
      <AnunciosSlider
        items={notasAtualizacao}
        onCardClick={handleCardClick}
        title="Notas de Atualização"
        icon={<FileText className="h-6 w-6 text-blue-600" />}
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

const Inicio = () => {
  return (
    <SidebarLayout>
      <InicioContent />
    </SidebarLayout>
  );
};

export default Inicio;
