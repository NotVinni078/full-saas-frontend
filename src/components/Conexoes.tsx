import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, QrCode, Edit, AlertCircle } from 'lucide-react';
import { useSectors } from '@/hooks/useSectors';
import SectorSelector from '@/components/selectors/SectorSelector';
import MultipleSectorSelector from '@/components/selectors/MultipleSectorSelector';
import ChannelSelector from '@/components/selectors/ChannelSelector';
import ImportSettings from '@/components/selectors/ImportSettings';
import QRCodeModal from '@/components/qr/QRCodeModal';
import { useBaileysConnections, BaileysConnection } from '@/hooks/useBaileysConnections';
import ConnectionCard from './cards/ConnectionCard';

/**
 * Interface para nova conexão sendo criada
 */
interface NewConnection {
  name: string;
  sector: string | string[];
  channel: string;
  importSettings?: any;
}

/**
 * Componente principal de Gerenciamento de Conexões
 * Agora integrado com API Baileys real e banco de dados
 */
const Conexoes = () => {
  const { 
    connections, 
    loading, 
    error, 
    createConnection, 
    disconnectConnection, 
    deleteConnection 
  } = useBaileysConnections();

  // Estado para controlar o diálogo de nova conexão
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para controlar o diálogo de edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Estado para pesquisa de conexões
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para nova conexão sendo criada
  const [newConnection, setNewConnection] = useState<NewConnection>({
    name: '',
    sector: [],
    channel: '',
    importSettings: undefined
  });

  // Estado para conexão sendo editada
  const [editingConnection, setEditingConnection] = useState<BaileysConnection | null>(null);

  // Estado para controlar exibição do modal QR Code
  const [qrCodeModal, setQrCodeModal] = useState<{
    isOpen: boolean;
    connectionId: string;
    connectionName: string;
  }>({
    isOpen: false,
    connectionId: '',
    connectionName: ''
  });

  // Hook para acessar setores disponíveis
  const { getActiveSectors, getSectorById } = useSectors();

  /**
   * Formata a exibição dos setores para o card
   */
  const formatSectors = (sectors: string[]): string => {
    return sectors
      .map(id => getSectorById(id)?.nome || id)
      .join(', ');
  };

  /**
   * Filtra conexões baseado no termo de pesquisa
   */
  const filteredConnections = connections.filter(connection => {
    const searchLower = searchTerm.toLowerCase();
    const sectorNames = formatSectors(connection.sectors).toLowerCase();
    
    return connection.name.toLowerCase().includes(searchLower) ||
           connection.channel_type.toLowerCase().includes(searchLower) ||
           sectorNames.includes(searchLower);
  });

  /**
   * Manipula a criação de uma nova conexão
   */
  const handleCreateConnection = async () => {
    if (!newConnection.name || !newConnection.sector || !newConnection.channel) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const sectorsArray = Array.isArray(newConnection.sector) ? newConnection.sector : [newConnection.sector];
    
    const result = await createConnection({
      name: newConnection.name,
      sectors: sectorsArray
    });

    if (result) {
      // Reset do formulário
      setNewConnection({
        name: '',
        sector: [],
        channel: '',
        importSettings: undefined
      });
      
      setIsDialogOpen(false);
      
      // Abre modal QR Code se for WhatsApp QR
      if (newConnection.channel === 'whatsapp-qr') {
        setQrCodeModal({
          isOpen: true,
          connectionId: result.connection_id,
          connectionName: newConnection.name
        });
      }
    }
  };

  /**
   * Manipula a conexão de uma conexão desconectada
   * Abre o modal QR Code para canais que necessitam
   */
  const handleConnect = (connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId);
    
    if (!connection) return;
    
    // Se for WhatsApp QR, abre o modal
    if (connection.channel_type === 'whatsapp-qr') {
      setQrCodeModal({
        isOpen: true,
        connectionId: connectionId,
        connectionName: connection.name
      });
    }
  };

  /**
   * Manipula a edição de uma conexão existente
   */
  const handleEditConnection = (connection: BaileysConnection) => {
    setEditingConnection(connection);
    setIsEditDialogOpen(true);
  };

  /**
   * Manipula a desconexão de uma conexão
   */
  const handleDisconnect = async (connectionId: string) => {
    await disconnectConnection(connectionId);
  };

  /**
   * Manipula a exclusão de uma conexão
   */
  const handleDelete = async (connectionId: string) => {
    await deleteConnection(connectionId);
  };

  /**
   * Atualiza as configurações de importação da nova conexão
   */
  const handleImportSettingsChange = (settings: any) => {
    setNewConnection(prev => ({
      ...prev,
      importSettings: settings
    }));
  };

  /**
   * Fecha o modal QR Code
   */
  const closeQRModal = () => {
    setQrCodeModal({
      isOpen: false,
      connectionId: '',
      connectionName: ''
    });
  };

  /**
   * Converte status do banco para status do card
   */
  const getCardStatus = (status: string): 'connected' | 'disconnected' | 'error' => {
    switch (status) {
      case 'connected':
        return 'connected';
      case 'error':
        return 'error';
      default:
        return 'disconnected';
    }
  };

  /**
   * Formata data de última atividade
   */
  const formatLastActivity = (lastActivity?: string): string => {
    if (!lastActivity) return 'Nunca conectado';
    
    try {
      const date = new Date(lastActivity);
      return date.toLocaleString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  // Exibir loading
  if (loading) {
    return (
      <div className="p-4 lg:p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-brand-muted">Carregando conexões...</p>
        </div>
      </div>
    );
  }

  // Exibir erro
  if (error) {
    return (
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-brand-foreground mb-2">
              Erro ao carregar conexões
            </h3>
            <p className="text-brand-muted mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-brand text-brand-foreground"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Cabeçalho principal */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-brand-foreground">
            Gerenciar Conexões
          </h1>
          <p className="text-brand-muted mt-1 text-sm lg:text-base">
            Configure e gerencie suas conexões com diferentes canais de comunicação
          </p>
        </div>
      </div>

      {/* Barra de ferramentas */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Barra de pesquisa */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-muted" />
          <Input
            placeholder="Pesquisar conexões..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-brand bg-brand-background text-brand-foreground placeholder:text-brand-muted"
          />
        </div>

        {/* Botão para criar nova conexão */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Criar Conexão
            </Button>
          </DialogTrigger>
          
          {/* Modal de criação de conexão */}
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4 border-brand bg-brand-background">
            <DialogHeader>
              <DialogTitle className="text-brand-foreground">Nova Conexão</DialogTitle>
              <DialogDescription className="text-brand-muted">
                Configure uma nova conexão com um canal de comunicação
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Campo nome da conexão */}
              <div className="space-y-2">
                <Label htmlFor="connectionName" className="text-brand-foreground">
                  Nome da Conexão *
                </Label>
                <Input
                  id="connectionName"
                  value={newConnection.name}
                  onChange={(e) => setNewConnection({...newConnection, name: e.target.value})}
                  placeholder="Ex: WhatsApp Principal"
                  className="border-brand bg-brand-background text-brand-foreground placeholder:text-brand-muted"
                />
              </div>

              {/* Seletor múltiplo de setores */}
              <div className="space-y-2">
                <Label className="text-brand-foreground">Setores Responsáveis *</Label>
                <MultipleSectorSelector
                  value={Array.isArray(newConnection.sector) ? newConnection.sector : []}
                  onValueChange={(sectors) => setNewConnection({...newConnection, sector: sectors})}
                  placeholder="Selecione os setores responsáveis"
                />
              </div>

              {/* Seletor de canal */}
              <div className="space-y-2">
                <ChannelSelector
                  value={newConnection.channel}
                  onValueChange={(channel) => setNewConnection({...newConnection, channel})}
                />
              </div>

              {/* Configurações de importação */}
              {newConnection.channel && (
                <ImportSettings
                  channel={newConnection.channel}
                  onSettingsChange={handleImportSettingsChange}
                />
              )}

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-brand">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto border-brand text-brand-foreground hover:bg-brand-accent"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateConnection}
                  disabled={!newConnection.name || !newConnection.sector || !newConnection.channel}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                >
                  Criar Conexão
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal flutuante do QR Code */}
      <QRCodeModal
        isOpen={qrCodeModal.isOpen}
        onClose={closeQRModal}
        connectionId={qrCodeModal.connectionId}
        connectionName={qrCodeModal.connectionName}
      />

      {/* Grid de conexões existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={{
                id: connection.id,
                name: connection.name,
                channel: connection.channel_type,
                sector: formatSectors(connection.sectors),
                status: getCardStatus(connection.status),
                lastActivity: formatLastActivity(connection.last_activity_at)
              }}
              onRestart={() => {}}
              onDisconnect={() => handleDisconnect(connection.id)}
              onConnect={() => handleConnect(connection.id)}
              onDelete={() => handleDelete(connection.id)}
              onEdit={() => {}}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <QrCode className="h-16 w-16 text-brand-muted mb-4" />
            <h3 className="text-lg font-semibold text-brand-foreground mb-2">
              {searchTerm ? 'Nenhuma conexão encontrada' : 'Nenhuma conexão configurada'}
            </h3>
            <p className="text-brand-muted mb-4 max-w-md">
              {searchTerm 
                ? 'Tente alterar os termos da pesquisa ou criar uma nova conexão.'
                : 'Comece criando sua primeira conexão com WhatsApp.'
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Conexão
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Instruções de configuração atualizadas com Facebook e Instagram */}
      <Card className="border-brand bg-brand-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-foreground">
            <QrCode className="h-5 w-5" />
            Instruções de Configuração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp QR Code */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">WhatsApp QR Code</h4>
              <p className="text-sm text-brand-muted">
                Escaneie o QR Code com seu WhatsApp para conectar. 
                Ideal para testes e uso pessoal.
              </p>
            </div>
            
            {/* WhatsApp API Oficial */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">WhatsApp API Oficial</h4>
              <p className="text-sm text-brand-muted">
                Conecte via Meta Business API. Requer aprovação e verificação de negócio.
              </p>
            </div>
            
            {/* Telegram */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">Telegram</h4>
              <p className="text-sm text-brand-muted">
                Configure um bot via @BotFather e conecte através do token gerado.
              </p>
            </div>
            
            {/* Facebook - Nova instrução */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">Facebook</h4>
              <p className="text-sm text-brand-muted">
                Conecte via Meta Business API. Requer conta business e permissões de páginas 
                para gerenciar mensagens do Messenger.
              </p>
            </div>
            
            {/* Instagram - Nova instrução */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">Instagram</h4>
              <p className="text-sm text-brand-muted">
                Conecte via Instagram Business API. Conta business obrigatória e 
                vinculação com página do Facebook necessária.
              </p>
            </div>
            
            {/* WebChat */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">WebChat</h4>
              <p className="text-sm text-brand-muted">
                Incorpore o chat diretamente no seu site usando o código fornecido.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conexoes;
