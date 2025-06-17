import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Smile, Paperclip, UserPlus, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface Contact {
  id: string;
  name: string;
  department: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

const ChatInterno = () => {
  const [selectedContact, setSelectedContact] = useState<string>('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'João Silva',
      department: 'Suporte Técnico',
      status: 'online',
      lastMessage: 'Oi! Como está o projeto?',
      lastMessageTime: '14:30',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Maria Santos',
      department: 'Vendas',
      status: 'away',
      lastMessage: 'Vou verificar isso',
      lastMessageTime: '13:45'
    },
    {
      id: '3',
      name: 'Pedro Costa',
      department: 'Desenvolvimento',
      status: 'offline',
      lastMessage: 'Obrigado pela ajuda!',
      lastMessageTime: '12:15'
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      department: 'Marketing',
      status: 'online',
      lastMessage: 'Reunião confirmada para amanhã',
      lastMessageTime: '11:30',
      unreadCount: 1
    },
    {
      id: '5',
      name: 'Carlos Lima',
      department: 'Financeiro',
      status: 'online',
      lastMessage: 'Perfeito! Vamos em frente',
      lastMessageTime: '10:20'
    },
    {
      id: '6',
      name: 'Luciana Ferreira',
      department: 'RH',
      status: 'online',
      lastMessage: 'Documentos enviados por email',
      lastMessageTime: '09:45',
      unreadCount: 3
    },
    {
      id: '7',
      name: 'Roberto Alves',
      department: 'Operações',
      status: 'away',
      lastMessage: 'Processo aprovado!',
      lastMessageTime: '09:15'
    },
    {
      id: '8',
      name: 'Fernanda Souza',
      department: 'Qualidade',
      status: 'offline',
      lastMessage: 'Relatório está pronto',
      lastMessageTime: 'Ontem'
    },
    {
      id: '9',
      name: 'Gabriel Pereira',
      department: 'TI',
      status: 'online',
      lastMessage: 'Sistema funcionando perfeitamente',
      lastMessageTime: '16:20',
      unreadCount: 1
    },
    {
      id: '10',
      name: 'Julia Mendes',
      department: 'Design',
      status: 'online',
      lastMessage: 'Mockups prontos para revisão',
      lastMessageTime: '15:45'
    },
    {
      id: '11',
      name: 'Rafael Torres',
      department: 'Produto',
      status: 'away',
      lastMessage: 'Reunião de planejamento às 17h',
      lastMessageTime: '14:50'
    },
    {
      id: '12',
      name: 'Camila Rocha',
      department: 'Comunicação',
      status: 'online',
      lastMessage: 'Post aprovado para publicação',
      lastMessageTime: '14:25',
      unreadCount: 2
    },
    {
      id: '13',
      name: 'Ricardo Mendes',
      department: 'TI',
      status: 'online',
      lastMessage: 'Backup realizado com sucesso',
      lastMessageTime: '13:10'
    },
    {
      id: '14',
      name: 'Juliana Rocha',
      department: 'Comercial',
      status: 'online',
      lastMessage: 'Cliente confirmou a proposta',
      lastMessageTime: '12:30',
      unreadCount: 1
    },
    {
      id: '15',
      name: 'André Barbosa',
      department: 'Logística',
      status: 'away',
      lastMessage: 'Entrega programada para hoje',
      lastMessageTime: '11:45'
    },
    {
      id: '16',
      name: 'Beatriz Silva',
      department: 'Jurídico',
      status: 'online',
      lastMessage: 'Contrato revisado e aprovado',
      lastMessageTime: '10:15',
      unreadCount: 2
    }
  ];

  const availableUsers: Contact[] = [
    {
      id: '17',
      name: 'Marcos Oliveira',
      department: 'TI',
      status: 'online'
    },
    {
      id: '18',
      name: 'Patricia Santos',
      department: 'Comercial',
      status: 'online'
    },
    {
      id: '19',
      name: 'Diego Costa',
      department: 'Logística',
      status: 'away'
    },
    {
      id: '20',
      name: 'Larissa Lima',
      department: 'Jurídico',
      status: 'online'
    }
  ];

  const messages: Record<string, Message[]> = {
    '1': [
      {
        id: '1',
        sender: 'João Silva',
        content: 'Oi! Como está o projeto?',
        timestamp: '14:30',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Está indo bem! Acabei de finalizar a parte do dashboard.',
        timestamp: '14:32',
        isOwn: true
      },
      {
        id: '3',
        sender: 'João Silva',
        content: 'Ótimo! Podemos revisar juntos depois?',
        timestamp: '14:33',
        isOwn: false
      },
      {
        id: '4',
        sender: 'Você',
        content: 'Claro! Que tal às 16h?',
        timestamp: '14:34',
        isOwn: true
      }
    ],
    '2': [
      {
        id: '1',
        sender: 'Maria Santos',
        content: 'Bom dia! Recebi sua proposta comercial',
        timestamp: '13:40',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Ótimo! O que achou dos valores?',
        timestamp: '13:42',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Maria Santos',
        content: 'Vou verificar isso',
        timestamp: '13:45',
        isOwn: false
      }
    ],
    '3': [
      {
        id: '1',
        sender: 'Pedro Costa',
        content: 'Conseguiu resolver o bug da API?',
        timestamp: '12:10',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Sim! Era um problema na validação dos dados',
        timestamp: '12:12',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Pedro Costa',
        content: 'Obrigado pela ajuda!',
        timestamp: '12:15',
        isOwn: false
      }
    ],
    '4': [
      {
        id: '1',
        sender: 'Ana Oliveira',
        content: 'Preciso confirmar nossa reunião de amanhã',
        timestamp: '11:25',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Claro! Às 10h na sala de reuniões?',
        timestamp: '11:28',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Ana Oliveira',
        content: 'Reunião confirmada para amanhã',
        timestamp: '11:30',
        isOwn: false
      }
    ],
    '5': [
      {
        id: '1',
        sender: 'Carlos Lima',
        content: 'Os números do trimestre estão aprovados',
        timestamp: '10:15',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Excelente! Podemos prosseguir com o planejamento',
        timestamp: '10:18',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Carlos Lima',
        content: 'Perfeito! Vamos em frente',
        timestamp: '10:20',
        isOwn: false
      }
    ],
    '6': [
      {
        id: '1',
        sender: 'Luciana Ferreira',
        content: 'Enviados os contratos para assinatura',
        timestamp: '09:40',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Recebi! Vou revisar hoje',
        timestamp: '09:42',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Luciana Ferreira',
        content: 'Documentos enviados por email',
        timestamp: '09:45',
        isOwn: false
      }
    ],
    '7': [
      {
        id: '1',
        sender: 'Roberto Alves',
        content: 'Solicitação de melhoria foi analisada',
        timestamp: '09:10',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'E qual foi o resultado?',
        timestamp: '09:12',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Roberto Alves',
        content: 'Processo aprovado!',
        timestamp: '09:15',
        isOwn: false
      }
    ],
    '8': [
      {
        id: '1',
        sender: 'Fernanda Souza',
        content: 'Análise de qualidade finalizada',
        timestamp: 'Ontem 16:30',
        isOwn: false
      },
      {
        id: '2',
        sender: 'Você',
        content: 'Ótimo! Alguma observação importante?',
        timestamp: 'Ontem 16:32',
        isOwn: true
      },
      {
        id: '3',
        sender: 'Fernanda Souza',
        content: 'Relatório está pronto',
        timestamp: 'Ontem 16:35',
        isOwn: false
      }
    ]
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = messages[selectedContact] || [];
  const currentContact = contacts.find(c => c.id === selectedContact);

  const handleSelectContact = (contactId: string) => {
    setSelectedContact(contactId);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowChat(false);
    setSelectedContact('');
  };

  const handleCloseChat = () => {
    setSelectedContact('');
    setShowChat(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Enviando mensagem:', message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartNewChat = (userId: string) => {
    console.log('Iniciando novo chat com usuário:', userId);
    setShowNewChatDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  return (
    <div className="h-full bg-background flex">
      {/* Lista de Contatos - Mobile: condicional, Desktop: sempre visível com largura reduzida */}
      <div className={`w-full md:w-72 border-r border-border bg-card flex flex-col ${showChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header da lista */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-card-foreground">Chat Interno</h2>
            <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Iniciar Nova Conversa</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleStartNewChat(user.id)}
                      className="w-full p-3 rounded-lg text-left transition-colors hover:bg-muted flex items-center space-x-3"
                    >
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card ${getStatusColor(user.status)}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm text-card-foreground">{user.name}</h3>
                        <p className="text-xs text-muted-foreground">{user.department}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuário"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de contatos */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleSelectContact(contact.id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedContact === contact.id 
                    ? 'bg-black text-white dark:bg-white dark:text-black' 
                    : 'hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(contact.status)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-medium text-sm truncate ${
                          selectedContact === contact.id ? 'text-white dark:text-black' : 'text-card-foreground'
                        }`}>
                          {contact.name}
                        </h3>
                        <p className={`text-xs truncate ${
                          selectedContact === contact.id ? 'text-white/70 dark:text-black/70' : 'text-muted-foreground'
                        }`}>
                          {contact.department}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {contact.lastMessageTime && (
                          <span className={`text-xs ${
                            selectedContact === contact.id ? 'text-white/70 dark:text-black/70' : 'text-muted-foreground'
                          }`}>
                            {contact.lastMessageTime}
                          </span>
                        )}
                        {contact.unreadCount && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {contact.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {contact.lastMessage && (
                      <p className={`text-xs truncate mt-1 ${
                        selectedContact === contact.id ? 'text-white/70 dark:text-black/70' : 'text-muted-foreground'
                      }`}>
                        {contact.lastMessage}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área de Chat - Mobile: condicional, Desktop: sempre visível */}
      <div className={`flex-1 flex flex-col bg-background ${!showChat ? 'hidden md:flex' : 'flex'}`}>
        {currentContact ? (
          <>
            {/* Header do chat */}
            <div className="p-4 border-b border-border bg-card flex items-center">
              {/* Botão voltar - apenas mobile */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden mr-2"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3 flex-1">
                {/* Botão fechar conversa - apenas para desktop */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleCloseChat}
                  className="hidden md:flex text-muted-foreground hover:text-card-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentContact.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                      {currentContact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-card ${getStatusColor(currentContact.status)}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-card-foreground">{currentContact.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentContact.department} • {getStatusText(currentContact.status)}</p>
                </div>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl ${msg.isOwn ? 'order-2' : ''}`}>
                      {!msg.isOwn && (
                        <p className="text-xs text-muted-foreground mb-1 ml-1">{msg.sender}</p>
                      )}
                      <div
                        className={`rounded-lg px-3 py-2 ${
                          msg.isOwn
                            ? 'bg-black text-white dark:bg-white dark:text-black'
                            : 'bg-muted text-card-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.isOwn ? 'text-white/70 dark:text-black/70' : 'text-muted-foreground'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de mensagem */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="resize-none"
                  />
                </div>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-background">
            <div className="text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">Selecione um usuário</h3>
              <p className="text-muted-foreground">Escolha uma conversa para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterno;
