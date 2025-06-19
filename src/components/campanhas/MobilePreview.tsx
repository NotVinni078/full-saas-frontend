
import React from 'react';
import { TipoCanal, AnexoCampanha } from '@/types/campanhas';
import { Smartphone, MessageCircle, Mail, MessageSquare, Send, Phone } from 'lucide-react';

/**
 * Props para o componente de preview mobile
 */
interface MobilePreviewProps {
  /** Canal selecionado para visualização */
  canal: TipoCanal;
  /** Mensagem a ser visualizada */
  mensagem: string;
  /** Anexos da mensagem */
  anexos: AnexoCampanha[];
  /** Nome do remetente/empresa */
  nomeRemetente: string;
  /** Permite alternar entre canais */
  onChangeCanal?: (canal: TipoCanal) => void;
  /** Canais disponíveis */
  canaisDisponiveis?: TipoCanal[];
}

/**
 * Componente que simula a visualização da mensagem em um smartphone
 * Mostra exatamente como a mensagem aparecerá para o destinatário
 */
export const MobilePreview: React.FC<MobilePreviewProps> = ({
  canal,
  mensagem,
  anexos,
  nomeRemetente,
  onChangeCanal,
  canaisDisponiveis = [TipoCanal.WHATSAPP]
}) => {
  
  /**
   * Renderiza o ícone do canal selecionado
   */
  const renderCanalIcon = (canalTipo: TipoCanal) => {
    const iconProps = { className: "w-4 h-4" };
    
    switch (canalTipo) {
      case TipoCanal.WHATSAPP:
        return <MessageCircle {...iconProps} className="w-4 h-4 text-green-500" />;
      case TipoCanal.EMAIL:
        return <Mail {...iconProps} className="w-4 h-4 text-blue-500" />;
      case TipoCanal.SMS:
        return <Phone {...iconProps} className="w-4 h-4 text-orange-500" />;
      case TipoCanal.TELEGRAM:
        return <Send {...iconProps} className="w-4 h-4 text-blue-400" />;
      default:
        return <MessageSquare {...iconProps} />;
    }
  };

  /**
   * Processa a mensagem substituindo variáveis por valores de exemplo
   */
  const processarMensagem = (texto: string): string => {
    return texto
      .replace(/\{nome\}/g, 'João Silva')
      .replace(/\{empresa\}/g, 'Sua Empresa')
      .replace(/\{telefone\}/g, '(11) 99999-9999')
      .replace(/\{email\}/g, 'joao@email.com')
      .replace(/\{[\w\s]+\}/g, '[Variável]'); // Outras variáveis genéricas
  };

  /**
   * Renderiza o preview específico para WhatsApp
   */
  const renderWhatsAppPreview = () => (
    <div className="bg-green-50 min-h-full flex flex-col">
      {/* Header do WhatsApp */}
      <div className="bg-green-600 text-white p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-xs font-bold">
          {nomeRemetente.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{nomeRemetente}</div>
          <div className="text-xs opacity-90">online</div>
        </div>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 p-3 space-y-2">
        {/* Mensagem recebida */}
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            {/* Anexos */}
            {anexos.map((anexo, index) => (
              <div key={index} className="mb-2">
                {anexo.tipo === 'imagem' && (
                  <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                    🖼️ {anexo.nome}
                  </div>
                )}
                {anexo.tipo === 'video' && (
                  <div className="w-full h-32 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs">
                    ▶️ {anexo.nome}
                  </div>
                )}
                {anexo.tipo === 'documento' && (
                  <div className="bg-gray-100 p-2 rounded flex items-center gap-2 text-xs">
                    📄 {anexo.nome}
                  </div>
                )}
              </div>
            ))}
            
            {/* Texto da mensagem */}
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {processarMensagem(mensagem) || 'Digite sua mensagem aqui...'}
            </div>
            
            {/* Timestamp */}
            <div className="text-xs text-gray-500 mt-1 text-right">
              {new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renderiza o preview específico para Email
   */
  const render EmailPreview = () => (
    <div className="bg-white min-h-full flex flex-col">
      {/* Header do Email */}
      <div className="border-b p-3 space-y-2">
        <div className="text-sm">
          <span className="text-gray-600">De:</span> {nomeRemetente}
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Para:</span> joao@email.com
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Assunto:</span> Sua mensagem
        </div>
      </div>
      
      {/* Corpo do email */}
      <div className="flex-1 p-3">
        {/* Anexos */}
        {anexos.map((anexo, index) => (
          <div key={index} className="mb-3 p-2 bg-gray-50 rounded border-l-4 border-blue-500">
            <div className="text-xs text-gray-600 flex items-center gap-1">
              📎 Anexo: {anexo.nome}
            </div>
          </div>
        ))}
        
        {/* Conteúdo */}
        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
          {processarMensagem(mensagem) || 'Digite sua mensagem aqui...'}
        </div>
        
        {/* Assinatura */}
        <div className="mt-4 pt-4 border-t text-xs text-gray-600">
          <div>Atenciosamente,</div>
          <div className="font-medium">{nomeRemetente}</div>
        </div>
      </div>
    </div>
  );

  /**
   * Renderiza o preview específico para SMS
   */
  const renderSMSPreview = () => (
    <div className="bg-gray-100 min-h-full flex flex-col">
      {/* Header SMS */}
      <div className="bg-gray-800 text-white p-3 text-center">
        <div className="text-sm font-medium">Mensagens</div>
      </div>
      
      {/* Conversa SMS */}
      <div className="flex-1 p-3">
        <div className="space-y-2">
          {/* Mensagem recebida */}
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-2 max-w-[80%] shadow-sm">
              <div className="text-sm text-gray-800">
                {processarMensagem(mensagem) || 'Digite sua mensagem aqui...'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {nomeRemetente} • {new Date().toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Renderiza o preview específico para Telegram
   */
  const renderTelegramPreview = () => (
    <div className="bg-blue-50 min-h-full flex flex-col">
      {/* Header do Telegram */}
      <div className="bg-blue-500 text-white p-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
          {nomeRemetente.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-medium text-sm">{nomeRemetente}</div>
          <div className="text-xs opacity-90">online</div>
        </div>
      </div>
      
      {/* Área de mensagens */}
      <div className="flex-1 p-3 space-y-2">
        <div className="flex justify-start">
          <div className="bg-white rounded-2xl p-3 max-w-[80%] shadow-sm">
            {/* Anexos */}
            {anexos.map((anexo, index) => (
              <div key={index} className="mb-2">
                <div className="bg-gray-100 p-2 rounded text-xs">
                  {anexo.tipo === 'imagem' && '🖼️'}
                  {anexo.tipo === 'video' && '🎥'}
                  {anexo.tipo === 'documento' && '📄'}
                  {' '}{anexo.nome}
                </div>
              </div>
            ))}
            
            <div className="text-sm text-gray-800 whitespace-pre-wrap">
              {processarMensagem(mensagem) || 'Digite sua mensagem aqui...'}
            </div>
            
            <div className="text-xs text-gray-500 mt-1 text-right">
              {new Date().toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /**
   * Seleciona o preview apropriado baseado no canal
   */
  const renderPreviewContent = () => {
    switch (canal) {
      case TipoCanal.WHATSAPP:
        return renderWhatsAppPreview();
      case TipoCanal.EMAIL:
        return renderEmailPreview();
      case TipoCanal.SMS:
        return renderSMSPreview();
      case TipoCanal.TELEGRAM:
        return renderTelegramPreview();
      default:
        return renderWhatsAppPreview();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Seletor de canal (se houver múltiplos canais) */}
      {canaisDisponiveis.length > 1 && onChangeCanal && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            Canal para Preview:
          </label>
          <div className="flex flex-wrap gap-2">
            {canaisDisponiveis.map((canalDisponivel) => (
              <button
                key={canalDisponivel}
                onClick={() => onChangeCanal(canalDisponivel)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${canal === canalDisponivel 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                {renderCanalIcon(canalDisponivel)}
                {canalDisponivel.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mockup do smartphone */}
      <div className="relative">
        {/* Frame do smartphone */}
        <div className="bg-gray-900 rounded-3xl p-2 shadow-2xl">
          <div className="bg-black rounded-2xl p-1">
            <div className="bg-white rounded-xl overflow-hidden" style={{ height: '600px' }}>
              {/* Status bar */}
              <div className="bg-black text-white px-4 py-1 flex justify-between items-center text-xs">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <span className="ml-2">Preview</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>100%</span>
                  <div className="w-4 h-2 border border-white rounded-sm"></div>
                </div>
              </div>
              
              {/* Conteúdo do preview */}
              <div className="h-full">
                {renderPreviewContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Ícone do smartphone */}
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-2">
          <Smartphone className="w-4 h-4" />
        </div>
      </div>

      {/* Legenda explicativa */}
      <div className="mt-3 text-center">
        <div className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
          {renderCanalIcon(canal)}
          Preview - {canal.toUpperCase()}
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Visualização em tempo real da mensagem
        </div>
      </div>
    </div>
  );
};
