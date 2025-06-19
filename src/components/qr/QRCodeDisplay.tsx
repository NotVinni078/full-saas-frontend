
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

interface QRCodeDisplayProps {
  connectionId: string;
  connectionName: string;
  onStatusChange?: (status: 'generating' | 'ready' | 'connected' | 'expired') => void;
}

/**
 * Componente para exibir QR Code da API Baileys
 * Funcionalidades implementadas:
 * - Exibição do QR Code em tempo real
 * - Status de conexão atualizado automaticamente
 * - Botão para regenerar QR Code expirado
 * - Layout responsivo com cores dinâmicas
 * - Instruções claras para o usuário
 */
const QRCodeDisplay = ({ connectionId, connectionName, onStatusChange }: QRCodeDisplayProps) => {
  // Estado para controlar o status do QR Code
  const [qrStatus, setQrStatus] = useState<'generating' | 'ready' | 'connected' | 'expired'>('generating');
  
  // Estado para armazenar a URL do QR Code
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Estado para countdown de expiração (QR Code expira em 20 segundos)
  const [countdown, setCountdown] = useState<number>(20);

  /**
   * Simula a geração do QR Code via API Baileys
   * Em produção, esta função fará uma chamada real para o backend
   */
  const generateQRCode = async () => {
    setQrStatus('generating');
    setCountdown(20);
    onStatusChange?.('generating');

    try {
      // Simula delay da API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção: const response = await fetch(`/api/baileys/qr/${connectionId}`)
      // Mock QR Code - substitua pela URL real da API
      const mockQrCode = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vY2sgUVIgQ29kZTwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjcwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q29uZXjDo28gSUQ6ICR7Y29ubmVjdGlvbklkfTwvdGV4dD4KPC9zdmc+`;
      
      setQrCodeUrl(mockQrCode);
      setQrStatus('ready');
      onStatusChange?.('ready');

      // Inicia o countdown de expiração
      startCountdown();

    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      setQrStatus('expired');
      onStatusChange?.('expired');
    }
  };

  /**
   * Inicia o countdown para expiração do QR Code
   * QR Codes da API Baileys expiram após 20 segundos
   */
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setQrStatus('expired');
          onStatusChange?.('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  /**
   * Simula a conexão bem-sucedida do WhatsApp
   * Em produção, isto seria acionado via WebSocket do backend
   */
  const simulateConnection = () => {
    setTimeout(() => {
      setQrStatus('connected');
      onStatusChange?.('connected');
    }, 8000); // Simula conexão após 8 segundos
  };

  // Gera o QR Code automaticamente quando o componente monta
  useEffect(() => {
    generateQRCode();
    // Simula conexão para demonstração
    simulateConnection();
  }, []);

  /**
   * Retorna o ícone apropriado baseado no status
   */
  const getStatusIcon = () => {
    switch (qrStatus) {
      case 'generating':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'ready':
        return <QrCode className="h-5 w-5 text-green-500" />;
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  /**
   * Retorna a mensagem de status apropriada
   */
  const getStatusMessage = () => {
    switch (qrStatus) {
      case 'generating':
        return 'Gerando QR Code...';
      case 'ready':
        return `QR Code pronto! Expira em ${countdown}s`;
      case 'connected':
        return 'WhatsApp conectado com sucesso!';
      case 'expired':
        return 'QR Code expirado. Clique para gerar um novo.';
    }
  };

  /**
   * Retorna a cor do status baseada no estado atual
   */
  const getStatusColor = () => {
    switch (qrStatus) {
      case 'generating':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400';
      case 'ready':
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
      case 'connected':
        return 'text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'expired':
        return 'text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400';
    }
  };

  return (
    <Card className="border-brand bg-brand-background">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-brand-foreground flex items-center gap-2">
          {getStatusIcon()}
          QR Code - {connectionName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Status atual da conexão */}
        <div className={`p-3 rounded-lg border ${getStatusColor()}`}>
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium text-sm">
              {getStatusMessage()}
            </span>
          </div>
        </div>

        {/* Área do QR Code */}
        <div className="flex flex-col items-center space-y-4">
          {qrStatus === 'generating' && (
            <div className="w-64 h-64 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-gray-400 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Gerando QR Code...</p>
              </div>
            </div>
          )}

          {(qrStatus === 'ready' || qrStatus === 'expired') && (
            <div className="relative">
              <img 
                src={qrCodeUrl} 
                alt="QR Code para conexão WhatsApp"
                className={`w-64 h-64 border-2 rounded-lg ${qrStatus === 'expired' ? 'opacity-50 border-red-300' : 'border-green-300'}`}
              />
              {qrStatus === 'expired' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <div className="text-center text-white">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Expirado</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {qrStatus === 'connected' && (
            <div className="w-64 h-64 bg-green-50 dark:bg-green-950 border-2 border-green-300 dark:border-green-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Conectado!
                </p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  WhatsApp conectado com sucesso
                </p>
              </div>
            </div>
          )}

          {/* Botão para regenerar QR Code */}
          {qrStatus === 'expired' && (
            <Button 
              onClick={generateQRCode}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Gerar Novo QR Code
            </Button>
          )}
        </div>

        {/* Instruções detalhadas */}
        <div className="space-y-3 p-4 bg-brand-muted/10 rounded-lg border border-brand">
          <h4 className="font-medium text-brand-foreground text-sm">
            Como conectar:
          </h4>
          <ol className="text-xs text-brand-muted space-y-2 list-decimal list-inside">
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque no menu (⋮) e selecione "Aparelhos conectados"</li>
            <li>Toque em "Conectar um aparelho"</li>
            <li>Aponte a câmera para este QR Code</li>
            <li>Aguarde a confirmação da conexão</li>
          </ol>
          
          <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              <strong>Importante:</strong> O QR Code expira em 20 segundos por segurança. 
              Se expirar, um novo será gerado automaticamente.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
