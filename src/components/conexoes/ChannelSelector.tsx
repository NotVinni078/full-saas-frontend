
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ChannelOption {
  id: string;
  name: string;
  logo: string;
  description: string;
}

interface ChannelSelectorProps {
  selectedChannel: string;
  onChannelSelect: (channelId: string) => void;
}

/**
 * Componente para seleção de canais de comunicação
 * Exibe as opções de canais com suas respectivas logos
 * Responsivo para desktop, tablet e mobile
 */
const ChannelSelector = ({ selectedChannel, onChannelSelect }: ChannelSelectorProps) => {
  /**
   * Lista de canais disponíveis com suas configurações
   * Cada canal possui id, nome, logo (emoji como placeholder) e descrição
   */
  const channels: ChannelOption[] = [
    {
      id: 'whatsapp-qr',
      name: 'WhatsApp QR Code',
      logo: '📱', // Placeholder - Em produção, usar logo real do WhatsApp
      description: 'Conexão via QR Code usando API Baileys'
    },
    {
      id: 'whatsapp-oficial',
      name: 'WhatsApp API Oficial',
      logo: '✅', // Placeholder - Em produção, usar logo oficial do WhatsApp Business
      description: 'API oficial do WhatsApp Business'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      logo: '✈️', // Placeholder - Em produção, usar logo do Telegram
      description: 'Integração via Bot do Telegram'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      logo: '👤', // Placeholder - Em produção, usar logo do Facebook
      description: 'Facebook Messenger'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      logo: '📸', // Placeholder - Em produção, usar logo do Instagram
      description: 'Instagram Direct'
    },
    {
      id: 'webchat',
      name: 'WebChat',
      logo: '💬', // Placeholder - Em produção, usar ícone personalizado
      description: 'Chat incorporado no site'
    }
  ];

  return (
    <div className="space-y-3">
      {/* Label do campo com cores dinâmicas da marca */}
      <Label className="brand-text-foreground font-medium">
        Selecionar Canal de Comunicação
      </Label>
      
      {/* Grid responsivo dos canais - 1 coluna no mobile, 2 no tablet, 3 no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {channels.map((channel) => (
          <Card
            key={channel.id}
            className={`
              cursor-pointer transition-all duration-200 brand-border
              ${selectedChannel === channel.id 
                ? 'ring-2 ring-primary border-primary brand-card-selected' 
                : 'brand-card hover:brand-hover-accent'
              }
            `}
            onClick={() => onChannelSelect(channel.id)}
          >
            <CardContent className="p-4">
              {/* Container do conteúdo do card com alinhamento centralizado */}
              <div className="flex flex-col items-center text-center space-y-2">
                {/* Logo do canal - placeholder com emoji, substituir por imagens reais */}
                <div className="text-2xl mb-1">
                  {channel.logo}
                </div>
                
                {/* Nome do canal com cores dinâmicas */}
                <h3 className="font-medium brand-text-foreground text-sm">
                  {channel.name}
                </h3>
                
                {/* Descrição do canal */}
                <p className="text-xs brand-text-muted text-center leading-tight">
                  {channel.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Instruções para o backend sobre integrações necessárias */}
      {selectedChannel && (
        <div className="mt-4 p-3 brand-card brand-border rounded-md">
          <p className="text-xs brand-text-muted">
            {/* Instruções específicas baseadas no canal selecionado */}
            {selectedChannel === 'whatsapp-qr' && (
              <>
                <strong>Backend:</strong> Implementar integração com Baileys API para QR Code. 
                Configurar webhook endpoint: /webhook/whatsapp-qr/[connection-id]
              </>
            )}
            {selectedChannel === 'whatsapp-oficial' && (
              <>
                <strong>Backend:</strong> Configurar Meta Business API. 
                Webhook: /webhook/whatsapp-business/[connection-id]. 
                Implementar fluxo OAuth2 para autenticação.
              </>
            )}
            {selectedChannel === 'telegram' && (
              <>
                <strong>Backend:</strong> Integração via Telegram Bot API. 
                Webhook: /webhook/telegram/[connection-id]. 
                Configurar bot token e comandos.
              </>
            )}
            {(selectedChannel === 'facebook' || selectedChannel === 'instagram') && (
              <>
                <strong>Backend:</strong> Usar Meta Graph API. 
                Webhook: /webhook/meta/[connection-id]. 
                Configurar permissões: pages_messaging, instagram_basic, instagram_manage_messages.
              </>
            )}
            {selectedChannel === 'webchat' && (
              <>
                <strong>Backend:</strong> WebSocket para chat em tempo real. 
                Endpoint: /ws/webchat/[connection-id]. 
                Gerar código de incorporação com SDK JavaScript.
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;
