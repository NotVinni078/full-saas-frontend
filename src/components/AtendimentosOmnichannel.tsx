
import React, { useState } from 'react';
import { Search, MoreVertical, Phone, Video, Paperclip, Send, Smile, Mic, Filter, Users, UserCheck, MessageSquare, Bot, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface Contact {
  id: number;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: 'online' | 'away' | 'offline';
  channel: 'whatsapp' | 'telegram' | 'messenger' | 'email';
  tags: string[];
}

interface Message {
  id: number;
  text: string;
  time: string;
  sender: 'user' | 'contact';
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

const AtendimentosOmnichannel = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('em-atendimento');
  const [searchTerm, setSearchTerm] = useState('');

  const contacts: Contact[] = [
    {
      id: 1,
      name: 'João Vinícius',
      avatar: '',
      lastMessage: 'Utilize nosso cardápio para realizar o pedido.',
      time: '21:49',
      unread: 2,
      status: 'online',
      channel: 'whatsapp',
      tags: ['VIP', 'KOMVVN', 'SUPORTE']
    },
    {
      id: 2,
      name: 'Maria Silva',
      avatar: '',
      lastMessage: 'Quando será entregue meu pedido?',
      time: '20:15',
      unread: 1,
      status: 'away',
      channel: 'whatsapp',
      tags: ['VENDAS']
    },
    {
      id: 3,
      name: 'Pedro Santos',
      avatar: '',
      lastMessage: 'Obrigado pelo atendimento!',
      time: '19:32',
      unread: 0,
      status: 'offline',
      channel: 'telegram',
      tags: ['SUPORTE']
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      text: 'Olá! Como posso ajudá-lo hoje?',
      time: '21:45',
      sender: 'user',
      status: 'read',
      type: 'text'
    },
    {
      id: 2,
      text: 'Utilize nosso cardápio para realizar o pedido.',
      time: '21:49',
      sender: 'contact',
      status: 'read',
      type: 'text'
    }
  ];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return '📱';
      case 'telegram': return '✈️';
      case 'messenger': return '💬';
      case 'email': return '📧';
      default: return '💬';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui implementaríamos a lógica de envio
      setMessage('');
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-background overflow-hidden">
      {/* Sidebar - Lista de Conversas */}
      <div className="w-full md:w-96 bg-card border-r border-border flex flex-col">
        {/* Header da Sidebar - Fixo sem rolagem */}
        <div className="flex-shrink-0 p-4 border-b border-border bg-card">
          {/* Título da Página */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Atendimentos</h2>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Barra de Busca com Filtros */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar atendimento e mensagens"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Button variant="outline" size="sm" className="flex-shrink-0 border-border">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs de Status - Grid responsivo */}
          <div className="grid grid-cols-2 gap-1 mb-2">
            <button
              onClick={() => setActiveTab('finalizado')}
              className={`flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-colors justify-center ${
                activeTab === 'finalizado' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              FINALIZADO
            </button>
            <button
              onClick={() => setActiveTab('grupos')}
              className={`flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-colors justify-center ${
                activeTab === 'grupos' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Users className="w-3 h-3 mr-1" />
              GRUPOS
            </button>
          </div>

          {/* Segunda linha de tabs - Grid responsivo */}
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setActiveTab('em-atendimento')}
              className={`flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-colors justify-center ${
                activeTab === 'em-atendimento' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">EM ATENDIMENTO</span>
              <span className="sm:hidden">ATEND.</span>
            </button>
            <button
              onClick={() => setActiveTab('aguardando')}
              className={`flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-colors justify-center ${
                activeTab === 'aguardando' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">AGUARDANDO</span>
              <span className="sm:hidden">AGUARD.</span>
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center px-2 py-2 rounded-lg text-xs font-medium transition-colors justify-center ${
                activeTab === 'chatbot' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Bot className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">CHATBOT</span>
              <span className="sm:hidden">BOT</span>
            </button>
          </div>
        </div>

        {/* Lista de Conversas - Rolagem independente */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 cursor-pointer border-b border-border transition-colors ${
                selectedContact?.id === contact.id 
                  ? 'bg-secondary' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(contact.status)}`}></div>
                  <div className="absolute -top-1 -right-1 text-lg">
                    {getChannelIcon(contact.channel)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground truncate">
                      {contact.name}
                    </h3>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">{contact.time}</span>
                      {contact.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {contact.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {contact.lastMessage}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-border text-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área Principal do Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedContact ? (
          <>
            {/* Header do Chat - Fixo sem rolagem */}
            <div className="flex-shrink-0 p-4 bg-card border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedContact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(selectedContact.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedContact.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Atribuído a: Suporte Komvvo | Setor: Suporte
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-5 h-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>Ver perfil</DropdownMenuItem>
                      <DropdownMenuItem>Transferir atendimento</DropdownMenuItem>
                      <DropdownMenuItem>Finalizar atendimento</DropdownMenuItem>
                      <DropdownMenuItem>Bloquear contato</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Área de Mensagens - Altura calculada dinamicamente */}
            <div className="flex-1 overflow-y-auto bg-muted/10 p-4 min-h-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='hsl(var(--muted))' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm20-16c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16z'/%3E%3C/g%3E%3C/svg%3E")`
            }}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card text-foreground border border-border'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Indicador de Status do Atendimento */}
              <div className="text-center my-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs border border-border">
                  ✓ Atendimento finalizado por Suporte Komvvo, em 15/06/2025 - 15:47
                </div>
              </div>
            </div>

            {/* Input de Mensagem - Fixo no viewport, sempre visível */}
            <div className="flex-shrink-0 p-4 bg-card border-t border-border">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 bg-background border border-border rounded-lg">
                  <Input
                    placeholder="Digite uma mensagem"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="border-0 focus:ring-0 bg-transparent"
                  />
                </div>
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <Smile className="w-5 h-5" />
                </Button>
                {message ? (
                  <Button onClick={handleSendMessage} size="sm" className="bg-primary text-primary-foreground flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="flex-shrink-0">
                    <Mic className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Estado Vazio */
          <div className="flex-1 flex items-center justify-center bg-muted/10">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Selecione uma conversa
              </h3>
              <p className="text-muted-foreground">
                Escolha uma conversa na lista para começar a atender
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AtendimentosOmnichannel;
