
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChannelIcons } from './ChannelIcons';
import { Calendar, Clock, Users, MessageSquare, TrendingUp } from 'lucide-react';

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

interface CampanhaDetailsModalProps {
  open: boolean;
  onClose: () => void;
  campanha: Campanha | null;
}

/**
 * Modal para exibir detalhes completos de uma campanha
 * Mostra estatísticas, configurações e progresso da campanha
 * Design responsivo com cards informativos
 */
export const CampanhaDetailsModal: React.FC<CampanhaDetailsModalProps> = ({
  open,
  onClose,
  campanha
}) => {
  if (!campanha) return null;

  /**
   * Retorna a cor do status da campanha
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendada':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'em_andamento':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'finalizada':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'erro':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * Formata data para exibição
   */
  const formatarData = (data: Date) => {
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const progressoEnvio = campanha.contatosTotal > 0 
    ? (campanha.contatosEnviados / campanha.contatosTotal) * 100 
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-card border-border">
        {/* Cabeçalho do modal */}
        <DialogHeader className="pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-foreground mb-2">
                {campanha.nome}
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(campanha.status)}>
                  {campanha.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <ChannelIcons canais={campanha.canais} size="sm" />
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo scrollável do modal */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Estatísticas da campanha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso de Envio</span>
                    <span>{campanha.contatosEnviados} / {campanha.contatosTotal}</span>
                  </div>
                  <Progress value={progressoEnvio} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {campanha.taxaSucesso.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Taxa de Sucesso
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground">
                      {campanha.canais.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Canais Ativos
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Remetente:</span>
                  <p className="text-foreground">{campanha.remetente}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Total de Contatos:</span>
                  <p className="text-foreground">{campanha.contatosTotal.toLocaleString()}</p>
                </div>
                
                {campanha.arquivo && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Arquivo Anexo:</span>
                    <p className="text-foreground">{campanha.arquivo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Datas importantes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Cronograma
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data de Início:</span>
                  <p className="text-foreground">{formatarData(campanha.dataInicio)}</p>
                </div>
                
                {campanha.dataFim && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Data de Fim:</span>
                    <p className="text-foreground">{formatarData(campanha.dataFim)}</p>
                  </div>
                )}
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Criada em:</span>
                  <p className="text-foreground">{formatarData(campanha.criadoEm)}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Última atualização:</span>
                  <p className="text-foreground">{formatarData(campanha.atualizadoEm)}</p>
                </div>
              </CardContent>
            </Card>

            {/* Mensagem da campanha */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">
                    {campanha.mensagem}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
