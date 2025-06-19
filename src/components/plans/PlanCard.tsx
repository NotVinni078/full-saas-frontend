
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';
import ChannelLogo from './ChannelLogos';

/**
 * Interface para definir a estrutura de um plano
 */
interface Plan {
  id: string;
  name: string;
  type: 'Publico' | 'Personalizado';
  userLimit: number;
  value: number;
  features: {
    chatInterno: boolean;
    agendamentos: boolean;
    tarefas: boolean;
    campanhas: boolean;
    integracaoAPI: boolean;
    whiteLabel: boolean;
  };
  channels: {
    whatsappQR: number;
    whatsappAPI: number;
    instagram: number;
    facebook: number;
    telegram: number;
    webchat: number;
  };
}

interface PlanCardProps {
  plan: Plan;
  onEdit: () => void;
  onDelete: () => void;
}

/**
 * Card para exibir informações de um plano
 * Mostra detalhes do plano de forma organizada e visual
 * Inclui botões para editar e excluir
 * Utiliza cores dinâmicas da gestão de marca
 * Responsivo para todos os tamanhos de tela
 * Atualizado com valor do plano e logos reais dos canais
 */
const PlanCard = ({ plan, onEdit, onDelete }: PlanCardProps) => {
  /**
   * Calcula o total de funcionalidades ativas
   */
  const activeFeaturesCount = Object.values(plan.features).filter(Boolean).length;

  /**
   * Calcula o total de canais configurados (com quantidade > 0)
   */
  const activeChannelsCount = Object.values(plan.channels).filter(count => count > 0).length;

  /**
   * Calcula o total de conexões permitidas somando todos os canais
   */
  const totalConnections = Object.values(plan.channels).reduce((sum, count) => sum + count, 0);

  /**
   * Formata o valor do plano para exibição em R$
   */
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Lista de nomes das funcionalidades para exibição
   */
  const featureNames = {
    chatInterno: 'Chat Interno',
    agendamentos: 'Agendamentos',
    tarefas: 'Tarefas',
    campanhas: 'Campanhas',
    integracaoAPI: 'API',
    whiteLabel: 'White Label',
  };

  /**
   * Lista de nomes dos canais para exibição
   */
  const channelNames = {
    whatsappQR: 'WhatsApp QR',
    whatsappAPI: 'WhatsApp API',
    instagram: 'Instagram',
    facebook: 'Facebook',
    telegram: 'Telegram',
    webchat: 'WebChat',
  };

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
      {/* Cabeçalho do Card */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-foreground text-lg font-semibold">
              {plan.name}
            </CardTitle>
            
            {/* Valor do Plano - Destaque */}
            <div className="text-2xl font-bold text-primary">
              {formatPrice(plan.value)}
            </div>
            
            <Badge 
              variant={plan.type === 'Publico' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {plan.type}
            </Badge>
          </div>
          
          {/* Botões de Ação */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
              title="Editar plano"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Excluir plano"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Conteúdo Principal */}
      <CardContent className="space-y-4">
        {/* Informações Básicas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Usuários</p>
            <p className="font-medium text-foreground">{plan.userLimit}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Conexões</p>
            <p className="font-medium text-foreground">{totalConnections}</p>
          </div>
        </div>

        {/* Funcionalidades Ativas */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Funcionalidades ({activeFeaturesCount}/6)
          </p>
          <div className="flex flex-wrap gap-1">
            {Object.entries(plan.features).map(([key, enabled]) => (
              enabled && (
                <Badge
                  key={key}
                  variant="outline"
                  className="text-xs border-primary/20 text-primary bg-primary/5"
                >
                  {featureNames[key]}
                </Badge>
              )
            ))}
            {activeFeaturesCount === 0 && (
              <span className="text-xs text-muted-foreground">
                Nenhuma funcionalidade ativa
              </span>
            )}
          </div>
        </div>

        {/* Canais Ativos com Logos Reais */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            Canais ({activeChannelsCount}/6)
          </p>
          <div className="space-y-2">
            {Object.entries(plan.channels).map(([key, count]) => (
              count > 0 && (
                <div key={key} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ChannelLogo channel={key} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {channelNames[key]}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {count}
                  </Badge>
                </div>
              )
            ))}
            {activeChannelsCount === 0 && (
              <span className="text-xs text-muted-foreground">
                Nenhum canal configurado
              </span>
            )}
          </div>
        </div>
      </CardContent>

      {/* Rodapé com Informações Resumidas */}
      <CardFooter className="pt-3 border-t border-border">
        <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
          <span>ID: {plan.id.slice(0, 8)}...</span>
          <span>{plan.type}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PlanCard;
