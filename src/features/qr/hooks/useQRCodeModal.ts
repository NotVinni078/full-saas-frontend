
import { useState, useCallback } from 'react';

/**
 * Hook para gerenciar estado do modal de QR Code
 * Separado para reutilização em outros componentes
 */
export const useQRCodeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [connectionId, setConnectionId] = useState<string>('');
  const [connectionName, setConnectionName] = useState<string>('');

  const openModal = useCallback((id: string, name: string) => {
    setConnectionId(id);
    setConnectionName(name);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setConnectionId('');
    setConnectionName('');
  }, []);

  return {
    isOpen,
    connectionId,
    connectionName,
    openModal,
    closeModal
  };
};
