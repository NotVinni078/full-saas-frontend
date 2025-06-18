
import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Users, Clock, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const AtendimentosOmnichannel = () => {
  const [selectedChannel, setSelectedChannel] = useState('all');

  const conversations = [
    {
      id: 1,
      customer: 'João Silva',
      avatar: '',
      channel: 'whatsapp',
      status: 'active',
      priority: 'high',
      lastMessage: 'Preciso de ajuda com meu pedido',
      time: '2 min',
      unread: 3,
      department: 'Vendas'
    },
    {
      id: 2,
      customer: 'Maria Santos',
      avatar: '',
      channel: 'email',
      status: 'waiting',
      priority: 'medium',
      lastMessage: 'Quando será entregue meu produto?',
      time: '15 min',
      unread: 1,
      department: 'Suporte'
    },
    {
      id: 3,
      customer: 'Pedro Costa',
      avatar: '',
      channel: 'chat',
      status: 'resolved',
      priority: 'low',
      lastMessage: 'Obrigado pela ajuda!',
      time: '1h',
      unread: 0,
      department: 'Suporte'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'waiting':
        return <Badge variant="warning">Aguardando</Badge>;
      case 'resolved':
        return <Badge variant="default">Resolvido</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'brand-text-error';
      case 'medium':
        return 'brand-text-warning';
      case 'low':
        return 'brand-text-success';
      default:
        return 'brand-text-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold brand-text-foreground">Atendimentos Omnichannel</h2>
          <p className="brand-text-muted">Gerencie conversas de todos os canais em um só lugar</p>
        </div>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          Nova Conversa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="brand-text-muted text-sm font-medium">Conversas Ativas</p>
                <p className="text-2xl font-bold brand-text-foreground">24</p>
              </div>
              <div className="brand-primary p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="brand-text-success text-sm">+12%</span>
              <span className="brand-text-muted text-sm ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="brand-text-muted text-sm font-medium">Tempo Médio</p>
                <p className="text-2xl font-bold brand-text-foreground">3m 45s</p>
              </div>
              <div className="brand-warning p-3 rounded-lg">
                <Clock className="w-6 h-6 text-black" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="brand-text-error text-sm">+5%</span>
              <span className="brand-text-muted text-sm ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="brand-text-muted text-sm font-medium">Resoluções</p>
                <p className="text-2xl font-bold brand-text-foreground">18</p>
              </div>
              <div className="brand-success p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="brand-text-success text-sm">+8%</span>
              <span className="brand-text-muted text-sm ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="brand-text-muted text-sm font-medium">Satisfação</p>
                <p className="text-2xl font-bold brand-text-foreground">4.8</p>
              </div>
              <div className="brand-info p-3 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="brand-text-success text-sm">+0.2</span>
              <span className="brand-text-muted text-sm ml-1">vs ontem</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Filter */}
      <div className="flex space-x-2">
        <Button 
          variant={selectedChannel === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedChannel('all')}
          size="sm"
        >
          Todos
        </Button>
        <Button 
          variant={selectedChannel === 'whatsapp' ? 'default' : 'outline'}
          onClick={() => setSelectedChannel('whatsapp')}
          size="sm"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          WhatsApp
        </Button>
        <Button 
          variant={selectedChannel === 'email' ? 'default' : 'outline'}
          onClick={() => setSelectedChannel('email')}
          size="sm"
        >
          <Mail className="w-4 h-4 mr-1" />
          Email
        </Button>
        <Button 
          variant={selectedChannel === 'chat' ? 'default' : 'outline'}
          onClick={() => setSelectedChannel('chat')}
          size="sm"
        >
          <MessageSquare className="w-4 h-4 mr-1" />
          Chat
        </Button>
      </div>

      {/* Conversations List */}
      <Card>
        <CardHeader>
          <CardTitle>Conversas Recentes</CardTitle>
          <CardDescription>Lista de todas as conversas ativas e recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversations.map((conversation) => (
              <div 
                key={conversation.id} 
                className="flex items-center space-x-4 p-4 brand-gray-50 brand-hover-gray-100 rounded-lg cursor-pointer brand-border brand-card"
              >
                <Avatar>
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback className="brand-primary text-white">
                    {conversation.customer.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium brand-text-foreground">{conversation.customer}</p>
                      <div className="brand-gray-200 p-1 rounded">
                        {getChannelIcon(conversation.channel)}
                      </div>
                      <span className="brand-text-gray-500 text-sm">{conversation.department}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(conversation.status)}
                      <AlertCircle className={`w-4 h-4 ${getPriorityColor(conversation.priority)}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="brand-text-muted text-sm truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center space-x-2">
                      <span className="brand-text-gray-500 text-xs">{conversation.time}</span>
                      {conversation.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Assumir conversa</DropdownMenuItem>
                    <DropdownMenuItem>Transferir</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como resolvida</DropdownMenuItem>
                    <DropdownMenuItem>Ver histórico</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtendimentosOmnichannel;
