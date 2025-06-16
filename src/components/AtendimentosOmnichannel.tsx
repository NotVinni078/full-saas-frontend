
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
  MoreVertical,
  MessageSquare,
  Clock,
  CheckCircle,
  CircleCheckBig,
  UsersRound,
  MessageSquareText,
  Clock9,
  BotMessageSquare,
  Filter,
  RefreshCcw,
  UserPlus,
  ClockArrowDown,
  SquarePen,
  EllipsisVertical,
  ArrowLeft,
  SmilePlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Conversa {
  id: string;
  cliente: string;
  canal: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  ultimaMensagem: string;
  timestamp: string;
  naoLidas: number;
  status: 'online' | 'offline' | 'ausente';
  statusAtendimento: 'atendendo' | 'aguardando' | 'finalizado' | 'chatbot';
  isGrupo?: boolean;
  avatar: string;
}

interface Mensagem {
  id: string;
  remetente: 'cliente' | 'atendente';
  conteudo: string;
  timestamp: string;
  status: 'enviada' | 'entregue' | 'lida';
}

const ChannelLogo = ({ canal }: { canal: string }) => {
  const logoStyle = "w-4 h-4 rounded-sm";
  
  switch (canal) {
    case 'whatsapp':
      return (
        <div className="w-4 h-4 bg-green-500 rounded-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
          </svg>
        </div>
      );
    case 'instagram':
      return (
        <div className="w-4 h-4 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-400 rounded-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </div>
      );
    case 'facebook':
      return (
        <div className="w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </div>
      );
    case 'telegram':
      return (
        <div className="w-4 h-4 bg-blue-400 rounded-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
        </div>
      );
    case 'webchat':
      return (
        <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
          <MessageSquare className="w-3 h-3 text-white" />
        </div>
      );
    default:
      return (
        <div className="w-4 h-4 bg-gray-500 rounded-sm flex items-center justify-center">
          <MessageSquare className="w-3 h-3 text-white" />
        </div>
      );
  }
};

const canalColors = {
  whatsapp: 'bg-green-500',
  instagram: 'bg-pink-500',
  facebook: 'bg-blue-600',
  telegram: 'bg-blue-400',
  webchat: 'bg-gray-500'
};

const conversasExemplo: Conversa[] = [
  {
    id: '1',
    cliente: 'João Silva',
    canal: 'whatsapp',
    ultimaMensagem: 'Olá, gostaria de saber sobre os produtos...',
    timestamp: '14:30',
    naoLidas: 2,
    status: 'online',
    statusAtendimento: 'atendendo',
    avatar: 'JS'
  },
  {
    id: '2',
    cliente: 'Maria Santos',
    canal: 'instagram',
    ultimaMensagem: 'Quando vocês fazem entrega?',
    timestamp: '13:45',
    naoLidas: 1,
    status: 'offline',
    statusAtendimento: 'aguardando',
    avatar: 'MS'
  },
  {
    id: '3',
    cliente: 'Pedro Costa',
    canal: 'facebook',
    ultimaMensagem: 'Obrigado pelo atendimento!',
    timestamp: '12:20',
    naoLidas: 0,
    status: 'ausente',
    statusAtendimento: 'finalizado',
    avatar: 'PC'
  },
  {
    id: '4',
    cliente: 'Ana Oliveira',
    canal: 'telegram',
    ultimaMensagem: 'Qual o prazo de entrega?',
    timestamp: '11:15',
    naoLidas: 3,
    status: 'online',
    statusAtendimento: 'chatbot',
    avatar: 'AO'
  },
  {
    id: '5',
    cliente: 'Grupo Vendas',
    canal: 'whatsapp',
    ultimaMensagem: 'Reunião amanhã às 10h',
    timestamp: '10:30',
    naoLidas: 1,
    status: 'online',
    statusAtendimento: 'atendendo',
    isGrupo: true,
    avatar: 'GV'
  }
];

