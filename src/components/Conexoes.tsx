import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, QrCode, Edit } from 'lucide-react';
import { useSectors } from '@/hooks/useSectors';
import SectorSelector from '@/components/selectors/SectorSelector';
import MultipleSectorSelector from '@/components/selectors/MultipleSectorSelector';
import ChannelSelector from '@/components/selectors/ChannelSelector';
import ImportSettings from '@/components/selectors/ImportSettings';
import ConnectionCard from '@/components/cards/ConnectionCard';
import QRCodeDisplay from '@/components/qr/QRCodeDisplay';

/**
 * Interface para definir uma conexão
 * Contém todas as informações necessárias para gerenciar canais
 */
interface Connection {
  id: string;
  name: string;
  channel: string;
  sector: string | string[]; // Agora suporta múltiplos setores
  status: 'connected' | 'disconnected' | 'error';
  lastActivity: string;
  importSettings?: {
    importMessages: boolean;
    importDate?: Date;
    showTyping: boolean;
    showRecording: boolean;
  };
}

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
 * Melhorias implementadas:
 * - Botão "Editar" adicionado aos cards de conexão
 * - Instruções completas para Facebook e Instagram
 * - Seleção múltipla de setores no formulário
 * - Layout para exibição de QR Code da API Baileys
 * - Modal de edição de conexões existentes
 * - Responsividade aprimorada para todas as telas
 * - Cores dinâmicas da gestão de marca mantidas
 */
