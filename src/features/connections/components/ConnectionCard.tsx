
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Smartphone, Wifi, WifiOff, Trash2, RotateCcw } from 'lucide-react';

export type ConnectionStatus = 'connecting' | 'waiting_scan' | 'connected' | 'disconnected' | 'error';

export interface Connection {
  id: string;
  name: string;
  status: ConnectionStatus;
  phone_number?: string;
  last_activity_at?: string;
  created_at: string;
  sectors: string[];
}

interface ConnectionCardProps {
  connection: Connection;
  onShowQR: (connection: Connection) => void;
  onDisconnect: (connectionId: string) => void;
  onDelete: (connectionId: string) => void;
  onReconnect: (connectionId: string) => void;
}

/**
 * Card para exibição individual de conexões WhatsApp
 * Componente focado e reutilizável
 */
export const ConnectionCard = ({
  connection,
  onShowQR,
  onDisconnect,
  onDelete,
  onReconnect
}: ConnectionCardProps) => {
  
  const getStatusIcon = () => {
    switch (connection.status) {
      case 'connected':
        return <Wifi className="h-4 w-4" />;
      case 'connecting':
      case 'waiting_scan':
        return <QrCode className="h-4 w-4" />;
      case 'disconnected':
      case 'error':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <QrCode className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (connection.status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'connecting':
      case 'waiting_scan':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusText = () => {
    switch (connection.status) {
      case 'connected':
        return 'Conectado';
      case 'connecting':
        return 'Conectando';
      case 'waiting_scan':
        return 'Aguardando QR';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  const canShowQR = connection.status === 'waiting_scan' || connection.status === 'connecting';
  const canDisconnect = connection.status === 'connected';
  const canReconnect = connection.status === 'disconnected' || connection.status === 'error';

  return (
    <Card className="border-brand bg-brand-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-brand-foreground flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            {connection.name}
          </CardTitle>
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Informações da conexão */}
        <div className="space-y-2">
          {connection.phone_number && (
            <div className="flex items-center gap-2 text-sm text-brand-muted">
              <Smartphone className="h-4 w-4" />
              <span>{connection.phone_number}</span>
            </div>
          )}
          
          {connection.last_activity_at && (
            <div className="text-xs text-brand-muted">
              Última atividade: {new Date(connection.last_activity_at).toLocaleString('pt-BR')}
            </div>
          )}
        </div>

        {/* Ações da conexão */}
        <div className="flex flex-wrap gap-2">
          {canShowQR && (
            <Button 
              size="sm" 
              onClick={() => onShowQR(connection)}
              className="bg-primary hover:bg-primary/90"
            >
              <QrCode className="h-4 w-4 mr-1" />
              Ver QR Code
            </Button>
          )}
          
          {canDisconnect && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onDisconnect(connection.id)}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              <WifiOff className="h-4 w-4 mr-1" />
              Desconectar
            </Button>
          )}
          
          {canReconnect && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onReconnect(connection.id)}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reconectar
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onDelete(connection.id)}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
