
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import QRCodeDisplay from './QRCodeDisplay';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  connectionName: string;
  onStatusChange?: (status: 'generating' | 'ready' | 'connected' | 'expired') => void;
}

/**
 * Modal flutuante para exibição do QR Code
 * Funcionalidades implementadas:
 * - Modal responsivo que se adapta a todas as telas
 * - Fecha automaticamente quando conexão é bem-sucedida
 * - Botão de fechar manual disponível
 * - Layout otimizado para celular, tablet e desktop
 * - Cores dinâmicas da gestão de marca mantidas
 * - Integração completa com o componente QRCodeDisplay
 */
const QRCodeModal = ({ isOpen, onClose, connectionId, connectionName, onStatusChange }: QRCodeModalProps) => {
  
  /**
   * Manipula mudanças de status do QR Code
   * Fecha automaticamente o modal quando a conexão é bem-sucedida
   */
  const handleStatusChange = (status: 'generating' | 'ready' | 'connected' | 'expired') => {
    // Chama o callback externo se fornecido
    onStatusChange?.(status);
    
    // Fecha automaticamente o modal quando conecta com sucesso
    if (status === 'connected') {
      setTimeout(() => {
        onClose();
      }, 2000); // Aguarda 2 segundos para mostrar o sucesso antes de fechar
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto border-brand bg-brand-background p-0">
        {/* Header do modal com botão de fechar */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-brand-foreground text-lg">
              Conectar WhatsApp
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-brand-muted hover:text-brand-foreground hover:bg-brand-accent"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Conteúdo do modal */}
        <div className="p-6 pt-2">
          <QRCodeDisplay
            connectionId={connectionId}
            connectionName={connectionName}
            onStatusChange={handleStatusChange}
          />
          
          {/* Botão de fechar na parte inferior */}
          <div className="mt-6 flex justify-center">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto border-brand text-brand-foreground hover:bg-brand-accent"
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;
