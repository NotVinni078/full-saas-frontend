import React, { useState, useMemo } from 'react';
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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
      observations: 'Contato por Telegram apenas'
    }
  ]);

  // Filtrar contatos baseado na pesquisa, tag e canal
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contact.phone.includes(searchTerm) ||
                           (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesTag = tagFilter === '' || tagFilter === 'todos' || contact.tags.includes(tagFilter);
      
      const matchesChannel = channelFilter === '' || channelFilter === 'todos' ||
                             (channelFilter === 'WhatsApp' && contact.hasWhatsApp) ||
                             (channelFilter === 'Telegram' && !contact.hasWhatsApp);
      
      return matchesSearch && matchesTag && matchesChannel;
    });
  }, [contacts, searchTerm, tagFilter, channelFilter]);

  const totalContacts = filteredContacts.length;

  const handleSaveContact = () => {
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

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditContact = () => {
    console.log('Salvando edição do contato:', selectedContact);
    setIsEditDialogOpen(false);
    setSelectedContact(null);
  };

  const handleDiscardEditContact = () => {
    setSelectedContact(null);
    setIsEditDialogOpen(false);
  };

  const availableTags = ['Cliente', 'Lead', 'VIP', 'Interessado', 'Prospect'];
  const availableChannels = ['WhatsApp', 'Telegram'];

  return (
    <TooltipProvider>
      <div className="p-3 sm:p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
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
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-6">
            <div className="min-w-48">
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="border-gray-300 bg-white">
                  <SelectValue placeholder="Filtrar por Tag" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  <SelectItem value="todos">Todas as Tags</SelectItem>
                  {availableTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-64">
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="border-gray-300 bg-white">
                  <SelectValue placeholder="Filtrar por Canal de atendimento" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  <SelectItem value="todos">Todos os Canais</SelectItem>
                  {availableChannels.map((channel) => (
                    <SelectItem key={channel} value={channel}>
                      {channel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Contato
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
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
                      <SelectContent className="bg-white">
                        {availableTags.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
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

        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela - escondido em mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 min-w-[800px]">
            <div className="col-span-1"></div>
            <div className="col-span-3">Nome</div>
            <div className="col-span-3">Número</div>
            <div className="col-span-3">Tags</div>
            <div className="col-span-2 text-center">Ações</div>
          </div>

          {/* Lista de contatos */}
          <div className="space-y-4 md:space-y-0">
            {filteredContacts.map((contact, index) => (
              <div key={contact.id}>
                {/* Layout mobile */}
                <div className="md:hidden p-4 bg-white border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-gray-600">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{contact.name}</h3>
                      <p className="text-sm text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Tags</span>
                    <div className="flex gap-1 flex-wrap mt-1">
                      {contact.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-xs rounded-full border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditContact(contact)}>
                          <UserPen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Contato</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Iniciar Atendimento</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Bloquear Contato</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Layout desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 transition-colors min-w-[800px]">
                  <div className="col-span-1">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {contact.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <h3 className="font-medium text-black">{contact.name}</h3>
                  </div>

                  <div className="col-span-3">
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>

                  <div className="col-span-3">
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-xs rounded-full border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditContact(contact)}>
                          <UserPen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Contato</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Iniciar Atendimento</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Ban className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Bloquear Contato</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Linha divisória */}
                {index < filteredContacts.length - 1 && (
                  <div className="hidden md:block border-b border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dialog de Editar Contato */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Contato</DialogTitle>
            </DialogHeader>
            {selectedContact && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={selectedContact.name}
                    onChange={(e) => setSelectedContact({...selectedContact, name: e.target.value})}
                    placeholder="Nome do contato"
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Número</label>
                  <Input
                    value={selectedContact.phone}
                    onChange={(e) => setSelectedContact({...selectedContact, phone: e.target.value})}
                    placeholder="Número do contato"
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={selectedContact.email || ''}
                    onChange={(e) => setSelectedContact({...selectedContact, email: e.target.value})}
                    placeholder="Email do contato"
                    className="border-gray-300"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Observações</label>
                  <Input
                    value={selectedContact.observations || ''}
                    onChange={(e) => setSelectedContact({...selectedContact, observations: e.target.value})}
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
                    <SelectContent className="bg-white">
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDiscardEditContact}
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Descartar
                  </Button>
                  <Button
                    onClick={handleSaveEditContact}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default GestaoContatos;
