
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RotateCcw, WifiOff, Trash, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  channel: string;
  sectors: string[];
  status: 'connected' | 'disconnected' | 'error';
  lastActivity: string;
}

interface ConnectionCardProps {
  connection: Connection;
  onRestart: (id: string) => void;
  onDisconnect: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Componente de card para exibir conexões existentes
 * Mostra informações da conexão e ações disponíveis
 * Inclui confirmações para ações destrutivas
 */
const ConnectionCard = ({ connection, onRestart, onDisconnect, onDelete }: ConnectionCardProps) => {
  // Estados para controlar os diálogos de confirmação
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  /**
   * Retorna o ícone apropriado baseado no status da conexão
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="h-4 w-4 text-gray-400" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  /**
   * Retorna as classes CSS para colorir o badge baseado no status
   */
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    }
  };

  /**
   * Retorna o nome amigável do canal
   */
  const getChannelDisplayName = (channel: string) => {
    const channelNames: { [key: string]: string } = {
      'whatsapp-qr': 'WhatsApp QR',
      'whatsapp-oficial': 'WhatsApp Oficial',
      'telegram': 'Telegram',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'webchat': 'WebChat'
    };
    return channelNames[channel] || channel;
  };

  return (
    <Card className="brand-card brand-border hover:brand-hover-accent transition-all duration-200">
      <CardHeader className="pb-3">
        {/* Cabeçalho do card com nome e status */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base brand-text-foreground">
              {connection.name}
            </CardTitle>
            <p className="text-sm brand-text-muted">
              {getChannelDisplayName(connection.channel)}
            </p>
          </div>
          
          {/* Indicador de status com ícone */}
          <div className="flex items-center space-x-2">
            {getStatusIcon(connection.status)}
            <Badge className={`text-xs ${getStatusBadgeClass(connection.status)}`}>
              {connection.status === 'connected' ? 'Conectado' : 
               connection.status === 'disconnected' ? 'Desconectado' : 'Erro'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações dos setores vinculados */}
        <div>
          <p className="text-xs brand-text-muted mb-1">Setores:</p>
          <div className="flex flex-wrap gap-1">
            {connection.sectors.map((sector, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs brand-border"
              >
                {sector}
              </Badge>
            ))}
          </div>
        </div>

        {/* Última atividade */}
        <div className="text-xs brand-text-muted">
          Última atividade: {connection.lastActivity}
        </div>

        {/* Botões de ação responsivos */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Botão Reiniciar */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRestart(connection.id)}
            className="flex-1 brand-border brand-text-foreground hover:brand-hover-accent"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Reiniciar
          </Button>

          {/* Botão Desconectar com confirmação */}
          <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 brand-border brand-text-foreground hover:brand-hover-accent"
              >
                <WifiOff className="h-4 w-4 mr-1" />
                Desconectar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="brand-card brand-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="brand-text-foreground">
                  Confirmar Desconexão
                </AlertDialogTitle>
                <AlertDialogDescription className="brand-text-muted">
                  Você deseja desconectar a conexão "{connection.name}"? 
                  Esta ação pode ser revertida reconectando posteriormente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="brand-border brand-text-foreground">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDisconnect(connection.id);
                    setShowDisconnectDialog(false);
                  }}
                  className="brand-warning hover:brand-hover-warning"
                >
                  Desconectar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Botão Excluir com confirmação */}
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Trash className="h-4 w-4 mr-1" />
                Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="brand-card brand-border">
              <AlertDialogHeader>
                <AlertDialogTitle className="brand-text-foreground">
                  Confirmar Exclusão
                </AlertDialogTitle>
                <AlertDialogDescription className="brand-text-muted">
                  Você deseja excluir a conexão "{connection.name}"? 
                  Esta ação é irreversível e todos os dados associados serão perdidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="brand-border brand-text-foreground">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onDelete(connection.id);
                    setShowDeleteDialog(false);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir Permanentemente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionCard;
