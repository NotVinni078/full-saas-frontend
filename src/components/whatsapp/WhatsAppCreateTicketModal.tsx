
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TenantTicket } from '@/hooks/useTenantTickets';

interface WhatsAppCreateTicketModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  newTicketForm: {
    title: string;
    description: string;
    contact_id: string;
    priority: TenantTicket['priority'];
    channel: TenantTicket['channel'];
  };
  setNewTicketForm: (form: any) => void;
  handleCreateTicket: () => void;
  contacts: any[];
}

const WhatsAppCreateTicketModal: React.FC<WhatsAppCreateTicketModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  newTicketForm,
  setNewTicketForm,
  handleCreateTicket,
  contacts
}) => {
  return (
    <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Atendimento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={newTicketForm.title}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do atendimento"
            />
          </div>

          <div>
            <Label htmlFor="contact">Contato *</Label>
            <Select 
              value={newTicketForm.contact_id} 
              onValueChange={(value) => setNewTicketForm(prev => ({ ...prev, contact_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um contato" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select 
                value={newTicketForm.priority} 
                onValueChange={(value: TenantTicket['priority']) => 
                  setNewTicketForm(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="channel">Canal</Label>
              <Select 
                value={newTicketForm.channel} 
                onValueChange={(value: TenantTicket['channel']) => 
                  setNewTicketForm(prev => ({ ...prev, channel: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                  <SelectItem value="webchat">WebChat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={newTicketForm.description}
              onChange={(e) => setNewTicketForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o problema ou solicitação"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTicket}>
              Criar Atendimento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppCreateTicketModal;
