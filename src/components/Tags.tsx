import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Edit, Trash2, Tag, UserPlus, Search, Phone, Mail, MessageCircle } from 'lucide-react';
import { EllipsisVertical } from "lucide-react";
import { useTags } from '@/hooks/useTags';
import { useContacts } from '@/hooks/useContacts';
import TagBadge from '@/components/shared/TagBadge';
import { Contact } from '@/types/global';

/**
 * Componente principal de gestão de tags
 * Integrado com sistema de contatos para exibir quantidade real e gerenciar associações
 * Mantém responsividade e cores dinâmicas do sistema de marca
 * Aplica cores das tags de forma consistente em todos os elementos visuais
 */

const Tags = () => {
  // Estados para controle de diálogos e modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isContatosDialogOpen, setIsContatosDialogOpen] = useState(false);
  const [selectedTagForContatos, setSelectedTagForContatos] = useState<any>(null);
  const [contactSearchTerm, setContactSearchTerm] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  
  // Estado para nova tag
  const [novaTag, setNovaTag] = useState({
    nome: '',
    cor: '#3B82F6'
  });

  // Hooks para gerenciamento de dados
  const { tags, addTag, updateTag, removeTag } = useTags();
  const { contacts, updateContact, searchContacts } = useContacts();

  /**
   * Calcula a quantidade de contatos associados a uma tag específica
   * @param {string} tagId - ID da tag para contar contatos
   * @returns {number} Quantidade de contatos com a tag
   */
  const getContactCountForTag = (tagId: string): number => {
    return contacts.filter(contact => contact.tags && contact.tags.includes(tagId)).length;
  };

  /**
   * Converte cor hexadecimal para estilo inline CSS
   * Garante contraste adequado para texto sobre a cor da tag
   * @param {string} hexColor - Cor em formato hexadecimal
   * @returns {Object} Objeto com estilos CSS para aplicar na tag
   */
  const getTagStyles = (hexColor: string) => {
    // Converter hex para RGB para calcular luminância
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcular luminância para determinar cor do texto
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
    
    return {
      backgroundColor: hexColor,
      color: textColor,
      border: `1px solid ${hexColor}`,
      boxShadow: `0 1px 3px rgba(0, 0, 0, 0.1)`
    };
  };

  /**
   * Filtra tags baseado no termo de pesquisa
   * @returns {Array} Lista de tags filtradas
   */
  const filtrarTags = () => {
    if (!searchTerm) return tags;
    
    return tags.filter(tag =>
      tag.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  /**
   * Filtra contatos para o popup de adição baseado no termo de busca
   * Exclui contatos que já possuem a tag selecionada
   * @returns {Contact[]} Lista de contatos filtrados
   */
  const getFilteredContactsForTag = (): Contact[] => {
    if (!selectedTagForContatos) return [];
    
    // Filtrar contatos baseado no termo de busca ou usar todos
    const baseContacts = contactSearchTerm.trim() 
      ? searchContacts(contactSearchTerm)
      : contacts;
    
    // Excluir contatos que já possuem a tag
    return baseContacts.filter(contact => 
      !contact.tags || !contact.tags.includes(selectedTagForContatos.id)
    );
  };

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
   * Obtém ícone do canal de comunicação com cores específicas
   * @param {string} canal - Canal de comunicação
   * @returns {JSX.Element} Ícone do canal com cor apropriada
   */
  const getChannelIcon = (canal: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (canal) {
      case 'whatsapp':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-green-500" />;
      case 'instagram':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-blue-600" />;
      case 'telegram':
        return <MessageCircle {...iconProps} className="h-4 w-4 text-blue-400" />;
      default:
        return <MessageCircle {...iconProps} className="h-4 w-4 text-gray-500" />;
    }
  };

  /**
   * Gerencia seleção/deseleção de contatos via checkbox
   * @param {string} contactId - ID do contato
   * @param {boolean} checked - Estado do checkbox
   */
  const handleContactSelection = (contactId: string, checked: boolean) => {
    if (checked) {
      setSelectedContactIds(prev => [...prev, contactId]);
    } else {
      setSelectedContactIds(prev => prev.filter(id => id !== contactId));
    }
  };

  /**
   * Salva as tags nos contatos selecionados
   * Adiciona a tag a todos os contatos marcados nos checkboxes
   */
  const handleSaveContactsToTag = () => {
    if (!selectedTagForContatos || selectedContactIds.length === 0) {
      alert('Selecione pelo menos um contato para adicionar à tag');
      return;
    }

    let addedCount = 0;
    
    // Adicionar tag a todos os contatos selecionados
    selectedContactIds.forEach(contactId => {
      const contact = contacts.find(c => c.id === contactId);
      if (contact) {
        const updatedContact = {
          ...contact,
          tags: [...(contact.tags || []), selectedTagForContatos.id],
          atualizadoEm: new Date()
        };
        updateContact(updatedContact);
        addedCount++;
      }
    });

    console.log(`Tag "${selectedTagForContatos.nome}" adicionada a ${addedCount} contato(s)`);
    
    // Fechar modal e limpar seleções
    handleCloseContatosDialog();
    
    // Mostrar feedback de sucesso
    alert(`Tag "${selectedTagForContatos.nome}" adicionada a ${addedCount} contato(s) com sucesso!`);
  };

  /**
   * Cria ou edita uma tag
   * Valida dados e atualiza estado global
   */
  const handleCriarTag = () => {
    if (!novaTag.nome.trim()) {
      alert('Por favor, insira um nome para a tag');
      return;
    }

    if (isEditMode && editingTag) {
      // Editar tag existente
      const tagAtualizada = {
        ...editingTag,
        nome: novaTag.nome.trim(),
        cor: novaTag.cor,
        atualizadoEm: new Date()
      };
      updateTag(tagAtualizada);
      console.log('Tag editada:', tagAtualizada);
    } else {
      // Criar nova tag
      const novaTagData = {
        nome: novaTag.nome.trim(),
        cor: novaTag.cor,
        descricao: `Tag criada para organização de contatos`,
        ativo: true
      };
      addTag(novaTagData);
      console.log('Nova tag criada:', novaTagData);
    }
    
    // Limpar estado e fechar modal
    handleCloseDialog();
  };

  /**
   * Prepara edição de tag existente
   * @param {Object} tag - Tag a ser editada
   */
  const handleEditarTag = (tag: any) => {
    setEditingTag(tag);
    setNovaTag({
      nome: tag.nome,
      cor: tag.cor
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  /**
   * Exclui uma tag do sistema
   * Remove a tag de todos os contatos associados antes da exclusão
   * @param {string} tagId - ID da tag a ser excluída
   */
  const handleExcluirTag = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    const contactCount = getContactCountForTag(tagId);
    
    if (!tag) return;

    // Confirmar exclusão
    const confirmMessage = contactCount > 0 
      ? `Tem certeza que deseja excluir a tag "${tag.nome}"? Ela será removida de ${contactCount} contato(s).`
      : `Tem certeza que deseja excluir a tag "${tag.nome}"?`;
    
    if (!confirm(confirmMessage)) return;

    // Remover tag de todos os contatos que a possuem
    if (contactCount > 0) {
      contacts.forEach(contact => {
        if (contact.tags && contact.tags.includes(tagId)) {
          const updatedContact = {
            ...contact,
            tags: contact.tags.filter(t => t !== tagId),
            atualizadoEm: new Date()
          };
          updateContact(updatedContact);
        }
      });
      console.log(`Tag removida de ${contactCount} contato(s)`);
    }

    // Remover a tag do sistema
    removeTag(tagId);
    console.log('Tag excluída:', tag.nome);
  };

  /**
   * Fecha o diálogo de criação/edição e limpa estados
   */
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingTag(null);
    setNovaTag({ nome: '', cor: '#3B82F6' });
  };

  /**
   * Abre modal para adicionar contatos à tag selecionada
   * @param {Object} tag - Tag para adicionar contatos
   */
  const handleAdicionarContatos = (tag: any) => {
    setSelectedTagForContatos(tag);
    setContactSearchTerm('');
    setSelectedContactIds([]);
    setIsContatosDialogOpen(true);
  };

  /**
   * Fecha modal de seleção de contatos
   */
  const handleCloseContatosDialog = () => {
    setIsContatosDialogOpen(false);
    setSelectedTagForContatos(null);
    setContactSearchTerm('');
    setSelectedContactIds([]);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-background">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-foreground">Tags</h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Gerencie etiquetas para organizar seus contatos
          </p>
        </div>
        
        {/* Modal de criação/edição de tag */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] mx-4 bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {isEditMode ? 'Editar Tag' : 'Criar Nova Tag'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Campo nome da tag */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-foreground">Nome da Tag</Label>
                <Input
                  id="nome"
                  value={novaTag.nome}
                  onChange={(e) => setNovaTag({...novaTag, nome: e.target.value})}
                  placeholder="Digite o nome da tag"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              {/* Seletor de cor da tag com preview aplicando estilos corretos */}
              <div className="space-y-2">
                <Label htmlFor="cor" className="text-foreground">Cor da Tag</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cor"
                    type="color"
                    value={novaTag.cor}
                    onChange={(e) => setNovaTag({...novaTag, cor: e.target.value})}
                    className="w-16 h-10 p-1 border-border rounded cursor-pointer"
                  />
                  <Badge 
                    style={getTagStyles(novaTag.cor)}
                    className="px-3 py-1 text-sm font-medium border-0"
                  >
                    {novaTag.nome || 'Preview'}
                  </Badge>
                </div>
              </div>
              
              {/* Botões de ação do modal */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleCloseDialog} 
                  className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
                >
                  Descartar
                </Button>
                <Button 
                  onClick={handleCriarTag} 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
                  disabled={!novaTag.nome.trim()}
                >
                  {isEditMode ? 'Salvar Alterações' : 'Salvar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de Pesquisa */}
      <div className="flex gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Pesquisar tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Tabela de Tags com cores aplicadas corretamente */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Tag className="h-5 w-5" />
            Tags Criadas ({filtrarTags().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-accent/50">
                  <TableHead className="text-muted-foreground">TAG</TableHead>
                  <TableHead className="text-center text-muted-foreground">QTD DE CONTATOS</TableHead>
                  <TableHead className="text-center text-muted-foreground">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrarTags().length > 0 ? (
                  filtrarTags().map((tag) => {
                    const contactCount = getContactCountForTag(tag.id);
                    return (
                      <TableRow key={tag.id} className="border-border hover:bg-accent/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {/* Badge da tag com cor personalizada aplicada corretamente */}
                            <Badge 
                              style={getTagStyles(tag.cor)}
                              className="px-3 py-1 text-sm font-medium border-0 shadow-sm"
                            >
                              {tag.nome}
                            </Badge>
                            {tag.descricao && (
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {tag.descricao}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-medium text-foreground">{contactCount}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {/* Ações para desktop */}
                            <div className="hidden sm:flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAdicionarContatos(tag)}
                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-950"
                                title="Adicionar contatos à tag"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditarTag(tag)}
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-950"
                                title="Editar tag"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleExcluirTag(tag.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                                title="Excluir tag"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Menu dropdown para mobile/tablet */}
                            <div className="sm:hidden">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-muted-foreground hover:bg-accent"
                                  >
                                    <EllipsisVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                                  <DropdownMenuItem 
                                    onClick={() => handleAdicionarContatos(tag)} 
                                    className="text-foreground hover:bg-accent"
                                  >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Adicionar contatos
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleEditarTag(tag)} 
                                    className="text-foreground hover:bg-accent"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar tag
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleExcluirTag(tag.id)} 
                                    className="text-foreground hover:bg-accent"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir tag
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Tag className="h-8 w-8 opacity-50" />
                        <p>Nenhuma tag encontrada</p>
                        {searchTerm && (
                          <p className="text-sm">Tente ajustar sua pesquisa</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal aprimorado para Adicionar Contatos à Tag com checkboxes */}
      <Dialog open={isContatosDialogOpen} onOpenChange={setIsContatosDialogOpen}>
        <DialogContent className="sm:max-w-[700px] mx-4 bg-card border-border max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-foreground flex items-center gap-2">
              Adicionar Contatos à Tag
              {selectedTagForContatos && (
                <Badge 
                  style={getTagStyles(selectedTagForContatos.cor)}
                  className="px-2 py-1 text-xs font-medium border-0 shadow-sm ml-2"
                >
                  {selectedTagForContatos.nome}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 space-y-4 py-4 overflow-hidden flex flex-col">
            {/* Campo de busca para contatos */}
            <div className="flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={contactSearchTerm}
                  onChange={(e) => setContactSearchTerm(e.target.value)}
                  placeholder="Buscar contatos para adicionar à tag..."
                  className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Lista de contatos com checkboxes - área scrollável */}
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {getFilteredContactsForTag().length > 0 ? (
                getFilteredContactsForTag().map((contact) => (
                  <Card 
                    key={contact.id} 
                    className="border-border hover:bg-accent/30 transition-colors"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        {/* Checkbox para seleção do contato */}
                        <div className="flex-shrink-0 pt-1">
                          <Checkbox
                            id={`contact-${contact.id}`}
                            checked={selectedContactIds.includes(contact.id)}
                            onCheckedChange={(checked) => 
                              handleContactSelection(contact.id, checked as boolean)
                            }
                            className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </div>

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
                            <label 
                              htmlFor={`contact-${contact.id}`}
                              className="font-medium text-foreground truncate cursor-pointer"
                            >
                              {contact.nome}
                            </label>
                            {/* Ícone do canal de comunicação */}
                            <div className="flex-shrink-0" title={`Canal: ${contact.canal}`}>
                              {getChannelIcon(contact.canal)}
                            </div>
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
                          {contact.tags && contact.tags.length > 0 && (
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
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Search className="h-8 w-8 opacity-50" />
                    <p>
                      {contactSearchTerm 
                        ? 'Nenhum contato encontrado' 
                        : 'Todos os contatos já possuem esta tag'
                      }
                    </p>
                    {contactSearchTerm && (
                      <p className="text-sm">Tente ajustar sua pesquisa</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Contador de seleções */}
            {selectedContactIds.length > 0 && (
              <div className="flex-shrink-0 text-sm text-muted-foreground text-center">
                {selectedContactIds.length} contato(s) selecionado(s)
              </div>
            )}

            {/* Botões de ação do modal */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                onClick={handleCloseContatosDialog} 
                className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveContactsToTag}
                disabled={selectedContactIds.length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                Salvar ({selectedContactIds.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tags;
