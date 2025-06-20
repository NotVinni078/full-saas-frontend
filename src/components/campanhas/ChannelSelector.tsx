
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChannelIcons } from './ChannelIcons';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

type Canal = 'whatsapp' | 'facebook' | 'instagram' | 'telegram';

interface ChannelSelectorProps {
  canaisSelecionados: Canal[];
  onChange: (canais: Canal[]) => void;
  error?: string;
}

/**
 * Componente para seleção de canais de envio
 * Exibe ícones oficiais de cada plataforma
 * Inclui informações sobre limitações de cada canal
 * Responsivo com cards clicáveis
 */
export const ChannelSelector: React.FC<ChannelSelectorProps> = ({
  canaisSelecionados,
  onChange,
  error
}) => {

  /**
   * Configuração dos canais disponíveis
   */
  const canaisDisponiveis = [
    {
      id: 'whatsapp' as Canal,
      nome: 'WhatsApp Business',
      descricao: 'Mensagens de texto, imagens, vídeos e documentos',
      limitacoes: 'Limite de 1.000 mensagens por dia por número',
      disponivel: true
    },
    {
      id: 'facebook' as Canal,
      nome: 'Facebook Messenger',
      descricao: 'Mensagens de texto, imagens e links',
      limitacoes: 'Apenas para páginas verificadas do Facebook',
      disponivel: true
    },
    {
      id: 'instagram' as Canal,
      nome: 'Instagram Direct',
      descricao: 'Mensagens de texto e imagens',
      limitacoes: 'Conta business obrigatória',
      disponivel: true
    },
    {
      id: 'telegram' as Canal,
      nome: 'Telegram',
      descricao: 'Mensagens de texto, imagens, vídeos e documentos',
      limitacoes: 'Bot necessário para envio em massa',
      disponivel: true
    }
  ];

  /**
   * Manipula seleção/deseleção de canal
   */
  const handleToggleCanal = (canal: Canal, checked: boolean) => {
    if (checked) {
      onChange([...canaisSelecionados, canal]);
    } else {
      onChange(canaisSelecionados.filter(c => c !== canal));
    }
  };

  return (
    <div className="space-y-4">
      {/* Grid de canais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {canaisDisponiveis.map((canal) => (
          <Card
            key={canal.id}
            className={`transition-all duration-200 hover:shadow-md ${
              canaisSelecionados.includes(canal.id)
                ? 'ring-2 ring-primary bg-primary/5 border-primary'
                : 'border-border hover:border-primary/50'
            } ${!canal.disponivel ? 'opacity-50' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <Checkbox
                  checked={canaisSelecionados.includes(canal.id)}
                  disabled={!canal.disponivel}
                  onCheckedChange={(checked) => 
                    canal.disponivel && handleToggleCanal(canal.id, checked === true)
                  }
                  className="mt-1"
                />

                {/* Ícone do canal */}
                <div className="flex-shrink-0">
                  <ChannelIcons canais={[canal.id]} size="lg" />
                </div>

                {/* Informações do canal */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground mb-1">
                    {canal.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {canal.descricao}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ⚠️ {canal.limitacoes}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Erro de validação */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {/* Informações importantes */}
      {canaisSelecionados.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Canais selecionados:</strong> {canaisSelecionados.length}
            <br />
            <span className="text-xs text-muted-foreground">
              A campanha será enviada através de todos os canais selecionados simultaneamente.
              Certifique-se de que suas contas estão configuradas corretamente.
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
