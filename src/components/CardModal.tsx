
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Bell, Calendar, Star } from 'lucide-react';

interface CardData {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
}

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardData | null;
}

const CardModal = ({ isOpen, onClose, card }: CardModalProps) => {
  if (!card) return null;

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'Atualização':
      case 'Recurso':
        return <FileText className="h-6 w-6" />;
      case 'Manutenção':
        return <Bell className="h-6 w-6" />;
      case 'Evento':
        return <Calendar className="h-6 w-6" />;
      case 'Produto':
      case 'Parceria':
        return <Star className="h-6 w-6" />;
      default:
        return <Bell className="h-6 w-6" />;
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon(card.tipo)}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(card.tipo)}`}>
              {card.tipo}
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{card.titulo}</h2>
          <p className="text-muted-foreground leading-relaxed">{card.descricao}</p>
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Publicado em: {card.data}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardModal;
