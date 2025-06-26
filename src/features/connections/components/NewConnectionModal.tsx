
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus, Loader2 } from 'lucide-react';
import SectorSelector from '@/components/selectors/SectorSelector';

interface NewConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateConnection: (name: string, sectors: string[]) => Promise<void>;
}

/**
 * Modal para criação de novas conexões WhatsApp
 * Separado do componente principal para melhor organização
 */
export const NewConnectionModal = ({
  isOpen,
  onClose,
  onCreateConnection
}: NewConnectionModalProps) => {
  const [name, setName] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Nome da conexão é obrigatório');
      return;
    }

    setIsCreating(true);
    setError('');

    try {
      const sectors = selectedSector ? [selectedSector] : [];
      await onCreateConnection(name.trim(), sectors);
      
      // Reset form and close modal on success
      setName('');
      setSelectedSector('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conexão');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName('');
      setSelectedSector('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-brand bg-brand-background">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-brand-foreground">
              Nova Conexão WhatsApp
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              disabled={isCreating}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Campo Nome */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-brand-foreground">
              Nome da Conexão *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: WhatsApp Vendas, Suporte Cliente..."
              className="bg-brand-background border-brand text-brand-foreground"
              disabled={isCreating}
            />
          </div>

          {/* Seletor de Setor */}
          <div className="space-y-2">
            <Label className="text-brand-foreground">
              Setor (Opcional)
            </Label>
            <SectorSelector
              value={selectedSector}
              onValueChange={setSelectedSector}
              placeholder="Selecionar setor..."
            />
            <p className="text-xs text-brand-muted">
              Associe esta conexão a um setor específico para melhor organização.
            </p>
          </div>

          {/* Exibir erro se houver */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
              className="border-brand text-brand-foreground"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Conexão
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
