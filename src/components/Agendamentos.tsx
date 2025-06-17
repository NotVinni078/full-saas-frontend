
import React, { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, Users, MessageSquare, Mic, Paperclip, X, Save, CalendarDays, Play, Pause } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Agendamento {
  id: number;
  contatos: string[];
  tipo: 'texto' | 'audio';
  mensagem: string;
  audioUrl?: string;
  dataEnvio: string;
  horaEnvio: string;
  canal: string;
  recorrencia?: {
    tipo: 'diaria' | 'semanal' | 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'personalizado';
    dias?: number;
  };
  statusTicket: 'finalizado' | 'aguardando' | 'em-atendimento';
  setor: string;
  assinatura: boolean;
  status: 'pendente' | 'enviado' | 'erro';
}

const Agendamentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroData, setFiltroData] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendario' | 'lista'>('calendario');
  
  const [novoAgendamento, setNovoAgendamento] = useState({
    contatos: [] as string[],
    tags: [] as string[],
    tipo: 'texto' as 'texto' | 'audio',
    mensagem: '',
    audioUrl: '',
    dataEnvio: '',
    horaEnvio: '',
    canal: '',
    recorrencia: false,
    tipoRecorrencia: '',
    diasPersonalizado: 1,
    statusTicket: 'aguardando',
    setor: '',
    assinatura: true,
    midias: [] as string[]
  });

  const [isRecording, setIsRecording] = useState(false);

  // Mock data
  const [agendamentos] = useState<Agendamento[]>([
    {
      id: 1,
      contatos: ['João Silva', 'Maria Costa'],
      tipo: 'texto',
      mensagem: 'Lembrando sobre sua consulta amanhã',
      dataEnvio: '2024-01-15',
      horaEnvio: '09:00',
      canal: 'WhatsApp',
      statusTicket: 'aguardando',
      setor: 'Atendimento',
      assinatura: true,
      status: 'pendente'
    },
    {
      id: 2,
      contatos: ['Pedro Santos'],
      tipo: 'audio',
      mensagem: '',
      audioUrl: '/audio1.mp3',
      dataEnvio: '2024-01-16',
      horaEnvio: '14:30',
      canal: 'WhatsApp',
      recorrencia: {
        tipo: 'mensal'
      },
      statusTicket: 'em-atendimento',
      setor: 'Vendas',
      assinatura: false,
      status: 'enviado'
    }
  ]);

  const contatos = ['João Silva', 'Maria Costa', 'Pedro Santos', 'Ana Oliveira'];
  const tags = ['Cliente', 'Lead', 'VIP', 'Interessado'];
  const canais = ['WhatsApp', 'Instagram', 'Facebook', 'Telegram'];
  const setores = ['Atendimento', 'Vendas', 'Suporte', 'Marketing'];
  const tiposRecorrencia = [
    { value: 'diaria', label: 'Diária (todo dia)' },
    { value: 'semanal', label: 'Semanal' },
    { value: 'mensal', label: 'Mensal (todo mês)' },
    { value: 'trimestral', label: 'Trimestral (cada 3 meses)' },
    { value: 'semestral', label: 'Semestral (cada 6 meses)' },
    { value: 'anual', label: 'Anual (1 vez por ano)' },
    { value: 'personalizado', label: 'Personalizado' }
  ];

  const handleSaveAgendamento = () => {
    console.log('Salvando agendamento:', novoAgendamento);
    setIsAddDialogOpen(false);
    setNovoAgendamento({
      contatos: [],
      tags: [],
      tipo: 'texto',
      mensagem: '',
      audioUrl: '',
      dataEnvio: '',
      horaEnvio: '',
      canal: '',
      recorrencia: false,
      tipoRecorrencia: '',
      diasPersonalizado: 1,
      statusTicket: 'aguardando',
      setor: '',
      assinatura: true,
      midias: []
    });
  };

  const handleDiscardAgendamento = () => {
    setNovoAgendamento({
      contatos: [],
      tags: [],
      tipo: 'texto',
      mensagem: '',
      audioUrl: '',
      dataEnvio: '',
      horaEnvio: '',
      canal: '',
      recorrencia: false,
      tipoRecorrencia: '',
      diasPersonalizado: 1,
      statusTicket: 'aguardando',
      setor: '',
      assinatura: true,
      midias: []
    });
    setIsAddDialogOpen(false);
  };

  const toggleContato = (contato: string) => {
    const contatos = novoAgendamento.contatos.includes(contato)
      ? novoAgendamento.contatos.filter(c => c !== contato)
      : [...novoAgendamento.contatos, contato];
    setNovoAgendamento({ ...novoAgendamento, contatos });
  };

  const toggleTag = (tag: string) => {
    const tags = novoAgendamento.tags.includes(tag)
      ? novoAgendamento.tags.filter(t => t !== tag)
      : [...novoAgendamento.tags, tag];
    setNovoAgendamento({ ...novoAgendamento, tags });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'enviado': return 'bg-green-100 text-green-800';
      case 'erro': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TooltipProvider>
      <div className="p-3 sm:p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
            Agendamentos ({agendamentos.length})
          </h1>

          {/* Controles superiores */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Barra de pesquisa */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar agendamentos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filtroData} onValueChange={setFiltroData}>
                <SelectTrigger className="w-full sm:w-48 border-gray-300 bg-white">
                  <SelectValue placeholder="Filtrar por período" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  <SelectItem value="hoje">Hoje</SelectItem>
                  <SelectItem value="semana">Esta semana</SelectItem>
                  <SelectItem value="mes">Este mês</SelectItem>
                  <SelectItem value="todos">Todos os períodos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-full sm:w-48 border-gray-300 bg-white">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="enviado">Enviado</SelectItem>
                  <SelectItem value="erro">Erro</SelectItem>
                  <SelectItem value="todos">Todos os status</SelectItem>
                </SelectContent>
              </Select>

              {/* Toggle de visualização */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'calendario' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendario')}
                  className={viewMode === 'calendario' ? 'bg-white shadow-sm' : ''}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendário
                </Button>
                <Button
                  variant={viewMode === 'lista' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('lista')}
                  className={viewMode === 'lista' ? 'bg-white shadow-sm' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Lista
                </Button>
              </div>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Agendamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Seleção de contatos */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Contatos</label>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {contatos.map((contato) => (
                            <Button
                              key={contato}
                              variant={novoAgendamento.contatos.includes(contato) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleContato(contato)}
                              className={novoAgendamento.contatos.includes(contato) ? "bg-black text-white" : "border-gray-300"}
                            >
                              {contato}
                            </Button>
                          ))}
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 mb-1 block">Ou filtrar por TAG</label>
                          <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                              <Button
                                key={tag}
                                variant={novoAgendamento.tags.includes(tag) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleTag(tag)}
                                className={novoAgendamento.tags.includes(tag) ? "bg-blue-600 text-white" : "border-gray-300"}
                              >
                                {tag}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tipo de mensagem */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tipo de mensagem</label>
                      <div className="flex gap-2">
                        <Button
                          variant={novoAgendamento.tipo === 'texto' ? "default" : "outline"}
                          onClick={() => setNovoAgendamento({ ...novoAgendamento, tipo: 'texto' })}
                          className={novoAgendamento.tipo === 'texto' ? "bg-black text-white" : "border-gray-300"}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Texto
                        </Button>
                        <Button
                          variant={novoAgendamento.tipo === 'audio' ? "default" : "outline"}
                          onClick={() => setNovoAgendamento({ ...novoAgendamento, tipo: 'audio' })}
                          className={novoAgendamento.tipo === 'audio' ? "bg-black text-white" : "border-gray-300"}
                        >
                          <Mic className="h-4 w-4 mr-2" />
                          Áudio
                        </Button>
                      </div>
                    </div>

                    {/* Conteúdo da mensagem */}
                    {novoAgendamento.tipo === 'texto' ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Mensagem</label>
                          <Textarea
                            value={novoAgendamento.mensagem}
                            onChange={(e) => setNovoAgendamento({ ...novoAgendamento, mensagem: e.target.value })}
                            placeholder="Digite sua mensagem..."
                            className="border-gray-300 min-h-[100px]"
                          />
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={novoAgendamento.assinatura}
                              onCheckedChange={(checked) => setNovoAgendamento({ ...novoAgendamento, assinatura: checked })}
                            />
                            <label className="text-sm">Enviar assinatura</label>
                          </div>
                          
                          <Button variant="outline" size="sm" className="border-gray-300">
                            <Paperclip className="h-4 w-4 mr-2" />
                            Anexar mídia
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Gravar áudio</label>
                        <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg">
                          <Button
                            variant={isRecording ? "destructive" : "default"}
                            size="sm"
                            onClick={() => setIsRecording(!isRecording)}
                            className={isRecording ? "" : "bg-red-600 hover:bg-red-700"}
                          >
                            {isRecording ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Parar
                              </>
                            ) : (
                              <>
                                <Mic className="h-4 w-4 mr-2" />
                                Gravar
                              </>
                            )}
                          </Button>
                          {isRecording && (
                            <div className="flex items-center gap-2 text-red-600">
                              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                              <span className="text-sm">Gravando...</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Data e hora */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Data de envio</label>
                        <Input
                          type="date"
                          value={novoAgendamento.dataEnvio}
                          onChange={(e) => setNovoAgendamento({ ...novoAgendamento, dataEnvio: e.target.value })}
                          className="border-gray-300"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Hora de envio</label>
                        <Input
                          type="time"
                          value={novoAgendamento.horaEnvio}
                          onChange={(e) => setNovoAgendamento({ ...novoAgendamento, horaEnvio: e.target.value })}
                          className="border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Recorrência */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={novoAgendamento.recorrencia}
                          onCheckedChange={(checked) => setNovoAgendamento({ ...novoAgendamento, recorrencia: checked })}
                        />
                        <label className="text-sm font-medium">Cadastrar recorrência</label>
                      </div>
                      
                      {novoAgendamento.recorrencia && (
                        <div className="space-y-3 pl-6">
                          <Select value={novoAgendamento.tipoRecorrencia} onValueChange={(value) => setNovoAgendamento({ ...novoAgendamento, tipoRecorrencia: value })}>
                            <SelectTrigger className="border-gray-300">
                              <SelectValue placeholder="Selecionar tipo de recorrência" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {tiposRecorrencia.map((tipo) => (
                                <SelectItem key={tipo.value} value={tipo.value}>
                                  {tipo.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {novoAgendamento.tipoRecorrencia === 'personalizado' && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm">Enviar a cada</span>
                              <Input
                                type="number"
                                min="1"
                                value={novoAgendamento.diasPersonalizado}
                                onChange={(e) => setNovoAgendamento({ ...novoAgendamento, diasPersonalizado: parseInt(e.target.value) || 1 })}
                                className="w-20 border-gray-300"
                              />
                              <span className="text-sm">dias</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Canal e configurações finais */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Canal</label>
                        <Select value={novoAgendamento.canal} onValueChange={(value) => setNovoAgendamento({ ...novoAgendamento, canal: value })}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Selecionar canal" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {canais.map((canal) => (
                              <SelectItem key={canal} value={canal}>
                                {canal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Setor</label>
                        <Select value={novoAgendamento.setor} onValueChange={(value) => setNovoAgendamento({ ...novoAgendamento, setor: value })}>
                          <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Selecionar setor" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {setores.map((setor) => (
                              <SelectItem key={setor} value={setor}>
                                {setor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Status do ticket após envio</label>
                      <Select value={novoAgendamento.statusTicket} onValueChange={(value) => setNovoAgendamento({ ...novoAgendamento, statusTicket: value })}>
                        <SelectTrigger className="border-gray-300">
                          <SelectValue placeholder="Selecionar status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="finalizado">Finalizado</SelectItem>
                          <SelectItem value="aguardando">Aguardando</SelectItem>
                          <SelectItem value="em-atendimento">Em Atendimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={handleDiscardAgendamento}
                        className="border-gray-300"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Descartar
                      </Button>
                      <Button
                        onClick={handleSaveAgendamento}
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
        </div>

        {/* Conteúdo principal */}
        {viewMode === 'calendario' ? (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-center py-20">
              <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Visualização de Calendário</h3>
              <p className="text-gray-500">Os agendamentos serão exibidos aqui em formato de calendário</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {agendamentos.map((agendamento) => (
              <div key={agendamento.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(agendamento.status)}`}>
                        {agendamento.status}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {agendamento.canal}
                      </span>
                      {agendamento.recorrencia && (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Recorrente
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {agendamento.contatos.join(', ')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {agendamento.tipo === 'texto' ? agendamento.mensagem : 'Mensagem de áudio'}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {agendamento.dataEnvio} às {agendamento.horaEnvio}
                      </span>
                      <span>{agendamento.setor}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Reagendar</p></TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Enviar agora</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Agendamentos;
