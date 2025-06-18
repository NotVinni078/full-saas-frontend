
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare,
  Calendar,
  MoreVertical,
  Filter,
  Download,
  Upload,
  Search
} from "lucide-react";

interface Contato {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  empresa?: string;
  cargo?: string;
  endereco?: string;
  tags: string[];
  status: 'ativo' | 'inativo' | 'bloqueado';
  ultimoContato: string;
  origem: 'manual' | 'whatsapp' | 'instagram' | 'site';
}

const GestaoContatos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContato, setEditingContato] = useState<Contato | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [novoContato, setNovoContato] = useState({
    nome: '',
    telefone: '',
    email: '',
    empresa: '',
    cargo: '',
    endereco: '',
    tags: [] as string[],
    status: 'ativo' as 'ativo' | 'inativo' | 'bloqueado'
  });

  // Mock data - contatos de exemplo
  const contatos: Contato[] = [
    {
      id: '1',
      nome: 'João Silva',
      telefone: '(11) 99999-1234',
      email: 'joao@email.com',
      empresa: 'Tech Corp',
      cargo: 'Desenvolvedor',
      endereco: 'São Paulo, SP',
      tags: ['Cliente VIP', 'Desenvolvedor'],
      status: 'ativo',
      ultimoContato: '2024-01-15',
      origem: 'whatsapp'
    },
    {
      id: '2',
      nome: 'Maria Santos',
      telefone: '(11) 88888-5678',
      email: 'maria@email.com',
      empresa: 'Design Studio',
      cargo: 'Designer',
      endereco: 'Rio de Janeiro, RJ',
      tags: ['Prospecto', 'Design'],
      status: 'ativo',
      ultimoContato: '2024-01-14',
      origem: 'instagram'
    },
    {
      id: '3',
      nome: 'Pedro Oliveira',
      telefone: '(11) 77777-9012',
      email: 'pedro@email.com',
      empresa: 'StartupXYZ',
      cargo: 'CEO',
      endereco: 'Belo Horizonte, MG',
      tags: ['Lead Qualificado'],
      status: 'inativo',
      ultimoContato: '2024-01-10',
      origem: 'site'
    }
  ];

  const filtrarContatos = () => {
    return contatos.filter(contato => {
      const matchesSearch = contato.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           contato.telefone.includes(searchTerm) ||
                           contato.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'todos' || contato.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const handleCriarContato = () => {
    if (isEditMode && editingContato) {
      console.log('Editar contato:', editingContato.id, novoContato);
    } else {
      console.log('Novo contato:', novoContato);
    }
    
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingContato(null);
    setNovoContato({
      nome: '',
      telefone: '',
      email: '',
      empresa: '',
      cargo: '',
      endereco: '',
      tags: [],
      status: 'ativo'
    });
  };

  const handleEditarContato = (contato: Contato) => {
    setEditingContato(contato);
    setNovoContato({
      nome: contato.nome,
      telefone: contato.telefone,
      email: contato.email,
      empresa: contato.empresa || '',
      cargo: contato.cargo || '',
      endereco: contato.endereco || '',
      tags: contato.tags,
      status: contato.status
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleExcluirContato = (contatoId: string) => {
    console.log('Excluir contato:', contatoId);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingContato(null);
    setNovoContato({
      nome: '',
      telefone: '',
      email: '',
      empresa: '',
      cargo: '',
      endereco: '',
      tags: [],
      status: 'ativo'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'inativo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'bloqueado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getOrigemIcon = (origem: string) => {
    switch (origem) {
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'instagram':
        return <div className="h-4 w-4 bg-pink-500 rounded" />;
      case 'site':
        return <MapPin className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 brand-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold brand-text-foreground">Gestão de Contatos</h1>
          <p className="brand-text-muted mt-1 text-sm lg:text-base">Gerencie todos os seus contatos e informações</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto brand-border brand-text-foreground brand-hover-accent">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" className="w-full sm:w-auto brand-border brand-text-foreground brand-hover-accent">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Novo Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto brand-card brand-border">
              <DialogHeader>
                <DialogTitle className="brand-text-foreground">{isEditMode ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome" className="brand-text-foreground">Nome *</Label>
                    <Input
                      id="nome"
                      value={novoContato.nome}
                      onChange={(e) => setNovoContato({...novoContato, nome: e.target.value})}
                      placeholder="Nome completo"
                      className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="brand-text-foreground">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={novoContato.telefone}
                      onChange={(e) => setNovoContato({...novoContato, telefone: e.target.value})}
                      placeholder="(11) 99999-9999"
                      className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="brand-text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={novoContato.email}
                    onChange={(e) => setNovoContato({...novoContato, email: e.target.value})}
                    placeholder="email@exemplo.com"
                    className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="empresa" className="brand-text-foreground">Empresa</Label>
                    <Input
                      id="empresa"
                      value={novoContato.empresa}
                      onChange={(e) => setNovoContato({...novoContato, empresa: e.target.value})}
                      placeholder="Nome da empresa"
                      className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cargo" className="brand-text-foreground">Cargo</Label>
                    <Input
                      id="cargo"
                      value={novoContato.cargo}
                      onChange={(e) => setNovoContato({...novoContato, cargo: e.target.value})}
                      placeholder="Cargo/Função"
                      className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endereco" className="brand-text-foreground">Endereço</Label>
                  <Textarea
                    id="endereco"
                    value={novoContato.endereco}
                    onChange={(e) => setNovoContato({...novoContato, endereco: e.target.value})}
                    placeholder="Endereço completo"
                    className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="brand-text-foreground">Status</Label>
                  <Select value={novoContato.status} onValueChange={(value: 'ativo' | 'inativo' | 'bloqueado') => setNovoContato({...novoContato, status: value})}>
                    <SelectTrigger className="brand-input brand-border brand-text-foreground">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent className="brand-card brand-border">
                      <SelectItem value="ativo" className="brand-text-foreground brand-hover-accent">Ativo</SelectItem>
                      <SelectItem value="inativo" className="brand-text-foreground brand-hover-accent">Inativo</SelectItem>
                      <SelectItem value="bloqueado" className="brand-text-foreground brand-hover-accent">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto brand-border brand-text-foreground brand-hover-accent">
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCriarContato} 
                    className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto"
                    disabled={!novoContato.nome.trim() || !novoContato.telefone.trim()}
                  >
                    {isEditMode ? 'Salvar Alterações' : 'Criar Contato'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 brand-text-muted" />
            <Input
              placeholder="Pesquisar contatos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 brand-input brand-border brand-text-foreground brand-placeholder-muted"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] brand-input brand-border brand-text-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="brand-card brand-border">
              <SelectItem value="todos" className="brand-text-foreground brand-hover-accent">Todos</SelectItem>
              <SelectItem value="ativo" className="brand-text-foreground brand-hover-accent">Ativo</SelectItem>
              <SelectItem value="inativo" className="brand-text-foreground brand-hover-accent">Inativo</SelectItem>
              <SelectItem value="bloqueado" className="brand-text-foreground brand-hover-accent">Bloqueado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" className="brand-border brand-text-foreground brand-hover-accent">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabela de Contatos */}
      <Card className="brand-card brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 brand-text-foreground">
            <Users className="h-5 w-5" />
            Contatos ({filtrarContatos().length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="brand-border-gray-200 hover:brand-hover-accent">
                  <TableHead className="brand-text-muted">CONTATO</TableHead>
                  <TableHead className="brand-text-muted">EMPRESA</TableHead>
                  <TableHead className="brand-text-muted">TAGS</TableHead>
                  <TableHead className="brand-text-muted">STATUS</TableHead>
                  <TableHead className="brand-text-muted">ORIGEM</TableHead>
                  <TableHead className="text-center brand-text-muted">AÇÕES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtrarContatos().length > 0 ? (
                  filtrarContatos().map((contato) => (
                    <TableRow key={contato.id} className="brand-border-gray-200 hover:brand-hover-accent">
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium brand-text-foreground">{contato.nome}</div>
                          <div className="flex items-center gap-3 text-sm brand-text-muted">
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contato.telefone}
                            </span>
                            {contato.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {contato.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium brand-text-foreground">{contato.empresa || '-'}</div>
                          {contato.cargo && (
                            <div className="text-sm brand-text-muted">{contato.cargo}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {contato.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs brand-secondary brand-text-foreground">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${getStatusColor(contato.status)}`}>
                          {contato.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getOrigemIcon(contato.origem)}
                          <span className="text-sm brand-text-muted capitalize">
                            {contato.origem}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 brand-text-muted brand-hover-accent">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 brand-card brand-border">
                              <DropdownMenuItem onClick={() => handleEditarContato(contato)} className="brand-text-foreground brand-hover-accent">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="brand-text-foreground brand-hover-accent">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Conversar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="brand-text-foreground brand-hover-accent">
                                <Calendar className="h-4 w-4 mr-2" />
                                Agendar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleExcluirContato(contato.id)} className="brand-text-error brand-hover-error">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 brand-text-muted">
                        <Users className="h-8 w-8 opacity-50" />
                        <p>Nenhum contato encontrado</p>
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
    </div>
  );
};

export default GestaoContatos;
