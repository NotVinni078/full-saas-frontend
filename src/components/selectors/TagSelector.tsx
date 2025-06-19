
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { X, Plus, ChevronDown } from 'lucide-react';
import { useTags } from '@/hooks/useTags';
import { Tag } from '@/types/global';

/**
 * Componente de seleção de tags em formato dropdown
 * Permite seleção múltipla de tags com visual em badges
 * Design responsivo com cores dinâmicas do sistema de marca
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
      {/* Tags selecionadas - exibidas como badges */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge 
              key={tag.id} 
              className={`text-xs px-2 py-1 flex items-center gap-1 ${tag.cor} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              {tag.nome}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
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
                <Badge className={`text-xs px-2 py-1 ${tag.cor} pointer-events-none`}>
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
