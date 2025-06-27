
import React from 'react';
import { ArrowLeft, Phone, Video, Search, MoreVertical, User, Clock, Tag, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import TicketAssignment from '@/components/tickets/TicketAssignment';
import { TenantTicket } from '@/hooks/useTenantTickets';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WhatsAppChatAreaProps {
  selectedTicket: TenantTicket | null;
  onStatusChange: (status: TenantTicket['status']) => void;
  onAssignmentChange: (ticketId: string, userId: string | null) => void;
  onBack: () => void;
  isMobile?: boolean;
}

const WhatsAppChatArea: React.FC<WhatsAppChatAreaProps> = ({
  selectedTicket,
  onStatusChange,
  onAssignmentChange,
  onBack,
  isMobile = false
}) => {
  if (!selectedTicket) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center max-w-sm">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" className="w-16 h-16 text-muted-foreground">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 className="text-xl font-medium text-foreground mb-2">
            Selecione um atendimento
          </h3>
          <p className="text-muted-foreground">
            Escolha um atendimento na lista para visualizar detalhes e iniciar o suporte
          </p>
        </div>
      </div>
    );
  }

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
    <div className="h-full flex flex-col bg-background">
      {/* Header estilo WhatsApp */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Botão voltar - mobile */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-foreground hover:bg-accent h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            {/* Avatar e informações */}
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedTicket.contact?.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {selectedTicket.contact?.name?.charAt(0).toUpperCase() || 'T'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {selectedTicket.contact?.name || 'Contato'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedTicket.title}
              </p>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Área de conteúdo */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Informações do ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Badge className={statusColors[selectedTicket.status]}>
                  {statusLabels[selectedTicket.status]}
                </Badge>
                <Badge variant="outline" className={priorityColors[selectedTicket.priority]}>
                  {priorityLabels[selectedTicket.priority]}
                </Badge>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTicket.description && (
              <div className="mb-4">
                <h4 className="font-medium text-foreground mb-2">Descrição:</h4>
                <p className="text-muted-foreground">{selectedTicket.description}</p>
              </div>
            )}
            
            {/* Ações de status */}
            <div className="flex gap-2">
              <Select value={selectedTicket.status} onValueChange={onStatusChange}>
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

        {/* Informações laterais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Atribuição */}
          <TicketAssignment 
            ticket={selectedTicket}
            onAssignmentChange={onAssignmentChange}
          />

          {/* Contato */}
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
                    {selectedTicket.contact?.name?.charAt(0).toUpperCase() || 'T'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedTicket.contact?.name || 'Contato'}</p>
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
        </div>

        {/* Informações do ticket */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Informações do Ticket
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
  );
};

export default WhatsAppChatArea;
