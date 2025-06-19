
import React, { useState } from 'react';
import { ArrowLeft, Search, Users, Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUsers } from "@/hooks/useUsers";
import { useSectors } from "@/hooks/useSectors";

/**
 * Interface para as props do componente NovoGrupo
 */
interface NovoGrupoProps {
  onBack: () => void;
  onCreate: (groupName: string, participantIds: string[]) => void;
}

/**
 * Componente para criação de novos grupos de chat
 * Permite nomear o grupo e selecionar múltiplos participantes
 * Utiliza cores dinâmicas da gestão de marca
 * Totalmente responsivo
 */
export const NovoGrupo: React.FC<NovoGrupoProps> = ({
  onBack,
  onCreate
}) => {
  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [step, setStep] = useState<'name' | 'users'>('name');
  
  const { getActiveUsers } = useUsers();
  const { getSectorById } = useSectors();

  /**
   * Filtrar usuários baseado na busca
   */
  const filteredUsers = getActiveUsers().filter(user => {
    if (!searchQuery) return true;
    
    const nameMatch = user.nome.toLowerCase().includes(searchQuery.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const cargoMatch = user.cargo?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    
    return nameMatch || emailMatch || cargoMatch;
  });

  /**
   * Alternar seleção de usuário
   */
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  /**
   * Criar o grupo com nome e participantes selecionados
   */
  const handleCreateGroup = () => {
    if (groupName.trim() && selectedUsers.length > 0) {
      onCreate(groupName.trim(), selectedUsers);
    }
  };

  /**
   * Obter usuários selecionados para exibição
   */
  const getSelectedUsersData = () => {
    return getActiveUsers().filter(user => selectedUsers.includes(user.id));
  };

  // Renderização do primeiro passo: definir nome do grupo
  if (step === 'name') {
    return (
      <div className="w-full bg-card flex flex-col">
        {/* Cabeçalho */}
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
            <h2 className="text-xl font-semibold text-foreground">Novo Grupo</h2>
          </div>
        </div>

        {/* Formulário para nome do grupo */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center mb-8">
              <div className="mb-4">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Criar Novo Grupo
              </h3>
              <p className="text-muted-foreground">
                Digite um nome para o seu grupo
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Nome do grupo"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="text-center bg-background border-border text-foreground placeholder:text-muted-foreground"
                maxLength={50}
                autoFocus
              />
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {groupName.length}/50 caracteres
                </p>
              </div>

              <Button 
                onClick={() => setStep('users')}
                disabled={!groupName.trim()}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Próximo: Adicionar Participantes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderização do segundo passo: selecionar participantes
  return (
    <div className="w-full bg-card flex flex-col">
      {/* Cabeçalho com informações do grupo */}
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStep('name')}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">{groupName}</h2>
            <p className="text-sm text-muted-foreground">
              {selectedUsers.length} participante{selectedUsers.length !== 1 ? 's' : ''} selecionado{selectedUsers.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button 
            onClick={handleCreateGroup}
            disabled={selectedUsers.length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Criar
          </Button>
        </div>
        
        {/* Barra de pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Lista de usuários selecionados */}
        {selectedUsers.length > 0 && (
          <div className="mt-3">
            <ScrollArea className="max-h-24">
              <div className="flex flex-wrap gap-2">
                {getSelectedUsersData().map((user) => (
                  <Badge 
                    key={user.id}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1"
                  >
                    {user.nome}
                    <button
                      onClick={() => toggleUserSelection(user.id)}
                      className="ml-1 hover:bg-accent rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Lista de usuários disponíveis */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.includes(user.id);
            const userSector = user.setores.length > 0 
              ? getSectorById(user.setores[0]) 
              : null;

            return (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-accent'
                } group`}
              >
                {/* Checkbox visual */}
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-border group-hover:border-primary/50'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                </div>

                {/* Avatar do usuário */}
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.avatar || user.nome.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Informações do usuário */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium truncate ${
                      isSelected ? 'text-primary' : 'text-foreground'
                    }`}>
                      {user.nome}
                    </h3>
                    
                    {/* Badge do setor */}
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
                        +{user.setores.length - 1}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Informações adicionais */}
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
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
