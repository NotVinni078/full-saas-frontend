
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

interface CampanhasHeaderProps {
  onNovaCampanha: () => void;
  buscaTexto: string;
  onBuscaChange: (texto: string) => void;
}

/**
 * Componente do cabeçalho da página de campanhas
 * Contém título, botão de nova campanha e campo de busca
 * Utiliza cores dinâmicas da gestão de marca
 * Responsivo para todos os dispositivos
 */
export const CampanhasHeader: React.FC<CampanhasHeaderProps> = ({
  onNovaCampanha,
  buscaTexto,
  onBuscaChange
}) => {
  return (
    <div className="mb-6">
      {/* Container principal do header - layout flexível */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        
        {/* Seção do título */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Campanhas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas campanhas de marketing multicanal
          </p>
        </div>

        {/* Botão para criar nova campanha - destaque com cores da marca */}
        <Button 
          onClick={onNovaCampanha}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors
                     flex items-center gap-2 px-4 py-2 md:px-6 md:py-3
                     font-medium rounded-lg shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Nova Campanha</span>
          <span className="sm:hidden">Nova</span>
        </Button>
      </div>

      {/* Campo de busca - busca por nome e remetente */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar campanhas..."
          value={buscaTexto}
          onChange={(e) => onBuscaChange(e.target.value)}
          className="pl-10 bg-background border-border focus:ring-primary/20 focus:border-primary
                     transition-colors rounded-lg"
        />
      </div>
    </div>
  );
};
