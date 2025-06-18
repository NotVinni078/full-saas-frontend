
import React, { useState } from 'react';
import { Bell, FileText } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import AnunciosSlider from '@/components/AnunciosSlider';
import CardModal from '@/components/CardModal';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

const AnunciosContent = () => {
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const notasAtualizacao = [
    {
      id: 1,
      titulo: "Nova versão 2.5.0 disponível",
      descricao: "Implementamos melhorias no sistema de atendimento e correções de bugs importantes. Esta atualização inclui novos recursos de automação, melhor performance e interface mais intuitiva para uma experiência ainda melhor.",
      data: "15 de Janeiro, 2024",
      tipo: "Atualização"
    },
    {
      id: 2,
      titulo: "Manutenção programada",
      descricao: "Sistema ficará em manutenção no dia 20/01 das 02:00 às 06:00 para melhorias na infraestrutura. Durante este período, algumas funcionalidades podem ficar temporariamente indisponíveis.",
      data: "12 de Janeiro, 2024",
      tipo: "Manutenção"
    },
    {
      id: 3,
      titulo: "Novas funcionalidades de IA",
      descricao: "Adicionamos respostas automáticas inteligentes e análise de sentimento em tempo real. Agora o sistema pode identificar automaticamente o tom das conversas e sugerir as melhores respostas.",
      data: "08 de Janeiro, 2024",
      tipo: "Recurso"
    },
    {
      id: 4,
      titulo: "Correções de segurança",
      descricao: "Implementamos importantes correções de segurança para proteger ainda mais seus dados e conversas.",
      data: "05 de Janeiro, 2024",
      tipo: "Atualização"
    }
  ];

  const anuncios = [
    {
      id: 1,
      titulo: "Webinar: Maximizando o atendimento",
      descricao: "Participe do nosso webinar gratuito sobre como otimizar seu atendimento ao cliente. Aprenda técnicas avançadas e melhores práticas para aumentar a satisfação dos seus clientes.",
      data: "25 de Janeiro, 2024",
      tipo: "Evento"
    },
    {
      id: 2,
      titulo: "Novo plano Enterprise",
      descricao: "Conheça nosso novo plano com recursos avançados para grandes empresas. Inclui suporte prioritário, integrações personalizadas e capacidade ilimitada de atendimentos.",
      data: "20 de Janeiro, 2024",
      tipo: "Produto"
    },
    {
      id: 3,
      titulo: "Parceria com WhatsApp Business",
      descricao: "Agora oferecemos integração oficial com a API do WhatsApp Business. Conecte-se diretamente com seus clientes através da plataforma mais usada no Brasil.",
      data: "18 de Janeiro, 2024",
      tipo: "Parceria"
    },
    {
      id: 4,
      titulo: "Nova integração com CRM",
      descricao: "Conecte seu sistema de atendimento com os principais CRMs do mercado para uma gestão completa dos seus clientes.",
      data: "15 de Janeiro, 2024",
      tipo: "Produto"
    }
  ];

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
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Anúncios e Atualizações</h1>
        <p className="text-muted-foreground">Fique por dentro das últimas novidades e atualizações do sistema</p>
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
