
import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useSectors } from '@/hooks/useSectors';

interface MultipleSectorSelectorProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  showColors?: boolean;
}

/**
 * Componente seletor de setores com seleção múltipla
 * Funcionalidades implementadas:
 * - Seleção múltipla com checkboxes visuais
 * - Badges para setores selecionados com cores dinâmicas
 * - Busca em tempo real por nome de setor
 * - Remoção individual de setores selecionados
 * - Interface totalmente responsiva
 * - Integração com cores da gestão de marca
 */
const MultipleSectorSelector = ({ 
  value = [], 
  onValueChange, 
  placeholder = "Selecione os setores",
  showColors = true 
}: MultipleSectorSelectorProps) => {
  const [open, setOpen] = useState(false);
  const { getActiveSectors, getSectorById } = useSectors();
  const activeSectors = getActiveSectors();

  /**
   * Manipula a seleção/deseleção de um setor
   * Adiciona se não estiver selecionado, remove se já estiver
   */
  const toggleSector = (sectorId: string) => {
    const currentValues = value || [];
    const isSelected = currentValues.includes(sectorId);
    
    if (isSelected) {
      // Remove o setor da seleção
      onValueChange(currentValues.filter(id => id !== sectorId));
    } else {
      // Adiciona o setor à seleção
      onValueChange([...currentValues, sectorId]);
    }
  };

  /**
   * Remove um setor específico da seleção
   * Usado pelos badges de setores selecionados
   */
  const removeSector = (sectorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const currentValues = value || [];
    onValueChange(currentValues.filter(id => id !== sectorId));
  };

  /**
   * Obter setores selecionados com suas informações completas
   */
  const selectedSectors = (value || []).map(id => getSectorById(id)).filter(Boolean);

  return (
    <div className="w-full space-y-2">
      {/* Popover para seleção de setores */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-brand bg-brand-background text-brand-foreground hover:bg-brand-accent"
          >
            <span className="truncate">
              {value && value.length > 0 
                ? `${value.length} setor${value.length > 1 ? 'es' : ''} selecionado${value.length > 1 ? 's' : ''}`
                : placeholder
              }
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-full min-w-[300px] p-0 border-brand bg-brand-background shadow-lg z-50">
          <Command className="bg-brand-background">
            <CommandInput 
              placeholder="Buscar setor..." 
              className="border-0 focus:ring-0 text-brand-foreground placeholder:text-brand-muted"
            />
            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty className="text-brand-muted p-4 text-center text-sm">
                Nenhum setor encontrado.
              </CommandEmpty>
              <CommandGroup>
                {activeSectors.map((sector) => {
                  const isSelected = value?.includes(sector.id) || false;
                  
                  return (
                    <CommandItem
                      key={sector.id}
                      value={sector.nome}
                      onSelect={() => toggleSector(sector.id)}
                      className="cursor-pointer hover:bg-brand-accent focus:bg-brand-accent text-brand-foreground py-3"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          {/* Checkbox visual */}
                          <div className={cn(
                            "h-4 w-4 border-2 rounded flex items-center justify-center",
                            isSelected 
                              ? "bg-primary border-primary text-primary-foreground" 
                              : "border-brand-muted"
                          )}>
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                          
                          {/* Badge do setor com cores se habilitado */}
                          {showColors ? (
                            <Badge className={`text-xs px-2 py-1 ${sector.cor}`}>
                              {sector.nome}
                            </Badge>
                          ) : (
                            <span className="text-sm">{sector.nome}</span>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Área de badges dos setores selecionados */}
      {selectedSectors.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-brand-muted/10 rounded-lg border border-brand">
          <p className="text-xs text-brand-muted w-full mb-2">
            Setores selecionados:
          </p>
          {selectedSectors.map((sector) => (
            <Badge 
              key={sector.id} 
              className={cn(
                "text-xs px-3 py-1 flex items-center gap-2",
                showColors ? sector.cor : "bg-primary text-primary-foreground"
              )}
            >
              <span>{sector.nome}</span>
              <button
                onClick={(e) => removeSector(sector.id, e)}
                className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remover ${sector.nome}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultipleSectorSelector;
