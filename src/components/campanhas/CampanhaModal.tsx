
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CampanhaForm } from './CampanhaForm';

// Interface para dados de campanha
interface Campanha {
  id: string;
  nome: string;
  canais: ('whatsapp' | 'facebook' | 'instagram' | 'telegram')[];
  dataInicio: Date;
  dataFim?: Date;
  status: 'agendada' | 'em_andamento' | 'finalizada' | 'erro';
  contatosEnviados: number;
  contatosTotal: number;
  taxaSucesso: number;
  mensagem: string;
  arquivo?: string;
  remetente: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface CampanhaModalProps {
  open: boolean;
  onClose: () => void;
  onSalvar: (dados: Partial<Campanha>) => Promise<void>;
  campanha: Campanha | null;
  titulo: string;
}

/**
 * Modal para criação e edição de campanhas
 * Centraliza o formulário de campanha em um dialog responsivo
 * Utiliza cores dinâmicas da gestão de marca
 * Responsivo para todos os dispositivos
 */
export const CampanhaModal: React.FC<CampanhaModalProps> = ({
  open,
  onClose,
  onSalvar,
  campanha,
  titulo
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        {/* Cabeçalho do modal */}
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="text-xl font-semibold text-foreground">
            {titulo}
          </DialogTitle>
        </DialogHeader>

        {/* Conteúdo scrollável do modal */}
        <div className="flex-1 overflow-y-auto py-4">
          <CampanhaForm
            campanha={campanha}
            onSalvar={onSalvar}
            onCancelar={onClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
