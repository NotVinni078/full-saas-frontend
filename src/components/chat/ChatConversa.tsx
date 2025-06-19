
import React, { useState } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical, Reply, Trash2, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/**
 * Interface para as props do componente ChatConversa
 * Define todos os parâmetros necessários para renderizar uma conversa ativa
 */
interface ChatConversaProps {
  chat: any;
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  replyingTo: any;
  setReplyingTo: (message: any) => void;
  onBack: () => void;
  onSendMessage: () => void;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onDeleteMessage: (messageId: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  messageInputRef: React.RefObject<HTMLInputElement>;
}

/**
 * Componente da conversa ativa do chat
 * Renderiza mensagens, permite envio, reações e respostas
 * Utiliza cores dinâmicas da gestão de marca
 * Totalmente responsivo
 */
export const ChatConversa: React.FC<ChatConversaProps> = ({
  chat,
  currentMessage,
  setCurrentMessage,
  replyingTo,
  setReplyingTo,
  onBack,
  onSendMessage,
  onReactToMessage,
  onDeleteMessage,
  messagesEndRef,
  messageInputRef
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  /**
   * Lista de emojis disponíveis para reações
   */
  const availableEmojis = ['❤️', '👍', '👎', '😂', '😢', '😮', '😡', '👏'];

  /**
   * Função para formatar horário das mensagens
   */
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  /**
   * Verificar se a mensagem pode ser deletada (dentro de 1 hora)
   */
  const canDeleteMessage = (message: any) => {
    const now = new Date();
    const timeDiff = now.getTime() - message.timestamp.getTime();
    const oneHour = 60 * 60 * 1000;
    
    return message.senderId === 'current-user' && timeDiff <= oneHour && !message.isDeleted;
  };

  /**
   * Função para encontrar a mensagem sendo respondida
   */
  const findReplyMessage = (replyToId: string) => {
    return chat.messages.find((msg: any) => msg.id === replyToId);
  };

  return (
    <div className="w-full bg-background flex flex-col">
      {/* 
        Cabeçalho da conversa
        Exibe informações do chat/grupo e botões de ação
      */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Botão voltar */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-foreground hover:bg-accent"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            {/* Avatar e informações do chat */}
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {chat.type === 'group' ? (
                  <Users className="w-5 h-5" />
                ) : (
                  chat.avatar || chat.name.slice(0, 2).toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium text-foreground">{chat.name}</h3>
              <p className="text-sm text-muted-foreground">
                {chat.type === 'group' 
                  ? `${chat.participants.length} participantes`
                  : 'Online'
                }
              </p>
            </div>
          </div>
          
          {/* Menu de opções */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-foreground hover:bg-accent"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 
        Área de mensagens
        Scrollável com todas as mensagens da conversa
      */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chat.messages.map((message: any) => {
            const isOwn = message.senderId === 'current-user';
            const replyMessage = message.replyTo ? findReplyMessage(message.replyTo) : null;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'order-2' : ''}`}>
                  {/* Nome do remetente (apenas em grupos e para mensagens de outros) */}
                  {!isOwn && chat.type === 'group' && (
                    <p className="text-xs text-muted-foreground mb-1 ml-1">
                      {message.senderName}
                    </p>
                  )}
                  
                  {/* Mensagem sendo respondida */}
                  {replyMessage && (
                    <div className={`mb-2 p-2 border-l-4 rounded ${
                      isOwn 
                        ? 'bg-primary/10 border-l-primary/50' 
                        : 'bg-muted border-l-muted-foreground'
                    }`}>
                      <p className="text-xs text-muted-foreground font-medium">
                        Respondendo a {replyMessage.senderName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {replyMessage.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Conteúdo da mensagem */}
                  <div
                    className={`relative group px-3 py-2 rounded-lg ${
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    
                    {/* Horário e status da mensagem */}
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs ${
                        isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                      
                      {/* Menu de ações da mensagem */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        {/* Botão de resposta */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(message)}
                          className="h-6 w-6 p-0 hover:bg-accent"
                        >
                          <Reply className="w-3 h-3" />
                        </Button>
                        
                        {/* Botão de reação */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-accent"
                            >
                              <Heart className="w-3 h-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2">
                            <div className="flex gap-1">
                              {availableEmojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => onReactToMessage(message.id, emoji)}
                                  className="text-lg hover:bg-accent rounded p-1 transition-colors"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        {/* Botão de deletar (apenas para mensagens próprias dentro de 1h) */}
                        {canDeleteMessage(message) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteMessage(message.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20 text-destructive"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Reações à mensagem */}
                  {message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {message.reactions.reduce((acc: any[], reaction: any) => {
                        const existing = acc.find(r => r.emoji === reaction.emoji);
                        if (existing) {
                          existing.count++;
                        } else {
                          acc.push({ emoji: reaction.emoji, count: 1 });
                        }
                        return acc;
                      }, []).map(({ emoji, count }) => (
                        <Badge
                          key={emoji}
                          variant="outline"
                          className="text-xs px-1 py-0 h-5 cursor-pointer hover:bg-accent"
                          onClick={() => onReactToMessage(message.id, emoji)}
                        >
                          {emoji} {count}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* 
        Área de entrada de mensagem
        Contém campo de texto, botões de ação e indicador de resposta
      */}
      <div className="p-4 border-t border-border bg-card">
        {/* Indicador de resposta */}
        {replyingTo && (
          <div className="mb-3 p-2 bg-accent rounded-lg flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground font-medium">
                Respondendo a {replyingTo.senderName}
              </p>
              <p className="text-sm text-foreground truncate">
                {replyingTo.content}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(null)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* Campo de entrada e botões */}
        <div className="flex items-center gap-2">
          {/* Botão de anexo */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          
          {/* Campo de texto */}
          <div className="flex-1">
            <Input
              ref={messageInputRef}
              placeholder="Digite sua mensagem..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              className="resize-none bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          
          {/* Botão de emoji */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <Smile className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-4 gap-1">
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setCurrentMessage(prev => prev + emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-lg hover:bg-accent rounded p-2 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Botão de enviar */}
          <Button 
            onClick={onSendMessage}
            disabled={!currentMessage.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
