
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MonitorCog, 
  Cpu, 
  MemoryStick, 
  HardDrive,
  Building,
  Users,
  Wifi
} from 'lucide-react';

const InfrastructureDashboard = () => {
  // Dados simulados para a demonstração
  const serverStats = {
    os: "Ubuntu 22.04 LTS",
    cpu: "78%",
    memory: "12.5 GB / 16 GB",
    storage: "450 GB / 1 TB",
    ping: "12ms"
  };

  const businessStats = {
    companies: 147,
    users: 2850
  };

  const channelStats = [
    { 
      name: "WhatsApp", 
      count: 89, 
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.687z"/>
        </svg>
      )
    },
    { 
      name: "Facebook", 
      count: 42, 
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      name: "Instagram", 
      count: 58, 
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8">
          <defs>
            <radialGradient id="ig-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f09433"/>
              <stop offset="25%" stopColor="#e6683c"/>
              <stop offset="50%" stopColor="#dc2743"/>
              <stop offset="75%" stopColor="#cc2366"/>
              <stop offset="100%" stopColor="#bc1888"/>
            </radialGradient>
          </defs>
          <path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: "Telegram", 
      count: 23, 
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#0088CC">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      )
    },
    { 
      name: "WebChat", 
      count: 156, 
      logo: (
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#4A90E2">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.36L2 22l5.64-1.05C9.96 21.64 11.46 22 13 22h7c1.1 0 2-.9 2-2V12c0-5.52-4.48-10-10-10zm0 18c-1.21 0-2.38-.25-3.44-.72L4 20l.72-4.56C4.25 14.38 4 13.21 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8-3.58 8-8 8z"/>
          <circle cx="8" cy="12" r="1"/>
          <circle cx="12" cy="12" r="1"/>
          <circle cx="16" cy="12" r="1"/>
        </svg>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard de Infraestrutura</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Monitoramento de recursos e estatísticas do sistema</p>
      </div>

      {/* Server Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

        {/* Ping Médio */}
        <Card className="card-hover dark:bg-gray-800">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 bg-gradient-to-r from-cyan-100 to-cyan-200 dark:from-cyan-800 dark:to-cyan-700 rounded-lg flex items-center justify-center">
                <Wifi className="h-8 w-8 text-cyan-700 dark:text-cyan-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Ping Médio</p>
                <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{serverStats.ping}</p>
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
                  {channel.logo}
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
    </div>
  );
};

export default InfrastructureDashboard;
