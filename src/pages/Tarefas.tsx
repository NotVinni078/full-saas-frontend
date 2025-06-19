
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Plus, Filter, Search, Clock, User, CheckCircle, AlertCircle, Circle } from 'lucide-react';

const Tarefas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');

  const tarefas = [
    {
      id: 1,
      titulo: 'Responder ticket #1234',
      descricao: 'Cliente relatou problema com integração do sistema de pagamento',
      status: 'pendente',
      prioridade: 'alta',
      responsavel: 'Ana Silva',
      prazo: '2024-01-20',
      cliente: 'Tech Solutions LTDA',
      tags: ['suporte', 'integração']
    },
    {
      id: 2,
      titulo: 'Atualizar documentação da API',
      descricao: 'Incluir novos endpoints desenvolvidos na versão 2.1',
      status: 'em-progresso',
      prioridade: 'media',
      responsavel: 'Carlos Santos',
      prazo: '2024-01-25',
      cliente: null,
      tags: ['documentação', 'api']
    },
    {
      id: 3,
      titulo: 'Treinamento nova funcionária',
      descricao: 'Orientar sobre processos de atendimento e sistema interno',
      status: 'concluida',
      prioridade: 'baixa',
      responsavel: 'Maria Costa',
      prazo: '2024-01-18',
      cliente: null,
      tags: ['treinamento', 'rh']
    },
    {
      id: 4,
      titulo: 'Análise de feedback do cliente',
      descricao: 'Revisar avaliações negativas e propor melhorias',
      status: 'pendente',
      prioridade: 'media',
      responsavel: 'João Oliveira',
      prazo: '2024-01-22',
      cliente: 'Empresa ABC',
      tags: ['feedback', 'melhoria']
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'em-progresso': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'pendente': return <Circle className="w-4 h-4 text-gray-400" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'concluida': return 'Concluída';
      case 'em-progresso': return 'Em Progresso';
      case 'pendente': return 'Pendente';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'default';
    }
  };

  const filteredTarefas = tarefas.filter(tarefa => {
    const matchesSearch = tarefa.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarefa.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tarefa.responsavel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todas' || tarefa.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    todas: tarefas.length,
    pendente: tarefas.filter(t => t.status === 'pendente').length,
    'em-progresso': tarefas.filter(t => t.status === 'em-progresso').length,
    concluida: tarefas.filter(t => t.status === 'concluida').length
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Tarefas</h1>
            <p className="text-muted-foreground">
              Organize e acompanhe as atividades da sua equipe
            </p>
          </div>
          
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barra de Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="whitespace-nowrap"
              >
                {status === 'todas' ? 'Todas' : getStatusText(status)}
                <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="space-y-4">
          {filteredTarefas.map((tarefa) => (
            <Card key={tarefa.id} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Título e Status */}
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(tarefa.status)}
                      <h3 className="text-lg font-medium text-foreground">{tarefa.titulo}</h3>
                      <Badge variant={getPrioridadeColor(tarefa.prioridade)} className="text-xs">
                        {tarefa.prioridade.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Descrição */}
                    <p className="text-sm text-muted-foreground">{tarefa.descricao}</p>

                    {/* Informações */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {/* Responsável */}
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{tarefa.responsavel}</span>
                      </div>

                      {/* Prazo */}
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">
                          {new Date(tarefa.prazo).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {/* Cliente */}
                      {tarefa.cliente && (
                        <div className="flex items-center space-x-2">
                          <span className="text-muted-foreground">Cliente:</span>
                          <span className="text-foreground">{tarefa.cliente}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {tarefa.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs border-border text-foreground"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-col space-y-2 ml-4">
                    {tarefa.status !== 'concluida' && (
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        {tarefa.status === 'pendente' ? 'Iniciar' : 'Concluir'}
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado Vazio */}
        {filteredTarefas.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira tarefa'}
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {searchTerm ? 'Limpar Busca' : 'Nova Tarefa'}
            </Button>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default Tarefas;
