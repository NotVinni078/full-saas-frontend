
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChannelIcons } from './ChannelIcons';

type Canal = 'whatsapp' | 'facebook' | 'instagram' | 'telegram';

interface MessagePreviewProps {
  canais: Canal[];
  mensagem: string;
  arquivo?: string;
  remetente: string;
}

/**
 * Componente de preview realista da mensagem
 * Simula a aparência em cada canal selecionado
 * Mockup responsivo de smartphone com ícones oficiais
 * Substitui variáveis por dados de exemplo
 */
export const MessagePreview: React.FC<MessagePreviewProps> = ({
  canais,
  mensagem,
  arquivo,
  remetente
}) => {
  const [canalAtivo, setCanalAtivo] = useState<Canal>(canais[0] || 'whatsapp');

  /**
   * Substitui variáveis na mensagem por dados de exemplo
   */
  const processarMensagem = (texto: string): string => {
    return texto
      .replace(/{nome}/g, 'João Silva')
      .replace(/{email}/g, 'joao@email.com')
      .replace(/{telefone}/g, '(11) 99999-9999');
  };

  /**
   * Configuração visual de cada canal
   */
  const canalConfig = {
    whatsapp: {
      nome: 'WhatsApp',
      cor: '#25D366',
      corFundo: '#f0f2f5',
      corMensagem: '#dcf8c6',
      corTexto: '#303030'
    },
    facebook: {
      nome: 'Messenger',
      cor: '#0084FF',
      corFundo: '#f5f5f5',
      corMensagem: '#0084FF',
      corTexto: '#ffffff'
    },
    instagram: {
      nome: 'Instagram',
      cor: '#E4405F',
      corFundo: '#f5f5f5',
      corMensagem: '#E4405F',
      corTexto: '#ffffff'
    },
    telegram: {
      nome: 'Telegram',
      cor: '#0088cc',
      corFundo: '#f5f5f5',
      corMensagem: '#0088cc',
      corTexto: '#ffffff'
    }
  };

  const config = canalConfig[canalAtivo];
  const mensagemProcessada = processarMensagem(mensagem);

  if (canais.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Selecione pelo menos um canal para ver o preview
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Seletor de canal para preview */}
      {canais.length > 1 && (
        <Tabs value={canalAtivo} onValueChange={(value) => setCanalAtivo(value as Canal)}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {canais.map((canal) => (
              <TabsTrigger key={canal} value={canal} className="flex items-center gap-2">
                <ChannelIcons canais={[canal]} size="sm" />
                <span className="hidden sm:inline">{canalConfig[canal].nome}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Preview do smartphone */}
      <div className="flex justify-center">
        <div className="relative">
          {/* Moldura do smartphone */}
          <div className="w-80 h-[600px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
              
              {/* Barra superior do app */}
              <div 
                className="h-16 flex items-center px-4 text-white"
                style={{ backgroundColor: config.cor }}
              >
                <div className="flex items-center gap-3">
                  <ChannelIcons canais={[canalAtivo]} size="md" />
                  <div>
                    <p className="font-medium text-sm">{remetente}</p>
                    <p className="text-xs opacity-90">online</p>
                  </div>
                </div>
              </div>

              {/* Área de conversa */}
              <div 
                className="flex-1 p-4 overflow-y-auto"
                style={{ backgroundColor: config.corFundo }}
              >
                <div className="space-y-4">
                  {/* Mensagem recebida (exemplo) */}
                  <div className="flex">
                    <div className="bg-white rounded-lg p-3 max-w-xs shadow-sm">
                      <p className="text-sm text-gray-800">
                        Olá! Como posso ajudar?
                      </p>
                      <p className="text-xs text-gray-500 mt-1">14:30</p>
                    </div>
                  </div>

                  {/* Mensagem da campanha */}
                  <div className="flex justify-end">
                    <div 
                      className="rounded-lg p-3 max-w-xs shadow-sm"
                      style={{ 
                        backgroundColor: canalAtivo === 'whatsapp' ? config.corMensagem : config.cor,
                        color: canalAtivo === 'whatsapp' ? config.corTexto : config.corTexto
                      }}
                    >
                      {/* Arquivo anexo (se houver) */}
                      {arquivo && (
                        <div className="mb-3 p-2 bg-black/10 rounded-md">
                          <p className="text-xs opacity-75">📎 Anexo enviado</p>
                        </div>
                      )}
                      
                      {/* Texto da mensagem */}
                      <p className="text-sm whitespace-pre-wrap">
                        {mensagemProcessada || 'Digite sua mensagem...'}
                      </p>
                      
                      {/* Horário e status */}
                      <div className="flex items-center justify-end gap-1 mt-2">
                        <p className="text-xs opacity-75">14:32</p>
                        {canalAtivo === 'whatsapp' && (
                          <span className="text-xs opacity-75">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Indicador de digitação */}
                  <div className="flex">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de digitação */}
              <div className="h-16 bg-white border-t border-gray-200 flex items-center px-4">
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2">
                  <p className="text-sm text-gray-500">Digite uma mensagem...</p>
                </div>
                <button className="ml-2 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: config.cor }}>
                  <span className="text-white text-sm">➤</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações sobre o preview */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              Preview: {config.nome}
            </p>
            <p className="text-xs text-muted-foreground">
              Visualização aproximada de como a mensagem aparecerá no {config.nome}
            </p>
            {mensagemProcessada.includes('{') && (
              <p className="text-xs text-amber-600">
                ⚠️ Algumas variáveis não foram substituídas. Verifique a sintaxe.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
