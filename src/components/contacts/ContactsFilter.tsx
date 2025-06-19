
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Filter, X } from 'lucide-react';
import { useTags } from '@/hooks/useTags';

/**
 * Componente de filtro para contatos
 * Permite filtrar por status (todos, bloqueados) e por tags
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface ContactsFilterProps {
  selectedFilter: 'all' | 'blocked';
  selectedTags: string[];
  onFilterChange: (filter: 'all' | 'blocked') => void;
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

const ContactsFilter = ({ 
  selectedFilter, 
  selectedTags, 
  onFilterChange, 
  onTagsChange, 
  onClearFilters 
}: ContactsFilterProps) => {
  const { tags } = useTags();
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Alterna seleção de uma tag específica
   * @param {string} tagId - ID da tag a ser alternada
   */
  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };

  /**
   * Verifica se há filtros ativos além do padrão "todos"
   */
  const hasActiveFilters = selectedFilter !== 'all' || selectedTags.length > 0;

  /**
   * Remove todos os filtros aplicados
   */
  const handleClearAll = () => {
    onFilterChange('all');
    onTagsChange([]);
    onClearFilters();
    setIsOpen(false);
  };

  /**
   * Retorna o texto do botão baseado nos filtros ativos
   */
  const getButtonText = () => {
    if (selectedFilter === 'blocked') return 'Bloqueados';
    if (selectedTags.length > 0) return `${selectedTags.length} tag(s)`;
    return 'Filtros';
  };

  return (
    <div className="flex items-center gap-2">
      {/* Dropdown de filtros */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`border-border text-foreground hover:bg-accent ${
              hasActiveFilters ? 'bg-primary/10 border-primary' : ''
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            {getButtonText()}
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2 px-1 py-0 text-xs">
                {selectedFilter === 'blocked' ? '1' : selectedTags.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 bg-card border-border shadow-lg"
          sideOffset={5}
        >
          {/* Seção de filtros por status */}
          <DropdownMenuLabel className="text-foreground text-sm font-semibold">
            Status dos Contatos
          </DropdownMenuLabel>
          
          <DropdownMenuItem 
            onClick={() => onFilterChange('all')}
            className={`text-foreground hover:bg-accent cursor-pointer ${
              selectedFilter === 'all' ? 'bg-accent font-medium' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>Todos os Contatos</span>
              {selectedFilter === 'all' && (
                <div className="h-2 w-2 bg-primary rounded-full" />
              )}
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onFilterChange('blocked')}
            className={`text-foreground hover:bg-accent cursor-pointer ${
              selectedFilter === 'blocked' ? 'bg-accent font-medium' : ''
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span>Contatos Bloqueados</span>
              {selectedFilter === 'blocked' && (
                <div className="h-2 w-2 bg-primary rounded-full" />
              )}
            </div>
          </DropdownMenuItem>

          {/* Separador se houver tags disponíveis */}
          {tags.length > 0 && (
            <>
              <DropdownMenuSeparator className="bg-border" />
              
              {/* Seção de filtros por tags */}
              <DropdownMenuLabel className="text-foreground text-sm font-semibold">
                Filtrar por Tags
              </DropdownMenuLabel>
              
              <div className="max-h-40 overflow-y-auto">
                {tags.map((tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                    className="text-foreground hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div 
                        className={`h-3 w-3 rounded-full flex-shrink-0 ${tag.cor}`}
                        style={{ backgroundColor: tag.cor?.includes('#') ? tag.cor : undefined }}
                      />
                      <span className="truncate">{tag.nome}</span>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </>
          )}

          {/* Botão para limpar filtros se houver filtros ativos */}
          {hasActiveFilters && (
            <>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem 
                onClick={handleClearAll}
                className="text-muted-foreground hover:bg-accent cursor-pointer"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar Filtros
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Badges dos filtros ativos (visível apenas em telas maiores) */}
      {hasActiveFilters && (
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {selectedFilter === 'blocked' && (
            <Badge 
              variant="secondary" 
              className="text-xs px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
            >
              Bloqueados
              <X 
                className="h-3 w-3 ml-1 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800 rounded-full" 
                onClick={() => onFilterChange('all')}
              />
            </Badge>
          )}
          
          {selectedTags.map((tagId) => {
            const tag = tags.find(t => t.id === tagId);
            if (!tag) return null;
            
            return (
              <Badge 
                key={tagId}
                variant="secondary" 
                className={`text-xs px-2 py-1 ${tag.cor} flex items-center gap-1`}
              >
                {tag.nome}
                <X 
                  className="h-3 w-3 cursor-pointer hover:bg-black/10 rounded-full" 
                  onClick={() => toggleTag(tagId)}
                />
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContactsFilter;
