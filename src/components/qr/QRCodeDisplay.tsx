
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, RefreshCw, CheckCircle, AlertCircle, Smartphone } from 'lucide-react';
import { useBaileysConnections } from '@/hooks/useBaileysConnections';

interface QRCodeDisplayProps {
  connectionId: string;
  connectionName: string;
  onStatusChange?: (status: 'generating' | 'ready' | 'connected' | 'expired') => void;
}

/**
 * Componente para exibir QR Code real do Baileys
 * Integrado com a biblioteca oficial WhatsApp Web
 */
const QRCodeDisplay = ({ connectionId, connectionName, onStatusChange }: QRCodeDisplayProps) => {
  const { getQRCode, getConnectionStatus } = useBaileysConnections();
  
  // Estado para controlar o status do QR Code
  const [qrStatus, setQrStatus] = useState<'generating' | 'ready' | 'connected' | 'expired'>('generating');
  
  // Estado para armazenar a URL do QR Code
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  
  // Estado para countdown de expiração (60 segundos)
  const [countdown, setCountdown] = useState<number>(60);

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
        return 'Inicializando Baileys WhatsApp...';
      case 'ready':
        return `QR Code pronto! Expira em ${countdown}s`;
      case 'connected':
        return 'WhatsApp conectado via Baileys!';
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

  /**
   * Busca o QR Code atual do servidor usando Baileys
   */
  const fetchQRCode = async () => {
    setQrStatus('generating');
    setCountdown(60);
    onStatusChange?.('generating');

    try {
      console.log('Solicitando QR Code real do Baileys...');
      const qrData = await getQRCode(connectionId);
      
      if (qrData && qrData.qr_code) {
        console.log('QR Code real recebido do Baileys');
        setQrCodeUrl(qrData.qr_code);
        setQrStatus('ready');
        onStatusChange?.('ready');
        
        // Calcular countdown baseado na expiração
        if (qrData.expires_at) {
          const expiresAt = new Date(qrData.expires_at);
          const now = new Date();
          const timeLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
          setCountdown(timeLeft);
          
          if (timeLeft > 0) {
            startCountdown(timeLeft);
          } else {
            setQrStatus('expired');
            onStatusChange?.('expired');
          }
        }
      } else {
        throw new Error('QR Code não disponível do Baileys');
      }
    } catch (error) {
      console.error('Erro ao buscar QR Code do Baileys:', error);
      setQrStatus('expired');
      onStatusChange?.('expired');
    }
  };

  /**
   * Inicia o countdown para expiração do QR Code
   */
  const startCountdown = (initialTime: number) => {
    let timeLeft = initialTime;
    
    const timer = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        setQrStatus('expired');
        onStatusChange?.('expired');
      }
    }, 1000);
    
    return timer;
  };

  /**
   * Verifica o status da conexão periodicamente
   */
  const checkConnectionStatus = async () => {
    try {
      const statusData = await getConnectionStatus(connectionId);
      
      if (statusData && statusData.status === 'connected') {
        console.log('Conexão WhatsApp estabelecida via Baileys!');
        setQrStatus('connected');
        onStatusChange?.('connected');
      }
    } catch (error) {
      console.error('Erro ao verificar status do Baileys:', error);
    }
  };

  // Busca o QR Code quando o componente monta
  useEffect(() => {
    fetchQRCode();
    
    // Verifica status da conexão a cada 2 segundos para respostas mais rápidas
    const statusInterval = setInterval(checkConnectionStatus, 2000);
    
    return () => {
      clearInterval(statusInterval);
    };
  }, [connectionId]);

  return (
    <Card className="border-brand bg-brand-background">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-brand-foreground flex items-center gap-2">
          {getStatusIcon()}
          QR Code Baileys - {connectionName}
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
                <p className="text-sm text-gray-500">Conectando com Baileys...</p>
                <p className="text-xs text-gray-400 mt-1">Gerando QR Code real</p>
              </div>
            </div>
          )}

          {(qrStatus === 'ready' || qrStatus === 'expired') && qrCodeUrl && (
            <div className="relative">
              <img 
                src={qrCodeUrl} 
                alt="QR Code real do WhatsApp via Baileys"
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
                  WhatsApp conectado via Baileys
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Smartphone className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-green-600">Conexão ativa</span>
                </div>
              </div>
            </div>
          )}

          {/* Botão para regenerar QR Code */}
          {qrStatus === 'expired' && (
            <Button 
              onClick={fetchQRCode}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Gerar Novo QR Code
            </Button>
          )}
        </div>

        {/* Instruções detalhadas */}
        <div className="space-y-3 p-4 bg-brand-muted/10 rounded-lg border border-brand">
          <h4 className="font-medium text-brand-foreground text-sm flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Como conectar via Baileys:
          </h4>
          <ol className="text-xs text-brand-muted space-y-2 list-decimal list-inside">
            <li>Abra o WhatsApp no seu celular</li>
            <li>Toque no menu (⋮) e selecione "Aparelhos conectados"</li>
            <li>Toque em "Conectar um aparelho"</li>
            <li>Aponte a câmera para este QR Code real</li>
            <li>Aguarde a confirmação da conexão</li>
          </ol>
          
          <div className="mt-3 p-2 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded">
            <p className="text-xs text-green-800 dark:text-green-200">
              <strong>✅ Baileys Integrado:</strong> Este QR Code é gerado pela biblioteca oficial 
              Baileys, garantindo compatibilidade total com o WhatsApp Web!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
