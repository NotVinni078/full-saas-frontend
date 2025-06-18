import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';

interface DashboardProps {
  currentPage?: string;
}

const Dashboard = ({ currentPage }: DashboardProps) => {
  // Mock data para métricas
  const metricas = {
    conversasAbertas: 23,
    conversasHoje: 45,
    tempoMedioResposta: '2m 34s',
    satisfacaoCliente: 4.8,
    conversasResolvidas: 156,
    taxaConversao: 12.5,
    novosContatos: 18,
    agendamentosHoje: 7
  };

  const conversasRecentes = [
    { id: 1, nome: 'João Silva', plataforma: 'WhatsApp', status: 'ativo', tempo: '2min', mensagem: 'Preciso de ajuda com meu pedido' },
    { id: 2, nome: 'Maria Santos', plataforma: 'Instagram', status: 'pendente', tempo: '15min', mensagem: 'Qual o horário de funcionamento?' },
    { id: 3, nome: 'Pedro Costa', plataforma: 'WhatsApp', status: 'resolvido', tempo: '1h', mensagem: 'Obrigado pelo atendimento!' },
    { id: 4, nome: 'Ana Oliveira', plataforma: 'Email', status: 'ativo', tempo: '5min', mensagem: 'Como faço para cancelar?' }
  ];

  const agendamentosHoje = [
    { id: 1, cliente: 'Carlos Silva', horario: '09:00', tipo: 'Consulta', status: 'confirmado' },
    { id: 2, cliente: 'Julia Santos', horario: '14:30', tipo: 'Reunião', status: 'pendente' },
    { id: 3, cliente: 'Roberto Lima', horario: '16:00', tipo: 'Apresentação', status: 'confirmado' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'resolvido':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'confirmado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPlataformaIcon = (plataforma: string) => {
    switch (plataforma) {
      case 'WhatsApp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'Instagram':
        return <div className="h-4 w-4 bg-pink-500 rounded" />;
      case 'Email':
        return <div className="h-4 w-4 bg-blue-500 rounded" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 brand-background">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-bold brand-text-foreground">Dashboard</h1>
        <p className="brand-text-muted mt-1 text-sm lg:text-base">Visão geral dos seus atendimentos e métricas</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Conversas Abertas</CardTitle>
            <MessageSquare className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.conversasAbertas}</div>
            <p className="text-xs brand-text-muted">+12% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Conversas Hoje</CardTitle>
            <TrendingUp className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.conversasHoje}</div>
            <p className="text-xs brand-text-muted">+8% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.tempoMedioResposta}</div>
            <p className="text-xs brand-text-muted">-15% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Satisfação</CardTitle>
            <CheckCircle className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.satisfacaoCliente}/5</div>
            <p className="text-xs brand-text-muted">+0.2 desde ontem</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Resolvidas</CardTitle>
            <Target className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.conversasResolvidas}</div>
            <p className="text-xs brand-text-muted">Esta semana</p>
          </CardContent>
        </Card>

        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Taxa Conversão</CardTitle>
            <BarChart3 className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.taxaConversao}%</div>
            <p className="text-xs brand-text-muted">+2.1% desde ontem</p>
          </CardContent>
        </Card>

        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Novos Contatos</CardTitle>
            <Users className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.novosContatos}</div>
            <p className="text-xs brand-text-muted">Hoje</p>
          </CardContent>
        </Card>

        <Card className="brand-card brand-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 brand-text-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{metricas.agendamentosHoje}</div>
            <p className="text-xs brand-text-muted">Hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversas Recentes e Agendamentos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Conversas Recentes */}
        <Card className="brand-card brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 brand-text-foreground">
              <MessageSquare className="h-5 w-5" />
              Conversas Recentes
            </CardTitle>
            <CardDescription className="brand-text-muted">
              Últimas conversas com clientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversasRecentes.map((conversa) => (
                <div key={conversa.id} className="flex items-center justify-between p-3 rounded-lg brand-hover-accent border brand-border">
                  <div className="flex items-center space-x-3">
                    {getPlataformaIcon(conversa.plataforma)}
                    <div>
                      <p className="font-medium brand-text-foreground">{conversa.nome}</p>
                      <p className="text-sm brand-text-muted truncate max-w-48">
                        {conversa.mensagem}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={`text-xs ${getStatusColor(conversa.status)}`}>
                      {conversa.status}
                    </Badge>
                    <span className="text-xs brand-text-muted">{conversa.tempo}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full brand-border brand-text-foreground brand-hover-accent">
                Ver Todas as Conversas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agendamentos de Hoje */}
        <Card className="brand-card brand-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 brand-text-foreground">
              <Calendar className="h-5 w-5" />
              Agendamentos de Hoje
            </CardTitle>
            <CardDescription className="brand-text-muted">
              Compromissos agendados para hoje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agendamentosHoje.map((agendamento) => (
                <div key={agendamento.id} className="flex items-center justify-between p-3 rounded-lg brand-hover-accent border brand-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full brand-primary"></div>
                    <div>
                      <p className="font-medium brand-text-foreground">{agendamento.cliente}</p>
                      <p className="text-sm brand-text-muted">{agendamento.tipo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="font-medium brand-text-foreground">{agendamento.horario}</span>
                    <Badge className={`text-xs ${getStatusColor(agendamento.status)}`}>
                      {agendamento.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full brand-border brand-text-foreground brand-hover-accent">
                Ver Todos os Agendamentos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card className="brand-card brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 brand-text-foreground">
            <Zap className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription className="brand-text-muted">
            Acesso rápido às principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="brand-primary brand-hover-primary brand-text-background h-20 flex flex-col space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span className="text-sm">Nova Conversa</span>
            </Button>
            
            <Button variant="outline" className="brand-border brand-text-foreground brand-hover-accent h-20 flex flex-col space-y-2">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">Agendar</span>
            </Button>
            
            <Button variant="outline" className="brand-border brand-text-foreground brand-hover-accent h-20 flex flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Novo Contato</span>
            </Button>
            
            <Button variant="outline" className="brand-border brand-text-foreground brand-hover-accent h-20 flex flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Relatórios</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
