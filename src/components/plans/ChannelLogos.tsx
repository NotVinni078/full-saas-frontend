
import React from 'react';

/**
 * Interface para definir as propriedades do componente ChannelLogo
 */
interface ChannelLogoProps {
  channel: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente que exibe as logos reais dos canais de comunicação
 * Utiliza SVGs inline das marcas oficiais de cada plataforma
 * Mantém responsividade e cores originais das marcas
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
   * Configurações das logos reais para cada canal
   * Utiliza SVGs inline com as cores oficiais das marcas
   */
  const channelConfig = {
    whatsappQR: {
      bgColor: 'bg-green-50 border-green-200',
      name: 'WhatsApp QR',
      logo: (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" fill="#25D366"/>
        </svg>
      ),
    },
    whatsappAPI: {
      bgColor: 'bg-green-100 border-green-300',
      name: 'WhatsApp API',
      logo: (
        <div className="relative">
          <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516" fill="#25D366"/>
          </svg>
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-700 rounded-full border border-white flex items-center justify-center">
            <svg className="w-1 h-1" viewBox="0 0 24 24" fill="white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
          </div>
        </div>
      ),
    },
    instagram: {
      bgColor: 'bg-pink-50 border-pink-200',
      name: 'Instagram',
      logo: (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
          <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#833AB4"/>
            <stop offset="50%" stopColor="#FD1D1D"/>
            <stop offset="100%" stopColor="#FCB045"/>
          </linearGradient>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#instagram-gradient)"/>
          <path d="m16 4h-8a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-8a4 4 0 0 0-4-4z" fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="12" cy="12" r="3" fill="none" stroke="white" strokeWidth="1"/>
          <circle cx="16.5" cy="7.5" r="1" fill="white"/>
        </svg>
      ),
    },
    facebook: {
      bgColor: 'bg-blue-50 border-blue-200',
      name: 'Facebook',
      logo: (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
          <path d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.632H7.078v3.47h3.047v8.385a12.118 12.118 0 003.75 0v-8.385h2.796z" fill="white"/>
        </svg>
      ),
    },
    telegram: {
      bgColor: 'bg-sky-50 border-sky-200',
      name: 'Telegram',
      logo: (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#0088CC"/>
          <path d="m5.491 11.74 11.57-4.461c.537-.194 1.006.131.832.943l.001-.001-1.97 9.281c-.146.658-.537.818-1.084.508l-3-2.211-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953z" fill="white"/>
        </svg>
      ),
    },
    webchat: {
      bgColor: 'bg-gray-50 border-gray-200',
      name: 'WebChat',
      logo: (
        <svg className={sizeClasses[size]} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#6B7280"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.54 0 3-.35 4.31-.99L22 22l-1.01-5.69C21.65 15 22 13.54 22 12c0-5.52-4.48-10-10-10zm-1 15l-3-3h2V9h2v5h2l-3 3z" fill="white"/>
          <circle cx="8" cy="10" r="1" fill="#6B7280"/>
          <circle cx="12" cy="10" r="1" fill="#6B7280"/>
          <circle cx="16" cy="10" r="1" fill="#6B7280"/>
        </svg>
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
      {config.logo}
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
 * Agora com logos reais das marcas das plataformas
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
