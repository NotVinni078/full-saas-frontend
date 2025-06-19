
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
 * Agora utiliza representações visuais mais próximas das marcas reais
 * Mantém responsividade e cores dinâmicas da gestão de marca
 * Atualizado com cores que refletem melhor a identidade visual de cada plataforma
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
   * Cores atualizadas para refletir melhor a identidade visual de cada plataforma
   * WhatsApp: Verde característico da marca (#25D366)
   * Instagram: Rosa/gradiente característico da marca (#E4405F)
   * Facebook: Azul característico da marca (#1877F2)
   * Telegram: Azul claro característico da marca (#0088CC)
   * WebChat: Cinza neutro para representar chat web genérico
   */
  const channelConfig = {
    whatsappQR: {
      icon: MessageCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50 border-green-200',
      name: 'WhatsApp QR',
      // Representação visual mais próxima do WhatsApp
      customIcon: (
        <div className="relative">
          <MessageCircle className={`${sizeClasses[size]} text-green-500`} />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-600 rounded-full border border-white"></div>
        </div>
      ),
    },
    whatsappAPI: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 border-green-300',
      name: 'WhatsApp API',
      // Representação visual do WhatsApp API com indicador de verificação
      customIcon: (
        <div className="relative">
          <MessageCircle className={`${sizeClasses[size]} text-green-600`} />
          <CheckCircle className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 text-green-700 bg-white rounded-full" />
        </div>
      ),
    },
    instagram: {
      icon: Camera,
      color: 'text-pink-500',
      bgColor: 'bg-pink-50 border-pink-200',
      name: 'Instagram',
      // Representação visual mais próxima do Instagram
      customIcon: (
        <div className="relative">
          <div className={`${sizeClasses[size]} rounded-lg border-2 border-pink-500 flex items-center justify-center`}>
            <div className="w-1.5 h-1.5 rounded-full border border-pink-500"></div>
            <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-pink-500"></div>
          </div>
        </div>
      ),
    },
    facebook: {
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      name: 'Facebook',
      // Representação visual mais próxima do Facebook
      customIcon: (
        <div className={`${sizeClasses[size]} bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs`}>
          f
        </div>
      ),
    },
    telegram: {
      icon: Send,
      color: 'text-sky-500',
      bgColor: 'bg-sky-50 border-sky-200',
      name: 'Telegram',
      // Representação visual mais próxima do Telegram
      customIcon: (
        <div className={`${sizeClasses[size]} bg-sky-500 text-white rounded-full flex items-center justify-center`}>
          <Send className="w-2.5 h-2.5" />
        </div>
      ),
    },
    webchat: {
      icon: Globe,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200',
      name: 'WebChat',
      // Mantém representação genérica para WebChat
      customIcon: (
        <Globe className={`${sizeClasses[size]} text-gray-600`} />
      ),
    },
  };

  const config = channelConfig[channel as keyof typeof channelConfig];
  
  if (!config) {
    return null;
  }

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg border p-2 ${config.bgColor} ${className}`}
      title={config.name}
    >
      {config.customIcon || <config.icon className={`${sizeClasses[size]} ${config.color}`} />}
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
 * Agora com logos mais representativas das plataformas reais
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
