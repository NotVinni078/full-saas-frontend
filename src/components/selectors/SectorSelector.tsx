
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
      <SelectTrigger>
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
      <SelectContent>
        {activeSectors.map((sector) => (
          <SelectItem key={sector.id} value={sector.id}>
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
