
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MessageCircle, User, Search } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import TagBadge from '@/components/shared/TagBadge';
import { Contact } from '@/types/global';

/**
 * Componente para seleção de contatos com filtros avançados
 * Exibe tags com cores personalizadas usando TagBadge
 * Design responsivo e acessível para todas as telas
 * Integrado com sistema de busca e filtros
 */

interface ContactSelectorProps {
  onSelectContact: (contact: Contact) => void;
  placeholder?: string;
  showTags?: boolean;
  maxResults?: number;
}

const ContactSelector = ({
  onSelectContact,
  placeholder = "Buscar contatos...",
  showTags = true,
  maxResults = 10
}: ContactSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchContacts, contacts } = useContacts();

  // Filtrar contatos baseado no termo de busca
  const filteredContacts = searchTerm.trim() 
    ? searchContacts(searchTerm).slice(0, maxResults)
    : contacts.slice(0, maxResults);

  /**
   * Gera iniciais do nome para avatar
   * @param {string} nome - Nome do contato
   * @returns {string} Iniciais do nome
   */
  const getInitials = (nome: string): string => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  /**
   * Formata telefone para exibição
   * @param {string} telefone - Número de telefone
   * @returns {string} Telefone formatado
   */
  const formatPhone = (telefone?: string): string => {
    if (!telefone) return '';
    
    // Remove caracteres não numéricos
    const numbers = telefone.replace(/\D/g, '');
    
    // Aplica formatação básica para telefones brasileiros
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    return telefone;
  };

  /**
   * Obtém ícone do canal de comunicação
   * @param {string} canal - Canal de comunicação
   * @returns {JSX.Element} Ícone do canal
   */
  const getChannelIcon = (canal: string) => {
    const iconProps = { className: "h-3 w-3" };
    
    switch (canal) {
      case 'whatsapp':
        return <MessageCircle {...iconProps} className="h-3 w-3 text-green-600" />;
      case 'instagram':
        return <MessageCircle {...iconProps} className="h-3 w-3 text-pink-600" />;
      case 'facebook':
        return <MessageCircle {...iconProps} className="h-3 w-3 text-blue-600" />;
      case 'telegram':
        return <MessageCircle {...iconProps} className="h-3 w-3 text-blue-500" />;
      default:
        return <MessageCircle {...iconProps} className="h-3 w-3 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Campo de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Lista de contatos */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className="cursor-pointer hover:bg-accent/50 transition-colors border-border"
              onClick={() => onSelectContact(contact)}
            >
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  {/* Avatar do contato */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={contact.avatar} alt={contact.nome} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(contact.nome)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Informações do contato */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {contact.nome}
                      </h4>
                      {getChannelIcon(contact.canal)}
                      <Badge 
                        variant={contact.status === 'online' ? 'success' : 'secondary'}
                        className="text-xs px-1.5 py-0.5"
                      >
                        {contact.status}
                      </Badge>
                    </div>
                    
                    {/* Contatos de comunicação */}
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs text-muted-foreground mb-2">
                      {contact.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{formatPhone(contact.telefone)}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags do contato com cores personalizadas */}
                    {showTags && contact.tags && contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {contact.tags.slice(0, 3).map((tagId) => (
                          <TagBadge 
                            key={tagId} 
                            tagId={tagId} 
                            size="sm"
                          />
                        ))}
                        {contact.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                            +{contact.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Botão de seleção */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 h-8 w-8 p-0 text-primary hover:bg-primary/10"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <User className="h-8 w-8 opacity-50" />
              <p>{searchTerm ? 'Nenhum contato encontrado' : 'Nenhum contato disponível'}</p>
              {searchTerm && (
                <p className="text-sm">Tente ajustar sua pesquisa</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Indicador de resultados limitados */}
      {filteredContacts.length === maxResults && contacts.length > maxResults && (
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground">
            Mostrando {maxResults} de {contacts.length} contatos. Use a busca para filtrar.
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactSelector;
