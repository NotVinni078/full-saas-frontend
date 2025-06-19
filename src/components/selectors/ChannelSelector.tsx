
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MessageSquare, MessageCircle, Send, Instagram, Facebook, Globe } from 'lucide-react';

/**
 * Interface para definir os tipos de canais disponíveis
 * Cada canal tem configurações específicas de integração
 */
interface ChannelOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface ChannelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

/**
 * Componente seletor de canais de comunicação
 * Permite escolher entre WhatsApp, Telegram, Facebook, Instagram e WebChat
 * Cada opção mostra o logo/ícone específico da plataforma
 * Responsivo para desktop, tablet e mobile
 */
const ChannelSelector = ({ value, onValueChange }: ChannelSelectorProps) => {
  
  /**
   * Lista de canais disponíveis com suas configurações
   * Cada canal tem integrações específicas comentadas para o backend
   */
  const channels: ChannelOption[] = [
    {
      id: 'whatsapp-qr',
      name: 'WhatsApp QR Code',
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      description: 'Integração via API Baileys - Exibe QR Code para conexão'
    },
    {
      id: 'whatsapp-oficial',
      name: 'WhatsApp API Oficial',
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      description: 'Integração via Meta Business API - Requer aprovação'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send className="h-6 w-6 text-blue-500" />,
      description: 'Integração via Telegram Bot API - QR Code para conexão'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="h-6 w-6 text-blue-600" />,
      description: 'Integração via Meta Business API - Conectar páginas'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="h-6 w-6 text-pink-500" />,
      description: 'Integração via Meta Business API - Conectar conta business'
    },
    {
      id: 'webchat',
      name: 'WebChat',
      icon: <Globe className="h-6 w-6 text-purple-500" />,
      description: 'Chat integrado para website - Código para incorporação'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Título da seção com cores dinâmicas */}
      <Label className="text-base font-medium text-brand-foreground">
        Selecionar Canal de Comunicação
      </Label>
      
      {/* Grid responsivo para seleção de canais */}
      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((channel) => (
            <Card 
              key={channel.id} 
              className={`
                cursor-pointer transition-all duration-200 hover:shadow-md
                ${value === channel.id 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'border-brand border hover:bg-brand-accent'
                }
              `}
              onClick={() => onValueChange(channel.id)}
            >
              <CardContent className="p-4">
                {/* Checkbox do canal com ícone */}
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={channel.id} className="mt-1" />
                  
                  {/* Área do ícone e informações */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {channel.icon}
                      <span className="font-medium text-brand-foreground text-sm">
                        {channel.name}
                      </span>
                    </div>
                    
                    {/* Descrição do canal */}
                    <p className="text-xs text-brand-muted leading-relaxed">
                      {channel.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {/* Instruções técnicas para integração (comentários para o backend) */}
      {value && (
        <div className="mt-4 p-3 bg-brand-muted/20 rounded-lg">
          <p className="text-xs text-brand-muted">
            {getIntegrationInstructions(value)}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Função que retorna instruções específicas de integração para cada canal
 * Serve como documentação para o time de backend implementar
 */
const getIntegrationInstructions = (channelId: string): string => {
  const instructions = {
    'whatsapp-qr': 'Backend: Implementar API Baileys para gerar QR Code. Webhook endpoint: /webhook/whatsapp-qr/{connectionId}',
    'whatsapp-oficial': 'Backend: Integração Meta Business API. Webhook: /webhook/whatsapp-official/{connectionId}. Verificação: GET /webhook/whatsapp-official',
    'telegram': 'Backend: Telegram Bot API. Webhook: /webhook/telegram/{connectionId}. Token do bot via @BotFather',
    'facebook': 'Backend: Meta Graph API. Webhook: /webhook/facebook/{connectionId}. Permissões: pages_messaging',
    'instagram': 'Backend: Instagram Business API. Webhook: /webhook/instagram/{connectionId}. Conta business obrigatória',
    'webchat': 'Backend: WebSocket para chat em tempo real. Endpoint: ws://api.domain.com/webchat/{connectionId}'
  };
  
  return instructions[channelId] || 'Configurações de integração não encontradas.';
};

export default ChannelSelector;
