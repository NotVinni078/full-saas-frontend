
import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bell } from 'lucide-react';

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
    return tipo === 'Nota de Atualização' ? <FileText className="h-5 w-5" /> : <Bell className="h-5 w-5" />;
  };

  const getTypeColor = (tipo: string) => {
    return tipo === 'Nota de Atualização' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
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
