
import React, { useState, useMemo } from 'react';
import { Search, Plus, UserPen, Save, X, Upload, SquarePen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface User {
  id: number;
  name: string;
  setores: string[];
  cargos: string[];
  canais: string[];
  photo?: string;
}

const GestaoUsuarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [setorFilter, setSetorFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    setores: [] as string[],
    cargos: [] as string[],
    canais: [] as string[],
    photo: ''
  });

  // Mock data para demonstração
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'Ana Silva',
      setores: ['Vendas'],
      cargos: ['Gestor'],
      canais: ['WhatsApp', 'Email'],
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b093?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      setores: ['Suporte', 'Vendas'],
      cargos: ['Atendente'],
      canais: ['WhatsApp', 'Telegram', 'Email'],
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Maria Costa',
      setores: ['Marketing'],
      cargos: ['Supervisor'],
      canais: ['Email', 'WhatsApp'],
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  // Filtrar usuários baseado na pesquisa e filtro de setor
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSetor = setorFilter === '' || setorFilter === 'todos' || user.setores.includes(setorFilter);
      return matchesSearch && matchesSetor;
    });
  }, [users, searchTerm, setorFilter]);

  const totalUsers = filteredUsers.length;

  const handleSaveUser = () => {
    console.log('Salvando usuário:', newUser);
    setIsAddDialogOpen(false);
    setNewUser({
      name: '',
      setores: [],
      cargos: [],
      canais: [],
      photo: ''
    });
  };

  const handleDiscardUser = () => {
    setNewUser({
      name: '',
      setores: [],
      cargos: [],
      canais: [],
      photo: ''
    });
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditUser = () => {
    console.log('Salvando edição do usuário:', selectedUser);
    setIsEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleDiscardEditUser = () => {
    setSelectedUser(null);
    setIsEditDialogOpen(false);
  };

  const availableSetores = ['Vendas', 'Suporte', 'Marketing', 'Financeiro', 'RH'];
  const availableCargos = ['Atendente', 'Supervisor', 'Gestor'];
  const availableCanais = ['WhatsApp', 'Telegram', 'Email', 'Chat'];

  const toggleSelection = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <TooltipProvider>
      <div className="p-3 sm:p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
            Gestão de Usuários ({totalUsers})
          </h1>

          {/* Barra de pesquisa */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar usuário"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300"
            />
          </div>

          {/* Filtros e botão adicionar */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center mb-6">
            <div className="min-w-48">
              <Select value={setorFilter} onValueChange={setSetorFilter}>
                <SelectTrigger className="border-gray-300 bg-white">
                  <SelectValue placeholder="Filtrar por Setor" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  <SelectItem value="todos">Todos os Setores</SelectItem>
                  {availableSetores.map((setor) => (
                    <SelectItem key={setor} value={setor}>
                      {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Adicionar Usuário</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Foto do perfil */}
                  <div>
                    <label className="text-sm font-medium">Foto do Perfil</label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        {newUser.photo ? (
                          <img src={newUser.photo} alt="Preview" className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                          <Upload className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-300">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      placeholder="Nome do usuário"
                      className="border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Setores</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSetores.map((setor) => (
                        <Button
                          key={setor}
                          variant={newUser.setores.includes(setor) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSelection(newUser.setores, setor, (setores) => setNewUser({...newUser, setores}))}
                          className={newUser.setores.includes(setor) ? "bg-black text-white" : "border-gray-300"}
                        >
                          {setor}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Cargos</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableCargos.map((cargo) => (
                        <Button
                          key={cargo}
                          variant={newUser.cargos.includes(cargo) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSelection(newUser.cargos, cargo, (cargos) => setNewUser({...newUser, cargos}))}
                          className={newUser.cargos.includes(cargo) ? "bg-black text-white" : "border-gray-300"}
                        >
                          {cargo}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Canais</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableCanais.map((canal) => (
                        <Button
                          key={canal}
                          variant={newUser.canais.includes(canal) ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSelection(newUser.canais, canal, (canais) => setNewUser({...newUser, canais}))}
                          className={newUser.canais.includes(canal) ? "bg-black text-white" : "border-gray-300"}
                        >
                          {canal}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleDiscardUser}
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Descartar
                    </Button>
                    <Button
                      onClick={handleSaveUser}
                      className="bg-black text-white hover:bg-gray-800"
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

        {/* Tabela responsiva */}
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela - escondido em mobile */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700 min-w-[800px]">
            <div className="col-span-1"></div>
            <div className="col-span-3">Nome</div>
            <div className="col-span-2">Setores</div>
            <div className="col-span-2">Cargos</div>
            <div className="col-span-2">Canais</div>
            <div className="col-span-2 text-center">Ações</div>
          </div>

          {/* Lista de usuários */}
          <div className="space-y-4 md:space-y-0">
            {filteredUsers.map((user, index) => (
              <div key={user.id}>
                {/* Layout mobile */}
                <div className="md:hidden p-4 bg-white border border-gray-200 rounded-lg space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-12 h-12 object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{user.name}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Setores</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {user.setores.map((setor, setorIndex) => (
                          <span key={setorIndex} className="px-2 py-1 bg-blue-100 text-xs rounded-full border border-blue-200">
                            {setor}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Cargos</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {user.cargos.map((cargo, cargoIndex) => (
                          <span key={cargoIndex} className="px-2 py-1 bg-green-100 text-xs rounded-full border border-green-200">
                            {cargo}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Canais</span>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {user.canais.map((canal, canalIndex) => (
                          <span key={canalIndex} className="px-2 py-1 bg-gray-100 text-xs rounded-full border border-gray-200">
                            {canal}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditUser(user)}>
                          <UserPen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Usuário</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Permissões</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Layout desktop */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 transition-colors min-w-[800px]">
                  <div className="col-span-1">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      {user.photo ? (
                        <img src={user.photo} alt={user.name} className="w-10 h-10 object-cover" />
                      ) : (
                        <span className="text-sm font-medium text-gray-600">
                          {user.name.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <h3 className="font-medium text-black">{user.name}</h3>
                  </div>

                  <div className="col-span-2">
                    <div className="flex gap-1 flex-wrap">
                      {user.setores.map((setor, setorIndex) => (
                        <span key={setorIndex} className="px-2 py-1 bg-blue-100 text-xs rounded-full border border-blue-200">
                          {setor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex gap-1 flex-wrap">
                      {user.cargos.map((cargo, cargoIndex) => (
                        <span key={cargoIndex} className="px-2 py-1 bg-green-100 text-xs rounded-full border border-green-200">
                          {cargo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex gap-1 flex-wrap">
                      {user.canais.map((canal, canalIndex) => (
                        <span key={canalIndex} className="px-2 py-1 bg-gray-100 text-xs rounded-full border border-gray-200">
                          {canal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditUser(user)}>
                          <UserPen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Usuário</p></TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <SquarePen className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Permissões</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Linha divisória */}
                {index < filteredUsers.length - 1 && (
                  <div className="hidden md:block border-b border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dialog de Editar Usuário */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                {/* Foto do perfil */}
                <div>
                  <label className="text-sm font-medium">Foto do Perfil</label>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedUser.photo ? (
                        <img src={selectedUser.photo} alt="Preview" className="w-16 h-16 object-cover" />
                      ) : (
                        <Upload className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Nome</label>
                  <Input
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                    placeholder="Nome do usuário"
                    className="border-gray-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Setores</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableSetores.map((setor) => (
                      <Button
                        key={setor}
                        variant={selectedUser.setores.includes(setor) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSelection(selectedUser.setores, setor, (setores) => setSelectedUser({...selectedUser, setores}))}
                        className={selectedUser.setores.includes(setor) ? "bg-black text-white" : "border-gray-300"}
                      >
                        {setor}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Cargos</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableCargos.map((cargo) => (
                      <Button
                        key={cargo}
                        variant={selectedUser.cargos.includes(cargo) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSelection(selectedUser.cargos, cargo, (cargos) => setSelectedUser({...selectedUser, cargos}))}
                        className={selectedUser.cargos.includes(cargo) ? "bg-black text-white" : "border-gray-300"}
                      >
                        {cargo}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Canais</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableCanais.map((canal) => (
                      <Button
                        key={canal}
                        variant={selectedUser.canais.includes(canal) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleSelection(selectedUser.canais, canal, (canais) => setSelectedUser({...selectedUser, canais}))}
                        className={selectedUser.canais.includes(canal) ? "bg-black text-white" : "border-gray-300"}
                      >
                        {canal}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDiscardEditUser}
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Descartar
                  </Button>
                  <Button
                    onClick={handleSaveEditUser}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default GestaoUsuarios;
