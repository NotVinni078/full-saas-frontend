
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Plus, Clock, AlertTriangle, CheckCircle2, User, Calendar, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  criadoPor: string;
  atribuidoPara: string;
  situacao: 'pendente' | 'em_atraso' | 'concluida';
  dataCriacao: Date;
  prazo: Date;
  dataInicio?: Date;
  dataConclusao?: Date;
}

const Tarefas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<'todos' | 'pendente' | 'em_atraso' | 'concluida'>('pendente');
  const [searchTerm, setSearchTerm] = useState('');
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    atribuidoPara: '',
    prazo: ''
  });

  // Mock data - tarefas de exemplo
  const tarefas: Tarefa[] = [
    {
      id: '1',
      titulo: 'Responder e-mails pendentes',
      descricao: 'Verificar e responder todos os e-mails da caixa de entrada',
      criadoPor: 'Ana Silva (Gestora)',
      atribuidoPara: 'João Santos',
      situacao: 'pendente',
      dataCriacao: new Date('2024-06-15'),
      prazo: new Date('2024-06-20'),
      dataInicio: new Date('2024-06-16')
    },
    {
      id: '2',
      titulo: 'Atualizar cadastro de clientes',
      descricao: 'Revisar e atualizar informações dos clientes na base de dados',
      criadoPor: 'Carlos Mendes (Supervisor)',
      atribuidoPara: 'Maria Costa',
      situacao: 'em_atraso',
      dataCriacao: new Date('2024-06-10'),
      prazo: new Date('2024-06-15'),
      dataInicio: new Date('2024-06-11')
    },
    {
      id: '3',
      titulo: 'Relatório mensal de vendas',
      descricao: 'Compilar dados de vendas do mês e gerar relatório',
      criadoPor: 'Ana Silva (Gestora)',
      atribuidoPara: 'Pedro Lima',
      situacao: 'concluida',
      dataCriacao: new Date('2024-06-01'),
      prazo: new Date('2024-06-14'),
      dataInicio: new Date('2024-06-02'),
      dataConclusao: new Date('2024-06-13')
    },
    {
      id: '4',
      titulo: 'Treinamento de novos funcionários',
      descricao: 'Conduzir sessão de treinamento para equipe recém-contratada',
      criadoPor: 'Roberto Silva',
      atribuidoPara: 'Roberto Silva',
      situacao: 'pendente',
      dataCriacao: new Date('2024-06-17'),
      prazo: new Date('2024-06-25'),
      dataInicio: new Date('2024-06-18')
    },
    {
      id: '5',
      titulo: 'Organizar arquivo de documentos',
      descricao: 'Reorganizar e digitalizar documentos físicos do setor',
      criadoPor: 'Carlos Mendes (Supervisor)',
      atribuidoPara: 'Lucia Oliveira',
      situacao: 'em_atraso',
      dataCriacao: new Date('2024-06-08'),
      prazo: new Date('2024-06-12'),
      dataInicio: new Date('2024-06-09')
    },
    {
      id: '6',
      titulo: 'Análise de satisfação do cliente',
      descricao: 'Analisar pesquisas de satisfação e preparar apresentação',
      criadoPor: 'Ana Silva (Gestora)',
      atribuidoPara: 'Fernando Costa',
      situacao: 'concluida',
      dataCriacao: new Date('2024-06-05'),
      prazo: new Date('2024-06-16'),
      dataInicio: new Date('2024-06-06'),
      dataConclusao: new Date('2024-06-15')
    }
  ];

  const usuarios = [
    'João Santos',
    'Maria Costa',
    'Pedro Lima',
    'Roberto Silva',
    'Lucia Oliveira',
    'Fernando Costa',
    'Ana Silva',
    'Carlos Mendes'
  ];

  const calcularDiasEmAberto = (dataInicio: Date, situacao: string) => {
    if (situacao === 'concluida') return 0;
    const hoje = new Date();
    const diffTime = hoje.getTime() - dataInicio.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calcularDiasEmAtraso = (prazo: Date, situacao: string) => {
    if (situacao === 'concluida') return 0;
    const hoje = new Date();
    if (hoje > prazo) {
      const diffTime = hoje.getTime() - prazo.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calcularDiasParaPrazo = (prazo: Date, situacao: string) => {
    if (situacao === 'concluida') return 0;
    const hoje = new Date();
    const diffTime = prazo.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calcularDuracaoTarefa = (dataInicio: Date | undefined, dataFim: Date | undefined) => {
    if (!dataInicio || !dataFim) return 0;
    const diffTime = dataFim.getTime() - dataInicio.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filtrarTarefas = () => {
    let tarefasFiltradas = tarefas;

    if (filtroAtivo !== 'todos') {
      tarefasFiltradas = tarefasFiltradas.filter(tarefa => tarefa.situacao === filtroAtivo);
    }

    if (searchTerm) {
      tarefasFiltradas = tarefasFiltradas.filter(tarefa =>
        tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarefa.atribuidoPara.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tarefa.criadoPor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return tarefasFiltradas;
  };

  const contarTarefasPorStatus = () => {
    return {
      pendentes: tarefas.filter(t => t.situacao === 'pendente').length,
      emAtraso: tarefas.filter(t => t.situacao === 'em_atraso').length,
      concluidas: tarefas.filter(t => t.situacao === 'concluida').length
    };
  };

  const handleCriarTarefa = () => {
    console.log('Nova tarefa:', novaTarefa);
    setIsDialogOpen(false);
    setNovaTarefa({ titulo: '', descricao: '', atribuidoPara: '', prazo: '' });
  };

  const handleConcluirTarefa = (tarefaId: string) => {
    console.log('Concluir tarefa:', tarefaId);
  };

  const getSituacaoIcon = (situacao: string) => {
    switch (situacao) {
      case 'pendente':
        return <Clock className="h-4 w-4" />;
      case 'em_atraso':
        return <AlertTriangle className="h-4 w-4" />;
      case 'concluida':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'pendente':
        return 'bg-gray-100 text-gray-800';
      case 'em_atraso':
        return 'bg-red-100 text-red-800';
      case 'concluida':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const contadores = contarTarefasPorStatus();

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Tarefas</h1>
          <p className="text-gray-600 mt-1 text-sm lg:text-base">Gerencie e acompanhe tarefas da equipe</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] mx-4">
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título da Tarefa</Label>
                <Input
                  id="titulo"
                  value={novaTarefa.titulo}
                  onChange={(e) => setNovaTarefa({...novaTarefa, titulo: e.target.value})}
                  placeholder="Digite o título da tarefa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={novaTarefa.descricao}
                  onChange={(e) => setNovaTarefa({...novaTarefa, descricao: e.target.value})}
                  placeholder="Descreva a tarefa detalhadamente"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="atribuido">Atribuir Para</Label>
                <Select value={novaTarefa.atribuidoPara} onValueChange={(value) => setNovaTarefa({...novaTarefa, atribuidoPara: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    {usuarios.map((usuario) => (
                      <SelectItem key={usuario} value={usuario}>
                        {usuario}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={novaTarefa.prazo}
                  onChange={(e) => setNovaTarefa({...novaTarefa, prazo: e.target.value})}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button onClick={handleCriarTarefa} className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
                  Criar Tarefa
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros e Contadores */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filtroAtivo === 'pendente' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('pendente')}
            className={`text-xs sm:text-sm ${
              filtroAtivo === 'pendente' 
                ? 'bg-black hover:bg-gray-800 text-white' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Clock className="h-4 w-4 mr-1" />
            Pendentes ({contadores.pendentes})
          </Button>
          <Button
            variant={filtroAtivo === 'em_atraso' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('em_atraso')}
            className={`text-xs sm:text-sm ${
              filtroAtivo === 'em_atraso' 
                ? 'bg-black hover:bg-gray-800 text-white' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4 mr-1" />
            Em Atraso ({contadores.emAtraso})
          </Button>
          <Button
            variant={filtroAtivo === 'concluida' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('concluida')}
            className={`text-xs sm:text-sm ${
              filtroAtivo === 'concluida' 
                ? 'bg-black hover:bg-gray-800 text-white' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Concluídas ({contadores.concluidas})
          </Button>
          <Button
            variant={filtroAtivo === 'todos' ? 'default' : 'outline'}
            onClick={() => setFiltroAtivo('todos')}
            className={`text-xs sm:text-sm ${
              filtroAtivo === 'todos' 
                ? 'bg-black hover:bg-gray-800 text-white' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            Todas ({tarefas.length})
          </Button>
        </div>
        
        <div className="flex-1 max-w-full lg:max-w-md">
          <Input
            placeholder="Buscar tarefas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Lista de Tarefas */}
      <div className="grid gap-4">
        {filtrarTarefas().map((tarefa) => (
          <Card key={tarefa.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="font-semibold text-base lg:text-lg text-gray-900 break-words">{tarefa.titulo}</h3>
                    <Badge className={`w-fit ${getSituacaoColor(tarefa.situacao)}`}>
                      {getSituacaoIcon(tarefa.situacao)}
                      <span className="ml-1 capitalize">
                        {tarefa.situacao === 'em_atraso' ? 'Em Atraso' : 
                         tarefa.situacao === 'concluida' ? 'Concluída' : 'Pendente'}
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2 break-words">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span><strong>Criada por:</strong> {tarefa.criadoPor}</span>
                    </div>
                    <div className="flex items-center gap-2 break-words">
                      <User className="h-4 w-4 flex-shrink-0" />
                      <span><strong>Atribuída para:</strong> {tarefa.atribuidoPara}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span><strong>Prazo:</strong> {format(tarefa.prazo, 'dd/MM/yyyy', { locale: ptBR })}</span>
                    </div>
                    
                    {tarefa.situacao === 'concluida' ? (
                      <>
                        <div className="text-green-600">
                          <strong>Início:</strong> {tarefa.dataInicio && format(tarefa.dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="text-green-600">
                          <strong>Conclusão:</strong> {tarefa.dataConclusao && format(tarefa.dataConclusao, 'dd/MM/yyyy', { locale: ptBR })}
                        </div>
                        <div className="text-green-600">
                          <strong>Duração:</strong> {calcularDuracaoTarefa(tarefa.dataInicio, tarefa.dataConclusao)} dias
                        </div>
                      </>
                    ) : (
                      <>
                        {tarefa.dataInicio && (
                          <div className="text-gray-600">
                            <strong>Início:</strong> {format(tarefa.dataInicio, 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        )}
                        
                        {tarefa.dataInicio && (
                          <div className="text-gray-600">
                            <strong>Dias em aberto:</strong> {calcularDiasEmAberto(tarefa.dataInicio, tarefa.situacao)}
                          </div>
                        )}
                        
                        {calcularDiasEmAtraso(tarefa.prazo, tarefa.situacao) > 0 && (
                          <div className="text-red-600">
                            <strong>Dias em atraso:</strong> {calcularDiasEmAtraso(tarefa.prazo, tarefa.situacao)}
                          </div>
                        )}
                        
                        {calcularDiasParaPrazo(tarefa.prazo, tarefa.situacao) > 0 && (
                          <div className="text-orange-600">
                            <strong>Dias para prazo:</strong> {calcularDiasParaPrazo(tarefa.prazo, tarefa.situacao)}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Botão de Concluir para tarefas Em Atraso e Pendentes */}
                {(tarefa.situacao === 'pendente' || tarefa.situacao === 'em_atraso') && (
                  <div className="flex justify-end xl:justify-start">
                    <Button
                      onClick={() => handleConcluirTarefa(tarefa.id)}
                      className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Concluir
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtrarTarefas().length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Nenhuma tarefa encontrada</p>
              <p className="text-sm mt-1">Tente ajustar os filtros ou criar uma nova tarefa</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tarefas;
