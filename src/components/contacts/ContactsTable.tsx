
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  Users
} from 'lucide-react';

/**
 * Tabela de contatos com layout responsivo
 * Mantém design de cards para mobile/tablet e tabela para desktop
 * Cores dinâmicas do sistema de marca
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
}

const ContactsTable = ({
  contacts,
  blockedContacts,
  onEditContact,
  onStartService,
  onCreateSchedule,
  onBlockContact,
  onDeleteContact,
  getContactTags
}: ContactsTableProps) => {

  /**
   * Gera iniciais do nome para avatar quando não há foto
   * @param {string} nome - Nome do contato
   */
  const getIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  /**
   * Retorna ícone baseado no canal de origem do contato
   * @param {string} canal - Canal de origem
   */
  const getIconeOrigem = (canal: string) => {
    const icones = {
      whatsapp: <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-2 w-2 text-white" />
                </div>,
      instagram: <div className="h-4 w-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />,
      facebook: <div className="h-4 w-4 bg-blue-600 rounded-full" />,
      telegram: <div className="h-4 w-4 bg-blue-400 rounded-full" />
    };
    
    return icones[canal as keyof typeof icones] || <Users className="h-4 w-4 text-muted-foreground" />;
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

  return (
    <div className="w-full">
      {/* Layout tabela para desktop */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
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
              
              return (
                <TableRow 
                  key={contato.id} 
                  className={`border-border hover:bg-accent/50 transition-colors ${
                    isBlocked ? 'opacity-60' : ''
                  }`}
                >
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

                  {/* Coluna Canal */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      {getIconeOrigem(contato.canal)}
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
                        <DropdownMenuItem onClick={() => onEditContact(contato)} className="text-foreground hover:bg-accent">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
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

      {/* Layout cards para mobile/tablet (mantém funcionalidade existente) */}
      <div className="lg:hidden space-y-4">
        {contacts.map((contato) => {
          const tags = getContactTags(contato);
          const isBlocked = isContactBlocked(contato.id);
          
          return (
            <div 
              key={contato.id} 
              className={`flex flex-col gap-4 p-4 border border-border rounded-lg bg-background hover:bg-accent/50 transition-colors ${
                isBlocked ? 'opacity-60' : ''
              }`}
            >
              {/* Header do card - Avatar e informações básicas */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
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
                    <DropdownMenuItem onClick={() => onEditContact(contato)} className="text-foreground hover:bg-accent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
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
                {/* Canal de origem */}
                <div className="flex items-center gap-2 text-sm">
                  {getIconeOrigem(contato.canal)}
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
