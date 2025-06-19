
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Instagram, Facebook, Globe } from 'lucide-react';

/**
 * Interface para definir os tipos de canais disponíveis
 * Cada canal tem configurações específicas de integração
 */
interface ChannelOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  logo: string; // URL da logo da empresa
}

interface ChannelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Componente seletor de canais de comunicação via dropdown
 * Permite escolher entre WhatsApp, Telegram, Facebook, Instagram e WebChat
 * Cada opção mostra a logo oficial da plataforma
 * Totalmente responsivo para desktop, tablet e mobile
 */
const ChannelSelector = ({ value, onValueChange }: ChannelSelectorProps) => {
  
  /**
   * Lista de canais disponíveis com suas configurações
   * Logos oficiais das empresas substituem ícones genéricos
   * Integrações específicas documentadas em comentários para o backend
   */
  const channels: ChannelOption[] = [
    {
      id: 'whatsapp-qr',
      name: 'WhatsApp QR Code',
      icon: <MessageSquare className="h-5 w-5 text-green-500" />,
      description: 'Conexão via QR Code - API Baileys',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
      // Backend: Implementar API Baileys para gerar QR Code. Webhook endpoint: /webhook/whatsapp-qr/{connectionId}
    },
    {
      id: 'whatsapp-oficial',
      name: 'WhatsApp API Oficial',
      icon: <MessageSquare className="h-5 w-5 text-green-600" />,
      description: 'Meta Business API - Requer aprovação',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg'
      // Backend: Integração Meta Business API. Webhook: /webhook/whatsapp-official/{connectionId}. Verificação: GET /webhook/whatsapp-official
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send className="h-5 w-5 text-blue-500" />,
      description: 'Telegram Bot API - Configuração via @BotFather',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'
      // Backend: Telegram Bot API. Webhook: /webhook/telegram/{connectionId}. Token do bot via @BotFather
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-5 w-5 text-blue-600" />,
      description: 'Meta Business API - Conectar páginas',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png'
      // Backend: Meta Graph API. Webhook: /webhook/facebook/{connectionId}. Permissões: pages_messaging
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5 text-pink-500" />,
      description: 'Meta Business API - Conta business obrigatória',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'
      // Backend: Instagram Business API. Webhook: /webhook/instagram/{connectionId}. Conta business obrigatória
    },
    {
      id: 'webchat',
      name: 'WebChat',
      icon: <Globe className="h-5 w-5 text-purple-500" />,
      description: 'Chat integrado para website',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Web_chat_icon.svg'
      // Backend: WebSocket para chat em tempo real. Endpoint: ws://api.domain.com/webchat/{connectionId}
    }
  ];

  const selectedChannel = channels.find(ch => ch.id === value);

  return (
    <div className="space-y-3">
      {/* Título da seção com cores dinâmicas */}
      <Label className="text-base font-medium text-brand-foreground">
        Selecionar Canal de Comunicação
      </Label>
      
      {/* Dropdown responsivo para seleção de canais */}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full border-brand bg-brand-background text-brand-foreground">
          <SelectValue placeholder="Escolha o canal de comunicação">
            {selectedChannel && (
              <div className="flex items-center gap-3">
                {/* Logo oficial da empresa */}
                <img 
                  src={selectedChannel.logo} 
                  alt={`${selectedChannel.name} logo`}
                  className="h-5 w-5 object-contain"
                  onError={(e) => {
                    // Fallback para ícone se logo não carregar
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden">{selectedChannel.icon}</span>
                <span className="font-medium">{selectedChannel.name}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        
        <SelectContent className="border-brand bg-brand-background max-h-80 overflow-y-auto">
          {channels.map((channel) => (
            <SelectItem 
              key={channel.id} 
              value={channel.id}
              className="cursor-pointer hover:bg-brand-accent focus:bg-brand-accent text-brand-foreground"
            >
              <div className="flex items-center gap-3 py-2">
                {/* Logo oficial da empresa */}
                <img 
                  src={channel.logo} 
                  alt={`${channel.name} logo`}
                  className="h-5 w-5 object-contain flex-shrink-0"
                  onError={(e) => {
                    // Fallback para ícone se logo não carregar
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <span className="hidden">{channel.icon}</span>
                
                {/* Informações do canal */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-brand-foreground">
                    {channel.name}
                  </div>
                  <div className="text-xs text-brand-muted mt-1">
                    {channel.description}
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Informação adicional para WhatsApp QR Code */}
      {value === 'whatsapp-qr' && (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm font-medium">QR Code será exibido após criar a conexão</span>
          </div>
          <p className="text-xs text-green-700 dark:text-green-300 mt-1">
            Escaneie o código QR com seu WhatsApp para conectar
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;
