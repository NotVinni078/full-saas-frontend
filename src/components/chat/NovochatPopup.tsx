
import React, { useState } from 'react';
import { Search, X, Users, Building2, Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUsers } from "@/hooks/useUsers";
import { useSectors } from "@/hooks/useSectors";

/**
 * Interface para as props do componente NovoChatsPopup
 */
interface NovoChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (userId: string) => void;
  existingChats: any[];
}

/**
 * Componente de popup flutuante para seleção de usuário para novo chat
 * Substitui a tela full-screen por uma experiência mais intuitiva
 */
export const NovoChatPopup: React.FC<NovoChatPopupProps> = ({
  isOpen,
  onClose,
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
   */
  const filteredUsers = getAvailableUsers().filter(user => {
    if (!searchQuery) return true;
    
    const searchTerm = searchQuery.toLowerCase();
    const nameMatch = user.nome.toLowerCase().includes(searchTerm);
    const emailMatch = user.email.toLowerCase().includes(searchTerm);
    const cargoMatch = user.cargo?.toLowerCase().includes(searchTerm) || false;
    
    const sectorMatch = user.setores.some(setorId => {
      const sector = getSectorById(setorId);
      return sector?.nome.toLowerCase().includes(searchTerm);
    });
    
    return nameMatch || emailMatch || cargoMatch || sectorMatch;
  });

  const handleUserSelect = (userId: string) => {
    onSelectUser(userId);
    onClose();
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
  };

  const availableUsers = getAvailableUsers();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold">Nova Conversa</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Selecione um usuário para iniciar uma nova conversa
          </p>
        </DialogHeader>

        {/* Barra de pesquisa */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email, cargo ou setor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Indicador de busca ativa */}
          {searchQuery && (
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Lista de usuários */}
        <ScrollArea className="flex-1 px-6 max-h-96">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2 pb-6">
              {filteredUsers.map((user) => {
                const userSectors = user.setores.map(setorId => getSectorById(setorId)).filter(Boolean);

                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className="flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent group border border-transparent hover:border-border"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {user.avatar || user.nome.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>

                    {/* Informações do usuário */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground truncate">
                          {user.nome}
                        </h3>
                        {user.cargo && (
                          <Badge variant="outline" className="text-xs">
                            {user.cargo}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>

                      {user.telefone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{user.telefone}</span>
                        </div>
                      )}
                      
                      {userSectors.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap">
                          <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          {userSectors.slice(0, 2).map((sector) => (
                            <Badge 
                              key={sector.id}
                              className={`text-xs ${sector.cor}`}
                            >
                              {sector.nome}
                            </Badge>
                          ))}
                          {userSectors.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{userSectors.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Ícone de ação */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Estado vazio */
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                {searchQuery ? (
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                ) : (
                  <Users className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              
              <h3 className="text-lg font-medium text-foreground mb-2">
                {searchQuery ? 'Nenhum usuário encontrado' : 'Todos os usuários já possuem chat'}
              </h3>
              
              <p className="text-muted-foreground text-sm max-w-sm">
                {searchQuery 
                  ? `Não encontramos usuários que correspondam à busca "${searchQuery}".`
                  : `Você já iniciou conversas com todos os ${availableUsers.length} usuários disponíveis.`
                }
              </p>
              
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Limpar Busca
                </Button>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
