
import React from 'react';
import { Badge } from '@/components/ui/badge';

// Tipo para filtros de status
type StatusFilter = 'todas' | 'agendada' | 'em_andamento' | 'finalizada' | 'erro';

interface CampanhasFiltersProps {
  filtroAtivo: StatusFilter;
  onFiltroChange: (filtro: StatusFilter) => void;
  totalCampanhas: number;
}

/**
 * Componente de filtros por status das campanhas
 * Permite filtrar campanhas por diferentes estados
 * Design responsivo com badges clicáveis
 * Cores dinâmicas baseadas na gestão de marca
 */
export const CampanhasFilters: React.FC<CampanhasFiltersProps> = ({
  filtroAtivo,
  onFiltroChange,
  totalCampanhas
}) => {
  
  // Configuração dos filtros disponíveis
  const filtros: Array<{
    value: StatusFilter;
    label: string;
    count?: number;
  }> = [
    { value: 'todas', label: 'Todas', count: totalCampanhas },
    { value: 'agendada', label: 'Agendadas' },
    { value: 'em_andamento', label: 'Em Andamento' },
    { value: 'finalizada', label: 'Finalizadas' },
    { value: 'erro', label: 'Com Erro' }
  ];

  /**
   * Retorna a classe CSS apropriada para cada status
   * Utiliza as cores dinâmicas da marca
   */
  const getStatusVariant = (status: StatusFilter, isActive: boolean) => {
    if (isActive) {
      return "default"; // Cor primária da marca quando ativo
    }
    
    switch (status) {
      case 'agendada':
        return "outline";
      case 'em_andamento':
        return "outline";
      case 'finalizada':
        return "outline";
      case 'erro':
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="mb-6">
      {/* Container dos filtros - scroll horizontal em mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filtros.map((filtro) => (
          <Badge
            key={filtro.value}
            variant={getStatusVariant(filtro.value, filtroAtivo === filtro.value)}
            className={`
              cursor-pointer whitespace-nowrap transition-all duration-200
              px-3 py-1.5 text-sm font-medium rounded-full
              hover:shadow-sm active:scale-95
              ${filtroAtivo === filtro.value 
                ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                : 'bg-background text-foreground border-border hover:bg-muted/50 hover:border-muted-foreground/20'
              }
            `}
            onClick={() => onFiltroChange(filtro.value)}
          >
            {filtro.label}
            
            {/* Contador de campanhas (apenas para "Todas") */}
            {filtro.count !== undefined && (
              <span className={`
                ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-semibold
                ${filtroAtivo === filtro.value 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {filtro.count}
              </span>
            )}
          </Badge>
        ))}
      </div>

      {/* Indicador visual do filtro ativo */}
      {filtroAtivo !== 'todas' && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span>
            Exibindo campanhas: {filtros.find(f => f.value === filtroAtivo)?.label}
          </span>
        </div>
      )}
    </div>
  );
};
