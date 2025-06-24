
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, QrCode, Globe, Bot } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * Interface para props do seletor de canais
 * Agora trabalha com tipos de canal disponíveis para criar conexões
 */
interface ChannelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Tipos de canais disponíveis para criar novas conexões
 * Cada canal tem suas características específicas
 */
interface ChannelType {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  available: boolean;
  requirements?: string;
}

/**
 * Componente seletor de tipos de canal para novas conexões
 * Exibe todos os canais disponíveis para configuração
 * Responsivo para desktop, tablet e mobile com cores dinâmicas
 */
const ChannelSelector = ({ value, onValueChange }: ChannelSelectorProps) => {
  /**
   * Canais disponíveis para criar novas conexões
   */
  const availableChannels: ChannelType[] = [
    {
      id: 'whatsapp-qr',
      name: 'WhatsApp QR Code',
      type: 'whatsapp',
      description: 'Conecte via QR Code - Ideal para testes e uso pessoal',
      icon: getChannelLogo('whatsapp'),
      badge: 'Gratuito',
      available: true
    },
    {
      id: 'whatsapp-meta',
      name: 'WhatsApp Meta Oficial',
      type: 'whatsapp',
      description: 'API oficial do Meta - Requer aprovação e verificação',
      icon: getChannelLogo('whatsapp'),
      badge: 'Oficial',
      available: true,
      requirements: 'Conta Business verificada'
    },
    {
      id: 'instagram-meta',
      name: 'Instagram Meta Oficial',
      type: 'instagram',
      description: 'API oficial do Instagram para empresas',
      icon: getChannelLogo('instagram'),
      badge: 'Oficial',
      available: true,
      requirements: 'Conta Business + Página Facebook'
    },
    {
      id: 'facebook-meta',
      name: 'Facebook Meta Oficial',
      type: 'facebook',
      description: 'Messenger via Meta Business API',
      icon: getChannelLogo('facebook'),
      badge: 'Oficial',
      available: true,
      requirements: 'Página Facebook + Permissões'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      type: 'telegram',
      description: 'Bot do Telegram via API oficial',
      icon: getChannelLogo('telegram'),
      badge: 'Bot',
      available: true,
      requirements: 'Token do @BotFather'
    },
    {
      id: 'webchat',
      name: 'WebChat',
      type: 'webchat',
      description: 'Chat incorporado no seu site',
      icon: getChannelLogo('webchat'),
      badge: 'Widget',
      available: true
    }
  ];

  /**
   * Obtém logo oficial da plataforma com fallback para ícone
   */
  function getChannelLogo(tipo: string) {
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
      case 'webchat':
        return (
          <div className={`${iconClasses} rounded-full bg-indigo-500 flex items-center justify-center`}>
            <Globe className="h-3 w-3 text-white" />
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} rounded-full bg-gray-500 flex items-center justify-center`}>
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
        );
    }
  }

  /**
   * Obtém cor do badge baseado no tipo
   */
  const getBadgeVariant = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'gratuito':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'oficial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'bot':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'widget':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const selectedChannel = availableChannels.find(channel => channel.id === value);

  return (
    <div className="space-y-3">
      {/* Título da seção com cores dinâmicas */}
      <Label className="text-base font-medium text-foreground">
        Selecionar Tipo de Canal *
      </Label>
      
      {/* Dropdown responsivo para seleção de canais */}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full border-border bg-background text-foreground">
          <SelectValue placeholder="Escolha o tipo de canal para conectar">
            {selectedChannel && (
              <div className="flex items-center gap-3">
                {selectedChannel.icon}
                <span className="font-medium">{selectedChannel.name}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getBadgeVariant(selectedChannel.badge)}`}
                >
                  {selectedChannel.badge}
                </Badge>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="border-border bg-background max-h-80 overflow-y-auto z-50">
          {availableChannels.map((channel) => (
            <SelectItem 
              key={channel.id} 
              value={channel.id}
              className="cursor-pointer hover:bg-accent focus:bg-accent text-foreground"
              disabled={!channel.available}
            >
              <div className="flex items-center gap-3 py-2 w-full">
                {channel.icon}
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">
                    {channel.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {channel.description}
                  </div>
                  {channel.requirements && (
                    <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                      Requer: {channel.requirements}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getBadgeVariant(channel.badge)}`}
                  >
                    {channel.badge}
                  </Badge>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Informações sobre QR Code quando WhatsApp QR for selecionado */}
      {value === 'whatsapp-qr' && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <QrCode className="h-4 w-4" />
            <span className="text-sm font-medium">QR Code será gerado automaticamente</span>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            Após criar a conexão, escaneie o QR Code com seu WhatsApp pessoal
          </p>
        </div>
      )}

      {/* Informações sobre APIs oficiais quando Meta for selecionado */}
      {(value === 'whatsapp-meta' || value === 'instagram-meta' || value === 'facebook-meta') && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">API Oficial do Meta</span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Configuração via Meta Business. Requer conta verificada e aprovação do Meta
          </p>
        </div>
      )}

      {/* Informações sobre Telegram quando selecionado */}
      {value === 'telegram' && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">Bot do Telegram</span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            Crie um bot via @BotFather e insira o token de acesso na configuração
          </p>
        </div>
      )}

      {/* Informações sobre WebChat quando selecionado */}
      {value === 'webchat' && (
        <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-center gap-2 text-indigo-800 dark:text-indigo-200">
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">Widget para seu site</span>
          </div>
          <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
            Código HTML será gerado para incorporar o chat no seu website
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;
