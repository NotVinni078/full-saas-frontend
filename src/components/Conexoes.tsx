
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, RotateCcw, Unplug, Trash2, Link, QrCode } from "lucide-react";
import { EllipsisVertical } from "lucide-react";

interface Conexao {
  id: string;
  nome: string;
  canal: string;
  status: 'conectado' | 'desconectado' | 'erro';
  setores: string[];
  configuracao?: any;
}

interface Setor {
  id: string;
  nome: string;
}

const Conexoes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [novaConexao, setNovaConexao] = useState({
    nome: '',
    canal: '',
    setoresSelecionados: [] as string[]
  });

  // Mock data - setores disponíveis
  const setores: Setor[] = [
    { id: '1', nome: 'Vendas' },
    { id: '2', nome: 'Suporte' },
    { id: '3', nome: 'Marketing' },
    { id: '4', nome: 'Financeiro' },
    { id: '5', nome: 'RH' }
  ];

  // Mock data - conexões existentes
  const conexoes: Conexao[] = [
    {
      id: '1',
      nome: 'WhatsApp Principal',
      canal: 'WhatsApp Web',
      status: 'conectado',
      setores: ['Vendas', 'Suporte']
    },
    {
      id: '2',
      nome: 'Instagram Empresarial',
      canal: 'Instagram',
      status: 'conectado',
      setores: ['Marketing']
    },
    {
      id: '3',
      nome: 'Facebook Business',
      canal: 'Facebook',
      status: 'desconectado',
      setores: ['Marketing', 'Vendas']
    }
  ];

  const canais = [
    'WhatsApp Web',
    'WhatsApp Meta',
    'Instagram',
    'Facebook',
    'Telegram',
    'WebChat'
  ];

  const filtrarConexoes = () => {
    if (!searchTerm) return conexoes;
    return conexoes.filter(conexao =>
      conexao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conexao.canal.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleCriarConexao = () => {
    console.log('Nova conexão:', novaConexao);
    setIsDialogOpen(false);
    setNovaConexao({ nome: '', canal: '', setoresSelecionados: [] });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setNovaConexao({ nome: '', canal: '', setoresSelecionados: [] });
  };

  const handleToggleSetor = (setorId: string) => {
    setNovaConexao(prev => ({
      ...prev,
      setoresSelecionados: prev.setoresSelecionados.includes(setorId)
        ? prev.setoresSelecionados.filter(id => id !== setorId)
        : [...prev.setoresSelecionados, setorId]
    }));
  };

  const getLogoUrl = (canal: string) => {
    const logos: { [key: string]: string } = {
      'WhatsApp Web': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      'WhatsApp Meta': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      'Instagram': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
      'Facebook': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
      'Telegram': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      'WebChat': 'https://cdn-icons-png.flaticon.com/512/1087/1087815.png'
    };
    return logos[canal] || '';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conectado': return 'bg-green-500';
      case 'desconectado': return 'bg-gray-500';
      case 'erro': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderCanalConfig = () => {
    switch (novaConexao.canal) {
      case 'WhatsApp Web':
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <QrCode className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Escaneie o QR Code com seu WhatsApp
              </p>
              <div className="mt-4 w-48 h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xs text-gray-500">QR Code simulado</span>
              </div>
            </div>
          </div>
        );

      case 'WhatsApp Meta':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Requisitos WhatsApp Meta API:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Conta Business do Facebook verificada</li>
                <li>• WhatsApp Business Account aprovado</li>
                <li>• Número de telefone verificado</li>
                <li>• Token de acesso da Meta</li>
                <li>• Webhook configurado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Token de Acesso</Label>
              <Input placeholder="Digite seu token de acesso da Meta" type="password" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number ID</Label>
              <Input placeholder="ID do número de telefone" />
            </div>
          </div>
        );

      case 'Instagram':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Requisitos Instagram Business:</h4>
              <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <li>• Conta Business do Instagram</li>
                <li>• Página do Facebook vinculada</li>
                <li>• Token de acesso do Instagram</li>
                <li>• Webhook configurado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Token de Acesso Instagram</Label>
              <Input placeholder="Digite seu token de acesso do Instagram" type="password" />
            </div>
          </div>
        );

      case 'Facebook':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Requisitos Facebook Messenger:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Página do Facebook Business</li>
                <li>• App do Facebook configurado</li>
                <li>• Token de acesso da página</li>
                <li>• Webhook verificado</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Token da Página</Label>
              <Input placeholder="Token de acesso da página do Facebook" type="password" />
            </div>
          </div>
        );

      case 'Telegram':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Requisitos Telegram Bot:</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Bot criado via @BotFather</li>
                <li>• Token do bot do Telegram</li>
                <li>• Webhook configurado (opcional)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Token do Bot</Label>
              <Input placeholder="Token fornecido pelo BotFather" type="password" />
            </div>
          </div>
        );

      case 'WebChat':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Configuração WebChat:</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Widget será gerado automaticamente</li>
                <li>• Código para incorporar no site</li>
                <li>• Personalização de cores e textos</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Label>Cor Principal</Label>
              <Input type="color" defaultValue="#3B82F6" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">Conexões</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm lg:text-base">Gerencie suas conexões com diferentes canais</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conexão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Conexão</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Conexão</Label>
                <Input
                  id="nome"
                  value={novaConexao.nome}
                  onChange={(e) => setNovaConexao({...novaConexao, nome: e.target.value})}
                  placeholder="Digite o nome da conexão"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Canal</Label>
                <Select onValueChange={(value) => setNovaConexao({...novaConexao, canal: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o canal" />
                  </SelectTrigger>
                  <SelectContent>
                    {canais.map((canal) => (
                      <SelectItem key={canal} value={canal}>{canal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {novaConexao.canal && renderCanalConfig()}

              <div className="space-y-2">
                <Label>Setores com Acesso</Label>
                <div className="grid grid-cols-2 gap-2">
                  {setores.map((setor) => (
                    <div key={setor.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={setor.id}
                        checked={novaConexao.setoresSelecionados.includes(setor.id)}
                        onChange={() => handleToggleSetor(setor.id)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={setor.id} className="text-sm font-medium">
                        {setor.nome}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                  Descartar
                </Button>
                <Button 
                  onClick={handleCriarConexao} 
                  className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto"
                  disabled={!novaConexao.nome.trim() || !novaConexao.canal}
                >
                  Salvar
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
            placeholder="Pesquisar conexões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Cards de Conexões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtrarConexoes().length > 0 ? (
          filtrarConexoes().map((conexao) => (
            <Card key={conexao.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={getLogoUrl(conexao.canal)} 
                      alt={conexao.canal}
                      className="w-8 h-8 object-contain"
                    />
                    <div>
                      <CardTitle className="text-base font-medium">{conexao.nome}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{conexao.canal}</p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(conexao.status)}`} />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status:</p>
                    <Badge variant={conexao.status === 'conectado' ? 'default' : 'secondary'}>
                      {conexao.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Setores:</p>
                    <div className="flex flex-wrap gap-1">
                      {conexao.setores.map((setor, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {setor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Desktop actions */}
                    <div className="hidden sm:flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-orange-100 hover:text-orange-600"
                      >
                        <Unplug className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Mobile dropdown */}
                    <div className="sm:hidden ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <EllipsisVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem>
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reiniciar Conexão
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Unplug className="h-4 w-4 mr-2" />
                            Desconectar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Link className="h-8 w-8 opacity-50" />
                  <p>Nenhuma conexão encontrada</p>
                  {searchTerm && (
                    <p className="text-sm">Tente ajustar sua pesquisa</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conexoes;
