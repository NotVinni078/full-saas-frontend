
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MessageSquare,
  Calendar,
  MoreVertical,
  Filter,
  Download,
  Upload,
  Search,
  Ban,
  Phone
} from "lucide-react";
import { useContacts } from '@/hooks/useContacts';
import ContactModal from './modals/ContactModal';
import BlockedContactsList from './contacts/BlockedContactsList';

const GestaoContatos = () => {
  // Estados principais para controle da interface
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockedContacts, setShowBlockedContacts] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState([]);

  // Hook customizado para gerenciamento de contatos
  const { contacts, updateContact, addContact, removeContact, getContactTags, searchContacts } = useContacts();

  /**
   * Filtra contatos para exibição principal
   * Remove contatos do WebChat e contatos bloqueados da lista principal
   */
  const filtrarContatos = () => {
    const filteredContacts = contacts.filter(contato => {
      // Remove contatos do WebChat da listagem principal
      if (contato.canal === 'webchat') return false;
      
      // Remove contatos bloqueados da listagem principal
      const isBlocked = blockedContacts.some(blocked => blocked.id === contato.id);
      if (isBlocked) return false;

      // Aplica filtro de pesquisa por nome, telefone ou email
      const matchesSearch = contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (contato.telefone && contato.telefone.includes(searchTerm)) ||
                           (contato.email && contato.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    });

    return filteredContacts;
  };

  /**
   * Abre modal para criação de novo contato
   * Limpa estados de edição
   */
  const handleNovoContato = () => {
    setIsEditMode(false);
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  /**
   * Abre modal para edição de contato existente
   * @param {Object} contato - Contato a ser editado
   */
  const handleEditarContato = (contato) => {
    setEditingContact(contato);
    setIsEditMode(true);
    setIsContactModalOpen(true);
  };

  /**
   * Exclui contato permanentemente do sistema
   * @param {string} contatoId - ID do contato a ser excluído
   */
  const handleExcluirContato = (contatoId) => {
    // Remove contato da lista principal
    removeContact(contatoId);
    
    // Remove contato da lista de bloqueados se estiver lá
    setBlockedContacts(prev => prev.filter(blocked => blocked.id !== contatoId));
    
    console.log('Contato excluído:', contatoId);
  };

  /**
   * Bloqueia/desbloqueia contato para envio e recebimento de mensagens
   * @param {Object} contato - Contato a ser bloqueado/desbloqueado
   */
  const handleBloquearContato = (contato) => {
    const isCurrentlyBlocked = blockedContacts.some(blocked => blocked.id === contato.id);
    
    if (isCurrentlyBlocked) {
      // Desbloquear contato
      setBlockedContacts(prev => prev.filter(blocked => blocked.id !== contato.id));
      console.log('Contato desbloqueado:', contato.nome);
    } else {
      // Bloquear contato - adiciona à lista de bloqueados
      setBlockedContacts(prev => [...prev, contato]);
      console.log('Contato bloqueado para envio e recebimento de mensagens:', contato.nome);
    }
  };

  /**
   * Inicia atendimento para o contato selecionado
   * Redireciona para tela de atendimentos após seleção do canal
   * @param {Object} contato - Contato para iniciar atendimento
   */
  const handleIniciarAtendimento = (contato) => {
    // TODO: Implementar seleção de canal antes de abrir atendimento
    console.log('Iniciando atendimento para:', contato.nome, 'Canal:', contato.canal);
    // Deve redirecionar para /atendimentos após seleção do canal
  };

  /**
   * Abre popup de agendamento reutilizando funcionalidade existente
   * @param {Object} contato - Contato para criar agendamento
   */
  const handleCriarAgendamento = (contato) => {
    // TODO: Reutilizar popup de agendamento da página /agendamentos
    console.log('Criar agendamento para:', contato.nome);
    // Deve abrir o mesmo modal usado na página de agendamentos
  };

  /**
   * Retorna ícone baseado no canal de origem do contato
   * @param {string} canal - Canal de origem (whatsapp, instagram, facebook, telegram)
   */
  const getIconeOrigem = (canal) => {
    const icones = {
      whatsapp: <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-2 w-2 text-white" />
                </div>,
      instagram: <div className="h-4 w-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />,
      facebook: <div className="h-4 w-4 bg-blue-600 rounded-full" />,
      telegram: <div className="h-4 w-4 bg-blue-400 rounded-full" />
    };
    
    return icones[canal] || <Users className="h-4 w-4 text-muted-foreground" />;
  };

  /**
   * Retorna nome do canal de origem formatado
   * @param {string} canal - Canal de origem
   */
  const getNomeCanal = (canal) => {
    const nomes = {
      whatsapp: 'WhatsApp',
      instagram: 'Instagram', 
      facebook: 'Facebook',
      telegram: 'Telegram'
    };
    
    return nomes[canal] || 'Desconhecido';
  };

  /**
   * Gera iniciais do nome para avatar quando não há foto
   * @param {string} nome - Nome do contato
   */
  const getIniciais = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  /**
   * Manipula importação de CSV
   */
  const handleImportarCSV = () => {
    console.log('Importar contatos via CSV');
    // TODO: Implementar importação de CSV
  };

  /**
   * Baixa planilha modelo para importação
   */
  const handleBaixarModelo = () => {
    console.log('Baixar planilha modelo');
    // TODO: Gerar e baixar planilha modelo baseada na estrutura de contatos
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-background min-h-screen">
      {/* Cabeçalho da página com título e botões principais */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Gestão de Contatos</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie todos os seus contatos e informações de atendimento
          </p>
        </div>
        
        {/* Botões de ação principais - responsivos */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Dropdown de importação com duas opções */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto border-border text-foreground hover:bg-accent">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-border">
              <DropdownMenuItem onClick={handleImportarCSV} className="text-foreground hover:bg-accent">
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBaixarModelo} className="text-foreground hover:bg-accent">
                <Download className="h-4 w-4 mr-2" />
                Baixar Planilha Modelo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão de novo contato */}
          <Button onClick={handleNovoContato} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>

      {/* Barra de pesquisa e filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de pesquisa com ícone */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar contatos por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
        
        {/* Botão para acessar lista de contatos bloqueados */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowBlockedContacts(true)}
            className="border-border text-foreground hover:bg-accent"
            title="Ver contatos bloqueados"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Lista principal de contatos */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5" />
            Contatos Ativos ({filtrarContatos().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Container responsivo para lista de contatos */}
          <div className="space-y-4">
            {filtrarContatos().length > 0 ? (
              filtrarContatos().map((contato) => {
                const tags = getContactTags(contato);
                
                return (
                  <div key={contato.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg bg-background hover:bg-accent/50 transition-colors">
                    {/* Avatar e informações básicas */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Avatar do contato */}
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={contato.avatar} alt={contato.nome} />
                        <AvatarFallback className="bg-muted text-muted-foreground">
                          {getIniciais(contato.nome)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Informações do contato */}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-foreground truncate">{contato.nome}</div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
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
                    </div>

                    {/* Origem do contato */}
                    <div className="flex items-center gap-2 text-sm">
                      {getIconeOrigem(contato.canal)}
                      <span className="text-muted-foreground hidden sm:inline">
                        {getNomeCanal(contato.canal)}
                      </span>
                    </div>

                    {/* Tags do contato */}
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

                    {/* Menu de ações */}
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                          {/* Editar contato */}
                          <DropdownMenuItem onClick={() => handleEditarContato(contato)} className="text-foreground hover:bg-accent">
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          
                          {/* Iniciar atendimento */}
                          <DropdownMenuItem onClick={() => handleIniciarAtendimento(contato)} className="text-foreground hover:bg-accent">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Iniciar Atendimento
                          </DropdownMenuItem>
                          
                          {/* Criar agendamento */}
                          <DropdownMenuItem onClick={() => handleCriarAgendamento(contato)} className="text-foreground hover:bg-accent">
                            <Calendar className="h-4 w-4 mr-2" />
                            Criar Agendamento
                          </DropdownMenuItem>
                          
                          {/* Bloquear/Desbloquear contato */}
                          <DropdownMenuItem onClick={() => handleBloquearContato(contato)} className="text-foreground hover:bg-accent">
                            <Ban className="h-4 w-4 mr-2" />
                            {blockedContacts.some(blocked => blocked.id === contato.id) ? 'Desbloquear' : 'Bloquear'} Contato
                          </DropdownMenuItem>
                          
                          {/* Excluir contato */}
                          <DropdownMenuItem onClick={() => handleExcluirContato(contato.id)} className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Estado vazio quando não há contatos */
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Users className="h-12 w-12 opacity-50" />
                  <div>
                    <p className="text-lg font-medium">Nenhum contato encontrado</p>
                    {searchTerm ? (
                      <p className="text-sm">Tente ajustar sua pesquisa ou criar um novo contato</p>
                    ) : (
                      <p className="text-sm">Comece criando seu primeiro contato</p>
                    )}
                  </div>
                  {!searchTerm && (
                    <Button onClick={handleNovoContato} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeiro Contato
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal de criação/edição de contatos */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        isEditMode={isEditMode}
        contact={editingContact}
        onSave={(contactData) => {
          if (isEditMode && editingContact) {
            updateContact({ ...editingContact, ...contactData });
          } else {
            addContact(contactData);
          }
          setIsContactModalOpen(false);
        }}
      />

      {/* Modal de contatos bloqueados */}
      <BlockedContactsList
        isOpen={showBlockedContacts}
        onClose={() => setShowBlockedContacts(false)}
        blockedContacts={blockedContacts}
        onUnblock={(contato) => handleBloquearContato(contato)}
        onDelete={(contactId) => handleExcluirContato(contactId)}
      />
    </div>
  );
};

export default GestaoContatos;
