
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Search, Plus, MoreVertical, Users, MessageCircle, Phone, Video } from 'lucide-react';

const ChatInterno = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Equipe de Suporte',
      type: 'group',
      participants: 5,
      lastMessage: 'Ana Silva: Resolvido o problema do cliente X',
      time: '14:30',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Carlos Santos',
      type: 'direct',
      lastMessage: 'Preciso de ajuda com um atendimento',
      time: '13:45',
      unread: 1,
      online: true
    },
    {
      id: 3,
      name: 'Maria Costa',
      type: 'direct',
      lastMessage: 'Obrigada pela ajuda!',
      time: '12:20',
      unread: 0,
      online: false
    },
    {
      id: 4,
      name: 'Gerência',
      type: 'group',
      participants: 3,
      lastMessage: 'João: Reunião amanhã às 10h',
      time: '11:15',
      unread: 0,
      online: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Ana Silva',
      message: 'Pessoal, consegui resolver aquele problema complexo do cliente da manhã',
      time: '14:25',
      isMe: false
    },
    {
      id: 2,
      sender: 'Você',
      message: 'Ótimo trabalho, Ana! Como você resolveu?',
      time: '14:26',
      isMe: true
    },
    {
      id: 3,
      sender: 'Carlos Santos',
      message: 'Foi relacionado à integração com o sistema de pagamento',
      time: '14:27',
      isMe: false
    },
    {
      id: 4,
      sender: 'Ana Silva', 
      message: 'Exato! Tive que ajustar as configurações da API. Vou documentar o processo para futuros casos similares.',
      time: '14:30',
      isMe: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Aqui implementaríamos a lógica de envio
      setMessage('');
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarLayout>
      <div className="flex h-[calc(100vh-80px)] bg-background">
        {/* Lista de Chats */}
        <div className="w-full md:w-80 bg-card border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Chat Interno</h2>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Chat
              </Button>
            </div>
            
            {/* Barra de Busca */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>

          {/* Lista de Conversas */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b border-border transition-colors ${
                  selectedChat?.id === chat.id 
                    ? 'bg-secondary' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {chat.type === 'group' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          chat.name.split(' ').map(n => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-foreground truncate">
                          {chat.name}
                        </h3>
                        {chat.type === 'group' && (
                          <Badge variant="outline" className="text-xs border-border">
                            {chat.participants}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                        {chat.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Área do Chat */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Header do Chat */}
              <div className="p-4 bg-card border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {selectedChat.type === 'group' ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          selectedChat.name.split(' ').map((n: string) => n[0]).join('')
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-foreground">{selectedChat.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedChat.type === 'group' 
                          ? `${selectedChat.participants} membros` 
                          : selectedChat.online ? 'Online' : 'Offline'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {selectedChat.type === 'direct' && (
                      <>
                        <Button variant="ghost" size="sm">
                          <Phone className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 bg-muted/10">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md ${msg.isMe ? 'order-2' : ''}`}>
                        {!msg.isMe && (
                          <p className="text-xs text-muted-foreground mb-1 ml-1">
                            {msg.sender}
                          </p>
                        )}
                        <div
                          className={`px-4 py-2 rounded-lg ${
                            msg.isMe
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-card text-foreground border border-border'
                          }`}
                        >
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${
                            msg.isMe 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input de Mensagem */}
              <div className="p-4 bg-card border-t border-border">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-background border border-border rounded-lg">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="border-0 focus:ring-0 bg-transparent"
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!message.trim()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Estado Vazio */
            <div className="flex-1 flex items-center justify-center bg-muted/10">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Selecione uma conversa
                </h3>
                <p className="text-muted-foreground">
                  Escolha uma conversa da lista para começar a conversar com sua equipe
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ChatInterno;
