
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChannelIcons } from './ChannelIcons';
import { 
  Edit, 
  Copy, 
  Pause, 
  X, 
  Trash2, 
  Eye, 
  Calendar, 
  Users, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interface para dados de campanha
interface Campanha {
  id: string;
  nome: string;
  canais: ('whatsapp' | 'facebook' | 'instagram' | 'telegram')[];
  dataInicio: Date;
  dataFim?: Date;
  status: 'agendada' | 'em_andamento' | 'finalizada' | 'erro';
  contatosEnviados: number;
  contatosTotal: number;
  taxaSucesso: number;
  mensagem: string;
  arquivo?: string;
  remetente: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface CampanhaCardProps {
  campanha: Campanha;
  onEditar: () => void;
  onClonar: () => void;
  onPausar: () => void;
  onCancelar: () => void;
  onExcluir: () => void;
  onVerDetalhes: () => void;
}

/**
 * Componente de card individual da campanha
 * Exibe informações resumidas de cada campanha
 * Botões de ação para gerenciar a campanha
 * Layout responsivo com cores dinâmicas da marca
 */
export const CampanhaCard: React.FC<CampanhaCardProps> = ({
  campanha,
  onEditar,
  onClonar,
  onPausar,
  onCancelar,
  onExcluir,
  onVerDetalhes
}) => {

  /**
   * Retorna a configuração visual para cada status
   */
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'agendada':
        return {
          variant: 'outline' as const,
          className: 'border-blue-200 text-blue-700 bg-blue-50',
          label: 'Agendada'
        };
      case 'em_andamento':
        return {
          variant: 'default' as const,
          className: 'border-green-200 text-green-700 bg-green-50',
          label: 'Em Andamento'
        };
      case 'finalizada':
        return {
          variant: 'secondary' as const,
          className: 'border-gray-200 text-gray-700 bg-gray-50',
          label: 'Finalizada'
        };
      case 'erro':
        return {
          variant: 'destructive' as const,
          className: 'border-red-200 text-red-700 bg-red-50',
          label: 'Erro'
        };
      default:
        return {
          variant: 'outline' as const,
          className: '',
          label: 'Indefinido'
        };
    }
  };

  /**
   * Formata a data para exibição
   */
  const formatarData = (data: Date) =>
    format(data, "dd/MM/yy 'às' HH:mm", { locale: ptBR });

  /**
   * Calcula progresso da campanha
   */
  const progresso = campanha.contatosTotal > 0 
    ? (campanha.contatosEnviados / campanha.contatosTotal) * 100 
    : 0;

  const statusConfig = getStatusConfig(campanha.status);

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-border bg-card group">
      <CardHeader className="pb-3">
        {/* Linha superior: Nome e Status */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-tight line-clamp-2">
            {campanha.nome}
          </h3>
          <Badge 
            variant={statusConfig.variant}
            className={`shrink-0 ${statusConfig.className}`}
          >
            {statusConfig.label}
          </Badge>
        </div>

        {/* Canais utilizados */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground">Canais:</span>
          <ChannelIcons canais={campanha.canais} size="sm" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Informações de data */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Início: {formatarData(campanha.dataInicio)}</span>
          </div>
          
          {campanha.dataFim && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Fim: {formatarData(campanha.dataFim)}</span>
            </div>
          )}
        </div>

        {/* Estatísticas da campanha */}
        <div className="grid grid-cols-2 gap-4 py-3 bg-muted/30 rounded-lg px-3">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="w-3 h-3" />
              <span className="text-xs">Contatos</span>
            </div>
            <p className="font-semibold text-sm text-foreground">
              {campanha.contatosEnviados}/{campanha.contatosTotal}
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs">Sucesso</span>
            </div>
            <p className="font-semibold text-sm text-foreground">
              {campanha.taxaSucesso.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        {campanha.status === 'em_andamento' && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progresso</span>
              <span>{progresso.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300 rounded-full"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        )}

        {/* Remetente */}
        <div className="text-xs text-muted-foreground">
          <span>Por: {campanha.remetente}</span>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
          {/* Botão Ver Detalhes */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onVerDetalhes}
            className="flex-1 min-w-0 h-8 text-xs hover:bg-primary/10 hover:text-primary"
          >
            <Eye className="w-3 h-3 mr-1" />
            Detalhes
          </Button>

          {/* Botão Editar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditar}
            className="flex-1 min-w-0 h-8 text-xs hover:bg-blue-50 hover:text-blue-600"
          >
            <Edit className="w-3 h-3 mr-1" />
            Editar
          </Button>

          {/* Botão Clonar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClonar}
            className="flex-1 min-w-0 h-8 text-xs hover:bg-green-50 hover:text-green-600"
          >
            <Copy className="w-3 h-3 mr-1" />
            Clonar
          </Button>

          {/* Botões condicionais baseados no status */}
          {campanha.status === 'em_andamento' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onPausar}
              className="flex-1 min-w-0 h-8 text-xs hover:bg-yellow-50 hover:text-yellow-600"
            >
              <Pause className="w-3 h-3 mr-1" />
              Pausar
            </Button>
          )}

          {campanha.status === 'agendada' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancelar}
              className="flex-1 min-w-0 h-8 text-xs hover:bg-orange-50 hover:text-orange-600"
            >
              <X className="w-3 h-3 mr-1" />
              Cancelar
            </Button>
          )}

          {/* Botão Excluir */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onExcluir}
            className="h-8 w-8 p-0 text-xs hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
