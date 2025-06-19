
import React, { useState } from 'react';
import { ArrowLeft, Send, Smile, Paperclip, MoreVertical, Reply, Trash2, Heart, Users, X, Phone, Video, Search } from 'lucide-react';
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
 * Layout similar ao WhatsApp Desktop
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
    <div className="w-full h-full bg-background flex flex-col">
      {/* 
        Cabeçalho da conversa - estilo WhatsApp
        Exibe informações do chat/grupo e botões de ação
      */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Botão voltar - mobile */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="md:hidden text-foreground hover:bg-accent h-8 w-8 p-0"
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
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
              <p className="text-sm text-muted-foreground">
                {chat.type === 'group' 
                  ? `${chat.participants.length} participantes`
                  : 'online'
                }
              </p>
            </div>
          </div>
          
          {/* Botões de ação - estilo WhatsApp */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Video className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-foreground hover:bg-accent h-8 w-8 p-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 
        Área de mensagens - estilo WhatsApp
        Background com padrão sutil e mensagens alinhadas
      */}
      <div 
        className="flex-1 overflow-hidden bg-gradient-to-b from-muted/20 to-muted/10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.03'%3E%3Cpolygon points='0,20 20,20 20,0'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        <ScrollArea className="h-full p-4">
          <div className="space-y-4 max-w-4xl mx-auto">
            {chat.messages.map((message: any) => {
              const isOwn = message.senderId === 'current-user';
              const replyMessage = message.replyTo ? findReplyMessage(message.replyTo) : null;
              
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md lg:max-w-lg xl:max-w-xl ${isOwn ? 'order-2' : ''}`}>
                    {/* Nome do remetente (apenas em grupos e para mensagens de outros) */}
                    {!isOwn && chat.type === 'group' && (
                      <p className="text-xs text-muted-foreground mb-1 ml-1">
                        {message.senderName}
                      </p>
                    )}
                    
                    {/* Mensagem sendo respondida */}
                    {replyMessage && (
                      <div className={`mb-2 p-2 border-l-4 rounded-r ${
                        isOwn 
                          ? 'bg-primary/10 border-l-primary/50' 
                          : 'bg-muted/50 border-l-muted-foreground'
                      }`}>
                        <p className="text-xs text-muted-foreground font-medium">
                          {replyMessage.senderName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {replyMessage.content}
                        </p>
                      </div>
                    )}
                    
                    {/* Conteúdo da mensagem - estilo WhatsApp */}
                    <div
                      className={`relative group px-3 py-2 rounded-lg shadow-sm ${
                        isOwn
                          ? 'bg-primary text-primary-foreground ml-12'
                          : 'bg-card text-foreground mr-12'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      
                      {/* Horário e status da mensagem */}
                      <div className="flex items-center justify-end mt-1 gap-1">
                        <p className={`text-xs ${
                          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                        
                        {/* Status de entrega (apenas para mensagens próprias) */}
                        {isOwn && (
                          <div className="flex">
                            <svg className={`w-4 h-4 ${
                              isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
                            }`} fill="currentColor" viewBox="0 0 16 16">
                              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Menu de ações da mensagem */}
                      <div className="absolute -top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-lg shadow-lg flex gap-1 p-1">
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
                        
                        {/* Botão de deletar */}
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
                            className="text-xs px-1 py-0 h-5 cursor-pointer hover:bg-accent bg-background/80"
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
      </div>

      {/* 
        Área de entrada de mensagem - estilo WhatsApp
        Campo de texto, botões de ação e indicador de resposta
      */}
      <div className="p-4 bg-card border-t border-border">
        {/* Indicador de resposta */}
        {replyingTo && (
          <div className="mb-3 p-3 bg-accent/50 rounded-lg flex items-center justify-between">
            <div className="flex-1 border-l-4 border-l-primary pl-3">
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
              className="h-6 w-6 p-0 ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {/* Campo de entrada e botões */}
        <div className="flex items-end gap-3">
          {/* Botão de anexo */}
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-foreground hover:bg-accent h-10 w-10 p-0 flex-shrink-0"
          >
            <Paperclip className="w-5 h-5" />
          </Button>
          
          {/* Campo de texto */}
          <div className="flex-1 bg-muted/50 rounded-lg border border-border focus-within:border-primary/50 transition-colors">
            <Input
              ref={messageInputRef}
              placeholder="Digite uma mensagem"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[40px] py-3"
            />
          </div>
          
          {/* Botão de emoji */}
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-muted-foreground hover:text-foreground hover:bg-accent h-10 w-10 p-0 flex-shrink-0"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
              <div className="grid grid-cols-4 gap-1">
                {availableEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setCurrentMessage(currentMessage + emoji);
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-10 p-0 flex-shrink-0 rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
