
import React, { useState } from 'react';
import { Search, Plus, UserPen, MessageSquare, Ban, Save, X, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email?: string;
  hasWhatsApp: boolean;
  tags: string[];
  observations?: string;
}

const GestaoContatos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [channelFilter, setChannelFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    email: '',
    observations: '',
    tags: [] as string[]
  });

  // Mock data para demonstração
  const [contacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'João Silva',
      phone: '+55 11 99999-9999',
      email: 'joao@email.com',
      hasWhatsApp: true,
      tags: ['Cliente', 'VIP'],
      observations: 'Cliente preferencial'
    },
    {
      id: 2,
      name: 'Maria Santos',
      phone: '+55 11 88888-8888',
      email: 'maria@email.com',
      hasWhatsApp: true,
      tags: ['Lead', 'Interessado'],
      observations: ''
    },
    {
      id: 3,
      name: 'Pedro Costa',
      phone: '+55 11 77777-7777',
      hasWhatsApp: false,
      tags: ['Cliente'],
      observations: 'Contato por SMS apenas'
    }
  ]);

  const totalContacts = contacts.length;

  const handleSaveContact = () => {
    // Lógica para salvar contato
    console.log('Salvando contato:', newContact);
    setIsAddDialogOpen(false);
    setNewContact({
      name: '',
      phone: '',
      email: '',
      observations: '',
      tags: []
    });
  };

  const handleDiscardContact = () => {
    setNewContact({
      name: '',
      phone: '',
      email: '',
      observations: '',
      tags: []
    });
    setIsAddDialogOpen(false);
  };

  const availableTags = ['Cliente', 'Lead', 'VIP', 'Interessado', 'Prospect'];
  const availableChannels = ['WhatsApp', 'SMS', 'Email', 'Telefone'];

  return (
    <TooltipProvider>
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-black mb-6">
            Gestão de Contatos ({totalContacts})
          </h1>

          {/* Barra de pesquisa */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar contatos"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>

          {/* Filtros e botão adicionar */}
          <div className="flex gap-4 items-center mb-6">
            <Select value={tagFilter} onValueChange={setTagFilter}>
              <SelectTrigger className="w-48 border-gray-300">
                <SelectValue placeholder="Filtrar por Tag" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-64 border-gray-300">
                <SelectValue placeholder="Filtrar por Canal de atendimento" />
                <ChevronDown className="h-4 w-4" />
              </SelectTrigger>
              <SelectContent>
                {availableChannels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Contato</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                      placeholder="Nome do contato"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Número</label>
                    <Input
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                      placeholder="Número do contato"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={newContact.email}
                      onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                      placeholder="Email do contato"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Observações</label>
                    <Input
                      value={newContact.observations}
                      onChange={(e) => setNewContact({...newContact, observations: e.target.value})}
                      placeholder="Observações livres"
                      className="border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Select>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Selecionar tags" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      onClick={handleDiscardContact}
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Descartar
                    </Button>
                    <Button
                      onClick={handleSaveContact}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lista de contatos */}
        <div className="space-y-1">
          {contacts.map((contact, index) => (
            <div key={contact.id}>
              <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  {/* Foto (placeholder) */}
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {contact.name.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Informações do contato */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-black">{contact.name}</h3>
                      {/* Tags */}
                      <div className="flex gap-1">
                        {contact.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-xs rounded-full border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <UserPen className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar Contato</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Iniciar Atendimento</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bloquear Contato</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* Linha divisória suave */}
              {index < contacts.length - 1 && (
                <div className="border-b border-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GestaoContatos;
