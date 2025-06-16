
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: "Receita Total",
      value: "R$ 45.231",
      change: "+20.1%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Usuários Ativos",
      value: "2.350",
      change: "+180.1%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Taxa de Conversão",
      value: "12.5%",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Activity,
    },
    {
      title: "Crescimento",
      value: "+573",
      change: "+15.3%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
  ];

  const recentActivity = [
    { id: 1, user: "João Silva", action: "Fez upgrade para Pro", time: "2 min atrás", amount: "R$ 49" },
    { id: 2, user: "Maria Santos", action: "Novo cadastro", time: "5 min atrás", amount: "R$ 0" },
    { id: 3, user: "Pedro Lima", action: "Pagamento processado", time: "10 min atrás", amount: "R$ 99" },
    { id: 4, user: "Ana Costa", action: "Cancelou assinatura", time: "15 min atrás", amount: "-R$ 29" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Visão geral do seu negócio</p>
        </div>
        <Button className="bg-gradient-to-r from-gray-700 to-black hover:from-gray-800 hover:to-gray-900 dark:bg-gradient-to-r dark:from-gray-200 dark:to-white dark:hover:from-gray-300 dark:hover:to-gray-100 text-white dark:text-black">
          <Plus className="h-4 w-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Atividade Recente</CardTitle>
            <CardDescription className="dark:text-gray-400">Últimas ações dos usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-black dark:from-gray-200 dark:to-white rounded-full flex items-center justify-center text-white dark:text-black font-semibold text-sm">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{activity.user}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                    <Badge variant={activity.amount.includes('-') ? 'destructive' : 'default'}>
                      {activity.amount}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Ações Rápidas</CardTitle>
            <CardDescription className="dark:text-gray-400">Principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
              <Users className="h-4 w-4 mr-2" />
              Gerenciar Usuários
            </Button>
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Ver Faturamento
            </Button>
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
              <Activity className="h-4 w-4 mr-2" />
              Análises Detalhadas
            </Button>
            <Button variant="outline" className="w-full justify-start dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
