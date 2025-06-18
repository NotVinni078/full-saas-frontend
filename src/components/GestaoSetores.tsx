
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Building2, UserPlus } from "lucide-react";
import { EllipsisVertical } from "lucide-react";

interface SetorInterface {
  id: string;
  nome: string;
  quantidadeUsuarios: number;
  cor: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
}

const GestaoSetores = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSetor, setEditingSetor] = useState<SetorInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUsuariosDialogOpen, setIsUsuariosDialogOpen] = useState(false);
  const [selectedSetorForUsuarios, setSelectedSetorForUsuarios] = useState<SetorInterface | null>(null);
  const [novoSetor, setNovoSetor] = useState({
    nome: '',
    cor: '#3B82F6'
  });

  // Mock data - setores de exemplo
  const setores: SetorInterface[] = [
    {
      id: '1',
      nome: 'Vendas',
      quantidadeUsuarios: 12,
      cor: '#10B981'
    },
    {
      id: '2',
      nome: 'Suporte',
      quantidadeUsuarios: 8,
      cor: '#F59E0B'
    },
    {
      id: '3',
      nome: 'Financeiro',
      quantidadeUsuarios: 5,
      cor: '#EF4444'
    },
    {
      id: '4',
      nome: 'Marketing',
      quantidadeUsuarios: 6,
      cor: '#8B5CF6'
    },
    {
      id: '5',
      nome: 'RH',
      quantidadeUsuarios: 3,
      cor: '#06B6D4'
    },
    {
      id: '6',
      nome: 'TI',
      quantidadeUsuarios: 4,
      cor: '#84CC16'
    }
  ];

  // Mock data - usuários de exemplo
  const usuarios: Usuario[] = [
    { id: '1', nome: 'João Silva', email: 'joao@empresa.com', cargo: 'Analista' },
    { id: '2', nome: 'Maria Santos', email: 'maria@empresa.com', cargo: 'Supervisor' },
    { id: '3', nome: 'Pedro Oliveira', email: 'pedro@empresa.com', cargo: 'Gerente' },
    { id: '4', nome: 'Ana Costa', email: 'ana@empresa.com', cargo: 'Coordenador' },
    { id: '5', nome: 'Carlos Rodrigues', email: 'carlos@empresa.com', cargo: 'Atendente' },
  ];

  const filtrarSetores = () => {
    if (!searchTerm) return setores;
    
    return setores.filter(setor =>
      setor.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCriarSetor = () => {
    if (isEditMode && editingSetor) {
      console.log('Editar setor:', editingSetor.id, novoSetor);
    } else {
      console.log('Novo setor:', novoSetor);
    }
    
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingSetor(null);
    setNovoSetor({ nome: '', cor: '#3B82F6' });
  };

  const handleEditarSetor = (setor: SetorInterface) => {
    setEditingSetor(setor);
    setNovoSetor({
      nome: setor.nome,
      cor: setor.cor
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleExcluirSetor = (setorId: string) => {
    console.log('Excluir setor:', setorId);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingSetor(null);
    setNovoSetor({ nome: '', cor: '#3B82F6' });
  };

  const handleAdicionarUsuarios = (setor: SetorInterface) => {
    setSelectedSetorForUsuarios(setor);
    setIsUsuariosDialogOpen(true);
  };

  const handleCloseUsuariosDialog = () => {
    setIsUsuariosDialogOpen(false);
    setSelectedSetorForUsuarios(null);
  };

  const handleSelecionarUsuario = (usuarioId: string) => {
    console.log('Adicionar usuário', usuarioId, 'ao setor', selectedSetorForUsuarios?.id);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold brand-text-foreground">Gestão de Setores</h1>
          <p className="brand-text-muted mt-1 text-sm lg:text-base">Gerencie os setores e departamentos da empresa</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Novo Setor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] mx-4">
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Editar Setor' : 'Criar Novo Setor'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Setor</Label>
                <Input
                  id="nome"
                  value={novoSetor.nome}
                  onChange={(e) => setNovoSetor({...novoSetor, nome: e.target.value})}
                  placeholder="Digite o nome do setor"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cor">Cor do Setor</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="cor"
                    type="color"
                    value={novoSetor.cor}
                    onChange={(e) => setNovoSetor({...novoSetor, cor: e.target.value})}
                    className="w-16 h-10 p-1 brand-border rounded"
                  />
                  <Badge 
                    style={{ backgroundColor: novoSetor.cor, color: 'white' }}
                    className="brand-text-background"
                  >
                    {novoSetor.nome || 'Preview'}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                  Descartar
                </Button>
                <Button 
                  onClick={handleCriarSetor} 
                  className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto"
                  disabled={!novoSetor.nome.trim()}
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
            placeholder="Pesquisar setores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Tabela de Setores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Setores Criados ({filtrarSetores().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SETOR</TableHead>
                  <TableHead className="text-center">QTD DE USUÁRIOS</TableHead>
                  <TableHead className="text-center">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrarSetores().length > 0 ? (
                  filtrarSetores().map((setor) => (
                    <TableRow key={setor.id} className="brand-hover-muted">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Badge 
                            style={{ backgroundColor: setor.cor, color: 'white' }}
                            className="brand-text-background"
                          >
                            {setor.nome}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{setor.quantidadeUsuarios}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {/* Desktop actions */}
                          <div className="hidden sm:flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAdicionarUsuarios(setor)}
                              className="h-8 w-8 p-0 brand-hover-accent"
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditarSetor(setor)}
                              className="h-8 w-8 p-0 brand-hover-accent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExcluirSetor(setor.id)}
                              className="h-8 w-8 p-0 brand-hover-error brand-text-error"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Mobile dropdown */}
                          <div className="sm:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <EllipsisVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleAdicionarUsuarios(setor)}>
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Adicionar usuários
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditarSetor(setor)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar setor
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleExcluirSetor(setor.id)}>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir setor
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
                        <Building2 className="h-8 w-8 opacity-50" />
                        <p>Nenhum setor encontrado</p>
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

      {/* Dialog para Adicionar Usuários */}
      <Dialog open={isUsuariosDialogOpen} onOpenChange={setIsUsuariosDialogOpen}>
        <DialogContent className="sm:max-w-[600px] mx-4">
          <DialogHeader>
            <DialogTitle>
              Adicionar Usuários ao Setor "{selectedSetorForUsuarios?.nome}"
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NOME</TableHead>
                    <TableHead>EMAIL</TableHead>
                    <TableHead>CARGO</TableHead>
                    <TableHead className="text-center">AÇÃO</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell className="font-medium">{usuario.nome}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell>{usuario.cargo}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          onClick={() => handleSelecionarUsuario(usuario.id)}
                          className="brand-primary brand-hover-primary brand-text-background"
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
              <Button variant="outline" onClick={handleCloseUsuariosDialog}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoSetores;
