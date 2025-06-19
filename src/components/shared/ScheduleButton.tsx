
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from 'lucide-react';
import { useScheduleModal } from '@/hooks/useScheduleModal';
import NewScheduleModal from '@/components/modals/NewScheduleModal';
import { Contact } from '@/types/global';

/**
 * Componente botão para abrir modal de agendamento
 * Pode ser usado em qualquer página da aplicação
 * Suporte para pré-seleção de contatos ou tags
 */

interface ScheduleButtonProps {
  contacts?: Contact[];
  tagId?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const ScheduleButton = ({
  contacts,
  tagId,
  variant = 'default',
  size = 'default',
  className,
  children
}: ScheduleButtonProps) => {
  const { isOpen, preSelectedContacts, preSelectedTag, openModal, closeModal } = useScheduleModal();

  const handleClick = () => {
    openModal(contacts, tagId);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={variant}
        size={size}
        className={className}
      >
        <Calendar className="h-4 w-4 mr-2" />
        {children || 'Novo Agendamento'}
      </Button>

      <NewScheduleModal
        isOpen={isOpen}
        onClose={closeModal}
        preSelectedContacts={preSelectedContacts}
        preSelectedTag={preSelectedTag}
      />
    </>
  );
};

export default ScheduleButton;
