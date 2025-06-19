
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ban, Trash2, RotateCcw, Users } from 'lucide-react';

/**
 * Lista de contatos bloqueados
 * Acessível apenas através do ícone de filtro na página principal
 * Permite desbloquear ou excluir contatos bloqueados
 */

interface BlockedContactsListProps {
  isOpen: boolean;
  onClose: () => void;
  blockedContacts: any[];
  onUnblock: (contact: any) => void;
  onDelete: (contactId: string) => void;
}

const BlockedContactsList = ({ 
  isOpen, 
  onClose, 
  blockedContacts, 
  onUnblock, 
  onDelete 
}: BlockedContactsListProps) => {

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
      whatsapp: <div className="h-3 w-3 bg-green-500 rounded-full" />,
      instagram: <div className="h-3 w-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />,
      facebook: <div className="h-3 w-3 bg-blue-600 rounded-full" />,
      telegram: <div className="h-3 w-3 bg-blue-400 rounded-full" />
    };
    
    return icones[canal as keyof typeof icones] || <Users className="h-3 w-3 text-muted-foreground" />;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] mx-4 max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Ban className="h-5 w-5 text-red-600" />
            Contatos Bloqueados ({blockedContacts.length})
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {blockedContacts.length > 0 ? (
            blockedContacts.map((contato) => (
              <div key={contato.id} className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background">
                {/* Avatar do contato bloqueado */}
                <Avatar className="h-10 w-10 flex-shrink-0 opacity-60">
                  <AvatarImage src={contato.avatar} alt={contato.nome} />
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {getIniciais(contato.nome)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  {/* Informações básicas do contato */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground truncate">{contato.nome}</h3>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-sm text-muted-foreground">
                        {contato.telefone && (
                          <span>{contato.telefone}</span>
                        )}
                        {contato.email && (
                          <span className="truncate">{contato.email}</span>
                        )}
                      </div>
                      
                      {/* Canal de origem */}
                      <div className="flex items-center gap-2 mt-1">
                        {getIconeOrigem(contato.canal)}
                        <span className="text-xs text-muted-foreground">
                          {getNomeCanal(contato.canal)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botões de ação */}
                    <div className="flex gap-2 flex-shrink-0">
                      {/* Botão desbloquear */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUnblock(contato)}
                        className="text-xs border-border text-foreground hover:bg-accent"
                        title="Desbloquear contato"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Desbloquear
                      </Button>
                      
                      {/* Botão excluir permanentemente */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(contato.id)}
                        className="text-xs border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Excluir contato permanentemente"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tags do contato se existirem */}
                  {contato.tags && contato.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {contato.tags.map((tagId: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs opacity-60">
                          Tag {tagId}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Observações se existirem */}
                  {contato.observacoes && (
                    <div className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                      <strong>Obs:</strong> {contato.observacoes}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            /* Estado vazio quando não há contatos bloqueados */
            <div className="text-center py-8">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Ban className="h-12 w-12 opacity-30" />
                <div>
                  <p className="font-medium">Nenhum contato bloqueado</p>
                  <p className="text-sm">
                    Contatos bloqueados aparecem aqui quando você impede o envio e recebimento de mensagens
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Rodapé explicativo */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <Ban className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground mb-1">Sobre contatos bloqueados:</p>
              <p>
                Contatos bloqueados não podem enviar nem receber mensagens através do sistema. 
                Você pode desbloquear a qualquer momento ou excluir permanentemente.
              </p>
            </div>
          </div>
        </div>
        
        {/* Botão de fechar */}
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={onClose} className="border-border text-foreground hover:bg-accent">
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlockedContactsList;
