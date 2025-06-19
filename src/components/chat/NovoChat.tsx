
import React, { useState } from 'react';
import { ArrowLeft, Search, MessageCircle, X, Users, Building2, Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/useUsers";
import { useSectors } from "@/hooks/useSectors";

/**
 * Interface para as props do componente NovoChat
 */
interface NovoChatProps {
  onBack: () => void;
  onSelectUser: (userId: string) => void;
  existingChats: any[];
}

/**
 * Componente para seleção de usuário para novo chat individual
 * Lista todos os usuários ativos do sistema excluindo aqueles que já possuem chat
 * Interface melhorada com indicadores visuais claros e busca avançada
 * Totalmente responsivo
 */
export const NovoChat: React.FC<NovoChatProps> = ({
  onBack,
  onSelectUser,
  existingChats
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getActiveUsers } = useUsers();
  const { getSectorById } = useSectors();

  /**
   * Obtém lista de usuários ativos que ainda não possuem chat individual
   */
  const getAvailableUsers = () => {
    const activeUsers = getActiveUsers();
    
    // Filtrar usuários que já possuem chat individual ativo
    return activeUsers.filter(user => {
      const hasExistingChat = existingChats.some(chat => 
        chat.type === 'individual' && 
        chat.participants.includes(user.id) && 
        chat.isActive
      );
      return !hasExistingChat;
    });
  };

  /**
   * Filtra usuários com busca avançada
   * Busca por nome, email, cargo e setores
   */
  const filteredUsers = getAvailableUsers().filter(user => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    const nameMatch = user.nome.toLowerCase().includes(searchTerm);
    const emailMatch = user.email.toLowerCase().includes(searchTerm);
    const cargoMatch = user.cargo?.toLowerCase().includes(searchTerm) || false;
    
    // Busca também nos setores do usuário
    const sectorMatch = user.setores.some(setorId => {
      const sector = getSectorById(setorId);
      return sector?.nome.toLowerCase().includes(searchTerm);
    });
    
    return nameMatch || emailMatch || cargoMatch || sectorMatch;
  });

  // Contar chats existentes para estatísticas
  const totalUsers = getActiveUsers().length;
  const availableUsers = getAvailableUsers().length;
  const existingChatsCount = existingChats.filter(chat => 
    chat.type === 'individual' && chat.isActive
  ).length;

  return (
    <div className="w-full bg-card flex flex-col h-full">
      {/* 
        Cabeçalho aprimorado com estatísticas
      */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">Nova Conversa</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {availableUsers} de {totalUsers} usuários disponíveis • {existingChatsCount} chats ativos
            </p>
          </div>
        </div>
        
        {/* Barra de pesquisa aprimorada */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, cargo ou setor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Indicador de busca ativa */}
        {searchQuery && (
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="w-3 h-3" />
            <span>
              {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} para "{searchQuery}"
            </span>
          </div>
        )}
      </div>

      {/* 
        Lista de usuários com design melhorado
      */}
      <ScrollArea className="flex-1">
        {filteredUsers.length > 0 ? (
          <div className="p-2 space-y-1">
            {filteredUsers.map((user) => {
              // Obter todos os setores do usuário
              const userSectors = user.setores.map(setorId => getSectorById(setorId)).filter(Boolean);

              return (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent hover:shadow-sm group border border-transparent hover:border-border/50"
                >
                  {/* Avatar melhorado */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-14 w-14 ring-2 ring-background group-hover:ring-primary/20 transition-all">
                      <AvatarFallback className="bg-primary text-primary-foreground text-base font-medium">
                        {user.avatar || user.nome.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Indicador de status */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>

                  {/* Informações do usuário expandidas */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Nome e cargo */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground truncate group-hover:text-accent-foreground text-base">
                        {user.nome}
                      </h3>
                      {user.cargo && (
                        <Badge variant="outline" className="text-xs px-2 py-1 border-border">
                          {user.cargo}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    {/* Telefone */}
                    {user.telefone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{user.telefone}</span>
                      </div>
                    )}
                    
                    {/* Setores */}
                    {userSectors.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        {userSectors.slice(0, 2).map((sector) => (
                          <Badge 
                            key={sector.id}
                            className={`text-xs px-2 py-1 ${sector.cor}`}
                          >
                            {sector.nome}
                          </Badge>
                        ))}
                        {userSectors.length > 2 && (
                          <Badge 
                            variant="outline" 
                            className="text-xs px-2 py-1 border-border"
                          >
                            +{userSectors.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ícone de ação */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Estado vazio melhorado */
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <div className="mb-6">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchQuery ? (
                    <Search className="w-10 h-10 text-muted-foreground/50" />
                  ) : (
                    <Users className="w-10 h-10 text-muted-foreground/50" />
                  )}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {searchQuery ? 'Nenhum usuário encontrado' : 'Todos os usuários já possuem chat'}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {searchQuery 
                  ? `Não encontramos usuários que correspondam à busca "${searchQuery}". Tente usar outros termos.`
                  : `Você já iniciou conversas com todos os ${totalUsers} usuários disponíveis no sistema.`
                }
              </p>
              
              <div className="flex flex-col gap-3">
                {searchQuery ? (
                  <Button 
                    onClick={() => setSearchQuery('')}
                    variant="outline"
                    className="border-border hover:bg-accent"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpar Busca
                  </Button>
                ) : (
                  <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4" />
                      <span className="font-medium">Dica</span>
                    </div>
                    <p>
                      Para criar novos chats, primeiro adicione mais usuários na seção 
                      <span className="font-medium text-foreground"> Gestão de Usuários</span>.
                    </p>
                  </div>
                )}
                
                <Button 
                  onClick={onBack}
                  variant="ghost"
                  className="border-border hover:bg-accent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para Conversas
                </Button>
              </div>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
