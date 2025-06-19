
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, MessageSquareMore, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImportSettingsProps {
  selectedChannel: string;
  importMessages: boolean;
  onImportToggle: (enabled: boolean) => void;
  importDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  showTyping: boolean;
  onTypingToggle: (enabled: boolean) => void;
  showRecording: boolean;
  onRecordingToggle: (enabled: boolean) => void;
}

/**
 * Componente para configurações de importação de mensagens
 * Exibe opções baseadas no canal selecionado
 * Inclui calendário responsivo e toggles para recursos especiais
 */
const ImportSettings = ({
  selectedChannel,
  importMessages,
  onImportToggle,
  importDate,
  onDateSelect,
  showTyping,
  onTypingToggle,
  showRecording,
  onRecordingToggle,
}: ImportSettingsProps) => {
  /**
   * Verifica se o canal suporta importação de mensagens
   * WebChat não suporta importação histórica
   */
  const supportsImport = selectedChannel !== 'webchat' && selectedChannel !== '';

  // Estado para controlar a abertura do popover do calendário
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  if (!selectedChannel) return null;

  return (
    <div className="space-y-6 pt-4 border-t brand-border">
      {/* Título da seção de configurações avançadas */}
      <h3 className="font-medium brand-text-foreground">
        Configurações Avançadas
      </h3>

      {/* Seção de importação de mensagens - apenas para canais que suportam */}
      {supportsImport && (
        <div className="space-y-4">
          {/* Toggle para ativar/desativar importação de mensagens */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="brand-text-foreground font-medium">
                Importar Mensagens Históricas
              </Label>
              <p className="text-sm brand-text-muted">
                Importar mensagens anteriores do canal selecionado
              </p>
            </div>
            <Switch
              checked={importMessages}
              onCheckedChange={onImportToggle}
              className="data-[state=checked]:brand-primary"
            />
          </div>

          {/* Seletor de data - aparece apenas quando importação está ativa */}
          {importMessages && (
            <div className="ml-4 space-y-2">
              <Label className="brand-text-foreground text-sm">
                Data de Início da Importação
              </Label>
              
              {/* Popover com calendário responsivo */}
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[240px] justify-start text-left font-normal brand-border",
                      !importDate && "brand-text-muted"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {importDate ? (
                      format(importDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 brand-card brand-border" 
                  align="start"
                  side="bottom"
                >
                  {/* Calendário com classe pointer-events-auto para funcionar em popover */}
                  <Calendar
                    mode="single"
                    selected={importDate}
                    onSelect={(date) => {
                      onDateSelect(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
              
              <p className="text-xs brand-text-muted">
                Mensagens partir desta data serão importadas
              </p>
            </div>
          )}
        </div>
      )}

      {/* Seção de indicadores de status - para todos os canais exceto WebChat */}
      {selectedChannel !== 'webchat' && (
        <div className="space-y-4">
          <h4 className="font-medium brand-text-foreground text-sm">
            Indicadores de Status
          </h4>
          
          {/* Toggle para indicador "Digitando..." */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquareMore className="h-4 w-4 brand-text-muted" />
              <div>
                <Label className="brand-text-foreground">
                  Mostrar "Digitando..."
                </Label>
                <p className="text-xs brand-text-muted">
                  Exibe indicador quando atendente está digitando
                </p>
              </div>
            </div>
            <Switch
              checked={showTyping}
              onCheckedChange={onTypingToggle}
              className="data-[state=checked]:brand-primary"
            />
          </div>

          {/* Toggle para indicador "Gravando áudio" */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mic className="h-4 w-4 brand-text-muted" />
              <div>
                <Label className="brand-text-foreground">
                  Mostrar "Gravando"
                </Label>
                <p className="text-xs brand-text-muted">
                  Exibe indicador quando atendente está gravando áudio
                </p>
              </div>
            </div>
            <Switch
              checked={showRecording}
              onCheckedChange={onRecordingToggle}
              className="data-[state=checked]:brand-primary"
            />
          </div>
        </div>
      )}

      {/* Instruções específicas para WebChat */}
      {selectedChannel === 'webchat' && (
        <div className="p-4 brand-card brand-border rounded-md">
          <h4 className="font-medium brand-text-foreground mb-2">
            Código de Incorporação WebChat
          </h4>
          <p className="text-sm brand-text-muted mb-3">
            Adicione este código ao seu site onde deseja que o chat apareça:
          </p>
          
          {/* Exemplo de código de incorporação */}
          <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
            {`<!-- WebChat Widget -->
<div id="webchat-widget"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://seu-dominio.com/webchat-sdk.js';
    script.onload = function() {
      WebChat.init({
        containerId: 'webchat-widget',
        connectionId: '[CONNECTION_ID]',
        theme: 'auto'
      });
    };
    document.head.appendChild(script);
  })();
</script>`}
          </div>
          
          <p className="text-xs brand-text-muted mt-2">
            <strong>Backend:</strong> Gerar connectionId único e configurar CORS para domínio do cliente.
            Implementar autenticação por session tokens.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImportSettings;
