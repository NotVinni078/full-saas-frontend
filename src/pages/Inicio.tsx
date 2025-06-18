
import React, { useState } from 'react';
import { FileText, Bell, TrendingUp, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Pegar os 3 itens mais recentes de cada categoria
  const recentNotasAtualizacao = notasAtualizacao.slice(0, 3);
  const recentAnuncios = anuncios.slice(0, 3);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao Sistema</h1>
          <p className="text-muted-foreground">Confira as últimas atualizações e novidades</p>
        </div>
        <Button 
          onClick={handleGerenciarAnuncios}
          variant="outline"
          className="hidden md:flex"
        >
          Gerenciar Anúncios
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Notas</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notasAtualizacao.length}</div>
            <p className="text-xs text-muted-foreground">Notas de atualização</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Anúncios</CardTitle>
            <Bell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{anuncios.length}</div>
            <p className="text-xs text-muted-foreground">Anúncios publicados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4k</div>
            <p className="text-xs text-muted-foreground">Hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Notas de Atualização */}
      {recentNotasAtualizacao.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-foreground">Últimas Atualizações</h2>
            </div>
            <Button variant="ghost" onClick={handleGerenciarAnuncios}>
              <Eye className="h-4 w-4 mr-2" />
              Ver todas
            </Button>
          </div>
          <AnunciosSlider
            items={recentNotasAtualizacao}
            onCardClick={handleCardClick}
            title=""
            icon={<></>}
          />
        </div>
      )}

      {/* Últimos Anúncios */}
      {recentAnuncios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-foreground">Últimos Anúncios</h2>
            </div>
            <Button variant="ghost" onClick={handleGerenciarAnuncios}>
              <Eye className="h-4 w-4 mr-2" />
              Ver todos
            </Button>
          </div>
          <AnunciosSlider
            items={recentAnuncios}
            onCardClick={handleCardClick}
            title=""
            icon={<></>}
          />
        </div>
      )}

      {/* Caso não haja conteúdo */}
      {notasAtualizacao.length === 0 && anuncios.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum conteúdo disponível</h3>
            <p className="text-muted-foreground mb-4">
              Ainda não há anúncios ou notas de atualização publicados.
            </p>
            <Button onClick={handleGerenciarAnuncios}>
              Criar Primeiro Anúncio
            </Button>
          </CardContent>
        </Card>
      )}

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
