
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { Tag } from '@/types/global';

/**
 * Hook customizado para gerenciamento de tags
 * Fornece funcionalidades CRUD e utilitários para tags
 * Mantém sincronização com contexto global de dados
 * Inclui utilitários para aplicação consistente de cores das tags
 */

export const useTags = () => {
  const { tags, updateTag, addTag, removeTag } = useGlobalData();

  /**
   * Busca tag por ID
   * @param {string} id - ID da tag
   * @returns {Tag | undefined} Tag encontrada ou undefined
   */
  const getTagById = (id: string): Tag | undefined => {
    return tags.find(tag => tag.id === id);
  };

  /**
   * Retorna apenas tags ativas
   * @returns {Tag[]} Lista de tags ativas
   */
  const getActiveTags = (): Tag[] => {
    return tags.filter(tag => tag.ativo);
  };

  /**
   * Pesquisa tags por termo de busca
   * Busca no nome e descrição da tag
   * @param {string} searchTerm - Termo de pesquisa
   * @returns {Tag[]} Lista de tags que correspondem à pesquisa
   */
  const searchTags = (searchTerm: string): Tag[] => {
    const term = searchTerm.toLowerCase();
    return tags.filter(tag => 
      tag.nome.toLowerCase().includes(term) ||
      tag.descricao?.toLowerCase().includes(term)
    );
  };

  /**
   * Retorna tags base em uma lista de IDs
   * Útil para buscar tags de um contato específico
   * @param {string[]} ids - Lista de IDs das tags
   * @returns {Tag[]} Lista de tags correspondentes aos IDs
   */
  const getTagsByIds = (ids: string[]): Tag[] => {
    return tags.filter(tag => ids.includes(tag.id));
  };

  /**
   * Converte cor hexadecimal para estilo inline CSS com contraste adequado
   * Garante legibilidade do texto sobre qualquer cor de fundo
   * @param {string} hexColor - Cor em formato hexadecimal
   * @returns {Object} Objeto com estilos CSS para aplicar na tag
   */
  const getTagStyles = (hexColor: string) => {
    // Validar e limpar cor hexadecimal
    if (!hexColor || !hexColor.startsWith('#') || hexColor.length !== 7) {
      return {
        backgroundColor: '#6B7280',
        color: '#FFFFFF',
        border: '1px solid #6B7280'
      };
    }

    // Converter hex para RGB para calcular luminância
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcular luminância relativa para determinar contraste
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
   * Converte cor hexadecimal para classes CSS compatíveis
   * Mantém compatibilidade com sistema de cores dinâmicas
   * @param {string} hexColor - Cor em formato hexadecimal
   * @returns {string} Classes CSS para a cor
   */
  const getTagColorClasses = (hexColor: string): string => {
    // Se já é uma classe CSS, retorna como está
    if (hexColor.includes('bg-') || hexColor.includes('text-')) {
      return hexColor;
    }
    
    // Para cores hexadecimais, usar style inline
    return '';
  };

  /**
   * Cria wrapper personalizado para addTag com validação
   * @param {Omit<Tag, 'id' | 'criadoEm' | 'atualizadoEm'>} tagData - Dados da tag
   */
  const createTag = (tagData: Omit<Tag, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    // Validação básica
    if (!tagData.nome.trim()) {
      throw new Error('Nome da tag é obrigatório');
    }
    
    // Verificar se já existe tag com o mesmo nome
    const existingTag = tags.find(tag => 
      tag.nome.toLowerCase() === tagData.nome.toLowerCase().trim()
    );
    
    if (existingTag) {
      throw new Error('Já existe uma tag com este nome');
    }
    
    // Criar tag com dados padronizados
    const newTagData = {
      ...tagData,
      nome: tagData.nome.trim(),
      ativo: tagData.ativo ?? true,
      descricao: tagData.descricao || `Tag "${tagData.nome.trim()}" criada automaticamente`
    };
    
    addTag(newTagData);
  };

  /**
   * Remove tag e realiza limpeza necessária
   * @param {string} id - ID da tag a ser removida
   */
  const deleteTag = (id: string) => {
    const tag = getTagById(id);
    if (!tag) {
      console.warn(`Tag com ID ${id} não encontrada`);
      return;
    }
    
    console.log(`Removendo tag: ${tag.nome}`);
    removeTag(id);
  };

  return {
    tags,
    updateTag,
    addTag: createTag,
    removeTag: deleteTag,
    getTagById,
    getActiveTags,
    searchTags,
    getTagsByIds,
    getTagColorClasses,
    getTagStyles // Nova função para aplicação consistente de cores
  };
};
