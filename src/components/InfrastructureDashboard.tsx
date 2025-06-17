
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MonitorCog, 
  Cpu, 
  MemoryStick, 
  HardDrive,
  Building,
  Users
} from 'lucide-react';

const InfrastructureDashboard = () => {
  // Dados simulados para a demonstração
  const serverStats = {
    os: "Ubuntu 22.04 LTS",
    cpu: "78%",
    memory: "12.5 GB / 16 GB",
    storage: "450 GB / 1 TB"
  };

  const businessStats = {
    companies: 147,
    users: 2850
  };

  const channelStats = [
    { name: "WhatsApp", count: 89, logo: "💬" },
    { name: "Facebook", count: 42, logo: "📘" },
    { name: "Instagram", count: 58, logo: "📷" },
    { name: "Telegram", count: 23, logo: "📤" },
    { name: "WebChat", count: 156, logo: "💻" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Infraestrutura</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitoramento de recursos e estatísticas do sistema</p>
      </div>

      {/* Server Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Sistema Operacional */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-lg flex items-center justify-center">
                <MonitorCog className="h-8 w-8 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Sistema Operacional</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{serverStats.os}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CPU */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-lg flex items-center justify-center">
                <Cpu className="h-8 w-8 text-green-700 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Uso de CPU</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{serverStats.cpu}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Memória RAM */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 rounded-lg flex items-center justify-center">
                <MemoryStick className="h-8 w-8 text-purple-700 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Memória RAM</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{serverStats.memory}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Armazenamento */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-700 rounded-lg flex items-center justify-center">
                <HardDrive className="h-8 w-8 text-orange-700 dark:text-orange-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Armazenamento</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{serverStats.storage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
        {/* Empresas */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 rounded-lg flex items-center justify-center">
                <Building className="h-8 w-8 text-indigo-700 dark:text-indigo-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Empresas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{businessStats.companies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usuários */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-700 rounded-lg flex items-center justify-center">
                <Users className="h-8 w-8 text-teal-700 dark:text-teal-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Usuários</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{businessStats.users}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Canais Conectados */}
        {channelStats.map((channel, index) => (
          <Card key={channel.name} className="card-hover dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="h-12 w-12 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{channel.logo}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{channel.name}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{channel.count}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info Card */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-white">Resumo dos Canais de Comunicação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {channelStats.map((channel) => (
              <div key={channel.name} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl">{channel.logo}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{channel.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{channel.count} canais</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Total de canais conectados:</strong> {channelStats.reduce((total, channel) => total + channel.count, 0)} canais ativos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureDashboard;
