
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Users, 
  Download,
  Upload,
  Search
} from "lucide-react";
import { useContacts } from '@/hooks/useContacts';
import ContactModal from './modals/ContactModal';
import BlockedContactsList from './contacts/BlockedContactsList';
import ContactsFilter from './contacts/ContactsFilter';
import ImportContactsModal from './contacts/ImportContactsModal';
import ContactsTable from './contacts/ContactsTable';

const GestaoContatos = () => {
  // Estados principais para controle da interface
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockedContacts, setShowBlockedContacts] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState([]);
  
  // Novos estados para filtros e importação
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'blocked'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);

  // Hook customizado para gerenciamento de contatos
  const { contacts, updateContact, addContact, removeContact, getContactTags, searchContacts } = useContacts();

  /**
   * Filtra contatos baseado nos critérios selecionados
   * Remove contatos do WebChat da listagem principal
   * Aplica filtros de pesquisa, status e tags
   */
  const filtrarContatos = () => {
    let filteredContacts = contacts.filter(contato => {
      // Remove contatos do WebChat da listagem principal
      if (contato.canal === 'webchat') return false;
      
      return true;
    });

    // Aplica filtro por status (todos ou bloqueados)
    if (selectedFilter === 'blocked') {
      filteredContacts = blockedContacts;
    } else {
      // Remove contatos bloqueados da lista principal se filtro for "all"
      const blockedIds = blockedContacts.map(blocked => blocked.id);
      filteredContacts = filteredContacts.filter(contato => !blockedIds.includes(contato.id));
    }

    // Aplica filtro de pesquisa por nome, telefone ou email
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredContacts = filteredContacts.filter(contato =>
        contato.nome.toLowerCase().includes(term) ||
        (contato.telefone && contato.telefone.includes(term)) ||
        (contato.email && contato.email.toLowerCase().includes(term))
      );
    }

    // Aplica filtro por tags selecionadas
    if (selectedTags.length > 0) {
      filteredContacts = filteredContacts.filter(contato =>
        selectedTags.some(tagId => contato.tags?.includes(tagId))
      );
    }

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
   * Processa importação de contatos via CSV
   * @param {Array} importedContacts - Lista de contatos importados
   */
  const handleImportContacts = (importedContacts) => {
    importedContacts.forEach(contact => {
      const newContact = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...contact,
        avatar: contact.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        status: 'offline'
      };
      addContact(newContact);
    });
    
    console.log(`${importedContacts.length} contatos importados com sucesso`);
    setShowImportModal(false);
  };

  /**
   * Exporta todos os contatos para arquivo CSV
   */
  const handleExportarCSV = () => {
    const contatosParaExportar = filtrarContatos();
    
    if (contatosParaExportar.length === 0) {
      alert('Nenhum contato disponível para exportação');
      return;
    }

    // Cabeçalho do CSV
    const csvHeader = 'nome,telefone,email,observacoes,tags,canal\n';
    
    // Dados dos contatos
    const csvData = contatosParaExportar.map(contato => {
      const tags = getContactTags(contato);
      return [
        `"${contato.nome || ''}"`,
        `"${contato.telefone || ''}"`,
        `"${contato.email || ''}"`,
        `"${contato.observacoes || ''}"`,
        `"${tags.map(tag => tag.nome).join(';')}"`,
        `"${contato.canal || ''}"`
      ].join(',');
    }).join('\n');

    // Cria e baixa o arquivo
    const csvContent = csvHeader + csvData;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contatos_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    console.log(`${contatosParaExportar.length} contatos exportados para CSV`);
  };

  /**
   * Limpa todos os filtros aplicados
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    setSelectedTags([]);
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
          {/* Botão de exportar CSV */}
          <Button 
            variant="outline" 
            onClick={handleExportarCSV}
            className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>

          {/* Botão de importar CSV */}
          <Button 
            variant="outline" 
            onClick={() => setShowImportModal(true)}
            className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar CSV
          </Button>

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
        
        {/* Componente de filtros */}
        <ContactsFilter
          selectedFilter={selectedFilter}
          selectedTags={selectedTags}
          onFilterChange={setSelectedFilter}
          onTagsChange={setSelectedTags}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Lista principal de contatos */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5" />
            {selectedFilter === 'blocked' ? 'Contatos Bloqueados' : 'Contatos Ativos'} ({filtrarContatos().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabela/Cards de contatos usando o novo componente */}
          {filtrarContatos().length > 0 ? (
            <ContactsTable
              contacts={filtrarContatos()}
              blockedContacts={blockedContacts}
              onEditContact={handleEditarContato}
              onStartService={handleIniciarAtendimento}
              onCreateSchedule={handleCriarAgendamento}
              onBlockContact={handleBloquearContato}
              onDeleteContact={handleExcluirContato}
              getContactTags={getContactTags}
            />
          ) : (
            /* Estado vazio quando não há contatos */
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <Users className="h-12 w-12 opacity-50" />
                <div>
                  <p className="text-lg font-medium">Nenhum contato encontrado</p>
                  {searchTerm || selectedTags.length > 0 ? (
                    <p className="text-sm">Tente ajustar sua pesquisa ou filtros</p>
                  ) : selectedFilter === 'blocked' ? (
                    <p className="text-sm">Nenhum contato bloqueado encontrado</p>
                  ) : (
                    <p className="text-sm">Comece criando seu primeiro contato</p>
                  )}
                </div>
                {!searchTerm && selectedTags.length === 0 && selectedFilter === 'all' && (
                  <Button onClick={handleNovoContato} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeiro Contato
                  </Button>
                )}
              </div>
            </div>
          )}
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

      {/* Modal de contatos bloqueados (mantido para compatibilidade) */}
      <BlockedContactsList
        isOpen={showBlockedContacts}
        onClose={() => setShowBlockedContacts(false)}
        blockedContacts={blockedContacts}
        onUnblock={(contato) => handleBloquearContato(contato)}
        onDelete={(contactId)=> handleExcluirContato(contactId)}
      />

      {/* Modal de importação de contatos */}
      <ImportContactsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportContacts}
      />
    </div>
  );
};

export default GestaoContatos;
