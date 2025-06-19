
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Tag, UserPlus } from "lucide-react";
import { EllipsisVertical } from "lucide-react";
import { useTags } from '@/hooks/useTags';
import { useContacts } from '@/hooks/useContacts';
import ContactSelector from '@/components/selectors/ContactSelector';
import { Contact } from '@/types/global';

/**
 * Componente principal de gestão de tags
 * Integrado com sistema de contatos para exibir quantidade real e gerenciar associações
 * Mantém responsividade e cores dinâmicas do sistema de marca
 */

const Tags = () => {
  // Estados para controle de diálogos e modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isContatosDialogOpen, setIsContatosDialogOpen] = useState(false);
  const [selectedTagForContatos, setSelectedTagForContatos] = useState<any>(null);
  
  // Estado para nova tag
  const [novaTag, setNovaTag] = useState({
    nome: '',
    cor: '#3B82F6'
  });

  // Hooks para gerenciamento de dados
  const { tags, addTag, updateTag, removeTag } = useTags();
  const { contacts, updateContact } = useContacts();

  /**
   * Calcula a quantidade de contatos associados a uma tag específica
   * @param {string} tagId - ID da tag para contar contatos
   * @returns {number} Quantidade de contatos com a tag
   */
  const getContactCountForTag = (tagId: string): number => {
    return contacts.filter(contact => contact.tags && contact.tags.includes(tagId)).length;
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
    setIsContatosDialogOpen(true);
  };

  /**
   * Fecha modal de seleção de contatos
   */
  const handleCloseContatosDialog = () => {
    setIsContatosDialogOpen(false);
    setSelectedTagForContatos(null);
  };

  /**
   * Adiciona tag a um contato específico
   * Verifica se o contato já possui a tag antes de adicionar
   * @param {Contact} contato - Contato selecionado para receber a tag
   */
  const handleSelecionarContato = (contato: Contact) => {
    if (!selectedTagForContatos) return;

    // Verificar se o contato já possui a tag
    const jaTemTag = contato.tags && contato.tags.includes(selectedTagForContatos.id);
    
    if (jaTemTag) {
      alert(`O contato ${contato.nome} já possui a tag "${selectedTagForContatos.nome}"`);
      return;
    }

    // Adicionar tag ao contato
    const contatoAtualizado = {
      ...contato,
      tags: [...(contato.tags || []), selectedTagForContatos.id],
      atualizadoEm: new Date()
    };
    
    updateContact(contatoAtualizado);
    console.log(`Tag "${selectedTagForContatos.nome}" adicionada ao contato "${contato.nome}"`);
    
    // Fechar modal após adicionar
    handleCloseContatosDialog();
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
              
              {/* Seletor de cor da tag */}
              <div className="space-y-2">
                <Label htmlFor="cor" className="text-foreground">Cor da Tag</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cor"
                    type="color"
                    value={novaTag.cor}
                    onChange={(e) => setNovaTag({...novaTag, cor: e.target.value})}
                    className="w-16 h-10 p-1 border-border rounded"
                  />
                  <Badge 
                    style={{ backgroundColor: novaTag.cor, color: 'white' }}
                    className="text-white"
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

      {/* Tabela de Tags com dados reais */}
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
                            <Badge 
                              style={{ backgroundColor: tag.cor, color: 'white' }}
                              className="text-white"
                            >
                              {tag.nome}
                            </Badge>
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

      {/* Modal para Adicionar Contatos à Tag */}
      <Dialog open={isContatosDialogOpen} onOpenChange={setIsContatosDialogOpen}>
        <DialogContent className="sm:max-w-[600px] mx-4 bg-card border-border max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Adicionar Contatos à Tag "{selectedTagForContatos?.nome}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-hidden">
            {/* Componente de seleção de contatos da gestão */}
            <div className="max-h-96 overflow-y-auto">
              <ContactSelector
                onSelectContact={handleSelecionarContato}
                placeholder="Buscar contatos para adicionar à tag..."
                showTags={true}
              />
            </div>
            
            {/* Botão para fechar modal */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button 
                variant="outline" 
                onClick={handleCloseContatosDialog} 
                className="border-border text-foreground hover:bg-accent"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tags;
