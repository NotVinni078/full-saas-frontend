
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { Badge } from '@/components/ui/badge';

/**
 * Interface para props do seletor de canais
 * Agora trabalha com conexões reais ao invés de tipos de canal
 */
interface ChannelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Componente seletor de conexões ativas
 * Exibe apenas as conexões já configuradas e ativas no sistema
 * Bloqueia seleção de WebChat para agendamentos
 * Mostra status de conectividade de cada conexão
 * Responsivo para desktop, tablet e mobile com cores dinâmicas
 */
const ChannelSelector = ({ value, onValueChange }: ChannelSelectorProps) => {
  const { connections } = useGlobalData();

  /**
   * Filtra conexões disponíveis para agendamento
   * Remove WebChat pois não é permitido para agendamentos
   * Apenas conexões ativas são mostradas
   */
  const availableConnections = connections.filter(conn => 
    conn.tipo !== 'webchat' && conn.status === 'connected'
  );

  /**
   * Obtém logo oficial da plataforma com fallback para ícone
   */
  const getChannelLogo = (tipo: string) => {
    const iconClasses = "h-5 w-5 flex-shrink-0";
    
    switch (tipo.toLowerCase()) {
      case 'whatsapp':
        return (
          <div className={`${iconClasses} rounded-full bg-green-500 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.426"/>
            </svg>
          </div>
        );
      case 'instagram':
        return (
          <div className={`${iconClasses} rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className={`${iconClasses} rounded-full bg-blue-600 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'telegram':
        return (
          <div className={`${iconClasses} rounded-full bg-blue-500 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} rounded-full bg-gray-500 flex items-center justify-center`}>
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
        );
    }
  };

  /**
   * Obtém ícone de status da conexão
   */
  const getStatusIcon = (status: string) => {
    return status === 'connected' 
      ? <Wifi className="h-3 w-3 text-green-500" />
      : <WifiOff className="h-3 w-3 text-red-500" />;
  };

  const selectedConnection = availableConnections.find(conn => conn.id === value);

  return (
    <div className="space-y-3">
      {/* Título da seção com cores dinâmicas */}
      <Label className="text-base font-medium text-foreground">
        Selecionar Conexão Ativa
      </Label>
      
      {/* Dropdown responsivo para seleção de conexões */}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full border-border bg-background text-foreground">
          <SelectValue placeholder="Escolha uma conexão ativa">
            {selectedConnection && (
              <div className="flex items-center gap-3">
                {getChannelLogo(selectedConnection.tipo)}
                <span className="font-medium">{selectedConnection.nome}</span>
                <Badge variant="outline" className="text-xs">
                  {selectedConnection.tipo}
                </Badge>
                {getStatusIcon(selectedConnection.status)}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="border-border bg-background max-h-80 overflow-y-auto z-50">
          {availableConnections.length > 0 ? (
            availableConnections.map((connection) => (
              <SelectItem 
                key={connection.id} 
                value={connection.id}
                className="cursor-pointer hover:bg-accent focus:bg-accent text-foreground"
              >
                <div className="flex items-center gap-3 py-2">
                  {getChannelLogo(connection.tipo)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">
                      {connection.nome}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {connection.tipo} • {connection.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {connection.tipo}
                    </Badge>
                    {getStatusIcon(connection.status)}
                  </div>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <div className="flex flex-col items-center gap-2">
                <WifiOff className="h-6 w-6 opacity-50" />
                <p className="text-sm">Nenhuma conexão ativa encontrada</p>
                <p className="text-xs">Configure suas conexões primeiro</p>
              </div>
            </div>
          )}
        </SelectContent>
      </Select>

      {/* Aviso sobre WebChat bloqueado */}
      <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
        <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <MessageSquare className="h-4 w-4" />
          <span className="text-sm font-medium">WebChat não disponível para agendamentos</span>
        </div>
        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
          Use apenas conexões de redes sociais para enviar mensagens agendadas
        </p>
      </div>
    </div>
  );
};

export default ChannelSelector;
