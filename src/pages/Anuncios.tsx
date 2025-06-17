
import React from 'react';
import { Bell, FileText, Calendar, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SidebarLayout from '@/components/SidebarLayout';

const AnunciosContent = () => {
  const notasAtualizacao = [
    {
      id: 1,
      titulo: "Nova versão 2.5.0 disponível",
      descricao: "Implementamos melhorias no sistema de atendimento e correções de bugs importantes.",
      data: "15 de Janeiro, 2024",
      tipo: "Atualização"
    },
    {
      id: 2,
      titulo: "Manutenção programada",
      descricao: "Sistema ficará em manutenção no dia 20/01 das 02:00 às 06:00 para melhorias na infraestrutura.",
      data: "12 de Janeiro, 2024",
      tipo: "Manutenção"
    },
    {
      id: 3,
      titulo: "Novas funcionalidades de IA",
      descricao: "Adicionamos respostas automáticas inteligentes e análise de sentimento em tempo real.",
      data: "08 de Janeiro, 2024",
      tipo: "Recurso"
    }
  ];

  const anuncios = [
    {
      id: 1,
      titulo: "Webinar: Maximizando o atendimento",
      descricao: "Participe do nosso webinar gratuito sobre como otimizar seu atendimento ao cliente.",
      data: "25 de Janeiro, 2024",
      tipo: "Evento"
    },
    {
      id: 2,
      titulo: "Novo plano Enterprise",
      descricao: "Conheça nosso novo plano com recursos avançados para grandes empresas.",
      data: "20 de Janeiro, 2024",
      tipo: "Produto"
    },
    {
      id: 3,
      titulo: "Parceria com WhatsApp Business",
      descricao: "Agora oferecemos integração oficial com a API do WhatsApp Business.",
      data: "18 de Janeiro, 2024",
      tipo: "Parceria"
    }
  ];

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'Atualização':
      case 'Recurso':
        return <FileText className="h-5 w-5" />;
      case 'Manutenção':
        return <Bell className="h-5 w-5" />;
      case 'Evento':
        return <Calendar className="h-5 w-5" />;
      case 'Produto':
      case 'Parceria':
        return <Star className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'Atualização':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Manutenção':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Recurso':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Evento':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Produto':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'Parceria':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Anúncios e Atualizações</h1>
        <p className="text-muted-foreground">Fique por dentro das últimas novidades e atualizações do sistema</p>
      </div>

      {/* Notas de Atualização */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-foreground">Notas de Atualização</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notasAtualizacao.map((nota) => (
            <Card key={nota.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(nota.tipo)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(nota.tipo)}`}>
                      {nota.tipo}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{nota.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{nota.descricao}</p>
                <p className="text-xs text-muted-foreground">{nota.data}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Anúncios */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-green-600" />
          <h2 className="text-2xl font-semibold text-foreground">Anúncios</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {anuncios.map((anuncio) => (
            <Card key={anuncio.id} className="hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(anuncio.tipo)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(anuncio.tipo)}`}>
                      {anuncio.tipo}
                    </span>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{anuncio.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{anuncio.descricao}</p>
                <p className="text-xs text-muted-foreground">{anuncio.data}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
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
