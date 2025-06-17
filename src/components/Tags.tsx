
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Tag, UserPlus } from "lucide-react";

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
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Tags</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm lg:text-base">Gerencie etiquetas para organizar seus contatos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tag
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] mx-4">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar Tag' : 'Criar Nova Tag'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Tag</Label>
                <Input
                  id="nome"
                  value={novaTag.nome}
                  onChange={(e) => setNovaTag({...novaTag, nome: e.target.value})}
                  placeholder="Digite o nome da tag"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cor">Cor da Tag</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cor"
                    type="color"
                    value={novaTag.cor}
                    onChange={(e) => setNovaTag({...novaTag, cor: e.target.value})}
                    className="w-16 h-10 p-1 border rounded"
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
                <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                  Descartar
                </Button>
                <Button 
                  onClick={handleCriarTag} 
                  className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
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
            className="w-full"
          />
        </div>
      </div>

      {/* Tabela de Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags Criadas ({filtrarTags().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TAG</TableHead>
                  <TableHead className="text-center">QTD DE CONTATOS</TableHead>
                  <TableHead className="text-center">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrarTags().length > 0 ? (
                  filtrarTags().map((tag) => (
                    <TableRow key={tag.id} className="hover:bg-muted/50">
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
                        <span className="font-medium">{tag.quantidadeContatos}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAdicionarContatos(tag)}
                            className="h-8 w-8 p-0 hover:bg-green-100 hover:text-green-600"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditarTag(tag)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExcluirTag(tag.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
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

      {/* Dialog para Adicionar Contatos */}
      <Dialog open={isContatosDialogOpen} onOpenChange={setIsContatosDialogOpen}>
        <DialogContent className="sm:max-w-[600px] mx-4">
          <DialogHeader>
            <DialogTitle>
              Adicionar Contatos à Tag "{selectedTagForContatos?.nome}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOME</TableHead>
                    <TableHead>TELEFONE</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead className="text-center">AÇÃO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contatos.map((contato) => (
                    <TableRow key={contato.id}>
                      <TableCell className="font-medium">{contato.nome}</TableCell>
                      <TableCell>{contato.telefone}</TableCell>
                      <TableCell>{contato.email}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleSelecionarContato(contato.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
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
            
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={handleCloseContatosDialog}>
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
