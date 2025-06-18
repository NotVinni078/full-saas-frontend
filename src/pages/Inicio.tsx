
import React, { useState } from 'react';
import { FileText, Bell, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SidebarLayout from '@/components/SidebarLayout';
import AnunciosSlider from '@/components/AnunciosSlider';
import CardModal from '@/components/CardModal';
import { useAnuncios } from '@/contexts/AnunciosContext';
import { useNavigate } from 'react-router-dom';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

const InicioContent = () => {
  const { notasAtualizacao, anuncios } = useAnuncios();
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (card: CardData) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const handleGerenciarAnuncios = () => {
    navigate('/anuncios');
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao Sistema</h1>
          <p className="text-muted-foreground">Confira as últimas atualizações e novidades</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="notas" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notas" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Notas de Atualização</span>
          </TabsTrigger>
          <TabsTrigger value="anuncios" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Anúncios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notas" className="space-y-4">
          {notasAtualizacao.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-foreground">Notas de Atualização</h2>
                </div>
                <Button variant="ghost" onClick={handleGerenciarAnuncios}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver todas
                </Button>
              </div>
              <AnunciosSlider
                items={notasAtualizacao}
                onCardClick={handleCardClick}
                title=""
                icon={<></>}
              />
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma nota de atualização disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Ainda não há notas de atualização publicadas.
                </p>
                <Button onClick={handleGerenciarAnuncios}>
                  Criar Primeira Nota
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="anuncios" className="space-y-4">
          {anuncios.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-6 w-6 text-green-600" />
                  <h2 className="text-2xl font-semibold text-foreground">Anúncios</h2>
                </div>
                <Button variant="ghost" onClick={handleGerenciarAnuncios}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver todos
                </Button>
              </div>
              <AnunciosSlider
                items={anuncios}
                onCardClick={handleCardClick}
                title=""
                icon={<></>}
              />
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum anúncio disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Ainda não há anúncios publicados.
                </p>
                <Button onClick={handleGerenciarAnuncios}>
                  Criar Primeiro Anúncio
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
