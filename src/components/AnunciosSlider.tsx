
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bell, Calendar, Star } from 'lucide-react';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

interface AnunciosSliderProps {
  items: CardData[];
  onCardClick: (card: CardData) => void;
  title: string;
  icon: React.ReactNode;
}

const AnunciosSlider = ({ items, onCardClick, title, icon }: AnunciosSliderProps) => {
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
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        {icon}
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card 
                className="hover:shadow-md transition-shadow duration-200 cursor-pointer h-full"
                onClick={() => onCardClick(item)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
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
