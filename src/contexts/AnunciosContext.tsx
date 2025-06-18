import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
  imagem?: string;
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
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      titulo: "Manutenção programada",
      descricao: "Sistema ficará em manutenção no dia 20/01 das 02:00 às 06:00 para melhorias na infraestrutura. Durante este período, algumas funcionalidades podem ficar temporariamente indisponíveis.",
      data: "12 de Janeiro, 2024",
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      titulo: "Novas funcionalidades de IA",
      descricao: "Adicionamos respostas automáticas inteligentes e análise de sentimento em tempo real. Agora o sistema pode identificar automaticamente o tom das conversas e sugerir as melhores respostas.",
      data: "08 de Janeiro, 2024",
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      titulo: "Correções de segurança",
      descricao: "Implementamos importantes correções de segurança para proteger ainda mais seus dados e conversas. Atualizamos protocolos de criptografia e melhoramos a autenticação de dois fatores.",
      data: "05 de Janeiro, 2024",
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop"
    },
    {
      id: 5,
      titulo: "Atualização da interface",
      descricao: "Nova interface mais moderna e intuitiva! Redesenhamos completamente o painel de controle com foco na usabilidade e experiência do usuário. Agora é ainda mais fácil navegar e encontrar o que você precisa.",
      data: "02 de Janeiro, 2024",
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop"
    },
    {
      id: 6,
      titulo: "Melhorias de performance",
      descricao: "Otimizamos o sistema para carregamento 50% mais rápido. Implementamos cache inteligente e compressão de dados para uma experiência mais fluida em todas as funcionalidades.",
      data: "28 de Dezembro, 2023",
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&h=400&fit=crop"
    },
    {
      id: 7,
      titulo: "Novo sistema de relatórios",
      descricao: "Lançamos uma nova ferramenta de relatórios com gráficos interativos e exportação em múltiplos formatos. Agora você pode ter insights ainda mais detalhados sobre seu atendimento.",
      data: "25 de Dezembro, 2023",
      tipo: "Nota de Atualização",
      imagem: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=400&fit=crop"
    }
  ]);

  const [anuncios, setAnuncios] = useState<CardData[]>([
    {
      id: 1,
      titulo: "Webinar: Maximizando o atendimento",
      descricao: "Participe do nosso webinar gratuito sobre como otimizar seu atendimento ao cliente. Aprenda técnicas avançadas e melhores práticas para aumentar a satisfação dos seus clientes.",
      data: "25 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=400&fit=crop"
    },
    {
      id: 2,
      titulo: "Novo plano Enterprise",
      descricao: "Conheça nosso novo plano com recursos avançados para grandes empresas. Inclui suporte prioritário, integrações personalizadas e capacidade ilimitada de atendimentos.",
      data: "20 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop"
    },
    {
      id: 3,
      titulo: "Parceria com WhatsApp Business",
      descricao: "Agora oferecemos integração oficial com a API do WhatsApp Business. Conecte-se diretamente com seus clientes através da plataforma mais usada no Brasil.",
      data: "18 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop"
    },
    {
      id: 4,
      titulo: "Nova integração com CRM",
      descricao: "Conecte seu sistema de atendimento com os principais CRMs do mercado para uma gestão completa dos seus clientes. Suporte para Salesforce, HubSpot, RD Station e muito mais.",
      data: "15 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
    },
    {
      id: 5,
      titulo: "Desconto especial de 30%",
      descricao: "Oferta limitada para novos clientes! Aproveite 30% de desconto nos primeiros 3 meses de qualquer plano. Válido até o final do mês. Use o código NOVO30 no checkout.",
      data: "10 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop"
    },
    {
      id: 6,
      titulo: "Certificação ISO 27001",
      descricao: "Temos o prazer de anunciar que nossa empresa obteve a certificação ISO 27001 para segurança da informação. Isso reforça nosso compromisso com a proteção dos seus dados.",
      data: "08 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop"
    },
    {
      id: 7,
      titulo: "Novo aplicativo mobile",
      descricao: "Baixe agora nosso novo app para iOS e Android! Gerencie seus atendimentos, visualize relatórios e receba notificações em tempo real, tudo na palma da sua mão.",
      data: "05 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop"
    },
    {
      id: 8,
      titulo: "Workshop gratuito de automação",
      descricao: "Inscreva-se em nosso workshop online sobre automação de atendimento. Aprenda a configurar chatbots, respostas automáticas e fluxos de trabalho para economizar tempo.",
      data: "03 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=400&fit=crop"
    },
    {
      id: 9,
      titulo: "Expansão para novos países",
      descricao: "Estamos expandindo nossos serviços para Argentina, Chile e Colômbia! Em breve, mais empresas da América Latina poderão aproveitar nossa plataforma de atendimento.",
      data: "01 de Janeiro, 2024",
      tipo: "Anúncio",
      imagem: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=400&fit=crop"
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
