
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Wifi, QrCode } from 'lucide-react';
import { useSectors } from '@/hooks/useSectors';
import SectorSelector from '@/components/selectors/SectorSelector';
import ChannelSelector from '@/components/selectors/ChannelSelector';
import ImportSettings from '@/components/selectors/ImportSettings';
import ConnectionCard from '@/components/cards/ConnectionCard';

/**
 * Interface para definir uma conexão
 * Contém todas as informações necessárias para gerenciar canais
 */
interface Connection {
  id: string;
  name: string;
  channel: string;
  sector: string;
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
  sector: string;
  channel: string;
  importSettings?: any;
}

/**
 * Componente principal de Gerenciamento de Conexões
 * Responsável por exibir, criar, editar e excluir conexões
 * Utiliza cores dinâmicas da gestão de marca
 * Totalmente responsivo para desktop, tablet e mobile
 */
const Conexoes = () => {
  // Estado para controlar o diálogo de nova conexão
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Estado para pesquisa de conexões
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para nova conexão sendo criada
  const [newConnection, setNewConnection] = useState<NewConnection>({
    name: '',
    sector: '',
    channel: '',
    importSettings: undefined
  });

  // Hook para acessar setores disponíveis
  const { getActiveSectors } = useSectors();

  // Estado para conexões existentes (dados mock para exemplo)
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: '1',
      name: 'WhatsApp Principal',
      channel: 'whatsapp-qr',
      sector: 'Vendas',
      status: 'connected',
      lastActivity: '2024-01-15 14:30'
    },
    {
      id: '2',
      name: 'Instagram Oficial',
      channel: 'instagram',
      sector: 'Marketing',
      status: 'connected',
      lastActivity: '2024-01-15 14:25'
    },
    {
      id: '3',
      name: 'Telegram Suporte',
      channel: 'telegram',
      sector: 'Suporte',
      status: 'disconnected',
      lastActivity: '2024-01-14 09:15'
    }
  ]);

  /**
   * Filtra conexões baseado no termo de pesquisa
   * Busca por nome, canal ou setor
   */
  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.sector.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Manipula a criação de uma nova conexão
   * Valida dados e adiciona à lista
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
      sector: '',
      channel: '',
      importSettings: undefined
    });
    
    setIsDialogOpen(false);
    
    console.log('Nova conexão criada:', connection);
  };

  /**
   * Manipula o reinício de uma conexão
   * Backend deve implementar lógica de reconexão
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
   * Backend deve parar os webhooks e limpeza necessária
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
   * Backend deve remover todos os dados relacionados
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
   * Fornece instruções completas para incorporação
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

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Cabeçalho principal com título e estatísticas */}
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-brand-foreground">
            Gerenciar Conexões
          </h1>
          <p className="text-brand-muted mt-1 text-sm lg:text-base">
            Configure e gerencie suas conexões com diferentes canais de comunicação
          </p>
        </div>

        {/* Alert com estatísticas das conexões */}
        <Alert className="border-brand bg-brand-background">
          <Wifi className="h-4 w-4" />
          <AlertDescription className="text-brand-foreground">
            {connections.filter(c => c.status === 'connected').length} de {connections.length} conexões ativas
          </AlertDescription>
        </Alert>
      </div>

      {/* Barra de ferramentas com pesquisa e botão criar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Barra de pesquisa responsiva */}
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

              {/* Seletor de setor */}
              <div className="space-y-2">
                <Label className="text-brand-foreground">Setor Responsável *</Label>
                <SectorSelector
                  value={newConnection.sector}
                  onValueChange={(sector) => setNewConnection({...newConnection, sector})}
                  placeholder="Selecione o setor responsável"
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

              {/* Código do WebChat se selecionado */}
              {renderWebChatCode()}

              {/* Botões de ação do modal */}
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

      {/* Grid de conexões existentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredConnections.length > 0 ? (
          filteredConnections.map((connection) => (
            <ConnectionCard
              key={connection.id}
              connection={connection}
              onRestart={handleRestart}
              onDisconnect={handleDisconnect}
              onDelete={handleDelete}
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

      {/* Instruções de uso */}
      <Card className="border-brand bg-brand-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-foreground">
            <Wifi className="h-5 w-5" />
            Instruções de Configuração
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instrução WhatsApp */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">WhatsApp QR Code</h4>
              <p className="text-sm text-brand-muted">
                Escaneie o QR Code com seu WhatsApp para conectar. 
                Ideal para testes e uso pessoal.
              </p>
            </div>
            
            {/* Instrução WhatsApp Oficial */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">WhatsApp API Oficial</h4>
              <p className="text-sm text-brand-muted">
                Conecte via Meta Business API. Requer aprovação e verificação de negócio.
              </p>
            </div>
            
            {/* Instrução Telegram */}
            <div className="space-y-2">
              <h4 className="font-medium text-brand-foreground">Telegram</h4>
              <p className="text-sm text-brand-muted">
                Configure um bot via @BotFather e conecte através do QR Code gerado.
              </p>
            </div>
            
            {/* Instrução WebChat */}
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
