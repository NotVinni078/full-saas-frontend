
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RotateCcw, WifiOff, Wifi, Trash2, MessageSquare, Send, Instagram, Facebook, Globe, Edit } from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  channel: string;
  sector: string;
  status: 'connected' | 'disconnected' | 'error';
  lastActivity: string;
}

interface ConnectionCardProps {
  connection: Connection;
  onRestart: (id: string) => void;
  onDisconnect: (id: string) => void;
  onConnect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (connection: Connection) => void;
}

/**
 * Componente de card para exibir conexões existentes
 * Melhorias implementadas:
 * - Botão "Conectar" quando conexão está desconectada
 * - Botão "Desconectar" quando conexão está conectada
 * - Reorganização dos botões de ação com melhor responsividade
 * - Mantém logos oficiais das empresas e cores dinâmicas
 * - Layout otimizado para desktop, tablet e mobile
 */
const ConnectionCard = ({ connection, onRestart, onDisconnect, onConnect, onDelete, onEdit }: ConnectionCardProps) => {
  
  /**
   * Retorna a logo oficial da empresa correspondente ao canal
   */
  const getChannelLogo = (channel: string) => {
    const logos = {
      'whatsapp-qr': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      'whatsapp-oficial': 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
      'telegram': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      'facebook': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png',
      'instagram': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png',
      'webchat': 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Web_chat_icon.svg'
    };
    return logos[channel] || '';
  };

  /**
   * Retorna ícone de fallback caso a logo não carregue
   */
  const getChannelIcon = (channel: string) => {
    const icons = {
      'whatsapp-qr': <MessageSquare className="h-6 w-6 text-green-500" />,
      'whatsapp-oficial': <MessageSquare className="h-6 w-6 text-green-600" />,
      'telegram': <Send className="h-6 w-6 text-blue-500" />,
      'facebook': <Facebook className="h-6 w-6 text-blue-600" />,
      'instagram': <Instagram className="h-6 w-6 text-pink-500" />,
      'webchat': <Globe className="h-6 w-6 text-purple-500" />
    };
    return icons[channel] || <MessageSquare className="h-6 w-6 text-gray-500" />;
  };

  /**
   * Retorna o nome amigável do canal para exibição
   */
  const getChannelName = (channel: string) => {
    const names = {
      'whatsapp-qr': 'WhatsApp QR',
      'whatsapp-oficial': 'WhatsApp Oficial',
      'telegram': 'Telegram',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'webchat': 'WebChat'
    };
    return names[channel] || channel;
  };

  /**
   * Retorna as cores do badge baseado no status da conexão
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'disconnected':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  /**
   * Retorna o texto do status em português
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      case 'error':
        return 'Erro';
      default:
        return 'Desconhecido';
    }
  };

  /**
   * Renderiza o botão de conexão baseado no status
   * Se está conectado, mostra "Desconectar"
   * Se está desconectado, mostra "Conectar"
   */
  const renderConnectionButton = () => {
    if (connection.status === 'connected') {
      // Botão Desconectar
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-brand text-brand-foreground hover:bg-brand-accent"
            >
              <WifiOff className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Desconectar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="border-brand bg-brand-background">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-brand-foreground">
                Desconectar
              </AlertDialogTitle>
              <AlertDialogDescription className="text-brand-muted">
                Você deseja desconectar "{connection.name}"? 
                O atendimento será interrompido até reconectar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-brand text-brand-foreground">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDisconnect(connection.id)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                Desconectar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    } else {
      // Botão Conectar
      return (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onConnect(connection.id)}
          className="border-green-300 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
        >
          <Wifi className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Conectar</span>
        </Button>
      );
    }
  };

  return (
    <Card className="border-brand bg-brand-background hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        {/* Cabeçalho com informações da conexão */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Logo oficial da empresa */}
            <div className="relative">
              <img 
                src={getChannelLogo(connection.channel)} 
                alt={`${getChannelName(connection.channel)} logo`}
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallbackDiv = target.nextElementSibling as HTMLDivElement;
                  if (fallbackDiv) {
                    fallbackDiv.classList.remove('hidden');
                  }
                }}
              />
              <div className="hidden">
                {getChannelIcon(connection.channel)}
              </div>
            </div>
            
            {/* Nome e detalhes da conexão */}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-brand-foreground truncate">
                {connection.name}
              </h3>
              <p className="text-sm text-brand-muted">
                {getChannelName(connection.channel)} • Setor: {connection.sector}
              </p>
            </div>
          </div>
          
          {/* Badge de status */}
          <Badge className={`text-xs ${getStatusColor(connection.status)}`}>
            {getStatusText(connection.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informação de última atividade */}
        <div className="text-xs text-brand-muted">
          Última atividade: {connection.lastActivity}
        </div>

        {/* Botões de ação reorganizados */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Botão Editar */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(connection)}
            className="border-brand text-brand-foreground hover:bg-brand-accent"
          >
            <Edit className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Editar</span>
          </Button>

          {/* Botão Reiniciar */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-brand text-brand-foreground hover:bg-brand-accent"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Reiniciar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-brand bg-brand-background">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-brand-foreground">
                  Reiniciar Conexão
                </AlertDialogTitle>
                <AlertDialogDescription className="text-brand-muted">
                  Você deseja reiniciar a conexão "{connection.name}"? 
                  Isso pode interromper temporariamente o atendimento.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-brand text-brand-foreground">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onRestart(connection.id)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Botão Conectar/Desconectar dinâmico */}
          {renderConnectionButton()}

          {/* Botão Excluir */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Excluir</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-brand bg-brand-background">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-brand-foreground">
                  Excluir Conexão
                </AlertDialogTitle>
                <AlertDialogDescription className="text-brand-muted">
                  Você deseja excluir a conexão "{connection.name}"? 
                  Esta ação não pode ser desfeita e todos os dados serão perdidos.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-brand text-brand-foreground">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(connection.id)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Excluir
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
