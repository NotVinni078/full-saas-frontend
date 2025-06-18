
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Send, 
  Paperclip, 
  Phone, 
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
  SmilePlus,
  MessageSquarePlus,
  CirclePlus,
  X,
  PenLine,
  PenOff,
  Zap,
  NotebookPen,
  IdCard,
  Star
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useContacts } from '@/hooks/useContacts';
import { useUsers } from '@/hooks/useUsers';
import { useTags } from '@/hooks/useTags';
import ContactSelector from '@/components/selectors/ContactSelector';
import UserSelector from '@/components/selectors/UserSelector';
import { Contact, User } from '@/types/global';

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
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  tags?: string[];
}

interface Mensagem {
  id: string;
  remetente: 'cliente' | 'atendente';
  conteudo: string;
  timestamp: string;
  status: 'enviada' | 'entregue' | 'lida';
}

// Sample messages for demonstration
const mensagensExemplo: Mensagem[] = [
  {
    id: '1',
    remetente: 'cliente',
    conteudo: 'Olá, gostaria de saber mais sobre os produtos.',
    timestamp: '14:30',
    status: 'lida'
  },
  {
    id: '2',
    remetente: 'atendente',
    conteudo: 'Olá! Claro, posso te ajudar. Qual produto específico você tem interesse?',
    timestamp: '14:32',
    status: 'lida'
  }
];

