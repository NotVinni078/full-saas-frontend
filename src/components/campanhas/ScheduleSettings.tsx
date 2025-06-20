
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock } from 'lucide-react';

interface ScheduleSettingsProps {
  agendamento: {
    imediato: boolean;
    dataInicio: string;
    horaInicio: string;
    dataFim?: string;
    horaFim?: string;
  };
  onChange: (agendamento: any) => void;
  error?: string;
}

/**
 * Componente para configurações de agendamento da campanha
 * Permite definir quando a campanha deve ser executada
 * Suporta envio imediato ou agendado
 */
export const ScheduleSettings: React.FC<ScheduleSettingsProps> = ({
  agendamento,
  onChange,
  error
}) => {

  /**
   * Atualiza uma propriedade do agendamento
   */
  const updateAgendamento = (key: string, value: any) => {
    onChange({
      ...agendamento,
      [key]: value
    });
  };

  /**
   * Obtém a data mínima (hoje)
   */
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  /**
   * Obtém a hora mínima (agora, se for hoje)
   */
  const getMinTime = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (agendamento.dataInicio === today) {
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    
    return '00:00';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Switch para envio imediato */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Enviar Imediatamente</Label>
            <p className="text-xs text-muted-foreground">
              A campanha será executada assim que for salva
            </p>
          </div>
          <Switch
            checked={agendamento.imediato}
            onCheckedChange={(checked) => updateAgendamento('imediato', checked)}
          />
        </div>

        {/* Configurações de agendamento (apenas se não for imediato) */}
        {!agendamento.imediato && (
          <div className="space-y-4 pt-4 border-t border-border">
            
            {/* Data e hora de início */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio" className="text-sm font-medium">
                  Data de Início *
                </Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={agendamento.dataInicio}
                  onChange={(e) => updateAgendamento('dataInicio', e.target.value)}
                  min={getMinDate()}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="horaInicio" className="text-sm font-medium">
                  Hora de Início *
                </Label>
                <Input
                  id="horaInicio"
                  type="time"
                  value={agendamento.horaInicio}
                  onChange={(e) => updateAgendamento('horaInicio', e.target.value)}
                  min={getMinTime()}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Data e hora de fim (opcional) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataFim" className="text-sm font-medium">
                  Data de Fim (Opcional)
                </Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={agendamento.dataFim || ''}
                  onChange={(e) => updateAgendamento('dataFim', e.target.value || undefined)}
                  min={agendamento.dataInicio}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Deixe vazio para campanha sem data limite
                </p>
              </div>
              
              <div>
                <Label htmlFor="horaFim" className="text-sm font-medium">
                  Hora de Fim (Opcional)
                </Label>
                <Input
                  id="horaFim"
                  type="time"
                  value={agendamento.horaFim || ''}
                  onChange={(e) => updateAgendamento('horaFim', e.target.value || undefined)}
                  className="mt-1"
                  disabled={!agendamento.dataFim}
                />
              </div>
            </div>

            {/* Informações importantes */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">Dicas de Agendamento:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Evite horários de pico para melhor entrega</li>
                    <li>• Considere o fuso horário dos seus contatos</li>
                    <li>• Campanhas grandes podem demorar para finalizar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Erro de validação */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};
