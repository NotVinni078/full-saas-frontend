import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import TicketsList from '@/components/tickets/TicketsList';
import TicketAssignment from '@/components/tickets/TicketAssignment';
import AssignmentNotification from '@/components/tickets/AssignmentNotification';
import { TenantTicket } from '@/hooks/useTenantTickets';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTenantTickets } from '@/hooks/useTenantTickets';
import { useTenantDataContext } from '@/contexts/TenantDataContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Clock, MessageSquare, Phone, Mail, Tag } from 'lucide-react';

const Atendimentos = () => {
  const [selectedTicket, setSelectedTicket] = useState<TenantTicket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [showAssignmentNotification, setShowAssignmentNotification] = useState<{
    ticketTitle: string;
    assignedUserName: string;
    assignedBy?: string;
    ticketId: string;
  } | null>(null);
  
  // Form states for creating new ticket
  const [newTicketForm, setNewTicketForm] = useState({
    title: '',
    description: '',
    contact_id: '',
    priority: 'normal' as TenantTicket['priority'],
    channel: 'whatsapp' as TenantTicket['channel']
  });

  const { createTicket, updateTicket } = useTenantTickets();
  const { contacts } = useTenantDataContext();

  const handleCreateTicket = async () => {
    if (!newTicketForm.title.trim() || !newTicketForm.contact_id) {
      return;
    }

    await createTicket({
      title: newTicketForm.title,
      description: newTicketForm.description,
      contact_id: newTicketForm.contact_id,
      priority: newTicketForm.priority,
      channel: newTicketForm.channel,
      status: 'open',
      tags: [],
      custom_fields: {}
    });

    setShowCreateModal(false);
    setNewTicketForm({
      title: '',
      description: '',
      contact_id: '',
      priority: 'normal',
      channel: 'whatsapp'
    });
  };

  const handleTicketSelect = (ticket: TenantTicket) => {
    setSelectedTicket(ticket);
    setShowTicketDetail(true);
  };

  const handleStatusChange = async (status: TenantTicket['status']) => {
    if (!selectedTicket) return;
    
    await updateTicket(selectedTicket.id, { status });
    setSelectedTicket({ ...selectedTicket, status });
  };

  const handleAssignmentChange = (ticketId: string, userId: string | null) => {
    if (selectedTicket && userId) {
      // Update the selected ticket with the new assignment
      const updatedTicket = { 
        ...selectedTicket, 
        assigned_user_id: userId,
        assigned_user: {
          id: userId,
          name: 'Usuario', // This will be updated by the refetch
          email: 'user@example.com'
        }
      };
      setSelectedTicket(updatedTicket);

      // Show notification
      setShowAssignmentNotification({
        ticketTitle: selectedTicket.title,
        assignedUserName: 'Agente',
        ticketId: ticketId
      });
    }
  };

  const statusLabels = {
    open: 'Aberto',
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    resolved: 'Resolvido',
    closed: 'Fechado'
  };

  const priorityLabels = {
    low: 'Baixa',
    normal: 'Normal',
    high: 'Alta',
    urgent: 'Urgente'
  };

  const statusColors = {
    open: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-orange-100 text-orange-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <SidebarLayout>
      <div className="p-6 bg-background min-h-screen">
        <TicketsList 
          onTicketSelect={handleTicketSelect}
          onCreateTicket={() => setShowCreateModal(true)}
        />

        {/* Create Ticket Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Criar Novo Ticket</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={newTicketForm.title}
                  onChange={(e) => setNewTicketForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título do ticket"
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
                  Criar Ticket
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Ticket Detail Modal */}
        <Dialog open={showTicketDetail} onOpenChange={setShowTicketDetail}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedTicket && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    {selectedTicket.title}
                    <Badge className={statusColors[selectedTicket.status]}>
                      {statusLabels[selectedTicket.status]}
                    </Badge>
                    <Badge variant="outline" className={priorityColors[selectedTicket.priority]}>
                      {priorityLabels[selectedTicket.priority]}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    {selectedTicket.description && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            Descrição
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{selectedTicket.description}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Status Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Select value={selectedTicket.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Aberto</SelectItem>
                              <SelectItem value="pending">Pendente</SelectItem>
                              <SelectItem value="in_progress">Em Andamento</SelectItem>
                              <SelectItem value="resolved">Resolvido</SelectItem>
                              <SelectItem value="closed">Fechado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Assignment Component */}
                    <TicketAssignment 
                      ticket={selectedTicket}
                      onAssignmentChange={handleAssignmentChange}
                    />

                    {/* Contact Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Contato
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={selectedTicket.contact?.avatar} />
                            <AvatarFallback>
                              {selectedTicket.contact?.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{selectedTicket.contact?.name}</p>
                            <p className="text-sm text-muted-foreground">Canal: {selectedTicket.channel}</p>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          {selectedTicket.contact?.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{selectedTicket.contact.phone}</span>
                            </div>
                          )}
                          {selectedTicket.contact?.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4" />
                              <span>{selectedTicket.contact.email}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Ticket Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Informações
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Criado:</span>
                          <p>{formatDistanceToNow(selectedTicket.created_at, { locale: ptBR, addSuffix: true })}</p>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Atualizado:</span>
                          <p>{formatDistanceToNow(selectedTicket.updated_at, { locale: ptBR, addSuffix: true })}</p>
                        </div>
                        
                        {selectedTicket.assigned_user && (
                          <div>
                            <span className="text-muted-foreground">Responsável:</span>
                            <p>{selectedTicket.assigned_user.name}</p>
                          </div>
                        )}
                        
                        {selectedTicket.tags.length > 0 && (
                          <div>
                            <span className="text-muted-foreground flex items-center gap-1 mb-2">
                              <Tag className="h-4 w-4" />
                              Tags:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {selectedTicket.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Assignment Notification */}
        {showAssignmentNotification && (
          <AssignmentNotification
            ticketTitle={showAssignmentNotification.ticketTitle}
            assignedUserName={showAssignmentNotification.assignedUserName}
            assignedBy={showAssignmentNotification.assignedBy}
            ticketId={showAssignmentNotification.ticketId}
          />
        )}
      </div>
    </SidebarLayout>
  );
};

export default Atendimentos;