const Conexoes = () => {
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
  const [editingConnection, setEditingConnection] = useState<Connection | null>(null);

  // Estado para controlar exibição do QR Code
  const [showQRCode, setShowQRCode] = useState<string | null>(null);

  // Hook para acessar setores disponíveis
  const { getActiveSectors, getSectorById } = useSectors();

  // Estado para conexões existentes (dados mock atualizados)
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'WhatsApp Principal',
      channel: 'whatsapp-qr',
      sector: ['vendas', 'suporte'], // Múltiplos setores
      status: 'connected',
      lastActivity: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Instagram Oficial',
      channel: 'instagram',
      sector: ['marketing'],
      status: 'connected',
      lastActivity: '2024-01-15 14:25'
    },
    {
      id: '3',
      name: 'Telegram Suporte',
      channel: 'telegram',
      sector: ['suporte', 'vendas'],
      status: 'disconnected',
      lastActivity: '2024-01-14 09:15'
    }
  ]);

  /**
   * Formata a exibição dos setores para o card
   */
  const formatSectors = (sectors: string | string[]): string => {
    if (typeof sectors === 'string') {
      const sector = getSectorById(sectors);
      return sector?.nome || sectors;
    }
    
    if (Array.isArray(sectors)) {
      return sectors
        .map(id => getSectorById(id)?.nome || id)
        .join(', ');
    }
    
    return '';
  };

  /**
   * Filtra conexões baseado no termo de pesquisa
   */
  const filteredConnections = connections.filter(connection => {
    const searchLower = searchTerm.toLowerCase();
    const sectorNames = formatSectors(connection.sector).toLowerCase();
    
    return connection.name.toLowerCase().includes(searchLower) ||
           connection.channel.toLowerCase().includes(searchLower) ||
           sectorNames.includes(searchLower);
  });

  /**
   * Manipula a criação de uma nova conexão
   */
  const handleCreateConnection = () => {
    if (!newConnection.name || !newConnection.sector || !newConnection.channel) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const connection: Connection = {
      id: Date.now().toString(),
      name: newConnection.name,
      channel: newConnection.channel,
      sector: newConnection.sector,
      status: 'disconnected',
      lastActivity: 'Nunca conectado',
      importSettings: newConnection.importSettings
    };

    setConnections(prev => [...prev, connection]);
    
    // Reset do formulário
    setNewConnection({
      name: '',
      sector: [],
      channel: '',
      importSettings: undefined
    });
    
    setIsDialogOpen(false);
    
    // Mostra QR Code se for WhatsApp Baileys
    if (newConnection.channel === 'whatsapp-qr') {
      setShowQRCode(connection.id);
    }
    
    console.log('Nova conexão criada:', connection);
  };

  /**
   * Manipula a edição de uma conexão existente
   */
  const handleEditConnection = (connection: Connection) => {
    setEditingConnection(connection);
    setIsEditDialogOpen(true);
  };

  /**
   * Salva as alterações da conexão editada
   */
  const handleSaveEdit = () => {
    if (!editingConnection) return;

    setConnections(prev => prev.map(conn => 
      conn.id === editingConnection.id ? editingConnection : conn
    ));
    
    setIsEditDialogOpen(false);
    setEditingConnection(null);
    console.log('Conexão editada:', editingConnection);
  };

  /**
   * Manipula o reinício de uma conexão
   */
  const handleRestart = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'connected' as const, lastActivity: new Date().toLocaleString('pt-BR') }
        : conn
    ));
    console.log('Conexão reiniciada:', id);
  };

  /**
   * Manipula a desconexão de uma conexão
   */
  const handleDisconnect = (id: string) => {
    setConnections(prev => prev.map(conn => 
      conn.id === id 
        ? { ...conn, status: 'disconnected' as const }
        : conn
    ));
    console.log('Conexão desconectada:', id);
  };

  /**
   * Manipula a exclusão de uma conexão
   */
  const handleDelete = (id: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== id));
    console.log('Conexão excluída:', id);
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
   * Renderiza o código do WebChat quando selecionado
   */
  const renderWebChatCode = () => {
    if (newConnection.channel !== 'webchat') return null;

    const webChatCode = `<!-- Código do WebChat - Incorporar no site -->
<div id="webchat-widget"></div>
<script>
  window.WebChatConfig = {
    apiUrl: 'https://api.seudominio.com',
    widgetId: 'conexao-${Date.now()}',
    position: 'bottom-right',
    theme: 'auto',
    language: 'pt-BR'
  };
  
  (function() {
    var script = document.createElement('script');
    script.src = 'https://cdn.seudominio.com/webchat.min.js';
    script.async = true;
    document.head.appendChild(script);
  })();
</script>`;

    return (
      <Card className="mt-4 border-brand bg-brand-background">
        <CardHeader>
          <CardTitle className="text-sm text-brand-foreground">
            Código para Incorporação do WebChat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono overflow-x-auto">
            <pre className="whitespace-pre-wrap text-brand-foreground">
              {webChatCode}
            </pre>
          </div>
          <p className="text-xs text-brand-muted mt-2">
            <strong>Instruções:</strong> Copie este código e cole antes da tag de fechamento &lt;/body&gt; 
            do seu site. O widget aparecerá automaticamente no canto inferior direito.
          </p>
        </CardContent>
      </Card>
    );
  };

  /**
   * Renderiza informações de QR Code para WhatsApp Baileys
   */
  const renderQRCodeInfo = () => {
    if (newConnection.channel !== 'whatsapp-qr') return null;

    return (
      <Card className="mt-4 border-brand bg-brand-background">
        <CardHeader>
          <CardTitle className="text-sm text-brand-foreground flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Code para Conexão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200 mb-2">
              <strong>Após criar a conexão:</strong>
            </p>
            <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
              <li>• Um QR Code será gerado automaticamente</li>
              <li>• Abra o WhatsApp no seu celular</li>
              <li>• Vá em Configurações → Aparelhos conectados</li>
              <li>• Toque em "Conectar um aparelho"</li>
              <li>• Escaneie o QR Code exibido na tela</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    );
  };

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

              {/* Código do WebChat */}
              {renderWebChatCode()}

              {/* Informações do QR Code */}
              {renderQRCodeInfo()}

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

        {/* Modal de edição de conexão */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto mx-4 border-brand bg-brand-background">
            <DialogHeader>
              <DialogTitle className="text-brand-foreground flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Editar Conexão
              </DialogTitle>
              <DialogDescription className="text-brand-muted">
                Modifique as configurações da conexão selecionada
              </DialogDescription>
            </DialogHeader>
            
            {editingConnection && (
              <div className="space-y-6 py-4">
                {/* Campo nome da conexão */}
                <div className="space-y-2">
                  <Label className="text-brand-foreground">Nome da Conexão *</Label>
                  <Input
                    value={editingConnection.name}
                    onChange={(e) => setEditingConnection({...editingConnection, name: e.target.value})}
                    placeholder="Ex: WhatsApp Principal"
                    className="border-brand bg-brand-background text-brand-foreground"
                  />
                </div>

                {/* Seletor de setores (usando seletor único para compatibilidade) */}
                <div className="space-y-2">
                  <Label className="text-brand-foreground">Setor Responsável *</Label>
                  <SectorSelector
                    value={Array.isArray(editingConnection.sector) ? editingConnection.sector[0] : editingConnection.sector}
                    onValueChange={(sector) => setEditingConnection({...editingConnection, sector})}
                    placeholder="Selecione o setor responsável"
                  />
                </div>

                {/* Canal (somente leitura) */}
                <div className="space-y-2">
                  <Label className="text-brand-foreground">Canal de Comunicação</Label>
                  <Input
                    value={editingConnection.channel}
                    disabled
                    className="border-brand bg-brand-muted text-brand-muted"
                  />
                  <p className="text-xs text-brand-muted">
                    O canal não pode ser alterado após a criação da conexão.
                  </p>
                </div>

                {/* Botões de ação */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-brand">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditDialogOpen(false)}
                    className="w-full sm:w-auto border-brand text-brand-foreground hover:bg-brand-accent"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveEdit}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
                  >
                    Salvar Alterações
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Exibição do QR Code quando necessário */}
      {showQRCode && (
        <div className="mb-6">
          <QRCodeDisplay
            connectionId={showQRCode}
            connectionName={connections.find(c => c.id === showQRCode)?.name || 'Conexão'}
            onStatusChange={(status) => {
              if (status === 'connected') {
                setConnections(prev => prev.map(conn => 
                  conn.id === showQRCode 
                    ? { ...conn, status: 'connected', lastActivity: new Date().toLocaleString('pt-BR') }
                    : conn
                ));
              }
            }}
          />
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowQRCode(null)}
              className="border-brand text-brand-foreground hover:bg-brand-accent"
            >
              Fechar QR Code
            </Button>
          </div>
        </div>
      )}

      {/* Grid de conexões existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={{
                ...connection,
                sector: formatSectors(connection.sector) // Converte para string para exibição
              }}
              onRestart={handleRestart}
              onDisconnect={handleDisconnect}
              onDelete={handleDelete}
              onEdit={handleEditConnection}
            />
          ))
        ) : (
          /* Mensagem quando não há conexões */
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <QrCode className="h-16 w-16 text-brand-muted mb-4" />
            <h3 className="text-lg font-semibold text-brand-foreground mb-2">
              {searchTerm ? 'Nenhuma conexão encontrada' : 'Nenhuma conexão configurada'}
            </h3>
            <p className="text-brand-muted mb-4 max-w-md">
              {searchTerm 
                ? 'Tente alterar os termos da pesquisa ou criar uma nova conexão.'
                : 'Comece criando sua primeira conexão com um canal de comunicação.'
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
