
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { X, Plus, ChevronDown } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/global';

/**
 * Componente de seleção de tags em formato dropdown
 * Permite seleção múltipla de tags com visual em badges coloridos
 * Design responsivo com cores dinâmicas do sistema de marca
 * Aplica cores personalizadas das tags de forma consistente
 */

interface TagSelectorProps {
  selectedTagIds: string[];
  onTagsChange: (tagIds: string[]) => void;
  placeholder?: string;
}

const TagSelector = ({ 
  selectedTagIds, 
  onTagsChange, 
  placeholder = "Selecionar tags..." 
}: TagSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { getActiveTags, getTagsByIds } = useTags();
  
  // Obtém tags selecionadas e disponíveis
  const selectedTags = getTagsByIds(selectedTagIds);
  const availableTags = getActiveTags();
  const unselectedTags = availableTags.filter(tag => !selectedTagIds.includes(tag.id));

  /**
   * Converte cor hexadecimal para estilo inline CSS
   * Garante contraste adequado para texto sobre a cor da tag
   * @param {string} hexColor - Cor em formato hexadecimal
   * @returns {Object} Objeto com estilos CSS para aplicar na tag
   */
  const getTagStyles = (hexColor: string) => {
    // Converter hex para RGB para calcular luminância
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcular luminância para determinar cor do texto
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
    
    return {
      backgroundColor: hexColor,
      color: textColor,
      border: `1px solid ${hexColor}`,
      boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1)`
    };
  };

  /**
   * Adiciona uma tag à seleção
   * @param {Tag} tag - Tag a ser adicionada
   */
  const handleAddTag = (tag: Tag) => {
    if (!selectedTagIds.includes(tag.id)) {
      onTagsChange([...selectedTagIds, tag.id]);
    }
    setIsOpen(false);
  };

  /**
   * Remove uma tag da seleção
   * @param {string} tagId - ID da tag a ser removida
   */
  const handleRemoveTag = (tagId: string) => {
    onTagsChange(selectedTagIds.filter(id => id !== tagId));
  };

  return (
    <div className="space-y-3">
      {/* Tags selecionadas - exibidas como badges com cores personalizadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag.id} 
              style={getTagStyles(tag.cor)}
              className="text-xs px-2 py-1 flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity border-0 shadow-sm"
            >
              {tag.nome}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-black/20 dark:hover:bg-white/20 rounded-full ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(tag.id);
                }}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown para seleção de tags */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-between border-border text-foreground hover:bg-accent"
          >
            <span className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {selectedTags.length > 0 
                ? `${selectedTags.length} tag(s) selecionada(s)` 
                : placeholder
              }
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="start" 
          className="w-full min-w-[250px] max-h-64 overflow-y-auto bg-card border-border"
        >
          {unselectedTags.length > 0 ? (
            unselectedTags.map((tag) => (
              <DropdownMenuItem
                key={tag.id}
                onClick={() => handleAddTag(tag)}
                className="flex items-center gap-2 p-3 cursor-pointer text-foreground hover:bg-accent focus:bg-accent"
              >
                <Badge 
                  style={getTagStyles(tag.cor)}
                  className="text-xs px-2 py-1 pointer-events-none border-0 shadow-sm"
                >
                  {tag.nome}
                </Badge>
                {tag.descricao && (
                  <span className="text-xs text-muted-foreground ml-2 truncate">
                    {tag.descricao}
                  </span>
                )}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-3 text-center">
              <p className="text-sm text-muted-foreground">
                {availableTags.length === 0 
                  ? 'Nenhuma tag disponível' 
                  : 'Todas as tags foram selecionadas'
                }
              </p>
              {availableTags.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Crie tags na página /tags primeiro
                </p>
              )}
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TagSelector;
