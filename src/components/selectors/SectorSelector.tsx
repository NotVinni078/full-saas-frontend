
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSectors } from '@/hooks/useSectors';

interface SectorSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  showColors?: boolean;
}

/**
 * Componente seletor de setores com dropdown não transparente
 * Integra com os setores da página /gestao-setores
 * Totalmente responsivo e com cores dinâmicas
 */
const SectorSelector = ({ 
  value, 
  onValueChange, 
  placeholder = "Selecione um setor",
  showColors = true 
}: SectorSelectorProps) => {
  const { getActiveSectors, getSectorById } = useSectors();
  const activeSectors = getActiveSectors();
  const selectedSector = value ? getSectorById(value) : null;

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full border-brand bg-brand-background text-brand-foreground">
        <SelectValue placeholder={placeholder}>
          {selectedSector && (
            <div className="flex items-center gap-2">
              {showColors && (
                <Badge className={`text-xs px-2 py-1 ${selectedSector.cor}`}>
                  {selectedSector.nome}
                </Badge>
              )}
              {!showColors && selectedSector.nome}
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      
      {/* Dropdown com fundo sólido e alta visibilidade */}
      <SelectContent className="border-brand bg-brand-background shadow-lg z-50 max-h-60 overflow-y-auto">
        {activeSectors.map((sector) => (
          <SelectItem 
            key={sector.id} 
            value={sector.id}
            className="cursor-pointer hover:bg-brand-accent focus:bg-brand-accent text-brand-foreground py-3"
          >
            <div className="flex items-center gap-2">
              {showColors && (
                <Badge className={`text-xs px-2 py-1 ${sector.cor}`}>
                  {sector.nome}
                </Badge>
              )}
              {!showColors && (
                <span>{sector.nome}</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SectorSelector;
