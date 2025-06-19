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
    <div className="flex h-screen bg-background">
      {/* Sidebar - Lista de Conversas */}
      <div className="w-full md:w-96 bg-card border-r border-border flex flex-col">
        {/* Header da Sidebar Reorganizado */}
        <div className="p-4 border-b border-border">
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
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Tabs de Status - Primeira Linha */}
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setActiveTab('finalizado')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === 'finalizado' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              FINALIZADO
            </button>
            <button
              onClick={() => setActiveTab('grupos')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === 'grupos' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Users className="w-4 h-4 mr-1" />
              GRUPOS
            </button>
          </div>

          {/* Tabs de Status - Segunda Linha */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('em-atendimento')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === 'em-atendimento' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <MessageSquare className="w-4 h-4 mr-1" />
              EM ATENDIMENTO
            </button>
            <button
              onClick={() => setActiveTab('aguardando')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === 'aguardando' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Clock className="w-4 h-4 mr-1" />
              AGUARDANDO
            </button>
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors flex-1 justify-center ${
                activeTab === 'chatbot' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <Bot className="w-4 h-4 mr-1" />
              CHATBOT
            </button>
          </div>
        </div>

        {/* Lista de Conversas */}
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
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="brand-primary brand-text-background text-sm">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(contact.status)}`}></div>
                  <div className="absolute -top-1 -right-1 text-lg">
                    {getChannelIcon(contact.channel)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium brand-text-foreground truncate">
                      {contact.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs brand-text-gray-500">{contact.time}</span>
                      {contact.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {contact.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm brand-text-gray-600 truncate mt-1">
                    {contact.lastMessage}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {contact.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs brand-border brand-text-foreground"
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
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 bg-card border-b border-border flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedContact.avatar} />
                    <AvatarFallback className="brand-primary brand-text-background">
                      {selectedContact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(selectedContact.status)}`}></div>
                </div>
                <div>
                  <h3 className="font-medium brand-text-foreground">{selectedContact.name}</h3>
                  <p className="text-sm brand-text-gray-500">
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

            {/* Área de Mensagens */}
            <div className="flex-1 p-4 overflow-y-auto bg-muted/20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20zm20-16c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16z'/%3E%3C/g%3E%3C/svg%3E")`
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
                          ? 'brand-primary brand-text-background'
                          : 'brand-card brand-text-foreground brand-border'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.sender === 'user' 
                          ? 'brand-text-background opacity-70' 
                          : 'brand-text-gray-500'
                      }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Indicador de Status do Atendimento */}
              <div className="text-center my-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full brand-success brand-text-background text-xs">
                  ✓ Atendimento finalizado por Suporte Komvvo, em 15/06/2025 - 15:47
                </div>
              </div>
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 bg-card border-t border-border">
              <div className="flex items-end space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 brand-card brand-border rounded-lg">
                  <Input
                    placeholder="Digite uma mensagem"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="border-0 focus:ring-0 brand-input"
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Smile className="w-5 h-5" />
                </Button>
                {message ? (
                  <Button onClick={handleSendMessage} size="sm" className="brand-primary">
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm">
                    <Mic className="w-5 h-5" />
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Estado Vazio */
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 brand-text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium brand-text-foreground mb-2">
                Selecione uma conversa
              </h3>
              <p className="brand-text-gray-500">
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
