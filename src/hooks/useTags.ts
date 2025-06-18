
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { Tag } from '@/types/global';

export const useTags = () => {
  const { tags, updateTag, addTag, removeTag } = useGlobalData();

  const getTagById = (id: string): Tag | undefined => {
    return tags.find(tag => tag.id === id);
  };

  const getActiveTags = (): Tag[] => {
    return tags.filter(tag => tag.ativo);
  };

  const searchTags = (searchTerm: string): Tag[] => {
    const term = searchTerm.toLowerCase();
    return tags.filter(tag => 
      tag.nome.toLowerCase().includes(term) ||
      tag.descricao?.toLowerCase().includes(term)
    );
  };

  const getTagsByIds = (ids: string[]): Tag[] => {
    return tags.filter(tag => ids.includes(tag.id));
  };

  return {
    tags,
    updateTag,
    addTag,
    removeTag,
    getTagById,
    getActiveTags,
    searchTags,
    getTagsByIds
  };
};
