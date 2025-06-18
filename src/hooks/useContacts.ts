
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { Contact } from '@/types/global';

export const useContacts = () => {
  const { contacts, updateContact, addContact, removeContact, tags, sectors } = useGlobalData();

  const getContactById = (id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  };

  const getContactsBySetor = (setorId: string): Contact[] => {
    return contacts.filter(contact => contact.setor === setorId);
  };

  const getContactsByTag = (tagId: string): Contact[] => {
    return contacts.filter(contact => contact.tags.includes(tagId));
  };

  const getContactTags = (contact: Contact) => {
    return tags.filter(tag => contact.tags.includes(tag.id));
  };

  const getContactSetor = (contact: Contact) => {
    return sectors.find(sector => sector.id === contact.setor);
  };

  const searchContacts = (searchTerm: string): Contact[] => {
    const term = searchTerm.toLowerCase();
    return contacts.filter(contact => 
      contact.nome.toLowerCase().includes(term) ||
      contact.telefone?.toLowerCase().includes(term) ||
      contact.email?.toLowerCase().includes(term)
    );
  };

  return {
    contacts,
    updateContact,
    addContact,
    removeContact,
    getContactById,
    getContactsBySetor,
    getContactsByTag,
    getContactTags,
    getContactSetor,
    searchContacts
  };
};
