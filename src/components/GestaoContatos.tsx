
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Users, 
  Download,
  Upload,
  Search
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useContacts } from '@/hooks/useContacts';
import ContactModal from './modals/ContactModal';
import BlockedContactsList from './contacts/BlockedContactsList';
import ContactsFilter from './contacts/ContactsFilter';
import ImportContactsModal from './contacts/ImportContactsModal';
import ContactsTable from './contacts/ContactsTable';
import ConfirmationDialog from './contacts/ConfirmationDialog';
import StartServiceDialog from './contacts/StartServiceDialog';
import NewScheduleModal from './modals/NewScheduleModal';

/**
 * Componente principal de gestão de contatos
 * Inclui funcionalidades de seleção múltipla, ações em lote e modal de agendamento
 * Mantém responsividade e cores dinâmicas do sistema de marca
 * Layout do seletor de arquivo JSON corrigido
 */

const GestaoContatos = () => {
  const navigate = useNavigate();
  
  // Estados principais para controle da interface
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBlockedContacts, setShowBlockedContacts] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState([]);
  
  // Estados para filtros e importação
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'blocked'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Estados para diálogos de confirmação e ações
  const [showBlockConfirmation, setShowBlockConfirmation] = useState(false);
  const [showUnblockConfirmation, setShowUnblockConfirmation] = useState(false);
  const [showStartServiceDialog, setShowStartServiceDialog] = useState(false);
  const [showNewScheduleModal, setShowNewScheduleModal] = useState(false);
  const [selectedContactForAction, setSelectedContactForAction] = useState(null);
  const [preSelectedContactsForSchedule, setPreSelectedContactsForSchedule] = useState([]);

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
   * Abre diálogo de confirmação para bloquear contato
   * @param {Object} contato - Contato a ser bloqueado
   */
  const handleBloquearContato = (contato) => {
    const isCurrentlyBlocked = blockedContacts.some(blocked => blocked.id === contato.id);
    
    setSelectedContactForAction(contato);
    
    if (isCurrentlyBlocked) {
      // Abrir confirmação de desbloqueio
      setShowUnblockConfirmation(true);
    } else {
      // Abrir confirmação de bloqueio
      setShowBlockConfirmation(true);
    }
  };

  /**
   * Confirma bloqueio do contato
   */
  const confirmBlockContact = () => {
    if (selectedContactForAction) {
      setBlockedContacts(prev => [...prev, selectedContactForAction]);
      console.log('Contato bloqueado para envio e recebimento de mensagens:', selectedContactForAction.nome);
    }
    setSelectedContactForAction(null);
  };

  /**
   * Confirma desbloqueio do contato
   */
  const confirmUnblockContact = () => {
    if (selectedContactForAction) {
      setBlockedContacts(prev => prev.filter(blocked => blocked.id !== selectedContactForAction.id));
      console.log('Contato desbloqueado:', selectedContactForAction.nome);
    }
    setSelectedContactForAction(null);
  };

  /**
   * Abre diálogo para iniciar atendimento
   * @param {Object} contato - Contato para iniciar atendimento
   */
  const handleIniciarAtendimento = (contato) => {
    setSelectedContactForAction(contato);
    setShowStartServiceDialog(true);
  };

  /**
   * Processa início do atendimento com setor selecionado
   * @param {string} contactId - ID do contato
   * @param {string} sectorId - ID do setor selecionado
   * @param {string} action -ção escolhida ('start' ou 'waiting')
   */
  const handleStartService = (contactId: string, sectorId: string, action: 'start' | 'waiting') => {
    const contato = contacts.find(c => c.id === contactId);
    if (contato) {
      console.log(`Atendimento ${action === 'start' ? 'iniciado' : 'movido para aguardando'} para:`, contato.nome, 'Setor:', sectorId);
      // TODO: Implementar lógica de redirecionamento para /atendimentos com os parâmetros necessários
      // navigate('/atendimentos', { state: { contactId, sectorId, action } });
    }
    setSelectedContactForAction(null);
  };

  /**
   * Abre modal de novo agendamento com contato pré-selecionado
   * @param {Object} contato - Contato para criar agendamento
   */
  const handleCriarAgendamento = (contato) => {
    setPreSelectedContactsForSchedule([contato]);
    setShowNewScheduleModal(true);
    console.log('Abrindo modal de agendamento com contato pré-selecionado:', contato.nome);
  };

  /**
   * Processa importação de contatos via JSON
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
   * Exporta todos os contatos para arquivo JSON
   * Corrigido: agora todas as tags ficam em uma única célula/propriedade
   */
  const handleExportarJSON = () => {
    const contatosParaExportar = filtrarContatos();
    
    if (contatosParaExportar.length === 0) {
      alert('Nenhum contato disponível para exportação');
      return;
    }

    // Prepara dados para exportação com tags em uma única propriedade
    const exportData = contatosParaExportar.map(contato => {
      const tags = getContactTags(contato);
      const allTagNames = tags.map(tag => tag.nome).join('; '); // Todas as tags separadas por ponto e vírgula
      
      return {
        nome: contato.nome || '',
        telefone: contato.telefone || '',
        email: contato.email || '',
        endereco: contato.endereco || '',
        observacoes: contato.observacoes || '',
        tags: allTagNames, // Tags unificadas em uma única propriedade
        canal: contato.canal || '',
        setor: contato.setor || '',
        status: contato.status || ''
      };
    });

    // Cria e baixa o arquivo JSON
    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `contatos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log(`${contatosParaExportar.length} contatos exportados para JSON com todas as tags unificadas`);
  };

  /**
   * Limpa todos os filtros aplicados
   */
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedFilter('all');
    setSelectedTags([]);
  };

  // Funções para ações em lote

  /**
   * Processa início de atendimento em lote
   * @param {Array} selectedContacts - Contatos selecionados
   */
  const handleBulkStartService = (selectedContacts) => {
    console.log('Iniciando atendimento para múltiplos contatos:', selectedContacts.map(c => c.nome));
    // TODO: Implementar lógica de início de atendimento em lote
    // Por enquanto, abre o diálogo para o primeiro contato como exemplo
    if (selectedContacts.length > 0) {
      handleIniciarAtendimento(selectedContacts[0]);
    }
  };

  /**
   * Processa bloqueio/desbloqueio em lote
   * @param {Array} selectedContacts - Contatos selecionados
   */
  const handleBulkBlock = (selectedContacts) => {
    selectedContacts.forEach(contact => {
      const isCurrentlyBlocked = blockedContacts.some(blocked => blocked.id === contact.id);
      
      if (isCurrentlyBlocked) {
        // Desbloquear
        setBlockedContacts(prev => prev.filter(blocked => blocked.id !== contact.id));
        console.log('Contato desbloqueado em lote:', contact.nome);
      } else {
        // Bloquear
        setBlockedContacts(prev => [...prev, contact]);
        console.log('Contato bloqueado em lote:', contact.nome);
      }
    });
  };

  /**
   * Processa exclusão em lote
   * @param {Array} selectedContacts - Contatos selecionados
   */
  const handleBulkDelete = (selectedContacts) => {
    if (confirm(`Tem certeza que deseja excluir ${selectedContacts.length} contato(s)?`)) {
      selectedContacts.forEach(contact => {
        handleExcluirContato(contact.id);
      });
      console.log(`${selectedContacts.length} contatos excluídos em lote`);
    }
  };

  /**
   * Processa criação de agendamento em lote
   * @param {Array} selectedContacts - Contatos selecionados
   */
  const handleBulkCreateSchedule = (selectedContacts) => {
    setPreSelectedContactsForSchedule(selectedContacts);
    setShowNewScheduleModal(true);
    console.log('Abrindo modal de agendamento com múltiplos contatos pré-selecionados:', selectedContacts.map(c => c.nome));
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
          {/* Botão de exportar JSON */}
          <Button 
            variant="outline" 
            onClick={handleExportarJSON}
            className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar JSON
          </Button>

          {/* Botão de importar JSON */}
          <Button 
            variant="outline" 
            onClick={() => setShowImportModal(true)}
            className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importar JSON
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
          {/* Tabela/Cards de contatos com funcionalidades de seleção múltipla */}
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
              onBulkStartService={handleBulkStartService}
              onBulkBlock={handleBulkBlock}
              onBulkDelete={handleBulkDelete}
              onBulkCreateSchedule={handleBulkCreateSchedule}
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

      {/* Modal de importação de contatos (agora JSON com layout corrigido) */}
      <ImportContactsModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleImportContacts}
      />

      {/* Modal de novo agendamento */}
      <NewScheduleModal
        isOpen={showNewScheduleModal}
        onClose={() => {
          setShowNewScheduleModal(false);
          setPreSelectedContactsForSchedule([]);
        }}
        preSelectedContacts={preSelectedContactsForSchedule}
      />

      {/* Diálogo de confirmação para bloquear contato */}
      <ConfirmationDialog
        isOpen={showBlockConfirmation}
        onClose={() => setShowBlockConfirmation(false)}
        onConfirm={confirmBlockContact}
        title="Bloquear Contato"
        description="Tem certeza que deseja bloquear este contato? Ele não poderá mais enviar ou receber mensagens."
        confirmText="Bloquear Contato"
        contact={selectedContactForAction}
        variant="destructive"
      />

      {/* Diálogo de confirmação para desbloquear contato */}
      <ConfirmationDialog
        isOpen={showUnblockConfirmation}
        onClose={() => setShowUnblockConfirmation(false)}
        onConfirm={confirmUnblockContact}
        title="Desbloquear Contato"
        description="Tem certeza que deseja desbloquear este contato? Ele poderá voltar a enviar e receber mensagens."
        confirmText="Desbloquear Contato"
        contact={selectedContactForAction}
        variant="default"
      />

      {/* Diálogo para iniciar atendimento com seleção de setor */}
      <StartServiceDialog
        isOpen={showStartServiceDialog}
        onClose={() => setShowStartServiceDialog(false)}
        contact={selectedContactForAction}
        onStartService={handleStartService}
      />
    </div>
  );
};

export default GestaoContatos;
