
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Wifi, RefreshCw, AlertCircle, Smartphone } from 'lucide-react';
import { ConnectionCard } from '@/features/connections/components/ConnectionCard';
import { NewConnectionModal } from '@/features/connections/components/NewConnectionModal';
import { useConnections } from '@/features/connections/hooks/useConnections';
import { useQRCodeModal } from '@/features/qr/hooks/useQRCodeModal';
import QRCodeModal from '@/components/qr/QRCodeModal';

/**
 * Página principal de gerenciamento de conexões WhatsApp
 * Refatorada para usar os novos hooks e componentes modulares
 */
const Conexoes = () => {
  const [showNewConnectionModal, setShowNewConnectionModal] = useState(false);
  
  const {
    connections,
    loading,
    error,
    createConnection,
    disconnectConnection,
    deleteConnection,
    reconnectConnection,
    refreshConnections,
    getQRCode
  } = useConnections();

  const {
    isOpen: isQRModalOpen,
    connectionId: qrConnectionId,
    connectionName: qrConnectionName,
    openModal: openQRModal,
    closeModal: closeQRModal
  } = useQRCodeModal();

  // Estatísticas das conexões
  const connectedCount = connections.filter(c => c.status === 'connected').length;
  const totalCount = connections.length;

  const handleShowQR = async (connection: any) => {
    const qrResult = await getQRCode(connection.id);
    if (qrResult) {
      openQRModal(connection.id, connection.name);
    }
  };

  const handleReconnect = async (connectionId: string) => {
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
      const qrResult = await reconnectConnection(connectionId);
      if (qrResult) {
        openQRModal(connectionId, connection.name);
      }
    }
  };

  if (loading && connections.length === 0) {
    return (
      <div className="p-6 brand-background min-h-full">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-brand-muted">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Carregando conexões...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 brand-background min-h-full space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold brand-text-foreground flex items-center gap-2">
            <Wifi className="h-6 w-6" />
            Conexões WhatsApp
          </h1>
          <p className="brand-text-muted">
            Gerencie suas conexões WhatsApp Business API via Baileys
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshConnections}
            disabled={loading}
            className="border-brand text-brand-foreground"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          
          <Button
            onClick={() => setShowNewConnectionModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conexão
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-brand bg-brand-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Total de Conexões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">{totalCount}</div>
          </CardContent>
        </Card>
        
        <Card className="border-brand bg-brand-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Conectadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{connectedCount}</div>
          </CardContent>
        </Card>
        
        <Card className="border-brand bg-brand-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium brand-text-muted">Taxa de Conexão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold brand-text-foreground">
              {totalCount > 0 ? Math.round((connectedCount / totalCount) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de erro */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lista de conexões */}
      {connections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onShowQR={handleShowQR}
              onDisconnect={disconnectConnection}
              onDelete={deleteConnection}
              onReconnect={handleReconnect}
            />
          ))}
        </div>
      ) : !loading && (
        <Card className="border-brand bg-brand-background">
          <CardContent className="p-12 text-center">
            <Smartphone className="h-12 w-12 brand-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold brand-text-foreground mb-2">
              Nenhuma conexão encontrada
            </h3>
            <p className="brand-text-muted mb-6">
              Crie sua primeira conexão WhatsApp para começar a usar o sistema.
            </p>
            <Button
              onClick={() => setShowNewConnectionModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeira Conexão
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modais */}
      <NewConnectionModal
        isOpen={showNewConnectionModal}
        onClose={() => setShowNewConnectionModal(false)}
        onCreateConnection={createConnection}
      />

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={closeQRModal}
        connectionId={qrConnectionId}
        connectionName={qrConnectionName}
      />
    </div>
  );
};

export default Conexoes;
