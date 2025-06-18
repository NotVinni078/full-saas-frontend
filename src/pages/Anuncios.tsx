
import React, { useState } from 'react';
import { Bell, FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

      {/* Navigation Tabs */}
      <Tabs defaultValue="anuncios" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="anuncios" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Anúncios</span>
          </TabsTrigger>
          <TabsTrigger value="notas" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Notas de Atualização</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anuncios" className="space-y-4">
          <AnunciosSlider
            items={anuncios}
            onCardClick={handleCardClick}
            title="Anúncios"
            icon={<Bell className="h-6 w-6 text-green-600" />}
            showDeleteButton={true}
          />
        </TabsContent>

        <TabsContent value="notas" className="space-y-4">
          <AnunciosSlider
            items={notasAtualizacao}
            onCardClick={handleCardClick}
            title="Notas de Atualização"
            icon={<FileText className="h-6 w-6 text-blue-600" />}
            showDeleteButton={true}
          />
        </TabsContent>
      </Tabs>

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
