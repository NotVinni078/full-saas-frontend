import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, MessageSquare, Clock, CheckCircle, Users, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useTenantTickets, TenantTicket } from '@/hooks/useTenantTickets';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WhatsAppSidebarProps {
  selectedTicket: TenantTicket | null;
  onTicketSelect: (ticket: TenantTicket) => void;
  onCreateTicket: () => void;
  isMobile?: boolean;
}

const WhatsAppSidebar: React.FC<WhatsAppSidebarProps> = ({
  selectedTicket,
  onTicketSelect,
  onCreateTicket,
  isMobile = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('em_atendimento');
  const { tickets } = useTenantTickets();

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = false;
    switch (activeFilter) {
      case 'finalizados':
        matchesFilter = ticket.status === 'resolved' || ticket.status === 'closed';
        break;
      case 'em_atendimento':
        matchesFilter = ticket.status === 'in_progress' || ticket.status === 'open';
        break;
      case 'aguardando':
        matchesFilter = ticket.status === 'pending';
        break;
      case 'chatbot':
        // Assumindo que tickets do chatbot têm uma tag ou campo específico
        matchesFilter = ticket.tags.includes('chatbot') || ticket.channel === 'webchat';
        break;
      case 'grupos':
        // Assumindo que grupos têm uma identificação específica
        matchesFilter = ticket.tags.includes('grupo') || ticket.custom_fields.isGroup;
        break;
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: TenantTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: TenantTicket['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getChannelIcon = (channel: TenantTicket['channel']) => {
    switch (channel) {
      case 'whatsapp': return '📱';
      case 'telegram': return '✈️';
      case 'instagram': return '📷';
      case 'facebook': return '👥';
      case 'webchat': return '💬';
      default: return '💬';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header estilo WhatsApp */}
      <div className="p-4 bg-card border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-foreground">Atendimentos</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onCreateTicket}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar atendimentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus:bg-background focus:ring-1 focus:ring-primary/20 rounded-lg"
          />
        </div>

        {/* Updated filter layout */}
        <div className="grid grid-cols-3 gap-1">
          {/* Top row: Finalizados, Aguardando, Em atendimento */}
          <Button
            variant={activeFilter === 'finalizados' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('finalizados')}
            className="text-xs whitespace-nowrap h-8"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Finalizados
          </Button>
          
          <Button
            variant={activeFilter === 'aguardando' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('aguardando')}
            className="text-xs whitespace-nowrap h-8"
          >
            <Clock className="w-3 h-3 mr-1" />
            Aguardando
          </Button>
          
          <Button
            variant={activeFilter === 'em_atendimento' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('em_atendimento')}
            className="text-xs whitespace-nowrap h-8"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Em atendimento
          </Button>

          {/* Bottom row: empty, Chatbot, Grupos */}
          <div></div> {/* Empty space */}
          
          <Button
            variant={activeFilter === 'chatbot' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('chatbot')}
            className="text-xs whitespace-nowrap h-8"
          >
            <Bot className="w-3 h-3 mr-1" />
            Chatbot
          </Button>
          
          <Button
            variant={activeFilter === 'grupos' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveFilter('grupos')}
            className="text-xs whitespace-nowrap h-8"
          >
            <Users className="w-3 h-3 mr-1" />
            Grupos
          </Button>
        </div>
      </div>

      {/* Lista de tickets */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => onTicketSelect(ticket)}
                className={`flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0 ${
                  selectedTicket?.id === ticket.id ? 'bg-secondary' : ''
                }`}
              >
                {/* Avatar e indicadores */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={ticket.contact?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {ticket.contact?.name?.charAt(0).toUpperCase() || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Indicador de prioridade */}
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                  
                  {/* Ícone do canal */}
                  <div className="absolute -bottom-1 -right-1 text-sm bg-card rounded-full w-5 h-5 flex items-center justify-center border border-border">
                    {getChannelIcon(ticket.channel)}
                  </div>
                </div>

                {/* Informações do ticket */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {ticket.contact?.name || 'Contato'}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(ticket.created_at, { locale: ptBR, addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {ticket.title}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' && 'Aberto'}
                      {ticket.status === 'pending' && 'Pendente'}
                      {ticket.status === 'in_progress' && 'Em Andamento'}
                      {ticket.status === 'resolved' && 'Resolvido'}
                      {ticket.status === 'closed' && 'Fechado'}
                    </Badge>
                    
                    {ticket.assigned_user && (
                      <span className="text-xs text-muted-foreground">
                        {ticket.assigned_user.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Nenhum atendimento encontrado' : 'Nenhum atendimento'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Tente buscar por outro termo'
                  : 'Crie um novo atendimento para começar'
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={onCreateTicket}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Atendimento
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WhatsAppSidebar;
