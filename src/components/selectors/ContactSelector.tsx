
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, User, Search } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import TagBadge from '@/components/shared/TagBadge';
import { Contact } from '@/types/global';

/**
 * Componente para seleção de contatos com exibição apenas durante a busca
 * Melhorias implementadas:
 * - Remove pré-visualização da lista de contatos
 * - Exibe contatos apenas quando o usuário digita
 * - Remove status online/offline/ausente
 * - Usa logos reais das redes sociais
 * Design responsivo e acessível para todas as telas
 */

interface ContactSelectorProps {
  onSelectContact: (contact: Contact) => void;
  placeholder?: string;
  showTags?: boolean;
  maxResults?: number;
}

const ContactSelector = ({
  onSelectContact,
  placeholder = "Digite para buscar contatos...",
  showTags = true,
  maxResults = 10
}: ContactSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchContacts } = useContacts();

  // Filtrar contatos apenas quando há termo de busca
  const filteredContacts = searchTerm.trim() 
    ? searchContacts(searchTerm).slice(0, maxResults)
    : [];

  /**
   * Gera iniciais do nome para avatar
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
   */
  const formatPhone = (telefone?: string): string => {
    if (!telefone) return '';
    
    const numbers = telefone.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    return telefone;
  };

  /**
   * Obtém ícone do canal com logos reais das redes sociais
   */
  const getChannelIcon = (canal: string) => {
    const iconClasses = "h-4 w-4 flex-shrink-0";
    
    switch (canal.toLowerCase()) {
      case 'whatsapp':
        return (
          <div className={`${iconClasses} rounded-full bg-green-500 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.426"/>
            </svg>
          </div>
        );
      case 'instagram':
        return (
          <div className={`${iconClasses} rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className={`${iconClasses} rounded-full bg-blue-600 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'telegram':
        return (
          <div className={`${iconClasses} rounded-full bg-blue-500 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} rounded-full bg-gray-500 flex items-center justify-center`}>
            <User className="h-2.5 w-2.5 text-white" />
          </div>
        );
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

      {/* Lista de contatos - apenas quando há busca */}
      {searchTerm.trim() && (
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
                      </div>
                      
                      {/* Contatos de comunicação - sem status */}
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
                <p>Nenhum contato encontrado</p>
                <p className="text-sm">Tente ajustar sua pesquisa</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instrução para começar a digitar */}
      {!searchTerm.trim() && (
        <div className="text-center py-8">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Search className="h-8 w-8 opacity-50" />
            <p>Digite para buscar contatos</p>
            <p className="text-sm">Os contatos aparecerão conforme você digita</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSelector;
