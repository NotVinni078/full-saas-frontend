
import React, { useState, useMemo } from 'react';
import { Search, Plus, UserPen, Save, X, Upload, SquarePen, EllipsisVertical, Key, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useUsers } from '@/hooks/useUsers';
import { useSectors } from '@/hooks/useSectors';
import SectorSelector from '@/components/selectors/SectorSelector';
import { User } from '@/types/global';

/**
 * Componente principal de Gestão de Usuários
 * Gerencia criação, edição, exclusão e alteração de senhas dos usuários
 * Integra com setores e conexões do sistema
 * Utiliza cores dinâmicas da gestão de marca automaticamente
 * Totalmente responsivo para desktop, tablet e mobile
 */
const GestaoUsuarios = () => {
  const { toast } = useToast();
  
  // Estado para controle da busca de usuários
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para filtro por setor
  const [setorFilter, setSetorFilter] = useState('');
  
  // Estados para controle dos modais/dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Estado para usuário selecionado para edição/ações
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Estados para alteração de senha
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estado para criação de novo usuário
  const [newUser, setNewUser] = useState({
    nome: '',
    email: '',
    senha: '',
    setor: '',
    cargo: 'atendente' as 'atendente' | 'supervisor' | 'gerente',
    telefone: '',
    avatar: '',
    status: 'ativo' as 'ativo' | 'inativo',
    perfil: 'atendente' as 'atendente' | 'gerente'
  });

  // Hooks para acessar dados do contexto global
  const { users, addUser, updateUser, removeUser, searchUsers, getUserSetor } = useUsers();
  const { sectors, getActiveSectors } = useSectors();

  /**
   * Filtra usuários baseado no termo de busca e setor selecionado
   * Utiliza a função de busca do hook useUsers
   */
  const filteredUsers = useMemo(() => {
    let result = users;
    
    // Aplica filtro de busca se houver termo
    if (searchTerm.trim()) {
      result = searchUsers(searchTerm);
    }
    
    // Aplica filtro por setor se selecionado
    if (setorFilter && setorFilter !== 'todos') {
      result = result.filter(user => user.setor === setorFilter);
    }
    
    return result;
  }, [users, searchTerm, setorFilter, searchUsers]);

  // Contador total de usuários filtrados
  const totalUsers = filteredUsers.length;

  /**
   * Manipula a criação de um novo usuário
   * Valida os campos obrigatórios e adiciona o usuário ao contexto global
   */
  const handleSaveUser = () => {
    // Validação básica dos campos obrigatórios
    if (!newUser.nome.trim() || !newUser.email.trim() || !newUser.senha.trim() || !newUser.setor) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Adiciona o usuário usando o contexto global
      addUser({
        nome: newUser.nome,
        email: newUser.email,
        telefone: newUser.telefone || '',
        setor: newUser.setor,
        cargo: newUser.cargo,
        avatar: newUser.avatar || newUser.nome.substring(0, 2).toUpperCase(),
        status: newUser.status,
        perfil: newUser.perfil
      });

      // Limpa o formulário
      setNewUser({
        nome: '',
        email: '',
        senha: '',
        setor: '',
        cargo: 'atendente',
        telefone: '',
        avatar: '',
        status: 'ativo',
        perfil: 'atendente'
      });

      // Fecha o modal
      setIsAddDialogOpen(false);

      // Exibe mensagem de sucesso
      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  /**
   * Descarta as alterações do formulário de novo usuário
   */
  const handleDiscardUser = () => {
    setNewUser({
      nome: '',
      email: '',
      senha: '',
      setor: '',
      cargo: 'atendente',
      telefone: '',
      avatar: '',
      status: 'ativo',
      perfil: 'atendente'
    });
    setIsAddDialogOpen(false);
  };

  /**
   * Inicia o processo de edição de um usuário
   */
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  /**
   * Salva as alterações do usuário editado
   */
  const handleSaveEditUser = () => {
    if (!selectedUser) return;

    try {
      updateUser(selectedUser);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  /**
   * Descarta as alterações da edição do usuário
   */
  const handleDiscardEditUser = () => {
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  /**
   * Inicia o processo de alteração de senha
   */
  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setIsPasswordDialogOpen(true);
  };

  /**
   * Salva a nova senha do usuário
   */
  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive"
      });
      return;
    }

    // Aqui seria implementada a lógica de alteração de senha
    console.log('Alterando senha do usuário:', selectedUser?.nome);
    
    setIsPasswordDialogOpen(false);
    setSelectedUser(null);
    setNewPassword('');
    setConfirmPassword('');
    
    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso!",
      variant: "default"
    });
  };

  /**
   * Descarta a alteração de senha
   */
  const handleDiscardPassword = () => {
    setSelectedUser(null);
    setIsPasswordDialogOpen(false);
    setNewPassword('');
    setConfirmPassword('');
  };

  /**
   * Inicia o processo de exclusão de usuário
   */
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  /**
   * Confirma e executa a exclusão do usuário
   */
  const handleConfirmDelete = () => {
    if (!selectedUser) return;

    try {
      removeUser(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso!",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir usuário. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  /**
   * Cancela a exclusão do usuário
   */
  const handleCancelDelete = () => {
    setSelectedUser(null);
    setIsDeleteDialogOpen(false);
  };

  // Lista de cargos disponíveis para seleção
  const availableCargos = [
    { value: 'atendente', label: 'Atendente' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'gerente', label: 'Gestor' }
  ];

  return (
    <div className="p-3 sm:p-6 bg-background min-h-screen">
      {/* Cabeçalho da página com título e contador */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          Gestão de Usuários ({totalUsers})
        </h1>

        {/* Barra de pesquisa funcional para buscar usuários */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar usuário por nome ou email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-border bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Linha com filtro por setor e botão de adicionar usuário */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-6">
          {/* Filtro por setor usando o SectorSelector existente */}
          <div className="min-w-48">
            <SectorSelector
              value={setorFilter}
              onValueChange={setSetorFilter}
              placeholder="Filtrar por Setor"
              showColors={false}
            />
          </div>

          {/* Botão para abrir modal de criação de usuário */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            
            {/* Modal de criação de usuário */}
            <DialogContent className="sm:max-w-md bg-background border-border max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-foreground">Novo Usuário</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Seção de upload da foto do perfil */}
                <div>
                  <label className="text-sm font-medium text-foreground">Foto do Perfil</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      {newUser.avatar ? (
                        <img src={newUser.avatar} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-border">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Campo nome do usuário */}
                <div>
                  <label className="text-sm font-medium text-foreground">Nome</label>
                  <Input
                    value={newUser.nome}
                    onChange={(e) => setNewUser({...newUser, nome: e.target.value})}
                    placeholder="Nome usado para identificação e Assinatura de Mensagens"
                    className="border-border bg-background text-foreground"
                  />
                </div>

                {/* Campo login (email) */}
                <div>
                  <label className="text-sm font-medium text-foreground">Login (Email)</label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="email@empresa.com"
                    className="border-border bg-background text-foreground"
                  />
                </div>

                {/* Campo senha */}
                <div>
                  <label className="text-sm font-medium text-foreground">Senha</label>
                  <Input
                    type="password"
                    value={newUser.senha}
                    onChange={(e) => setNewUser({...newUser, senha: e.target.value})}
                    placeholder="Senha do usuário"
                    className="border-border bg-background text-foreground"
                  />
                </div>

                {/* Seletor de setor */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Setor</label>
                  <SectorSelector
                    value={newUser.setor}
                    onValueChange={(value) => setNewUser({...newUser, setor: value})}
                    placeholder="Selecionar setor"
                    showColors={true}
                  />
                </div>

                {/* Campo telefone */}
                <div>
                  <label className="text-sm font-medium text-foreground">Telefone</label>
                  <Input
                    value={newUser.telefone}
                    onChange={(e) => setNewUser({...newUser, telefone: e.target.value})}
                    placeholder="(11) 99999-9999"
                    className="border-border bg-background text-foreground"
                  />
                </div>

                {/* Seletor de cargo */}
                <div>
                  <label className="text-sm font-medium text-foreground">Cargo</label>
                  <select
                    value={newUser.cargo}
                    onChange={(e) => setNewUser({...newUser, cargo: e.target.value as any})}
                    className="w-full h-9 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                  >
                    {availableCargos.map((cargo) => (
                      <option key={cargo.value} value={cargo.value}>
                        {cargo.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botões de ação do modal */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDiscardUser}
                    className="border-border"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Descartar
                  </Button>
                  <Button
                    onClick={handleSaveUser}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
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

      {/* Área de listagem dos usuários */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const userSetor = getUserSetor(user);
            return (
              <Card key={user.id} className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-4">
                  {/* Layout responsivo para desktop */}
                  <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                    {/* Foto do usuário */}
                    <div className="col-span-1">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        {user.avatar && user.avatar.startsWith('http') ? (
                          <img src={user.avatar} alt={user.nome} className="w-10 h-10 object-cover" />
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">
                            {user.avatar || user.nome.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Nome do usuário */}
                    <div className="col-span-2">
                      <h3 className="font-medium text-foreground">{user.nome}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    {/* Setor do usuário */}
                    <div className="col-span-2">
                      {userSetor ? (
                        <Badge className={userSetor.cor}>
                          {userSetor.nome}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem setor</span>
                      )}
                    </div>

                    {/* Cargo do usuário */}
                    <div className="col-span-2">
                      <Badge variant="outline" className="border-border">
                        {user.cargo || 'Não definido'}
                      </Badge>
                    </div>

                    {/* Status do usuário */}
                    <div className="col-span-2">
                      <Badge variant={user.status === 'ativo' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                    </div>

                    {/* Ações do usuário */}
                    <div className="col-span-3 flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="bg-background border-border shadow-lg z-50"
                        >
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <UserPen className="h-4 w-4 mr-2" />
                            Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                            <Key className="h-4 w-4 mr-2" />
                            Alterar Senha
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Layout responsivo para tablet e mobile */}
                  <div className="md:hidden space-y-3">
                    {/* Cabeçalho com foto e nome */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.avatar && user.avatar.startsWith('http') ? (
                          <img src={user.avatar} alt={user.nome} className="w-12 h-12 object-cover" />
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">
                            {user.avatar || user.nome.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{user.nome}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      {/* Menu de ações para mobile */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="bg-background border-border shadow-lg z-50"
                        >
                          <DropdownMenuItem onClick={() => handleEditUser(user)}>
                            <UserPen className="h-4 w-4 mr-2" />
                            Editar Usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangePassword(user)}>
                            <Key className="h-4 w-4 mr-2" />
                            Alterar Senha
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteUser(user)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {/* Informações organizadas em mobile */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Setor</span>
                        <div className="mt-1">
                          {userSetor ? (
                            <Badge className={userSetor.cor}>
                              {userSetor.nome}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">Sem setor</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Cargo</span>
                        <div className="mt-1">
                          <Badge variant="outline" className="border-border">
                            {user.cargo || 'Não definido'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Status</span>
                        <div className="mt-1">
                          <Badge variant={user.status === 'ativo' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          /* Mensagem quando não há usuários */
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchTerm || setorFilter ? 
                  'Nenhum usuário encontrado com os filtros aplicados.' : 
                  'Nenhum usuário cadastrado ainda.'
                }
              </p>
              {!searchTerm && !setorFilter && (
                <p className="text-sm text-muted-foreground mt-2">
                  Clique em "Novo Usuário" para começar.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de Editar Usuário */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Usuário</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {/* Campos similares ao modal de criação */}
              <div>
                <label className="text-sm font-medium text-foreground">Foto do Perfil</label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {selectedUser.avatar && selectedUser.avatar.startsWith('http') ? (
                      <img src={selectedUser.avatar} alt="Preview" className="w-16 h-16 object-cover" />
                    ) : (
                      <span className="text-lg font-medium text-muted-foreground">
                        {selectedUser.avatar || selectedUser.nome.charAt(0)}
                      </span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="border-border">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Nome</label>
                <Input
                  value={selectedUser.nome}
                  onChange={(e) => setSelectedUser({...selectedUser, nome: e.target.value})}
                  placeholder="Nome usado para identificação e Assinatura de Mensagens"
                  className="border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Login (Email)</label>
                <Input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  placeholder="email@empresa.com"
                  className="border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Telefone</label>
                <Input
                  value={selectedUser.telefone}
                  onChange={(e) => setSelectedUser({...selectedUser, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                  className="border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Setor</label>
                <SectorSelector
                  value={selectedUser.setor}
                  onValueChange={(value) => setSelectedUser({...selectedUser, setor: value})}
                  placeholder="Selecionar setor"
                  showColors={true}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Cargo</label>
                <select
                  value={selectedUser.cargo}
                  onChange={(e) => setSelectedUser({...selectedUser, cargo: e.target.value})}
                  className="w-full h-9 px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground"
                >
                  {availableCargos.map((cargo) => (
                    <option key={cargo.value} value={cargo.value}>
                      {cargo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleDiscardEditUser}
                  className="border-border"
                >
                  <X className="h-4 w-4 mr-2" />
                  Descartar
                </Button>
                <Button
                  onClick={handleSaveEditUser}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de Alterar Senha */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Alterar Senha - {selectedUser?.nome}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Nova Senha</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha"
                className="border-border bg-background text-foreground"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Confirmar Nova Senha</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme a nova senha"
                className="border-border bg-background text-foreground"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleDiscardPassword}
                className="border-border"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                onClick={handleSavePassword}
                disabled={!newPassword || newPassword !== confirmPassword}
                className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmar Exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-foreground">
              Tem certeza que deseja excluir o usuário <strong>{selectedUser?.nome}</strong>?
            </p>
            <p className="text-sm text-muted-foreground">
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                className="border-border"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmDelete}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestaoUsuarios;
