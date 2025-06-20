
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormularioCampanha } from './FormularioCampanha';
import { CampanhaFormData, ConexaoDisponivel } from '@/types/campanhas';

interface CriarCampanhaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (dados: CampanhaFormData) => Promise<void>;
  conexoesDisponiveis: ConexaoDisponivel[];
  isLoading?: boolean;
}

export const CriarCampanhaModal: React.FC<CriarCampanhaModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  conexoesDisponiveis,
  isLoading = false
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Nova Campanha</DialogTitle>
          <DialogDescription>
            Crie uma nova campanha de marketing multicanal. Preencha os dados abaixo para configurar sua campanha.
          </DialogDescription>
        </DialogHeader>
        
        <FormularioCampanha
          onSubmit={onSubmit}
          conexoesDisponiveis={conexoesDisponiveis}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
