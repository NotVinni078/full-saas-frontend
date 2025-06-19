
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Clock, X, Users } from 'lucide-react';
import { Label } from "@/components/ui/label";
import SectorSelector from '@/components/selectors/SectorSelector';
import { useSectors } from '@/hooks/useSectors';

/**
 * Componente de diálogo para iniciar atendimento
 * Permite seleção de setor e ação (iniciar, aguardar ou cancelar)
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface StartServiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
    avatar?: string;
    canal?: string;
  };
  onStartService: (contactId: string, sectorId: string, action: 'start' | 'waiting') => void;
}

const StartServiceDialog = ({
  isOpen,
  onClose,
  contact,
  onStartService
}: StartServiceDialogProps) => {
  const [selectedSector, setSelectedSector] = useState<string>('');
  const { getSectorById } = useSectors();

  /**
   * Gera iniciais do nome para avatar
   * @param {string} nome - Nome do contato
   */
  const getIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  /**
   * Manipula início do atendimento
   * @param {string} action - Ação a ser executada (start ou waiting)
   */
  const handleServiceAction = (action: 'start' | 'waiting') => {
    if (!contact || !selectedSector) {
      alert('Por favor, selecione um setor antes de continuar.');
      return;
    }

    onStartService(contact.id, selectedSector, action);
    handleClose();
  };

  /**
   * Fecha diálogo e limpa estado
   */
  const handleClose = () => {
    setSelectedSector('');
    onClose();
  };

  const selectedSectorData = selectedSector ? getSectorById(selectedSector) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] mx-4 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Iniciar Atendimento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações do contato */}
          {contact && (
            <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={contact.avatar} alt={contact.nome} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {getIniciais(contact.nome)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-foreground truncate text-lg">
                  {contact.nome}
                </div>
                <div className="text-sm text-muted-foreground">
                  {contact.telefone && <span>{contact.telefone}</span>}
                  {contact.telefone && contact.email && <span> • </span>}
                  {contact.email && <span className="truncate">{contact.email}</span>}
                </div>
                {contact.canal && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Canal: {contact.canal}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Seleção de setor */}
          <div className="space-y-3">
            <Label htmlFor="setor" className="text-foreground font-medium">
              Selecione o Setor Responsável *
            </Label>
            <SectorSelector
              value={selectedSector}
              onValueChange={setSelectedSector}
              placeholder="Escolha o setor para este atendimento..."
              showColors={true}
            />
            {selectedSectorData && (
              <p className="text-xs text-muted-foreground">
                {selectedSectorData.descricao}
              </p>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col gap-3 pt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Escolha como deseja prosseguir com o atendimento:
            </div>
            
            {/* Iniciar Atendimento Imediatamente */}
            <Button 
              onClick={() => handleServiceAction('start')}
              disabled={!selectedSector}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Iniciar Atendimento Agora
            </Button>

            {/* Mover para Aguardando */}
            <Button 
              onClick={() => handleServiceAction('waiting')}
              disabled={!selectedSector}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Mover para Aguardando
            </Button>

            {/* Cancelar */}
            <Button 
              onClick={handleClose}
              variant="outline"
              className="w-full border-border text-muted-foreground hover:bg-accent flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>

          {/* Informação adicional */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Sobre as opções:</p>
                <p className="mb-1"><strong>Iniciar Agora:</strong> O atendimento será direcionado imediatamente para o setor selecionado.</p>
                <p><strong>Mover para Aguardando:</strong> O contato ficará na fila de espera do setor selecionado.</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StartServiceDialog;
