
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';
import { useContacts } from '@/hooks/useContacts';
import { useTags } from '@/hooks/useTags';
import { Contact } from '@/types/global';

interface ContactSelectorProps {
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
  placeholder?: string;
  showTags?: boolean;
}

const ContactSelector = ({ 
  onSelectContact, 
  selectedContactId, 
  placeholder = "Buscar contatos...",
  showTags = true 
}: ContactSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchContacts, contacts } = useContacts();
  const { getTagsByIds } = useTags();

  const filteredContacts = searchTerm ? searchContacts(searchTerm) : contacts;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredContacts.map((contact) => {
            const contactTags = getTagsByIds(contact.tags);
            return (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  selectedContactId === contact.id ? 'bg-blue-50 dark:bg-blue-950 border-blue-200' : ''
                }`}
                onClick={() => onSelectContact(contact)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{contact.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {contact.nome}
                    </p>
                    {showTags && contactTags.length > 0 && (
                      <div className="flex gap-1">
                        {contactTags.slice(0, 2).map((tag) => (
                          <Badge key={tag.id} className={`text-xs px-1 py-0 h-4 ${tag.cor}`}>
                            {tag.nome}
                          </Badge>
                        ))}
                        {contactTags.length > 2 && (
                          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
                            +{contactTags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {contact.telefone || contact.email || 'Sem contato'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ContactSelector;