const ChannelLogo = ({ canal }: { canal: string }) => {
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
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.281-.073-1.689-.073-4.948 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
            <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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

const AtendimentosOmnichannel = () => {
  const [conversaSelecionada, setConversaSelecionada] = useState<string>('');
  const [mensagens, setMensagens] = useState<Mensagem[]>(mensagensExemplo);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('atendendo'); // Mudança aqui: padrão "atendendo"
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Conversa | null>(null);
  const [isSignatureActive, setIsSignatureActive] = useState(false);
  const [isContactListOpen, setIsContactListOpen] = useState(false);
  const [isChatbotListOpen, setIsChatbotListOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);

  // Usar dados sincronizados
  const { contacts, getContactTags } = useContacts();
  const { getActiveUsers } = useUsers();
  const { getTagsByIds } = useTags();

  // Converter contatos para conversas
  const conversasExemplo: Conversa[] = contacts.slice(0, 10).map((contact, index) => {
    const contactTags = getContactTags(contact);
    return {
      id: contact.id,
      cliente: contact.nome,
      canal: contact.canal,
      ultimaMensagem: index === 0 ? 'Olá, gostaria de saber sobre os produtos...' : 
                     index === 1 ? 'Quando vocês fazem entrega?' :
                     index === 2 ? 'Obrigado pelo atendimento!' :
                     'Mensagem de exemplo',
      timestamp: `${14 - index}:${30 + index}`,
      naoLidas: index < 3 ? index + 1 : 0,
      status: contact.status,
      statusAtendimento: index === 0 ? 'atendendo' : 
                        index === 1 ? 'aguardando' :
                        index === 2 ? 'finalizado' : 'chatbot',
      isGrupo: false,
      avatar: contact.avatar,
      telefone: contact.telefone,
      email: contact.email,
      endereco: contact.endereco,
      observacoes: contact.observacoes,
      tags: contactTags.map(tag => tag.nome)
    };
  });

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

  const handleCloseConversation = () => {
    setConversaSelecionada('');
    setShowChatMobile(false); // Adicionar esta linha para resetar o estado mobile
  };

  const handleContactClick = (conversa: Conversa) => {
    setSelectedContact(conversa);
    setIsEditContactOpen(true);
  };

  const handleEditContact = (conversa: Conversa) => {
    setSelectedContact(conversa);
    setIsEditContactOpen(true);
  };

  const handleTransferUser = (user: User) => {
    console.log('Transferindo atendimento para:', user.nome);
    setIsTransferDialogOpen(false);
  };

  const handleContactFromSelector = (contact: Contact) => {
    const novaConversa: Conversa = {
      id: contact.id,
      cliente: contact.nome,
      canal: contact.canal,
      ultimaMensagem: 'Conversa iniciada',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      naoLidas: 0,
      status: contact.status,
      statusAtendimento: 'atendendo',
      isGrupo: false,
      avatar: contact.avatar,
      telefone: contact.telefone,
      email: contact.email,
      endereco: contact.endereco,
      observacoes: contact.observacoes,
      tags: getContactTags(contact).map(tag => tag.nome)
    };
    
    setConversaSelecionada(contact.id);
    setIsContactDialogOpen(false);
  };

  const StatusIndicator = ({ status }: { status: string }) => {
    const colors = {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      ausente: 'bg-yellow-500'
    };
    return <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`} />;
  };

  const ActionIcons = ({ statusAtendimento }: { statusAtendimento: string }) => {
    switch (statusAtendimento) {
      case 'atendendo':
        return (
          <div className="flex gap-1">
            {/* Desktop - Mostrar todos os ícones */}
            <div className="hidden lg:flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Clock9 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Retornar a Aguardando</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Star className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviar pesquisa de satisfação</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <CircleCheckBig className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Finalizar</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Mobile/Tablet - Mostrar apenas ellipsis-vertical */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <EllipsisVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Clock9 className="h-4 w-4 mr-2" />
                    Retornar a Aguardando
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Star className="h-4 w-4 mr-2" />
                    Enviar pesquisa
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleCheckBig className="h-4 w-4 mr-2" />
                    Finalizar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      case 'aguardando':
        return (
          <div className="flex gap-1">
            {/* Desktop - Mostrar todos os ícones */}
            <div className="hidden lg:flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Realizar Atendimento</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <CircleCheckBig className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Finalizar</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Mobile/Tablet - Mostrar apenas ellipsis-vertical */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <EllipsisVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Realizar Atendimento
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleCheckBig className="h-4 w-4 mr-2" />
                    Finalizar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      case 'chatbot':
        return (
          <div className="flex gap-1">
            {/* Desktop - Mostrar todos os ícones */}
            <div className="hidden lg:flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Realizar Atendimento</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <CircleCheckBig className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Finalizar</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Mobile/Tablet - Mostrar apenas ellipsis-vertical */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <EllipsisVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Realizar Atendimento
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleCheckBig className="h-4 w-4 mr-2" />
                    Finalizar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      case 'finalizado':
        return (
          <div className="flex gap-1">
            {/* Desktop - Mostrar todos os ícones */}
            <div className="hidden lg:flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Realizar Atendimento</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <RefreshCcw className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Transferir para outro Atendente</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Mobile/Tablet - Mostrar apenas ellipsis-vertical */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <EllipsisVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Realizar Atendimento
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    Transferir para outro Atendente
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const ConversasList = () => (
    <div className={`${conversaSelecionada ? 'md:w-1/3' : 'md:w-2/3 lg:w-1/2'} border-r border-gray-200 dark:border-gray-700 flex flex-col h-full relative`}>
      {/* Header da Lista */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-[#000000]">
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
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={filtroStatus === 'finalizado' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFiltroStatus(filtroStatus === 'finalizado' ? 'todos' : 'finalizado');
                setFiltroTipo('todos');
              }}
              className="flex items-center justify-center gap-2 w-full h-12"
            >
              <CircleCheckBig className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:inline">Finalizados</span>
              <span className="hidden md:inline lg:hidden">Final.</span>
            </Button>
            
            <Button
              variant={filtroTipo === 'grupos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFiltroTipo(filtroTipo === 'grupos' ? 'todos' : 'grupos');
                setFiltroStatus('todos');
              }}
              className="flex items-center justify-center gap-2 w-full h-12"
            >
              <UsersRound className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:inline">Grupos</span>
              <span className="hidden md:inline lg:hidden">Grup.</span>
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
              className="flex items-center justify-center gap-1 w-full h-12"
            >
              <MessageSquareText className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:inline text-xs">Atendendo</span>
              <span className="hidden md:inline lg:hidden text-xs">Atend.</span>
            </Button>
            
            <Button
              variant={filtroStatus === 'aguardando' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFiltroStatus(filtroStatus === 'aguardando' ? 'todos' : 'aguardando');
                setFiltroTipo('todos');
              }}
              className="flex items-center justify-center gap-1 w-full h-12"
            >
              <Clock9 className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:inline text-xs">Aguardando</span>
              <span className="hidden md:inline lg:hidden text-xs">Aguard.</span>
            </Button>
            
            <Button
              variant={filtroStatus === 'chatbot' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setFiltroStatus(filtroStatus === 'chatbot' ? 'todos' : 'chatbot');
                setFiltroTipo('todos');
              }}
              className="flex items-center justify-center gap-1 w-full h-12"
            >
              <BotMessageSquare className="h-4 w-4 flex-shrink-0" />
              <span className="hidden lg:inline text-xs">Chatbot</span>
              <span className="hidden md:inline lg:hidden text-xs">Bot</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Lista de Conversas com ScrollArea */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2">
            {conversasFiltradas.map((conversa) => {
              // Usar tags sincronizadas
              const conversaTags = conversa.tags || [];
              return (
                <Card
                  key={conversa.id}
                  className={`p-4 mb-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 min-h-[80px] ${
                    conversaSelecionada === conversa.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-950' : ''
                  }`}
                  onClick={() => handleConversaClick(conversa.id)}
                >
                  <div className="flex items-start gap-3 h-full">
                    <div className="relative">
                      <div 
                        className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContactClick(conversa);
                        }}
                      >
                        {conversa.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <ChannelLogo canal={conversa.canal} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {conversa.cliente}
                            {conversa.isGrupo && <UsersRound className="inline h-3 w-3 ml-1" />}
                          </h3>
                          <div className="flex gap-1">
                            {conversaTags.slice(0, 2).map((tagName) => {
                              // Encontrar a tag real para pegar a cor
                              const realTag = getTagsByIds(['1', '2', '3', '4', '5', '6']).find(t => t.nome === tagName);
                              return (
                                <Badge key={tagName} className={`text-xs px-1 py-0 h-4 text-[10px] ${realTag?.cor || 'bg-gray-100 text-gray-800'}`}>
                                  {tagName}
                                </Badge>
                              );
                            })}
                            {conversaTags.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-1 py-0 h-4 text-[10px]">
                                +{conversaTags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <ActionIcons statusAtendimento={conversa.statusAtendimento} />
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
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Botão Flutuante com ContactSelector */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogTrigger asChild>
          <Button
            className="absolute bottom-20 left-4 h-12 w-12 rounded-full shadow-lg z-10 bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
            size="icon"
          >
            <CirclePlus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Selecionar Contato</DialogTitle>
          </DialogHeader>
          <ContactSelector
            onSelectContact={handleContactFromSelector}
            placeholder="Buscar contatos..."
            showTags={true}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  const ChatArea = () => (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {conversaAtual ? (
        <>
          {/* Header do Chat */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#000000] flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Botão de voltar para mobile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                {/* Botão de fechar conversa para desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseConversation}
                  className="hidden md:flex"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="relative">
                  <div 
                    className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    onClick={() => handleContactClick(conversaAtual)}
                  >
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
                      {(conversaAtual.tags || []).map((tagName) => {
                        const realTag = getTagsByIds(['1', '2', '3', '4', '5', '6']).find(t => t.nome === tagName);
                        return (
                          <Badge key={tagName} className={`text-xs px-2 py-0.5 ${realTag?.cor || 'bg-gray-100 text-gray-800'}`}>
                            {tagName}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    ID: #{conversaAtual.id} • Atendimento em andamento
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Desktop - Mostrar todos os ícones */}
                <div className="hidden lg:flex items-center gap-2">
                  <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                    <DialogTrigger asChild>
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
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Transferir Atendimento</DialogTitle>
                      </DialogHeader>
                      <UserSelector
                        onSelectUser={handleTransferUser}
                        placeholder="Buscar usuários..."
                        showSector={true}
                      />
                    </DialogContent>
                  </Dialog>

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
                        <Star className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar pesquisa de satisfação</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditContact(conversaAtual)}
                      >
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

                {/* Mobile/Tablet - Usar ellipsis-vertical */}
                <div className="lg:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsTransferDialogOpen(true)}>
                        <RefreshCcw className="h-4 w-4 mr-2" />
                        Transferir atendimento
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Adicionar Participante
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ClockArrowDown className="h-4 w-4 mr-2" />
                        Retornar a aguardando
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Enviar pesquisa
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CircleCheckBig className="h-4 w-4 mr-2" />
                        Finalizar Atendimento
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditContact(conversaAtual)}>
                        <SquarePen className="h-4 w-4 mr-2" />
                        Editar Contato
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="h-4 w-4 mr-2" />
                        Ligar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Container para Mensagens e Barra de Digitação */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Área de Mensagens com ScrollArea */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
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
                              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
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
                </div>
              </ScrollArea>
            </div>

            {/* Barra de Digitação */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              <div className="flex items-center gap-2 max-w-full">
                {/* Desktop - Mostrar botões expandidos */}
                <div className="hidden lg:flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-auto p-1 bg-transparent border-none shadow-none">
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsSignatureActive(!isSignatureActive)}
                          className={`w-8 h-8 rounded-full shadow-lg flex-shrink-0 ${
                            isSignatureActive ? 'bg-red-100 hover:bg-red-200' : 'bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          {isSignatureActive ? (
                            <PenOff className="h-4 w-4 text-red-600" />
                          ) : (
                            <PenLine className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg flex-shrink-0">
                          <Zap className="h-4 w-4" />
                        </Button>
                        
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg flex-shrink-0">
                          <NotebookPen className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg flex-shrink-0"
                          onClick={() => setIsContactListOpen(true)}
                        >
                          <IdCard className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 shadow-lg flex-shrink-0"
                          onClick={() => setIsChatbotListOpen(true)}
                        >
                          <BotMessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <SmilePlus className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mobile/Tablet - Mostrar apenas ellipsis-vertical */}
                <div className="lg:hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setIsSignatureActive(!isSignatureActive)}>
                        {isSignatureActive ? (
                          <PenOff className="h-4 w-4 mr-2" />
                        ) : (
                          <PenLine className="h-4 w-4 mr-2" />
                        )}
                        Assinatura
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Zap className="h-4 w-4 mr-2" />
                        Ações rápidas
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <NotebookPen className="h-4 w-4 mr-2" />
                        Notas
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsContactListOpen(true)}>
                        <IdCard className="h-4 w-4 mr-2" />
                        Contatos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setIsChatbotListOpen(true)}>
                        <BotMessageSquare className="h-4 w-4 mr-2" />
                        Chatbot
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <SmilePlus className="h-4 w-4 mr-2" />
                        Emojis
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Paperclip className="h-4 w-4 mr-2" />
                        Anexar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={novaMensagem}
                    onChange={(e) => setNovaMensagem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
                    className="w-full"
                  />
                </div>
                
                <Button 
                  onClick={enviarMensagem} 
                  disabled={!novaMensagem.trim()} 
                  className="flex-shrink-0"
                  size="default"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Placeholder apenas para desktop (telas grandes)
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquarePlus className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Selecione ou inicie um atendimento
            </h3>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex h-full bg-white dark:bg-gray-900 overflow-hidden">
        {/* Em mobile e tablet, mostra lista OU chat baseado no estado */}
        <div className="lg:hidden w-full h-full">
          {!showChatMobile ? <ConversasList /> : <ChatArea />}
        </div>

        {/* Em desktop (lg+), mostra ambos lado a lado */}
        <div className="hidden lg:flex w-full h-full">
          <ConversasList />
          <ChatArea />
        </div>

        {/* Modal de Edição de Contato */}
        <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Contato</DialogTitle>
            </DialogHeader>
            {selectedContact && (
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{selectedContact.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      placeholder="Nome do contato"
                      defaultValue={selectedContact.cliente}
                      className="mb-2"
                    />
                    <div className="flex items-center gap-2">
                      <ChannelLogo canal={selectedContact.canal} />
                      <span className="text-sm text-gray-500 capitalize">{selectedContact.canal}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                    <Input
                      placeholder="Telefone"
                      defaultValue={selectedContact.telefone}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <Input
                      placeholder="Email"
                      defaultValue={selectedContact.email}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</label>
                    <Input
                      placeholder="Endereço"
                      defaultValue={selectedContact.endereco}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Observações</label>
                    <Textarea
                      placeholder="Observações sobre o contato..."
                      defaultValue={selectedContact.observacoes}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedContact.tags?.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-1 flex items-center gap-1">
                          {tag}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-3 w-3 p-0 hover:bg-red-100"
                            onClick={() => {
                              // Lógica para remover tag seria implementada aqui
                            }}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Adicionar nova tag..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          // Lógica para adicionar nova tag seria implementada aqui
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsEditContactOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={() => setIsEditContactOpen(false)}>
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Modal de Lista de Contatos */}
        <Dialog open={isContactListOpen} onOpenChange={setIsContactListOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Compartilhar Contatos</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar contatos..."
                  className="pl-10"
                />
              </div>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {conversasExemplo.map((conversa) => (
                    <div
                      key={conversa.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        // Lógica para enviar contato na conversa
                        setIsContactListOpen(false);
                      }}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{conversa.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {conversa.cliente}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversa.telefone || 'Sem telefone'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>

        {/* Modal de Lista de Chatbots */}
        <Dialog open={isChatbotListOpen} onOpenChange={setIsChatbotListOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Transferir para Chatbot</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {['Atendimento Geral', 'Suporte Técnico', 'Vendas', 'Financeiro'].map((chatbot) => (
                    <div
                      key={chatbot}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        // Lógica para transferir para chatbot
                        setIsChatbotListOpen(false);
                      }}
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BotMessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {chatbot}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Chatbot disponível
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default AtendimentosOmnichannel;
