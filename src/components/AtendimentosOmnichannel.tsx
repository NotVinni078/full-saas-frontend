
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
  Video, 
  MoreVertical,
  MessageSquare,
  Clock,
  CheckCircle,
  CircleCheckBig,
  UsersRound,
  MessageSquareText,
  Clock9,
  BotMessageSquare,
  Filter
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const canalIcons = {
  whatsapp: '📱',
  instagram: '📷',
  facebook: '👤',
  telegram: '✈️',
  webchat: '💬'
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

  const StatusIndicator = ({ status }: { status: string }) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      ausente: 'bg-yellow-500'
    };
    return <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`} />;
  };

  return (
    <div className="flex h-full bg-white dark:bg-gray-900">
      {/* Lista de Conversas */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header da Lista */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Atendimentos</h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {conversasExemplo.reduce((acc, conv) => acc + conv.naoLidas, 0)} não lidas
            </Badge>
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

          {/* Filtros Rápidos */}
          <div className="space-y-3">
            {/* Primeira linha - Finalizados e vazio para espaço */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={filtroStatus === 'finalizado' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFiltroStatus(filtroStatus === 'finalizado' ? 'todos' : 'finalizado');
                  setFiltroTipo('todos');
                }}
                className="flex items-center justify-center gap-1 w-full"
              >
                <CircleCheckBig className="h-4 w-4" />
                <span>Finalizados</span>
              </Button>
              <div></div>
              <Button
                variant={filtroTipo === 'grupos' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFiltroTipo(filtroTipo === 'grupos' ? 'todos' : 'grupos');
                  setFiltroStatus('todos');
                }}
                className="flex items-center justify-center gap-1 w-full"
              >
                <UsersRound className="h-4 w-4" />
                <span>Grupos</span>
              </Button>
            </div>
            
            {/* Separador */}
            <Separator className="my-2" />
            
            {/* Segunda linha - Atendendo, Aguardando e Chatbot */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={filtroStatus === 'atendendo' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFiltroStatus(filtroStatus === 'atendendo' ? 'todos' : 'atendendo');
                  setFiltroTipo('todos');
                }}
                className="flex items-center justify-center gap-1 w-full"
              >
                <MessageSquareText className="h-4 w-4" />
                <span>Atendendo</span>
              </Button>
              <Button
                variant={filtroStatus === 'aguardando' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFiltroStatus(filtroStatus === 'aguardando' ? 'todos' : 'aguardando');
                  setFiltroTipo('todos');
                }}
                className="flex items-center justify-center gap-1 w-full"
              >
                <Clock9 className="h-4 w-4" />
                <span>Aguardando</span>
              </Button>
              <Button
                variant={filtroStatus === 'chatbot' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setFiltroStatus(filtroStatus === 'chatbot' ? 'todos' : 'chatbot');
                  setFiltroTipo('todos');
                }}
                className="flex items-center justify-center gap-1 w-full"
              >
                <BotMessageSquare className="h-4 w-4" />
                <span>Chatbot</span>
              </Button>
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
                onClick={() => setConversaSelecionada(conversa.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {conversa.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${canalColors[conversa.canal]} flex items-center justify-center text-xs`}>
                      {canalIcons[conversa.canal]}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {conversa.cliente}
                        {conversa.isGrupo && <UsersRound className="inline h-3 w-3 ml-1" />}
                      </h3>
                      <div className="flex items-center gap-2">
                        <StatusIndicator status={conversa.status} />
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

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col">
        {conversaAtual ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {conversaAtual.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${canalColors[conversaAtual.canal]} flex items-center justify-center text-xs`}>
                      {canalIcons[conversaAtual.canal]}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {conversaAtual.cliente}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <StatusIndicator status={conversaAtual.status} />
                      <span className="capitalize">{conversaAtual.status}</span>
                      <span>•</span>
                      <span className="capitalize">{conversaAtual.canal}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Transferir conversa</DropdownMenuItem>
                      <DropdownMenuItem>Marcar como resolvido</DropdownMenuItem>
                      <DropdownMenuItem>Arquivar conversa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Mensagens */}
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

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
                
                <Button onClick={enviarMensagem} disabled={!novaMensagem.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
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
    </div>
  );
};

export default AtendimentosOmnichannel;
