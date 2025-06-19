
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical,
  Edit,
  MessageSquare,
  Calendar,
  Ban,
  Trash2,
  Phone,
  Mail,
  Users,
  EllipsisVertical
} from 'lucide-react';

/**
 * Tabela de contatos com layout responsivo
 * Inclui funcionalidades de seleção múltipla e ações em lote
 * Mantém design de cards para mobile/tablet e tabela para desktop
 * Cores dinâmicas do sistema de marca
 * Logos reais das redes sociais
 */

interface ContactsTableProps {
  contacts: any[];
  blockedContacts: any[];
  onEditContact: (contact: any) => void;
  onStartService: (contact: any) => void;
  onCreateSchedule: (contact: any) => void;
  onBlockContact: (contact: any) => void;
  onDeleteContact: (contactId: string) => void;
  getContactTags: (contact: any) => any[];
  onBulkStartService?: (contacts: any[]) => void;
  onBulkBlock?: (contacts: any[]) => void;
  onBulkDelete?: (contacts: any[]) => void;
  onBulkCreateSchedule?: (contacts: any[]) => void;
}

const ContactsTable = ({
  contacts,
  blockedContacts,
  onEditContact,
  onStartService,
  onCreateSchedule,
  onBlockContact,
  onDeleteContact,
  getContactTags,
  onBulkStartService,
  onBulkBlock,
  onBulkDelete,
  onBulkCreateSchedule
}: ContactsTableProps) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  /**
   * Gera iniciais do nome para avatar quando não há foto
   * @param {string} nome - Nome do contato
   */
  const getIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  /**
   * Retorna logo da rede social baseado no canal de origem do contato
   * Usa SVGs inline para garantir compatibilidade e design consistente
   * @param {string} canal - Canal de origem
   */
  const getLogoCanal = (canal: string) => {
    const logos = {
      whatsapp: (
        <div className="h-5 w-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-green-500">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.63"/>
          </svg>
        </div>
      ),
      instagram: (
        <div className="h-5 w-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <defs>
              <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#833ab4"/>
                <stop offset="50%" stopColor="#fd1d1d"/>
                <stop offset="100%" stopColor="#fcb045"/>
              </linearGradient>
            </defs>
            <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      ),
      facebook: (
        <div className="h-5 w-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-blue-600">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      ),
      telegram: (
        <div className="h-5 w-5 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-blue-500">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </div>
      )
    };
    
    return logos[canal as keyof typeof logos] || <Users className="h-4 w-4 text-muted-foreground" />;
  };

  /**
   * Retorna nome do canal formatado
   * @param {string} canal - Canal de origem
   */
  const getNomeCanal = (canal: string) => {
    const nomes = {
      whatsapp: 'WhatsApp',
      instagram: 'Instagram', 
      facebook: 'Facebook',
      telegram: 'Telegram'
    };
    
    return nomes[canal as keyof typeof nomes] || 'Desconhecido';
  };

  /**
   * Verifica se contato está bloqueado
   * @param {string} contactId - ID do contato
   */
  const isContactBlocked = (contactId: string) => {
    return blockedContacts.some(blocked => blocked.id === contactId);
  };

  /**
   * Manipula seleção individual de contatos
   * @param {string} contactId - ID do contato
   * @param {boolean} checked - Estado da seleção
   */
  const handleContactSelection = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContacts(prev => [...prev, contactId]);
    } else {
      setSelectedContacts(prev => prev.filter(id => id !== contactId));
    }
  };

  /**
   * Manipula seleção de todos os contatos visíveis
   * @param {boolean} checked - Estado da seleção
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allContactIds = contacts.map(contact => contact.id);
      setSelectedContacts(allContactIds);
    } else {
      setSelectedContacts([]);
    }
    setIsAllSelected(checked);
  };

  /**
   * Atualiza estado de "selecionar todos" baseado na seleção individual
   */
  useEffect(() => {
    const allSelected = contacts.length > 0 && selectedContacts.length === contacts.length;
    setIsAllSelected(allSelected);
  }, [selectedContacts, contacts]);

  /**
   * Obtém contatos selecionados completos
   */
  const getSelectedContactsData = () => {
    return contacts.filter(contact => selectedContacts.includes(contact.id));
  };

  /**
   * Manipula ações em lote
   * @param {string} action - Ação a ser executada
   */
  const handleBulkAction = (action: string) => {
    const selectedContactsData = getSelectedContactsData();
    
    switch (action) {
      case 'start-service':
        onBulkStartService?.(selectedContactsData);
        break;
      case 'block':
        onBulkBlock?.(selectedContactsData);
        break;
      case 'delete':
        onBulkDelete?.(selectedContactsData);
        break;
      case 'create-schedule':
        onBulkCreateSchedule?.(selectedContactsData);
        break;
    }
    
    // Limpa seleção após ação
    setSelectedContacts([]);
  };

  return (
    <div className="w-full">
      {/* Ações em lote - visível apenas quando há contatos selecionados */}
      {selectedContacts.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedContacts.length} contato(s) selecionado(s)
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-800">
                  <EllipsisVertical className="h-4 w-4" />
                  Ações em Lote
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                <DropdownMenuItem onClick={() => handleBulkAction('start-service')} className="text-foreground hover:bg-accent">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Iniciar Atendimento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('create-schedule')} className="text-foreground hover:bg-accent">
                  <Calendar className="h-4 w-4 mr-2" />
                  Criar Agendamento
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('block')} className="text-foreground hover:bg-accent">
                  <Ban className="h-4 w-4 mr-2" />
                  Bloquear/Desbloquear
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Selecionados
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}

      {/* Layout tabela para desktop */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground font-semibold w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos os contatos"
                />
              </TableHead>
              <TableHead className="text-foreground font-semibold">Contato</TableHead>
              <TableHead className="text-foreground font-semibold">Telefone</TableHead>
              <TableHead className="text-foreground font-semibold">Email</TableHead>
              <TableHead className="text-foreground font-semibold">Canal</TableHead>
              <TableHead className="text-foreground font-semibold">Tags</TableHead>
              <TableHead className="text-foreground font-semibold w-[50px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.map((contato) => {
              const tags = getContactTags(contato);
              const isBlocked = isContactBlocked(contato.id);
              const isSelected = selectedContacts.includes(contato.id);
              
              return (
                <TableRow 
                  key={contato.id} 
                  className={`border-border hover:bg-accent/50 transition-colors ${
                    isBlocked ? 'opacity-60' : ''
                  } ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  {/* Coluna Checkbox */}
                  <TableCell className="py-4">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleContactSelection(contato.id, checked as boolean)}
                      aria-label={`Selecionar ${contato.nome}`}
                    />
                  </TableCell>

                  {/* Coluna Contato - Avatar + Nome */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={contato.avatar} alt={contato.nome} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                          {getIniciais(contato.nome)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-foreground truncate max-w-[200px]">
                          {contato.nome}
                        </div>
                        {isBlocked && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Bloqueado
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Coluna Telefone */}
                  <TableCell className="py-4">
                    {contato.telefone ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span className="font-mono text-sm">{contato.telefone}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>

                  {/* Coluna Email */}
                  <TableCell className="py-4">
                    {contato.email ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm truncate max-w-[200px]">{contato.email}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>

                  {/* Coluna Canal - com logos reais */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      {getLogoCanal(contato.canal)}
                      <span className="text-sm text-muted-foreground">
                        {getNomeCanal(contato.canal)}
                      </span>
                    </div>
                  </TableCell>

                  {/* Coluna Tags */}
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {tags.length > 0 ? (
                        tags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} className={`text-xs px-2 py-1 ${tag.cor}`}>
                            {tag.nome}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Sem tags</span>
                      )}
                      {tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Coluna Ações */}
                  <TableCell className="py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                        {selectedContacts.length <= 1 && (
                          <DropdownMenuItem onClick={() => onEditContact(contato)} className="text-foreground hover:bg-accent">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onStartService(contato)} className="text-foreground hover:bg-accent">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Iniciar Atendimento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onCreateSchedule(contato)} className="text-foreground hover:bg-accent">
                          <Calendar className="h-4 w-4 mr-2" />
                          Criar Agendamento
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBlockContact(contato)} className="text-foreground hover:bg-accent">
                          <Ban className="h-4 w-4 mr-2" />
                          {isBlocked ? 'Desbloquear' : 'Bloquear'} Contato
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteContact(contato.id)} className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Layout cards para mobile/tablet */}
      <div className="lg:hidden space-y-4">
        {contacts.map((contato) => {
          const tags = getContactTags(contato);
          const isBlocked = isContactBlocked(contato.id);
          const isSelected = selectedContacts.includes(contato.id);
          
          return (
            <div 
              key={contato.id} 
              className={`flex flex-col gap-4 p-4 border border-border rounded-lg bg-background hover:bg-accent/50 transition-colors ${
                isBlocked ? 'opacity-60' : ''
              } ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}`}
            >
              {/* Header do card - Checkbox, Avatar e informações básicas */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleContactSelection(contato.id, checked as boolean)}
                  aria-label={`Selecionar ${contato.nome}`}
                />
                
                <Avatar className="h-10 w-10 flex-shrink-0">
                  <AvatarImage src={contato.avatar} alt={contato.nome} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getIniciais(contato.nome)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">{contato.nome}</div>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    {contato.telefone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {contato.telefone}
                      </span>
                    )}
                    {contato.email && (
                      <span className="truncate">{contato.email}</span>
                    )}
                  </div>
                </div>

                {/* Menu de ações no mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    {selectedContacts.length <= 1 && (
                      <DropdownMenuItem onClick={() => onEditContact(contato)} className="text-foreground hover:bg-accent">
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onStartService(contato)} className="text-foreground hover:bg-accent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Iniciar Atendimento
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCreateSchedule(contato)} className="text-foreground hover:bg-accent">
                      <Calendar className="h-4 w-4 mr-2" />
                      Criar Agendamento
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onBlockContact(contato)} className="text-foreground hover:bg-accent">
                      <Ban className="h-4 w-4 mr-2" />
                      {isBlocked ? 'Desbloquear' : 'Bloquear'} Contato
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDeleteContact(contato.id)} className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Footer do card - Canal, Tags e Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {/* Canal de origem - com logos reais */}
                <div className="flex items-center gap-2 text-sm">
                  {getLogoCanal(contato.canal)}
                  <span className="text-muted-foreground">
                    {getNomeCanal(contato.canal)}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 min-w-0">
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <Badge key={tag.id} className={`text-xs px-2 py-1 ${tag.cor}`}>
                        {tag.nome}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Sem tags</span>
                  )}
                </div>

                {/* Status de bloqueio */}
                {isBlocked && (
                  <Badge variant="destructive" className="text-xs">
                    Bloqueado
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactsTable;
