
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MonitorCog, 
  Cpu, 
  MemoryStick, 
  HardDrive,
  Wifi,
  Activity,
  Info
} from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';

interface ServerStats {
  softwareVersion: string;
  cpuUsage: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  diskUsage: {
    used: number;
    total: number;
    percentage: number;
  };
  ping: number;
}

const InfrastructureDashboard = () => {
  const { brandConfig } = useBrand();
  const [serverStats, setServerStats] = useState<ServerStats>({
    softwareVersion: "v2.4.1",
    cpuUsage: 45,
    memoryUsage: {
      used: 8.2,
      total: 16,
      percentage: 51
    },
    diskUsage: {
      used: 285,
      total: 500,
      percentage: 57
    },
    ping: 18
  });

  // Simular atualizações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setServerStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 35, // 35-65%
        memoryUsage: {
          ...prev.memoryUsage,
          used: Math.round((Math.random() * 4 + 6) * 10) / 10, // 6.0-10.0 GB
          percentage: Math.floor(Math.random() * 25) + 40 // 40-65%
        },
        diskUsage: {
          ...prev.diskUsage,
          used: Math.floor(Math.random() * 50) + 260, // 260-310 GB
          percentage: Math.floor(Math.random() * 20) + 50 // 50-70%
        },
        ping: Math.floor(Math.random() * 20) + 10 // 10-30ms
      }));
    }, 3000); // Atualiza a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600 dark:text-green-400';
    if (percentage < 75) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getUsageBgColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-100 dark:bg-green-900/20';
    if (percentage < 75) return 'bg-yellow-100 dark:bg-yellow-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard de Infraestrutura
          </h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Monitoramento em tempo real do servidor de {brandConfig.companyName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:text-green-400 dark:border-green-800 dark:bg-green-900/20">
            <Activity className="w-3 h-3 mr-1" />
            Online
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
        {/* Versão do Software */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Versão do Software
              </CardTitle>
              <MonitorCog className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-bold text-foreground mb-1">
              {serverStats.softwareVersion}
            </div>
            <p className="text-xs text-muted-foreground">
              Última atualização
            </p>
          </CardContent>
        </Card>

        {/* CPU Usage */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uso de CPU
              </CardTitle>
              <Cpu className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold mb-1 ${getUsageColor(serverStats.cpuUsage)}`}>
              {serverStats.cpuUsage}%
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  serverStats.cpuUsage < 50 
                    ? 'bg-green-500' 
                    : serverStats.cpuUsage < 75 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${serverStats.cpuUsage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Processamento atual
            </p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Memória RAM
              </CardTitle>
              <MemoryStick className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold mb-1 ${getUsageColor(serverStats.memoryUsage.percentage)}`}>
              {serverStats.memoryUsage.percentage}%
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  serverStats.memoryUsage.percentage < 50 
                    ? 'bg-green-500' 
                    : serverStats.memoryUsage.percentage < 75 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${serverStats.memoryUsage.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {serverStats.memoryUsage.used}GB / {serverStats.memoryUsage.total}GB
            </p>
          </CardContent>
        </Card>

        {/* Disk Usage */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Armazenamento
              </CardTitle>
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold mb-1 ${getUsageColor(serverStats.diskUsage.percentage)}`}>
              {serverStats.diskUsage.percentage}%
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  serverStats.diskUsage.percentage < 50 
                    ? 'bg-green-500' 
                    : serverStats.diskUsage.percentage < 75 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${serverStats.diskUsage.percentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {serverStats.diskUsage.used}GB / {serverStats.diskUsage.total}GB
            </p>
          </CardContent>
        </Card>

        {/* Ping */}
        <Card className="border-border bg-card hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ping Médio
              </CardTitle>
              <Wifi className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className={`text-2xl font-bold mb-1 ${
              serverStats.ping < 20 
                ? 'text-green-600 dark:text-green-400' 
                : serverStats.ping < 50 
                ? 'text-yellow-600 dark:text-yellow-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {serverStats.ping}ms
            </div>
            <div className="flex items-center gap-1 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                serverStats.ping < 20 
                  ? 'bg-green-500' 
                  : serverStats.ping < 50 
                  ? 'bg-yellow-500' 
                  : 'bg-red-500'
              }`} />
              <span className="text-xs text-muted-foreground">
                {serverStats.ping < 20 ? 'Excelente' : serverStats.ping < 50 ? 'Bom' : 'Alto'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Latência de rede
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Sistema Operacional:</span>
              <p className="text-muted-foreground">Ubuntu 22.04 LTS</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Última Reinicialização:</span>
              <p className="text-muted-foreground">Há 7 dias</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Processos Ativos:</span>
              <p className="text-muted-foreground">142 processos</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Conexões Ativas:</span>
              <p className="text-muted-foreground">89 conexões</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Temperatura CPU:</span>
              <p className="text-muted-foreground">52°C</p>
            </div>
            <div>
              <span className="font-medium text-foreground">Próxima Manutenção:</span>
              <p className="text-muted-foreground">Em 15 dias</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfrastructureDashboard;
