
import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Smile, Paperclip, UserPlus, ArrowLeft, Users, MoreVertical, Trash2, Reply, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUsers } from "@/hooks/useUsers";
import { ChatInicio } from './chat/ChatInicio';
import { NovoChat } from './chat/NovoChat';
import { NovoGrupo } from './chat/NovoGrupo';
import { ChatConversa } from './chat/ChatConversa';

/**
 * Interface para definir uma mensagem individual do chat
 * Contém todas as informações necessárias para renderizar uma mensagem
 */
interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'audio' | 'file' | 'emoji';
  replyTo?: string; // ID da mensagem sendo respondida
  reactions: { userId: string; emoji: string }[]; // Reações dos usuários
  isDeleted?: boolean; // Marca mensagens apagadas
  deletedAt?: Date; // Timestamp de quando foi deletada
}

/**
 * Interface para definir um chat (individual ou grupo)
 * Contém informações do chat e lista de mensagens
 */
interface Chat {
  id: string;
  name: string;
  type: 'individual' | 'group';
  participants: string[]; // IDs dos usuários participantes
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // Para controlar se o chat ainda está ativo
}

/**
 * Estados possíveis da interface do chat interno
 * Controla qual tela está sendo exibida
 */
type ChatState = 'inicio' | 'novo-chat' | 'novo-grupo' | 'conversa';

/**
 * Componente principal do Chat Interno
 * Gerencia toda a interface e funcionalidades do sistema de chat
 * Utiliza cores dinâmicas da gestão de marca
 * Totalmente responsivo para todos os tamanhos de tela
 */
const ChatInterno = () => {
  // Estados principais da aplicação
  const [currentState, setCurrentState] = useState<ChatState>('inicio');
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Hook para acessar dados dos usuários do sistema
  const { users, getActiveUsers } = useUsers();
  
  // Referências para elementos DOM
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  /**
   * Efeito para rolar automaticamente para o final das mensagens
   * Executado sempre que novas mensagens são recebidas
   */
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatId, chats]);

  /**
   * Efeito para configurar atalhos de teclado
   * Enter: Enviar mensagem
   * Esc: Voltar para início/fechar chat
   */
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && currentState === 'conversa') {
        event.preventDefault();
        handleSendMessage();
      } else if (event.key === 'Escape') {
        if (currentState === 'conversa') {
          setCurrentState('inicio');
          setSelectedChatId('');
        } else if (currentState === 'novo-chat' || currentState === 'novo-grupo') {
          setCurrentState('inicio');
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentState, currentMessage]);

  /**
   * Função para iniciar um novo chat individual
   * Verifica se já existe chat com o usuário selecionado
   */
  const handleStartIndividualChat = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Verificar se já existe chat com este usuário
    const existingChat = chats.find(chat => 
      chat.type === 'individual' && 
      chat.participants.includes(userId) && 
      chat.isActive
    );

    if (existingChat) {
      // Se já existe, abrir o chat existente
      setSelectedChatId(existingChat.id);
      setCurrentState('conversa');
    } else {
      // Criar novo chat
      const newChat: Chat = {
        id: Date.now().toString(),
        name: user.nome,
        type: 'individual',
        participants: [userId, 'current-user'], // Assumindo usuário atual
        messages: [],
        unreadCount: 0,
        avatar: user.avatar,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };

      setChats(prev => [...prev, newChat]);
      setSelectedChatId(newChat.id);
      setCurrentState('conversa');
    }
  };

  /**
   * Função para criar um novo grupo
   * Permite nomear o grupo e selecionar participantes
   */
  const handleCreateGroup = (groupName: string, participantIds: string[]) => {
    const newGroup: Chat = {
      id: Date.now().toString(),
      name: groupName,
      type: 'group',
      participants: [...participantIds, 'current-user'], // Incluir usuário atual
      messages: [],
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    setChats(prev => [...prev, newGroup]);
    setSelectedChatId(newGroup.id);
    setCurrentState('conversa');
  };

  /**
   * Função para enviar uma nova mensagem
   * Suporta texto, resposta a mensagens e diferentes tipos de conteúdo
   */
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'current-user', // ID do usuário atual
      senderName: 'Você', // Nome do usuário atual
      content: currentMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      replyTo: replyingTo?.id,
      reactions: []
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: newMessage,
          updatedAt: new Date()
        };
      }
      return chat;
    }));

    setCurrentMessage('');
    setReplyingTo(null);
  };

  /**
   * Função para reagir a uma mensagem com emoji
   * Permite adicionar/remover reações de mensagens
   */
  const handleReactToMessage = (messageId: string, emoji: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId) {
              const existingReaction = msg.reactions.find(r => 
                r.userId === 'current-user' && r.emoji === emoji
              );

              if (existingReaction) {
                // Remover reação se já existe
                return {
                  ...msg,
                  reactions: msg.reactions.filter(r => 
                    !(r.userId === 'current-user' && r.emoji === emoji)
                  )
                };
              } else {
                // Adicionar nova reação
                return {
                  ...msg,
                  reactions: [...msg.reactions, { userId: 'current-user', emoji }]
                };
              }
            }
            return msg;
          })
        };
      }
      return chat;
    }));
  };

  /**
   * Função para deletar uma mensagem
   * Permite deletar mensagens dentro do prazo de 1 hora
   */
  const handleDeleteMessage = (messageId: string) => {
    const now = new Date();
    
    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId) {
              const timeDiff = now.getTime() - msg.timestamp.getTime();
              const oneHour = 60 * 60 * 1000; // 1 hora em millisegundos

              if (timeDiff <= oneHour && msg.senderId === 'current-user') {
                return {
                  ...msg,
                  isDeleted: true,
                  deletedAt: now,
                  content: 'Esta mensagem foi deletada'
                };
              }
            }
            return msg;
          })
        };
      }
      return chat;
    }));
  };

  /**
   * Função para filtrar chats baseado na pesquisa
   * Busca por nome do chat ou última mensagem
   */
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return chat.isActive;
    
    const nameMatch = chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    const messageMatch = chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    return chat.isActive && (nameMatch || messageMatch);
  });

  /**
   * Função para obter o chat atualmente selecionado
   */
  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  // Renderização condicional baseada no estado atual
  return (
    <div className="h-full bg-background flex">
      {/* 
        Renderização condicional dos componentes baseada no estado atual
        Cada estado representa uma tela diferente da aplicação
      */}
      {currentState === 'inicio' && (
        <ChatInicio
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredChats={filteredChats}
          onSelectChat={(chatId) => {
            setSelectedChatId(chatId);
            setCurrentState('conversa');
          }}
          onNewChat={() => setCurrentState('novo-chat')}
          onNewGroup={() => setCurrentState('novo-grupo')}
        />
      )}

      {currentState === 'novo-chat' && (
        <NovoChat
          onBack={() => setCurrentState('inicio')}
          onSelectUser={handleStartIndividualChat}
          existingChats={chats}
        />
      )}

      {currentState === 'novo-grupo' && (
        <NovoGrupo
          onBack={() => setCurrentState('inicio')}
          onCreate={handleCreateGroup}
        />
      )}

      {currentState === 'conversa' && selectedChat && (
        <ChatConversa
          chat={selectedChat}
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          onBack={() => setCurrentState('inicio')}
          onSendMessage={handleSendMessage}
          onReactToMessage={handleReactToMessage}
          onDeleteMessage={handleDeleteMessage}
          messagesEndRef={messagesEndRef}
          messageInputRef={messageInputRef}
        />
      )}
    </div>
  );
};

export default ChatInterno;
