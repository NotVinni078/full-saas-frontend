
import { useState } from 'react';
import { Contact } from '@/types/global';

/**
 * Hook personalizado para controlar o modal de agendamento
 * Permite abrir o modal de qualquer página da aplicação
 * Suporte para pré-seleção de contatos e tags
 */

interface UseScheduleModalReturn {
  isOpen: boolean;
  preSelectedContacts: Contact[];
  preSelectedTag?: string;
  openModal: (contacts?: Contact[], tagId?: string) => void;
  closeModal: () => void;
}

export const useScheduleModal = (): UseScheduleModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [preSelectedContacts, setPreSelectedContacts] = useState<Contact[]>([]);
  const [preSelectedTag, setPreSelectedTag] = useState<string | undefined>();

  /**
   * Abre o modal com contatos ou tag pré-selecionados
   * @param contacts - Lista de contatos para pré-selecionar
   * @param tagId - ID da tag para pré-selecionar
   */
  const openModal = (contacts?: Contact[], tagId?: string) => {
    if (contacts) {
      setPreSelectedContacts(contacts);
      setPreSelectedTag(undefined);
    } else if (tagId) {
      setPreSelectedContacts([]);
      setPreSelectedTag(tagId);
    } else {
      setPreSelectedContacts([]);
      setPreSelectedTag(undefined);
    }
    
    setIsOpen(true);
    console.log('Modal de agendamento aberto:', { contacts, tagId });
  };

  /**
   * Fecha o modal e limpa seleções
   */
  const closeModal = () => {
    setIsOpen(false);
    setPreSelectedContacts([]);
    setPreSelectedTag(undefined);
  };

  return {
    isOpen,
    preSelectedContacts,
    preSelectedTag,
    openModal,
    closeModal
  };
};
