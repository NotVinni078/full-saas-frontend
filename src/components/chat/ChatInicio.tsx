
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
 * Layout similar ao painel lateral do WhatsApp Desktop
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
    <div className="w-full h-full flex flex-col bg-card">
      {/* 
        Cabeçalho estilo WhatsApp
        Contém título e botões de ação
      */}
      <div className="p-4 bg-card border-b border-border">
        {/* Cabeçalho principal */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-foreground">Conversas</h1>
          
          {/* Botões de ação - estilo WhatsApp */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNewGroup}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <Users className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNewChat}
              className="h-8 w-8 p-0 hover:bg-accent"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Barra de pesquisa estilo WhatsApp */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ou começar uma nova conversa"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-muted/50 border-0 focus:bg-background focus:ring-1 focus:ring-primary/20 rounded-lg"
          />
        </div>
      </div>

      {/* 
        Lista de conversas - estilo WhatsApp
        Scrollável com todas as conversas
      */}
      <ScrollArea className="flex-1">
        {filteredChats.length > 0 ? (
          <div className="py-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-0"
              >
                {/* Avatar do chat */}
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {chat.type === 'group' ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        chat.avatar || chat.name.slice(0, 2).toUpperCase()
                      )}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Indicador de mensagens não lidas */}
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-xs font-medium">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </div>
                  )}
                </div>

                {/* Informações do chat */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {chat.name}
                    </h3>
                    
                    {/* Horário da última mensagem */}
                    {chat.lastMessage && (
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatMessageTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  {/* Preview da última mensagem */}
                  <div className="flex items-center justify-between">
                    {chat.lastMessage ? (
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage.isDeleted 
                          ? 'Esta mensagem foi deletada'
                          : chat.lastMessage.content
                        }
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Toque para enviar uma mensagem
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Estado vazio */
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-sm">
              <div className="mb-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Tente buscar por outro termo'
                  : 'Inicie uma nova conversa para começar'
                }
              </p>
              {!searchQuery && (
                <div className="flex flex-col gap-2">
                  <Button 
                    onClick={onNewChat}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Nova Conversa
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onNewGroup}
                    size="sm"
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
