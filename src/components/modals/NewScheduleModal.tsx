
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Users, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/**
 * Modal para criação de novos agendamentos
 * Permite pré-seleção de contatos vindos da gestão de contatos
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedContacts?: any[];
}

const NewScheduleModal = ({
  isOpen,
  onClose,
  preSelectedContacts = []
}: NewScheduleModalProps) => {
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Pré-seleciona contatos quando o modal é aberto
   */
  useEffect(() => {
    if (preSelectedContacts.length > 0) {
      setSelectedContacts(preSelectedContacts);
    }
  }, [preSelectedContacts]);

  /**
   * Gera iniciais do nome para avatar
   * @param {string} nome - Nome do contato
   */
  const getIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  /**
   * Remove contato da seleção
   * @param {string} contactId - ID do contato a ser removido
   */
  const removeContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  /**
   * Manipula criação do agendamento
   */
  const handleCreateSchedule = () => {
    if (!title || !date || !time || selectedContacts.length === 0) {
      alert('Por favor, preencha todos os campos obrigatórios e selecione pelo menos um contato.');
      return;
    }

    const scheduleData = {
      title,
      date,
      time,
      description,
      contacts: selectedContacts
    };

    console.log('Agendamento criado:', scheduleData);
    // TODO: Implementar lógica de criação do agendamento
    
    handleClose();
  };

  /**
   * Fecha modal e limpa estados
   */
  const handleClose = () => {
    setSelectedContacts([]);
    setSearchTerm('');
    setTitle('');
    setDate('');
    setTime('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl mx-4 bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações básicas do agendamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Título *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do agendamento"
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-foreground">
                Data *
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-foreground">
                Horário *
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descrição (opcional)
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para o agendamento..."
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Contatos selecionados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Contatos Selecionados ({selectedContacts.length})
              </Label>
            </div>
            
            {selectedContacts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto">
                {selectedContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border"
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={contact.avatar} alt={contact.nome} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                        {getIniciais(contact.nome)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm truncate">
                        {contact.nome}
                      </div>
                      {contact.telefone && (
                        <div className="text-xs text-muted-foreground">
                          {contact.telefone}
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(contact.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Nenhum contato selecionado</p>
                <p className="text-xs">Adicione contatos para criar o agendamento</p>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="border-border text-foreground hover:bg-accent"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleCreateSchedule}
              disabled={!title || !date || !time || selectedContacts.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Criar Agendamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewScheduleModal;
