
import React, { useState } from 'react';
import { Users, MessageSquare, Clock, CheckCircle, AlertCircle, TrendingUp, BarChart3, Activity, User, UserCheck, Bot, Headphones, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PainelAtendimentos = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('hoje');

  // Dados simulados para os gráficos
  const atendimentosData = [
    { name: '08:00', atendimentos: 12, resolvidos: 10 },
    { name: '10:00', atendimentos: 19, resolvidos: 15 },
    { name: '12:00', atendimentos: 25, resolvidos: 22 },
    { name: '14:00', atendimentos: 31, resolvidos: 28 },
    { name: '16:00', atendimentos: 18, resolvidos: 16 },
    { name: '18:00', atendimentos: 14, resolvidos: 12 },
  ];

  const canaisData = [
    { name: 'WhatsApp', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Telegram', value: 25, color: 'hsl(var(--secondary))' },
    { name: 'Email', value: 20, color: 'hsl(var(--accent))' },
    { name: 'Chat Web', value: 10, color: 'hsl(var(--muted))' },
  ];

  const agentesData = [
    { 
      id: 1, 
      nome: 'Ana Silva', 
      status: 'online', 
      atendimentos: 15, 
      tempoMedio: '3m 20s',
      satisfacao: 4.8,
      avatar: ''
    },
    { 
      id: 2, 
      nome: 'Carlos Santos', 
      status: 'ocupado', 
      atendimentos: 12, 
      tempoMedio: '4m 15s',
      satisfacao: 4.6,
      avatar: ''
    },
    { 
      id: 3, 
      nome: 'Maria Costa', 
      status: 'pausa', 
      atendimentos: 8, 
      tempoMedio: '2m 45s',
      satisfacao: 4.9,
      avatar: ''
    },
    { 
      id: 4, 
      nome: 'João Oliveira', 
      status: 'offline', 
      atendimentos: 0, 
      tempoMedio: '0m 0s',
      satisfacao: 0,
      avatar: ''
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'ocupado': return 'bg-yellow-500';
      case 'pausa': return 'bg-orange-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'ocupado': return 'Ocupado';
      case 'pausa': return 'Em Pausa';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Painel de Atendimentos</h1>
          <p className="text-muted-foreground">
            Monitore em tempo real a performance da sua equipe de atendimento
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'hoje' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('hoje')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Hoje
          </Button>
          <Button 
            variant={selectedPeriod === 'semana' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('semana')}
          >
            Esta Semana
          </Button>
          <Button 
            variant={selectedPeriod === 'mes' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setSelectedPeriod('mes')}
          >
            Este Mês
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total de Atendimentos */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Total Atendimentos
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">342</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> em relação a ontem
            </p>
          </CardContent>
        </Card>

        {/* Atendimentos Resolvidos */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Resolvidos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">298</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">87%</span> de resolução
            </p>
          </CardContent>
        </Card>

        {/* Tempo Médio */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Tempo Médio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3m 42s</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">-15s</span> mais rápido que ontem
            </p>
          </CardContent>
        </Card>

        {/* Satisfação */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Satisfação
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4.7/5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.2</span> pontos esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Atendimentos */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Atendimentos por Horário</CardTitle>
            <CardDescription className="text-muted-foreground">
              Volume de atendimentos ao longo do dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={atendimentosData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="atendimentos" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Total"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolvidos" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth={2}
                    name="Resolvidos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Canais */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Canais de Atendimento</CardTitle>
            <CardDescription className="text-mute-foreground">
              Distribuição dos atendimentos por canal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={canaisData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {canaisData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance dos Agentes */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Performance dos Agentes</CardTitle>
          <CardDescription className="text-muted-foreground">
            Status atual e métricas de performance da equipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentesData.map((agente) => (
              <div key={agente.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={agente.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {agente.nome.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(agente.status)}`}></div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground">{agente.nome}</h4>
                    <p className="text-sm text-muted-foreground">{getStatusText(agente.status)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-8 text-sm">
                  <div className="text-center">
                    <p className="font-medium text-foreground">{agente.atendimentos}</p>
                    <p className="text-muted-foreground">Atendimentos</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="font-medium text-foreground">{agente.tempoMedio}</p>
                    <p className="text-muted-foreground">Tempo Médio</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-foreground">
                        {agente.satisfacao > 0 ? agente.satisfacao.toFixed(1) : '—'}
                      </span>
                      {agente.satisfacao > 0 && <span className="text-yellow-500">★</span>}
                    </div>
                    <p className="text-muted-foreground">Satisfação</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atendimentos em Tempo Real */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Atendimentos em Andamento</CardTitle>
          <CardDescription className="text-muted-foreground">
            Lista dos atendimentos que estão sendo realizados agora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { cliente: 'João Silva', agente: 'Ana Silva', canal: 'WhatsApp', tempo: '2m 15s', prioridade: 'alta' },
              { cliente: 'Maria Santos', agente: 'Carlos Santos', canal: 'Email', tempo: '5m 30s', prioridade: 'normal' },
              { cliente: 'Pedro Costa', agente: 'Ana Silva', canal: 'Telegram', tempo: '1m 45s', prioridade: 'baixa' },
              { cliente: 'Ana Oliveira', agente: 'Maria Costa', canal: 'Chat Web', tempo: '3m 20s', prioridade: 'normal' },
            ].map((atendimento, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/30">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-foreground">{atendimento.cliente}</p>
                    <p className="text-sm text-muted-foreground">
                      Agente: {atendimento.agente} • {atendimento.canal}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant={
                      atendimento.prioridade === 'alta' ? 'destructive' : 
                      atendimento.prioridade === 'normal' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {atendimento.prioridade.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{atendimento.tempo}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PainelAtendimentos;
