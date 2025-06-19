
import React from 'react';
import { MessageCircle, CheckCircle, Camera, Users, Send, Globe } from 'lucide-react';

/**
 * Interface para definir as propriedades do componente ChannelLogo
 */
interface ChannelLogoProps {
  channel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente que exibe as logos dos canais de comunicação
 * Utiliza ícones do Lucide React que representam cada plataforma
 * Mantém responsividade e cores dinâmicas da gestão de marca
 */
const ChannelLogo = ({ channel, size = 'md', className = '' }: ChannelLogoProps) => {
  /**
   * Configurações de tamanho dos ícones
   */
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  /**
   * Configurações de cores e ícones para cada canal
   * Utiliza cores que representam as marcas de cada plataforma
   */
  const channelConfig = {
    whatsappQR: {
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      name: 'WhatsApp QR',
    },
    whatsappAPI: {
      icon: CheckCircle,
      color: 'text-green-700',
      bgColor: 'bg-green-100 border-green-300',
      name: 'WhatsApp API',
    },
    instagram: {
      icon: Camera,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 border-pink-200',
      name: 'Instagram',
    },
    facebook: {
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      name: 'Facebook',
    },
    telegram: {
      icon: Send,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50 border-sky-200',
      name: 'Telegram',
    },
    webchat: {
      icon: Globe,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200',
      name: 'WebChat',
    },
  };

  const config = channelConfig[channel as keyof typeof channelConfig];
  
  if (!config) {
    return null;
  }

  const IconComponent = config.icon;

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg border p-2 ${config.bgColor} ${className}`}
      title={config.name}
    >
      <IconComponent className={`${sizeClasses[size]} ${config.color}`} />
    </div>
  );
};

/**
 * Interface para definir as propriedades do componente ChannelRow
 */
interface ChannelRowProps {
  channel: string;
  name: string;
  value: number;
  onChange: (channel: string, value: number) => void;
}

/**
 * Componente que exibe uma linha de canal com logo, nome e input
 * Utilizado no formulário de criação/edição de planos
 */
export const ChannelRow = ({ channel, name, value, onChange }: ChannelRowProps) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <ChannelLogo channel={channel} size="md" />
        <span className="text-foreground font-medium">{name}</span>
      </div>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => onChange(channel, parseInt(e.target.value) || 0)}
        className="w-20 px-3 py-2 text-center rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
      />
    </div>
  );
};

export default ChannelLogo;
