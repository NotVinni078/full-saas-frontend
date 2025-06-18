
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Instagram, 
  Mail, 
  MessageSquare, 
  Settings, 
  Plus, 
  QrCode,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Wifi,
  WifiOff
} from 'lucide-react';

interface Conexao {
  id: string;
  tipo: 'whatsapp' | 'instagram' | 'email' | 'telegram';
  nome: string;
  identificador: string;
  status: 'conectado' | 'desconectado' | 'erro' | 'pendente';
  ultimaAtualizacao: string;
  ativa: boolean;
}

const Conexoes = () => {
  const [conexoes, setConexoes] = useState<Conexao[]>([
    {
      id: '1',
      tipo: 'whatsapp',
      nome: 'WhatsApp Business',
      identificador: '+55 11 99999-9999',
      status: 'conectado',
      ultimaAtualizacao: '2024-01-15 14:30',
      ativa: true
    },
    {
      id: '2',
      tipo: 'instagram',
      nome: 'Instagram Business',
      identificador: '@minhaempresa',
      status: 'conectado',
      ultimaAtualizacao: '2024-01-15 14:25',
      ativa: true
    },
    {
      id: '3',
      tipo: 'email',
      nome: 'Email Corporativo',
      identificador: 'contato@empresa.com',
      status: 'desconectado',
      ultimaAtualizacao: '2024-01-14 09:15',
      ativa: false
    },
    {
      id: '4',
      tipo: 'telegram',
      nome: 'Telegram Bot',
      identificador: '@empresabot',
      status: 'erro',
      ultimaAtualizacao: '2024-01-13 16:45',
      ativa: false
    }
  ]);

  const [novaConexao, setNovaConexao] = useState({
    tipo: 'whatsapp' as 'whatsapp' | 'instagram' | 'email' | 'telegram',
    nome: '',
    identificador: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'conectado':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'desconectado':
        return <WifiOff className="h-4 w-4 text-gray-400" />;
      case 'erro':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pendente':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'conectado':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'desconectado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'erro':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'instagram':
        return <div className="h-5 w-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />;
      case 'email':
        return <Mail className="h-5 w-5 text-blue-600" />;
      case 'telegram':
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      default:
        return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleToggleConexao = (id: string) => {
    setConexoes(prev => prev.map(conexao => 
      conexao.id === id 
        ? { ...conexao, ativa: !conexao.ativa }
        : conexao
    ));
  };

  const handleConectar = (id: string) => {
    setConexoes(prev => prev.map(conexao => 
      conexao.id === id 
        ? { 
            ...conexao, 
            status: 'conectado',
            ultimaAtualizacao: new Date().toLocaleString('pt-BR')
          }
        : conexao
    ));
  };

  const handleDesconectar = (id: string) => {
    setConexoes(prev => prev.map(conexao => 
      conexao.id === id 
        ? { 
            ...conexao, 
            status: 'desconectado',
            ultimaAtualizacao: new Date().toLocaleString('pt-BR')
          }
        : conexao
    ));
  };

  const handleAdicionarConexao = () => {
    const nova: Conexao = {
      id: Date.now().toString(),
      ...novaConexao,
      status: 'pendente',
      ultimaAtualizacao: new Date().toLocaleString('pt-BR'),
      ativa: false
    };

    setConexoes(prev => [...prev, nova]);
    setNovaConexao({
      tipo: 'whatsapp',
      nome: '',
      identificador: ''
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold brand-text-foreground">Conexões</h1>
          <p className="brand-text-muted mt-1 text-sm lg:text-base">
            Gerencie suas conexões com diferentes canais de comunicação
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Nova Conexão
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] mx-4 brand-card brand-border">
            <DialogHeader>
              <DialogTitle className="brand-text-foreground">Adicionar Nova Conexão</DialogTitle>
              <DialogDescription className="brand-text-muted">
                Configure uma nova conexão com um canal de comunicação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="brand-text-foreground">Tipo de Conexão</Label>
                <select
                  id="tipo"
                  value={novaConexao.tipo}
                  onChange={(e) => setNovaConexao({...novaConexao, tipo: e.target.value as any})}
                  className="w-full p-2 brand-border rounded-md brand-background brand-text-foreground"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="email">Email</option>
                  <option value="telegram">Telegram</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nome" className="brand-text-foreground">Nome da Conexão</Label>
                <Input
                  id="nome"
                  value={novaConexao.nome}
                  onChange={(e) => setNovaConexao({...novaConexao, nome: e.target.value})}
                  placeholder="Ex: WhatsApp Principal"
                  className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="identificador" className="brand-text-foreground">Identificador</Label>
                <Input
                  id="identificador"
                  value={novaConexao.identificador}
                  onChange={(e) => setNovaConexao({...novaConexao, identificador: e.target.value})}
                  placeholder="Ex: +55 11 99999-9999"
                  className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full sm:w-auto brand-border brand-text-foreground brand-hover-accent"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAdicionarConexao}
                  disabled={!novaConexao.nome || !novaConexao.identificador}
                  className="brand-primary brand-hover-primary brand-text-background w-full sm:w-auto"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert de Status */}
      <Alert className="brand-border">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="brand-text-foreground">
          {conexoes.filter(c => c.status === 'conectado').length} de {conexoes.length} conexões ativas
        </AlertDescription>
      </Alert>

      {/* Grid de Conexões */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {conexoes.map((conexao) => (
          <Card key={conexao.id} className="brand-card brand-border">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getTipoIcon(conexao.tipo)}
                  <div>
                    <CardTitle className="text-base brand-text-foreground">{conexao.nome}</CardTitle>
                    <CardDescription className="brand-text-muted">{conexao.identificador}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(conexao.status)}
                  <Switch 
                    checked={conexao.ativa}
                    onCheckedChange={() => handleToggleConexao(conexao.id)}
                    className="data-[state=checked]:brand-primary data-[state=unchecked]:brand-input"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm brand-text-muted">Status:</span>
                <Badge className={`text-xs ${getStatusColor(conexao.status)}`}>
                  {conexao.status}
                </Badge>
              </div>

              <div className="text-xs brand-text-muted">
                Última atualização: {conexao.ultimaAtualizacao}
              </div>

              <div className="flex space-x-2">
                {conexao.status === 'desconectado' || conexao.status === 'erro' ? (
                  <Button 
                    size="sm" 
                    onClick={() => handleConectar(conexao.id)}
                    className="flex-1 brand-success brand-hover-success brand-text-background"
                  >
                    Conectar
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDesconectar(conexao.id)}
                    className="flex-1 brand-border brand-text-foreground brand-hover-accent"
                  >
                    Desconectar
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="outline"
                  className="brand-border brand-text-foreground brand-hover-accent"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                {conexao.tipo === 'whatsapp' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="brand-border brand-text-foreground brand-hover-accent"
                  >
                    <QrCode className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card de Instrução */}
      <Card className="brand-card brand-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 brand-text-foreground">
            <Settings className="h-5 w-5" />
            Como Configurar Conexões
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium brand-text-foreground">WhatsApp Business</h4>
              <p className="text-sm brand-text-muted">
                Escaneie o código QR com seu WhatsApp para conectar a conta business
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium brand-text-foreground">Instagram Business</h4>
              <p className="text-sm brand-text-muted">
                Conecte sua conta business do Instagram através do Facebook Business
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium brand-text-foreground">Email</h4>
              <p className="text-sm brand-text-muted">
                Configure SMTP para envio e IMAP para recebimento de emails
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium brand-text-foreground">Telegram</h4>
              <p className="text-sm brand-text-muted">
                Crie um bot através do @BotFather e configure o webhook
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conexoes;
