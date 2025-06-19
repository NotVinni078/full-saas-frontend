
import React, { useState } from 'react';
import { ArrowLeft, Search, MessageCircle, X } from 'lucide-react';
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
 * Utiliza cores dinâmicas da gestão de marca
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
   * Filtra usuários baseado na busca
   */
  const filteredUsers = getAvailableUsers().filter(user => {
    if (!searchQuery) return true;
    
    const nameMatch = user.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const cargoMatch = user.cargo?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    return nameMatch || emailMatch || cargoMatch;
  });

  return (
    <div className="w-full bg-card flex flex-col">
      {/* 
        Cabeçalho com botão voltar e título
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
          <h2 className="text-xl font-semibold text-foreground">Novo Chat</h2>
        </div>
        
        {/* Barra de pesquisa de usuários */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* 
        Lista de usuários disponíveis para chat
      */}
      <ScrollArea className="flex-1">
        {filteredUsers.length > 0 ? (
          <div className="p-2 space-y-1">
            {filteredUsers.map((user) => {
              // Obter primeiro setor do usuário para exibição
              const userSector = user.setores.length > 0 
                ? getSectorById(user.setores[0]) 
                : null;

              return (
                <div
                  key={user.id}
                  onClick={() => onSelectUser(user.id)}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent group"
                >
                  {/* Avatar do usuário */}
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.avatar || user.nome.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Informações do usuário */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground truncate group-hover:text-accent-foreground">
                        {user.nome}
                      </h3>
                      
                      {/* Badge do setor do usuário */}
                      {userSector && (
                        <Badge 
                          className={`text-xs px-2 py-1 ${userSector.cor}`}
                        >
                          {userSector.nome}
                        </Badge>
                      )}
                      
                      {/* Badge para múltiplos setores */}
                      {user.setores.length > 1 && (
                        <Badge 
                          variant="outline" 
                          className="text-xs px-2 py-1 border-border"
                        >
                          +{user.setores.length - 1} setores
                        </Badge>
                      )}
                    </div>
                    
                    {/* Informações adicionais do usuário */}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                      {user.cargo && (
                        <p className="text-xs text-muted-foreground">
                          {user.cargo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ícone indicativo de ação */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Estado vazio quando não há usuários disponíveis */
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div className="max-w-md">
              <div className="mb-4">
                <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Nenhum usuário encontrado' : 'Todos os usuários já possuem chat'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? 'Tente buscar por outro termo'
                  : 'Você já iniciou conversas com todos os usuários disponíveis'
                }
              </p>
              <Button 
                onClick={onBack}
                variant="outline"
                className="border-border hover:bg-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
