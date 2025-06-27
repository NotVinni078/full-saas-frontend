
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TenantTicket } from '@/hooks/useTenantTickets';
import { TenantContact, TenantConnection } from '@/hooks/useTenantData';

interface WhatsAppCreateTicketModalProps {
  showCreateModal: boolean;
  setShowCreateModal: (show: boolean) => void;
  newTicketForm: {
    title: string;
    description: string;
    contact_id: string;
    channel: TenantTicket['channel'];
  };
  setNewTicketForm: (form: any) => void;
  handleCreateTicket: () => void;
  contacts: TenantContact[];
  connections: TenantConnection[];
}

const WhatsAppCreateTicketModal: React.FC<WhatsAppCreateTicketModalProps> = ({
  showCreateModal,
  setShowCreateModal,
  newTicketForm,
  setNewTicketForm,
  handleCreateTicket,
  contacts,
  connections
}) => {
  const getChannelDisplayName = (channel: TenantTicket['channel']) => {
    switch (channel) {
      case 'whatsapp': return 'WhatsApp';
      case 'instagram': return 'Instagram';
      case 'facebook': return 'Facebook';
      case 'telegram': return 'Telegram';
      case 'webchat': return 'WebChat';
      default: return channel;
    }
  };

  const getChannelIcon = (channel: TenantTicket['channel']) => {
    switch (channel) {
      case 'whatsapp': return '📱';
      case 'instagram': return '📷';
      case 'facebook': return '👥';
      case 'telegram': return '✈️';
      case 'webchat': return '💬';
      default: return '💬';
    }
  };

  // Get available channels from active connections
  const availableChannels = connections
    .filter(conn => conn.status === 'active')
    .map(conn => conn.type as TenantTicket['channel']);

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
                    <div className="flex items-center gap-2">
                      <span>{getChannelIcon(contact.channel)}</span>
                      <span>{contact.name}</span>
                      {contact.phone && (
                        <span className="text-sm text-muted-foreground">({contact.phone})</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="channel">Canal *</Label>
            <Select 
              value={newTicketForm.channel} 
              onValueChange={(value: TenantTicket['channel']) => 
                setNewTicketForm(prev => ({ ...prev, channel: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um canal" />
              </SelectTrigger>
              <SelectContent>
                {availableChannels.length > 0 ? (
                  availableChannels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      <div className="flex items-center gap-2">
                        <span>{getChannelIcon(channel)}</span>
                        <span>{getChannelDisplayName(channel)}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="whatsapp" disabled>
                    Nenhuma conexão ativa encontrada
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
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
