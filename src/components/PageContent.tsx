
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  FileText, 
  Bell, 
  Settings,
  Plus,
  Search
} from 'lucide-react';
import { Input } from "@/components/ui/input";

interface PageContentProps {
  page: string;
}

const PageContent = ({ page }: PageContentProps) => {
  const getPageConfig = (page: string) => {
    const configs = {
      analytics: {
        title: 'Análises',
        description: 'Métricas e insights do seu negócio',
        icon: BarChart3,
        content: 'Aqui você encontrará gráficos detalhados, métricas de performance e insights valiosos sobre o comportamento dos seus usuários.'
      },
      users: {
        title: 'Usuários',
        description: 'Gerencie sua base de usuários',
        icon: Users,
        content: 'Lista de todos os usuários cadastrados, com informações de perfil, histórico de atividades e controles de acesso.'
      },
      billing: {
        title: 'Faturamento',
        description: 'Controle financeiro e pagamentos',
        icon: CreditCard,
        content: 'Acompanhe receitas, processos de pagamento, faturas e relatórios financeiros detalhados.'
      },
      reports: {
        title: 'Relatórios',
        description: 'Relatórios personalizados',
        icon: FileText,
        content: 'Gere relatórios customizados com base nos dados do seu negócio e exporte em diferentes formatos.'
      },
      notifications: {
        title: 'Notificações',
        description: 'Central de notificações',
        icon: Bell,
        content: 'Configure e gerencie todas as notificações do sistema, alertas e comunicações com usuários.'
      },
      settings: {
        title: 'Configurações',
        description: 'Configurações do sistema',
        icon: Settings,
        content: 'Ajuste preferências do sistema, configurações de segurança, integrações e personalizações.'
      }
    };
    
    return configs[page as keyof typeof configs];
  };

  const config = getPageConfig(page);
  if (!config) return null;

  const Icon = config.icon;

  const mockData = [
    { id: 1, name: 'Item 1', status: 'Ativo', date: '15/06/2024', value: 'R$ 150' },
    { id: 2, name: 'Item 2', status: 'Pendente', date: '14/06/2024', value: 'R$ 75' },
    { id: 3, name: 'Item 3', status: 'Ativo', date: '13/06/2024', value: 'R$ 200' },
    { id: 4, name: 'Item 4', status: 'Inativo', date: '12/06/2024', value: 'R$ 50' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-600 mt-1">{config.description}</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Pesquisar..." className="pl-10" />
        </div>
        <Button variant="outline">Filtros</Button>
      </div>

      {/* Description Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre esta seção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{config.content}</p>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de {config.title}</CardTitle>
          <CardDescription>Dados recentes desta seção</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockData.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {item.id}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge 
                    variant={item.status === 'Ativo' ? 'default' : item.status === 'Pendente' ? 'secondary' : 'destructive'}
                  >
                    {item.status}
                  </Badge>
                  <span className="font-medium text-gray-900">{item.value}</span>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageContent;
