
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

interface TagInterface {
  id: string;
  nome: string;
  cor: string;
  quantidadeContatos: number;
}

interface Contato {
  id: string;
  nome: string;
  telefone: string;
  email: string;
}

const Tags = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingTag, setEditingTag] = useState<TagInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isContatosDialogOpen, setIsContatosDialogOpen] = useState(false);
  const [selectedTagForContatos, setSelectedTagForContatos] = useState<TagInterface | null>(null);
  const [novaTag, setNovaTag] = useState({
    nome: '',
    cor: '#3B82F6'
  });

  // Mock data - tags de exemplo
  const tags: TagInterface[] = [
    {
      id: '1',
      nome: 'Cliente VIP',
      cor: '#10B981',
      quantidadeContatos: 45
    },
    {
      id: '2',
      nome: 'Prospecto',
      cor: '#F59E0B',
      quantidadeContatos: 123
    },
    {
      id: '3',
      nome: 'Inadimplente',
      cor: '#EF4444',
      quantidadeContatos: 12
    },
    {
      id: '4',
      nome: 'Parceiro',
      cor: '#8B5CF6',
      quantidadeContatos: 28
    },
    {
      id: '5',
      nome: 'Ex-cliente',
      cor: '#6B7280',
      quantidadeContatos: 67
    },
    {
      id: '6',
      nome: 'Lead Qualificado',
      cor: '#06B6D4',
      quantidadeContatos: 89
    },
    {
      id: '7',
      nome: 'Fornecedor',
      cor: '#84CC16',
      quantidadeContatos: 15
    }
  ];

  // Mock data - contatos de exemplo
  const contatos: Contato[] = [
    { id: '1', nome: 'João Silva', telefone: '(11) 99999-1234', email: 'joao@email.com' },
    { id: '2', nome: 'Maria Santos', telefone: '(11) 88888-5678', email: 'maria@email.com' },
    { id: '3', nome: 'Pedro Oliveira', telefone: '(11) 77777-9012', email: 'pedro@email.com' },
    { id: '4', nome: 'Ana Costa', telefone: '(11) 66666-3456', email: 'ana@email.com' },
    { id: '5', nome: 'Carlos Rodrigues', telefone: '(11) 55555-7890', email: 'carlos@email.com' },
  ];

  const filtrarTags = () => {
    if (!searchTerm) return tags;
    
    return tags.filter(tag =>
      tag.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCriarTag = () => {
    if (isEditMode && editingTag) {
      console.log('Editar tag:', editingTag.id, novaTag);
    } else {
      console.log('Nova tag:', novaTag);
    }
    
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingTag(null);
    setNovaTag({ nome: '', cor: '#3B82F6' });
  };

  const handleEditarTag = (tag: TagInterface) => {
    setEditingTag(tag);
    setNovaTag({
      nome: tag.nome,
      cor: tag.cor
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleExcluirTag = (tagId: string) => {
    console.log('Excluir tag:', tagId);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingTag(null);
    setNovaTag({ nome: '', cor: '#3B82F6' });
  };

  const handleAdicionarContatos = (tag: TagInterface) => {
    setSelectedTagForContatos(tag);
    setIsContatosDialogOpen(true);
  };

  const handleCloseContatosDialog = () => {
    setIsContatosDialogOpen(false);
    setSelectedTagForContatos(null);
  };

  const handleSelecionarContato = (contatoId: string) => {
    console.log('Adicionar contato', contatoId, 'à tag', selectedTagForContatos?.id);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 brand-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold brand-text-foreground">Tags</h1>
          <p className="brand-text-muted mt-1 text-sm lg:text-base">Gerencie etiquetas para organizar seus contatos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] mx-4 brand-card brand-border">
            <DialogHeader>
              <DialogTitle className="brand-text-foreground">{isEditMode ? 'Editar Tag' : 'Criar Nova Tag'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="brand-text-foreground">Nome da Tag</Label>
                <Input
                  id="nome"
                  value={novaTag.nome}
                  onChange={(e) => setNovaTag({...novaTag, nome: e.target.value})}
                  placeholder="Digite o nome da tag"
                  className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cor" className="brand-text-foreground">Cor da Tag</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cor"
                    type="color"
                    value={novaTag.cor}
                    onChange={(e) => setNovaTag({...novaTag, cor: e.target.value})}
                    className="w-16 h-10 p-1 brand-border rounded"
                  />
                  <Badge 
                    style={{ backgroundColor: novaTag.cor, color: 'white' }}
                    className="text-white"
                  >
                    {novaTag.nome || 'Preview'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto brand-border brand-text-foreground brand-hover-accent">
                  Descartar
                </Button>
                <Button 
                  onClick={handleCriarTag} 
                  className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto"
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
            className="w-full brand-input brand-border brand-text-foreground brand-placeholder-muted"
          />
        </div>
      </div>

      {/* Tabela de Tags */}
      <Card className="brand-card brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 brand-text-foreground">
            <Tag className="h-5 w-5" />
            Tags Criadas ({filtrarTags().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="brand-border-gray-200 hover:brand-hover-accent">
                  <TableHead className="brand-text-muted">TAG</TableHead>
                  <TableHead className="text-center brand-text-muted">QTD DE CONTATOS</TableHead>
                  <TableHead className="text-center brand-text-muted">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrarTags().length > 0 ? (
                  filtrarTags().map((tag) => (
                    <TableRow key={tag.id} className="brand-border-gray-200 hover:brand-hover-accent">
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
                        <span className="font-medium brand-text-foreground">{tag.quantidadeContatos}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {/* Desktop actions */}
                          <div className="hidden sm:flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdicionarContatos(tag)}
                              className="h-8 w-8 p-0 brand-hover-success brand-text-success"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarTag(tag)}
                              className="h-8 w-8 p-0 brand-hover-info brand-text-info"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExcluirTag(tag.id)}
                              className="h-8 w-8 p-0 brand-hover-error brand-text-error"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Mobile dropdown */}
                          <div className="sm:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 brand-text-muted brand-hover-accent">
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 brand-card brand-border">
                                <DropdownMenuItem onClick={() => handleAdicionarContatos(tag)} className="brand-text-foreground brand-hover-accent">
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Adicionar contatos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditarTag(tag)} className="brand-text-foreground brand-hover-accent">
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar tag
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExcluirTag(tag.id)} className="brand-text-foreground brand-hover-accent">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir tag
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 brand-text-muted">
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

      {/* Dialog para Adicionar Contatos */}
      <Dialog open={isContatosDialogOpen} onOpenChange={setIsContatosDialogOpen}>
        <DialogContent className="sm:max-w-[600px] mx-4 brand-card brand-border">
          <DialogHeader>
            <DialogTitle className="brand-text-foreground">
              Adicionar Contatos à Tag "{selectedTagForContatos?.nome}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="max-h-96 overflow-y-auto brand-scrollbar">
              <Table>
                <TableHeader>
                  <TableRow className="brand-border-gray-200">
                    <TableHead className="brand-text-muted">NOME</TableHead>
                    <TableHead className="brand-text-muted">TELEFONE</TableHead>
                    <TableHead className="brand-text-muted">EMAIL</TableHead>
                    <TableHead className="text-center brand-text-muted">AÇÃO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contatos.map((contato) => (
                    <TableRow key={contato.id} className="brand-border-gray-200 hover:brand-hover-accent">
                      <TableCell className="font-medium brand-text-foreground">{contato.nome}</TableCell>
                      <TableCell className="brand-text-foreground">{contato.telefone}</TableCell>
                      <TableCell className="brand-text-foreground">{contato.email}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleSelecionarContato(contato.id)}
                          className="brand-success brand-hover-success brand-text-background"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end pt-4 brand-border-gray-200 border-t">
              <Button variant="outline" onClick={handleCloseContatosDialog} className="brand-border brand-text-foreground brand-hover-accent">
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
