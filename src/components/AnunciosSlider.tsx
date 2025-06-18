
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Bell, Trash } from 'lucide-react';
import { useAnuncios } from '@/contexts/AnunciosContext';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
  imagem?: string;
}

interface AnunciosSliderProps {
  items: CardData[];
  onCardClick: (card: CardData) => void;
  title: string;
  icon: React.ReactNode;
  showDeleteButton?: boolean;
}

const AnunciosSlider = ({ items, onCardClick, title, icon, showDeleteButton = false }: AnunciosSliderProps) => {
  const { deleteAnuncio, deleteNotaAtualizacao } = useAnuncios();

  console.log('AnunciosSlider items:', items);
  console.log('Items with images:', items.filter(item => item.imagem));

  const getIcon = (tipo: string) => {
    return tipo === 'Nota de Atualização' ? <FileText className="h-5 w-5" /> : <Bell className="h-5 w-5" />;
  };

  const getTypeColor = (tipo: string) => {
    return tipo === 'Nota de Atualização' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  const handleDelete = (e: React.MouseEvent, item: CardData) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir "${item.titulo}"?`)) {
      if (item.tipo === 'Nota de Atualização') {
        deleteNotaAtualizacao(item.id);
      } else {
        deleteAnuncio(item.id);
      }
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <div className="flex items-center space-x-2">
          {icon}
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        </div>
      )}
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card 
                className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full relative overflow-hidden"
                onClick={() => onCardClick(item)}
              >
                {showDeleteButton && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 z-10"
                    onClick={(e) => handleDelete(e, item)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
                
                {item.imagem && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={item.imagem} 
                      alt={item.titulo}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Erro ao carregar imagem:', item.imagem);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Imagem carregada com sucesso:', item.imagem);
                      }}
                    />
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between pr-8">
                    <div className="flex items-center space-x-2">
                      {getIcon(item.tipo)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.tipo)}`}>
                        {item.tipo}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{item.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{item.descricao}</p>
                  <p className="text-xs text-muted-foreground">{item.data}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};

export default AnunciosSlider;
