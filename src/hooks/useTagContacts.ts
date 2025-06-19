
import { useContacts } from './useContacts';
import { useTags } from './useTags';
import { Contact, Tag } from '@/types/global';

/**
 * Hook especializado para gerenciar relação entre tags e contatos
 * Fornece funcionalidades para associar/desassociar tags de contatos
 * Mantém sincronização bidirecional entre tags e gestão de contatos
 */

export const useTagContacts = () => {
  const { contacts, updateContact } = useContacts();
  const { tags } = useTags();

  /**
   * Conta quantos contatos possuem uma tag específica
   * @param {string} tagId - ID da tag
   * @returns {number} Quantidade de contatos com a tag
   */
  const getContactCountForTag = (tagId: string): number => {
    return contacts.filter(contact => 
      contact.tags && contact.tags.includes(tagId)
    ).length;
  };

  /**
   * Retorna todos os contatos que possuem uma tag específica
   * @param {string} tagId - ID da tag
   * @returns {Contact[]} Lista de contatos com a tag
   */
  const getContactsWithTag = (tagId: string): Contact[] => {
    return contacts.filter(contact => 
      contact.tags && contact.tags.includes(tagId)
    );
  };

  /**
   * Adiciona uma tag a um contato específico
   * Verifica se o contato já possui a tag antes de adicionar
   * @param {string} contactId - ID do contato
   * @param {string} tagId - ID da tag
   * @returns {boolean} True se a tag foi adicionada, false se já existia
   */
  const addTagToContact = (contactId: string, tagId: string): boolean => {
    const contact = contacts.find(c => c.id === contactId);
    const tag = tags.find(t => t.id === tagId);
    
    if (!contact || !tag) {
      console.error('Contato ou tag não encontrados');
      return false;
    }
    
    // Verificar se já possui a tag
    if (contact.tags && contact.tags.includes(tagId)) {
      console.warn(`Contato ${contact.nome} já possui a tag ${tag.nome}`);
      return false;
    }
    
    // Adicionar tag ao contato
    const updatedContact = {
      ...contact,
      tags: [...(contact.tags || []), tagId],
      atualizadoEm: new Date()
    };
    
    updateContact(updatedContact);
    console.log(`Tag "${tag.nome}" adicionada ao contato "${contact.nome}"`);
    return true;
  };

  /**
   * Remove uma tag de um contato específico
   * @param {string} contactId - ID do contato
   * @param {string} tagId - ID da tag
   * @returns {boolean} True se a tag foi removida, false se não existia
   */
  const removeTagFromContact = (contactId: string, tagId: string): boolean => {
    const contact = contacts.find(c => c.id === contactId);
    const tag = tags.find(t => t.id === tagId);
    
    if (!contact || !tag) {
      console.error('Contato ou tag não encontrados');
      return false;
    }
    
    // Verificar se possui a tag
    if (!contact.tags || !contact.tags.includes(tagId)) {
      console.warn(`Contato ${contact.nome} não possui a tag ${tag.nome}`);
      return false;
    }
    
    // Remover tag do contato
    const updatedContact = {
      ...contact,
      tags: contact.tags.filter(t => t !== tagId),
      atualizadoEm: new Date()
    };
    
    updateContact(updatedContact);
    console.log(`Tag "${tag.nome}" removida do contato "${contact.nome}"`);
    return true;
  };

  /**
   * Remove uma tag de todos os contatos que a possuem
   * Usado antes de excluir uma tag do sistema
   * @param {string} tagId - ID da tag
   * @returns {number} Quantidade de contatos afetados
   */
  const removeTagFromAllContacts = (tagId: string): number => {
    const contactsWithTag = getContactsWithTag(tagId);
    
    contactsWithTag.forEach(contact => {
      const updatedContact = {
        ...contact,
        tags: contact.tags!.filter(t => t !== tagId),
        atualizadoEm: new Date()
      };
      updateContact(updatedContact);
    });
    
    console.log(`Tag removida de ${contactsWithTag.length} contato(s)`);
    return contactsWithTag.length;
  };

  /**
   * Adiciona múltiplas tags a um contato
   * @param {string} contactId - ID do contato
   * @param {string[]} tagIds - IDs das tags
   * @returns {string[]} IDs das tags que foram adicionadas com sucesso
   */
  const addMultipleTagsToContact = (contactId: string, tagIds: string[]): string[] => {
    const addedTags: string[] = [];
    
    tagIds.forEach(tagId => {
      if (addTagToContact(contactId, tagId)) {
        addedTags.push(tagId);
      }
    });
    
    return addedTags;
  };

  /**
   * Retorna estatísticas de uso de tags
   * @returns {Object} Objeto com estatísticas das tags
   */
  const getTagUsageStats = () => {
    const stats = tags.map(tag => ({
      id: tag.id,
      nome: tag.nome,
      cor: tag.cor,
      totalContacts: getContactCountForTag(tag.id),
      contactsData: getContactsWithTag(tag.id).map(c => ({
        id: c.id,
        nome: c.nome,
        telefone: c.telefone
      }))
    }));
    
    return {
      totalTags: tags.length,
      activeTags: tags.filter(t => t.ativo).length,
      tagsInUse: stats.filter(s => s.totalContacts > 0).length,
      mostUsedTag: stats.reduce((prev, current) => 
        prev.totalContacts > current.totalContacts ? prev : current
      ),
      tagStats: stats
    };
  };

  return {
    getContactCountForTag,
    getContactsWithTag,
    addTagToContact,
    removeTagFromContact,
    removeTagFromAllContacts,
    addMultipleTagsToContact,
    getTagUsageStats
  };
};
