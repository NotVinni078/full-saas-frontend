import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

interface AnunciosContextType {
  notasAtualizacao: CardData[];
  anuncios: CardData[];
  addAnuncio: (anuncio: Omit<CardData, 'id'>) => void;
  addNotaAtualizacao: (nota: Omit<CardData, 'id'>) => void;
  deleteAnuncio: (id: number) => void;
  deleteNotaAtualizacao: (id: number) => void;
}

const AnunciosContext = createContext<AnunciosContextType | undefined>(undefined);

export const useAnuncios = () => {
  const context = useContext(AnunciosContext);
  if (!context) {
    throw new Error('useAnuncios deve ser usado dentro de um AnunciosProvider');
  }
  return context;
};

interface AnunciosProviderProps {
  children: ReactNode;
}

export const AnunciosProvider = ({ children }: AnunciosProviderProps) => {
  const [notasAtualizacao, setNotasAtualizacao] = useState<CardData[]>([
    {
      id: 1,
      titulo: "Nova versão 2.5.0 disponível",
      descricao: "Implementamos melhorias no sistema de atendimento e correções de bugs importantes. Esta atualização inclui novos recursos de automação, melhor performance e interface mais intuitiva para uma experiência ainda melhor.",
      data: "15 de Janeiro, 2024",
      tipo: "Nota de Atualização"
    },
    {
      id: 2,
      titulo: "Manutenção programada",
      descricao: "Sistema ficará em manutenção no dia 20/01 das 02:00 às 06:00 para melhorias na infraestrutura. Durante este período, algumas funcionalidades podem ficar temporariamente indisponíveis.",
      data: "12 de Janeiro, 2024",
      tipo: "Nota de Atualização"
    },
    {
      id: 3,
      titulo: "Novas funcionalidades de IA",
      descricao: "Adicionamos respostas automáticas inteligentes e análise de sentimento em tempo real. Agora o sistema pode identificar automaticamente o tom das conversas e sugerir as melhores respostas.",
      data: "08 de Janeiro, 2024",
      tipo: "Nota de Atualização"
    },
    {
      id: 4,
      titulo: "Correções de segurança",
      descricao: "Implementamos importantes correções de segurança para proteger ainda mais seus dados e conversas.",
      data: "05 de Janeiro, 2024",
      tipo: "Nota de Atualização"
    }
  ]);

  const [anuncios, setAnuncios] = useState<CardData[]>([
    {
      id: 1,
      titulo: "Webinar: Maximizando o atendimento",
      descricao: "Participe do nosso webinar gratuito sobre como otimizar seu atendimento ao cliente. Aprenda técnicas avançadas e melhores práticas para aumentar a satisfação dos seus clientes.",
      data: "25 de Janeiro, 2024",
      tipo: "Anúncio"
    },
    {
      id: 2,
      titulo: "Novo plano Enterprise",
      descricao: "Conheça nosso novo plano com recursos avançados para grandes empresas. Inclui suporte prioritário, integrações personalizadas e capacidade ilimitada de atendimentos.",
      data: "20 de Janeiro, 2024",
      tipo: "Anúncio"
    },
    {
      id: 3,
      titulo: "Parceria com WhatsApp Business",
      descricao: "Agora oferecemos integração oficial com a API do WhatsApp Business. Conecte-se diretamente com seus clientes através da plataforma mais usada no Brasil.",
      data: "18 de Janeiro, 2024",
      tipo: "Anúncio"
    },
    {
      id: 4,
      titulo: "Nova integração com CRM",
      descricao: "Conecte seu sistema de atendimento com os principais CRMs do mercado para uma gestão completa dos seus clientes.",
      data: "15 de Janeiro, 2024",
      tipo: "Anúncio"
    }
  ]);

  const addAnuncio = (anuncio: Omit<CardData, 'id'>) => {
    const newId = anuncios.length > 0 ? Math.max(...anuncios.map(a => a.id)) + 1 : 1;
    const newAnuncio = { ...anuncio, id: newId };
    setAnuncios(prev => [newAnuncio, ...prev]);
  };

  const addNotaAtualizacao = (nota: Omit<CardData, 'id'>) => {
    const newId = notasAtualizacao.length > 0 ? Math.max(...notasAtualizacao.map(n => n.id)) + 1 : 1;
    const newNota = { ...nota, id: newId };
    setNotasAtualizacao(prev => [newNota, ...prev]);
  };

  const deleteAnuncio = (id: number) => {
    setAnuncios(prev => prev.filter(anuncio => anuncio.id !== id));
  };

  const deleteNotaAtualizacao = (id: number) => {
    setNotasAtualizacao(prev => prev.filter(nota => nota.id !== id));
  };

  const value = {
    notasAtualizacao,
    anuncios,
    addAnuncio,
    addNotaAtualizacao,
    deleteAnuncio,
    deleteNotaAtualizacao
  };

  return (
    <AnunciosContext.Provider value={value}>
      {children}
    </AnunciosContext.Provider>
  );
};
