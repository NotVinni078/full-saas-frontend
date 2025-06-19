
import React from 'react';
import { Search, MessageCircle, Users, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

/**
 * Interface para as props do componente ChatInicio
 * Define todos os parâmetros necessários para renderizar a tela inicial
 */
interface ChatInicioProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredChats: any[];
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

/**
 * Componente da tela inicial do Chat Interno
 * Exibe lista de chats existentes, barra de pesquisa e botões para novos chats
 * Utiliza cores dinâmicas da gestão de marca
 * Responsivo para desktop, tablet e mobile
 */
export const ChatInicio: React.FC<ChatInicioProps> = ({
  searchQuery,
  setSearchQuery,
  filteredChats,
  onSelectChat,
  onNewChat,
  onNewGroup
}) => {
  /**
   * Função para formatar o horário da última mensagem
   * Exibe hora se for hoje, senão exibe a data
   */
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  return (
    <div className="w-full bg-card border-r border-border flex flex-col">
      {/* 
        Cabeçalho da tela inicial
        Contém título, barra de pesquisa e botões de ação
      */}
      <div className="p-4 border-b border-border bg-card">
        {/* Título da página */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-foreground">Chat Interno</h1>
          
          {/* Botões para criar novos chats - Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewChat}
              className="bg-background hover:bg-accent text-foreground border-border"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Novo Chat
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onNewGroup}
              className="bg-background hover:bg-accent text-foreground border-border"
            >
              <Users className="w-4 h-4 mr-2" />
              Novo Grupo
            </Button>
          </div>
        </div>
        
        {/* Barra de pesquisa responsiva */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Botões para mobile/tablet - Responsivos */}
        <div className="flex md:hidden gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewChat}
            className="flex-1 bg-background hover:bg-accent text-foreground border-border"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Novo Chat
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNewGroup}
            className="flex-1 bg-background hover:bg-accent text-foreground border-border"
          >
            <Users className="w-4 h-4 mr-2" />
            Novo Grupo
          </Button>
        </div>
      </div>

      {/* 
        Lista de conversas existentes
        Scrollável com todos os chats filtrados
      */}
      <ScrollArea className="flex-1">
        {filteredChats.length > 0 ? (
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent group"
              >
                {/* Avatar do chat (usuário ou grupo) */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {chat.type === 'group' ? (
                        <Users className="w-6 h-6" />
                      ) : (
                        chat.avatar || chat.name.slice(0, 2).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Indicador de mensagens não lidas */}
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs font-medium">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </div>
                  )}
                </div>

                {/* Informações do chat */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground truncate group-hover:text-accent-foreground">
                        {chat.name}
                      </h3>
                      {/* Badge para indicar tipo de chat */}
                      {chat.type === 'group' && (
                        <Badge variant="secondary" className="text-xs">
                          {chat.participants.length} membros
                        </Badge>
                      )}
                    </div>
                    
                    {/* Horário da última mensagem */}
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatMessageTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  {/* Prévia da última mensagem */}
                  {chat.lastMessage ? (
                    <p className="text-sm text-muted-foreground truncate">
                      {chat.lastMessage.isDeleted 
                        ? '🗑️ Mensagem deletada'
                        : `${chat.lastMessage.senderName}: ${chat.lastMessage.content}`
                      }
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Nenhuma mensagem ainda
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado vazio quando não há chats */
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <div className="mb-4">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Nenhum chat encontrado' : 'Nenhuma conversa ainda'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Tente buscar por outro termo'
                  : 'Comece uma nova conversa clicando em "Novo Chat" ou "Novo Grupo"'
                }
              </p>
              {!searchQuery && (
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button 
                    onClick={onNewChat}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Novo Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onNewGroup}
                    className="border-border hover:bg-accent"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Novo Grupo
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
