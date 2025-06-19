
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, MessageSquareMore, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImportSettingsProps {
  channel: string;
  onSettingsChange: (settings: ImportSettings) => void;
}

interface ImportSettings {
  importMessages: boolean;
  importDate?: Date;
  showTyping: boolean;
  showRecording: boolean;
}

/**
 * Componente para configurações de importação de mensagens
 * Exibido apenas para canais que suportam importação (não WebChat)
 * Permite configurar data de importação e indicadores de digitação/gravação
 * Responsivo para todos os tamanhos de tela
 */
const ImportSettings = ({ channel, onSettingsChange }: ImportSettingsProps) => {
  // Estado local para gerenciar as configurações
  const [settings, setSettings] = useState<ImportSettings>({
    importMessages: false,
    importDate: undefined,
    showTyping: true,
    showRecording: true
  });

  /**
   * Verifica se o canal selecionado suporta importação de mensagens
   * WebChat não suporta importação por ser canal novo
   */
  const supportsImport = channel !== 'webchat';

  /**
   * Atualiza uma configuração específica e notifica o componente pai
   */
  const updateSetting = (key: keyof ImportSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  // Se o canal não suporta importação, não renderiza nada
  if (!supportsImport) {
    return null;
  }

  return (
    <Card className="border-brand bg-brand-background">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-brand-foreground flex items-center gap-2">
          <MessageSquareMore className="h-4 w-4" />
          Configurações de Importação
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Toggle para ativar/desativar importação de mensagens */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium text-brand-foreground">
              Importar Mensagens Históricas
            </Label>
            <p className="text-xs text-brand-muted">
              Importa conversas existentes do canal selecionado
            </p>
          </div>
          <Switch
            checked={settings.importMessages}
            onCheckedChange={(checked) => updateSetting('importMessages', checked)}
            className="data-[state=checked]:bg-primary"
          />
        </div>

        {/* Seletor de data - só aparece se importação estiver ativada */}
        {settings.importMessages && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-brand-foreground">
              Data de Início da Importação
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-brand",
                    !settings.importDate && "text-brand-muted"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {settings.importDate ? (
                    format(settings.importDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    "Selecionar data"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-brand bg-brand-background" align="start">
                {/* Calendário responsivo com cores dinâmicas */}
                <Calendar
                  mode="single"
                  selected={settings.importDate}
                  onSelect={(date) => updateSetting('importDate', date)}
                  disabled={(date) => date > new Date() || date < new Date("2020-01-01")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-brand-muted">
              Mensagens anteriores a esta data não serão importadas
            </p>
          </div>
        )}

        {/* Configurações de indicadores de status */}
        <div className="space-y-3 pt-2 border-t border-brand">
          <Label className="text-sm font-medium text-brand-foreground">
            Indicadores de Status do Atendente
          </Label>
          
          {/* Toggle para indicador "Digitando..." */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquareMore className="h-4 w-4 text-brand-muted" />
              <div>
                <Label className="text-sm text-brand-foreground">Digitando...</Label>
                <p className="text-xs text-brand-muted">
                  Mostra quando atendente está digitando
                </p>
              </div>
            </div>
            <Switch
              checked={settings.showTyping}
              onCheckedChange={(checked) => updateSetting('showTyping', checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Toggle para indicador "Gravando" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mic className="h-4 w-4 text-brand-muted" />
              <div>
                <Label className="text-sm text-brand-foreground">Gravando</Label>
                <p className="text-xs text-brand-muted">
                  Mostra quando atendente está gravando áudio
                </p>
              </div>
            </div>
            <Switch
              checked={settings.showRecording}
              onCheckedChange={(checked) => updateSetting('showRecording', checked)}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Informações técnicas para o backend */}
        <div className="text-xs text-brand-muted bg-brand-muted/10 p-2 rounded">
          <strong>Para Backend:</strong> APIs devem consultar estes status via endpoints:
          GET /api/connection/{`{connectionId}`}/typing-status e 
          GET /api/connection/{`{connectionId}`}/recording-status
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportSettings;