const mensagensExemplo: Mensagem[] = [
  {
    id: '1',
    remetente: 'cliente',
    conteudo: 'Olá, gostaria de saber sobre os produtos disponíveis',
    timestamp: '14:25',
    status: 'lida'
  },
  {
    id: '2',
    remetente: 'atendente',
    conteudo: 'Olá! Claro, temos vários produtos disponíveis. Qual categoria te interessa?',
    timestamp: '14:26',
    status: 'lida'
  },
  {
    id: '3',
    remetente: 'cliente',
    conteudo: 'Estou procurando produtos para casa',
    timestamp: '14:28',
    status: 'lida'
  },
  {
    id: '4',
    remetente: 'atendente',
    conteudo: 'Perfeito! Temos uma linha completa de produtos para casa. Posso te enviar nosso catálogo?',
    timestamp: '14:29',
    status: 'entregue'
  },
  {
    id: '5',
    remetente: 'cliente',
    conteudo: 'Sim, por favor!',
    timestamp: '14:30',
    status: 'enviada'
  }
];

const AtendimentosOmnichannel = () => {
  const [conversaSelecionada, setConversaSelecionada] = useState<string>('1');
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensExemplo);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [showChatMobile, setShowChatMobile] = useState(false);

  const conversaAtual = conversasExemplo.find(c => c.id === conversaSelecionada);
  
  const conversasFiltradas = conversasExemplo.filter(conversa => {
    const matchStatus = filtroStatus === 'todos' || conversa.statusAtendimento === filtroStatus;
    const matchTipo = filtroTipo === 'todos' || 
                     (filtroTipo === 'grupos' && conversa.isGrupo) ||
                     (filtroTipo === 'individuais' && !conversa.isGrupo);
    const matchBusca = conversa.cliente.toLowerCase().includes(busca.toLowerCase()) ||
                      conversa.ultimaMensagem.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchTipo && matchBusca;
  });

  const enviarMensagem = () => {
    if (!novaMensagem.trim()) return;

    const mensagem: Mensagem = {
      id: Date.now().toString(),
      remetente: 'atendente',
      conteudo: novaMensagem,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'enviada'
    };

    setMensagens([...mensagens, mensagem]);
    setNovaMensagem('');
  };

  const handleConversaClick = (conversaId: string) => {
    setConversaSelecionada(conversaId);
    setShowChatMobile(true);
  };

  const handleBackToList = () => {
    setShowChatMobile(false);
  };

  const StatusIndicator = ({ status }: { status: string }) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      ausente: 'bg-yellow-500'
    };
    return <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`} />;
  };

  const ConversasList = () => (
    <div className="w-full md:w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header da Lista */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Atendimentos</h2>
        </div>
        
        {/* Busca */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar conversas..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filtros Rápidos - Responsivos */}
        <div className="space-y-3">
          {/* Primeira linha - Finalizados e Grupos */}
          <div className="grid grid-cols-3 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={filtroStatus === 'finalizado' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFiltroStatus(filtroStatus === 'finalizado' ? 'todos' : 'finalizado');
                    setFiltroTipo('todos');
                  }}
                  className="flex items-center justify-center gap-1 w-full col-span-1 px-1"
                >
                  <CircleCheckBig className="h-4 w-4 flex-shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Finalizados</p>
              </TooltipContent>
            </Tooltip>
            <div></div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={filtroTipo === 'grupos' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFiltroTipo(filtroTipo === 'grupos' ? 'todos' : 'grupos');
                    setFiltroStatus('todos');
                  }}
                  className="flex items-center justify-center gap-1 w-full col-span-1 px-1"
                >
                  <UsersRound className="h-4 w-4 flex-shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Grupos</p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          {/* Separador */}
          <Separator className="my-2" />
          
          {/* Segunda linha - Atendendo, Aguardando e Chatbot */}
          <div className="grid grid-cols-3 gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={filtroStatus === 'atendendo' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFiltroStatus(filtroStatus === 'atendendo' ? 'todos' : 'atendendo');
                    setFiltroTipo('todos');
                  }}
                  className="flex items-center justify-center gap-1 w-full px-1"
                >
                  <MessageSquareText className="h-4 w-4 flex-shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Atendendo</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={filtroStatus === 'aguardando' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFiltroStatus(filtroStatus === 'aguardando' ? 'todos' : 'aguardando');
                    setFiltroTipo('todos');
                  }}
                  className="flex items-center justify-center gap-1 w-full px-1"
                >
                  <Clock9 className="h-4 w-4 flex-shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Aguardando</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={filtroStatus === 'chatbot' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setFiltroStatus(filtroStatus === 'chatbot' ? 'todos' : 'chatbot');
                    setFiltroTipo('todos');
                  }}
                  className="flex items-center justify-center gap-1 w-full px-1"
                >
                  <BotMessageSquare className="h-4 w-4 flex-shrink-0" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chatbot</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Lista de Conversas */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {conversasFiltradas.map((conversa) => (
            <Card
              key={conversa.id}
              className={`p-3 mb-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                conversaSelecionada === conversa.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
              }`}
              onClick={() => handleConversaClick(conversa.id)}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {conversa.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <ChannelLogo canal={conversa.canal} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {conversa.cliente}
                      {conversa.isGrupo && <UsersRound className="inline h-3 w-3 ml-1" />}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{conversa.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      {conversa.ultimaMensagem}
                    </p>
                    {conversa.naoLidas > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {conversa.naoLidas}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  const ChatArea = () => (
    <div className="flex-1 flex flex-col h-full">
      {conversaAtual ? (
        <>
          {/* Header do Chat */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Botão de voltar apenas em mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="relative">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {conversaAtual.avatar}
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <ChannelLogo canal={conversaAtual.canal} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {conversaAtual.cliente}
                    </h3>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs px-2 py-0.5">
                        VIP
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        Cliente
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    ID: #{conversaAtual.id} • Atendimento em andamento
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Ícones visíveis em telas grandes */}
                <div className="hidden md:flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Transferir atendimento</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar Participante a Conversa</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ClockArrowDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Retornar a aguardando</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <CircleCheckBig className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Finalizar Atendimento</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <SquarePen className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar Contato</p>
                    </TooltipContent>
                  </Tooltip>

                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>

                {/* Menu de opções para telas pequenas */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <div className="space-y-4 mt-6">
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Transferir atendimento
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Adicionar Participante a Conversa
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <ClockArrowDown className="h-4 w-4 mr-2" />
                          Retornar a aguardando
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <CircleCheckBig className="h-4 w-4 mr-2" />
                          Finalizar Atendimento
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <SquarePen className="h-4 w-4 mr-2" />
                          Editar Contato
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          Ligar
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Menu de opções adicionais apenas em telas grandes */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Histórico de conversas</DropdownMenuItem>
                    <DropdownMenuItem>Arquivar conversa</DropdownMenuItem>
                    <DropdownMenuItem>Bloquear contato</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Mensagens - Com altura fixa para evitar espaço extra */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`flex ${mensagem.remetente === 'atendente' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        mensagem.remetente === 'atendente'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{mensagem.conteudo}</p>
                      <div className={`flex items-center justify-between mt-1 ${
                        mensagem.remetente === 'atendente' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{mensagem.timestamp}</span>
                        {mensagem.remetente === 'atendente' && (
                          <div className="ml-2">
                            {mensagem.status === 'lida' && <CheckCircle className="h-3 w-3" />}
                            {mensagem.status === 'entregue' && <CheckCircle className="h-3 w-3 opacity-60" />}
                            {mensagem.status === 'enviada' && <Clock className="h-3 w-3 opacity-60" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input de Mensagem - Fixo na parte inferior */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <div className="flex items-end gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    className="resize-none"
                  />
                </div>

                <Button variant="ghost" size="icon">
                  <SmilePlus className="h-4 w-4" />
                </Button>
                
                <Button onClick={enviarMensagem} disabled={!novaMensagem.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Selecione uma conversa
            </h3>
            <p className="text-gray-500">
              Escolha uma conversa da lista para começar o atendimento
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-full bg-white dark:bg-gray-900">
        {/* Em mobile, mostra lista OU chat baseado no estado */}
        <div className="md:hidden w-full h-full">
          {!showChatMobile ? <ConversasList /> : <ChatArea />}
        </div>

        {/* Em desktop, mostra ambos lado a lado */}
        <div className="hidden md:flex w-full h-full">
          <ConversasList />
          <ChatArea />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AtendimentosOmnichannel;
