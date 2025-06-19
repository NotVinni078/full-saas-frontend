
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Tag } from '@/types/global';
import { useTags } from '@/hooks/useTags';

/**
 * Componente reutilizável para exibição consistente de badges de tags
 * Aplica cores personalizadas das tags com contraste adequado
 * Usado em todas as páginas onde tags são referenciadas
 * Mantém design responsivo e acessível
 */

interface TagBadgeProps {
  tagId?: string;
  tag?: Tag;
  size?: 'sm' | 'md' | 'lg';
  showRemove?: boolean;
  onRemove?: () => void;
  className?: string;
}

const TagBadge = ({ 
  tagId, 
  tag, 
  size = 'md', 
  showRemove = false, 
  onRemove,
  className = '' 
}: TagBadgeProps) => {
  const { getTagById, getTagStyles } = useTags();
  
  // Resolver tag por ID se não fornecida diretamente
  const resolvedTag = tag || (tagId ? getTagById(tagId) : null);
  
  if (!resolvedTag) {
    return null;
  }

  // Estilos baseados no tamanho
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge 
      style={getTagStyles(resolvedTag.cor)}
      className={`
        ${sizeClasses[size]} 
        font-medium border-0 shadow-sm hover:opacity-80 transition-opacity
        ${className}
      `}
      title={resolvedTag.descricao || `Tag: ${resolvedTag.nome}`}
    >
      {resolvedTag.nome}
      {showRemove && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:bg-black/20 dark:hover:bg-white/20 rounded-full p-0.5 transition-colors"
          title={`Remover tag ${resolvedTag.nome}`}
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Badge>
  );
};

export default TagBadge;
