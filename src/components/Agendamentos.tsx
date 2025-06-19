import React, { useState, useMemo } from 'react';
import { Search, Plus, Calendar as CalendarIcon, List, Trash2, Edit, ChevronLeft, ChevronRight, Send, X, Save, Paperclip, Mic, Tag, Clock, Users, Hash, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import NewScheduleModal from './modals/NewScheduleModal';

interface Contact {
  id: number;
  name: string;
  phone: string;
  tags: string[];
}

interface Agendamento {
  id: number;
  title: string;
  contacts: Contact[];
  messageType: 'text' | 'audio';
  message?: string;
  audioUrl?: string;
  includeSignature: boolean;
  hasAttachments: boolean;
  scheduledDate: Date;
  scheduledTime: string;
  hasRecurrence: boolean;
  recurrenceType?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'custom';
  customDays?: number;
  channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Telegram';
  ticketStatus: 'Finalizado' | 'Aguardando' | 'Em Atendimento';
  sector: string;
  status: 'Agendado' | 'Enviado' | 'Cancelado';
}

const Agendamentos = () => {
  // Estados principais de controle da interface
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar'); // Modo de visualização: calendário ou lista
  const [searchTerm, setSearchTerm] = useState(''); // Termo de busca para filtrar agendamentos
  const [statusFilter, setStatusFilter] = useState('all'); // Filtro por status dos agendamentos
  const [periodFilter, setPeriodFilter] = useState('all'); // Filtro por período de tempo
  const [isNewAgendamentoOpen, setIsNewAgendamentoOpen] = useState(false); // Controla abertura do modal de novo agendamento
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null); // Agendamento selecionado para edição
  const [isEditAgendamentoOpen, setIsEditAgendamentoOpen] = useState(false); // Controla abertura do modal de edição
  
  // Estados da nova navegação unificada de data
  const [currentDate, setCurrentDate] = useState(new Date()); // Data atual para navegação do calendário
  const [showDatePicker, setShowDatePicker] = useState(false); // Controla exibição do mini calendário de navegação

  // Estados do formulário de agendamento
  const [contactSearch, setContactSearch] = useState(''); // Busca de contatos no formulário
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]); // Contatos selecionados para o agendamento
  const [selectedTag, setSelectedTag] = useState(''); // Tag selecionada para filtrar contatos
  const [messageType, setMessageType] = useState<'text' | 'audio'>('text'); // Tipo de mensagem: texto ou áudio
  const [messageText, setMessageText] = useState(''); // Conteúdo da mensagem de texto
  const [includeSignature, setIncludeSignature] = useState(false); // Incluir assinatura na mensagem
  const [hasAttachments, setHasAttachments] = useState(false); // Anexar mídia à mensagem
  const [selectedDate, setSelectedDate] = useState<Date>(); // Data selecionada para envio
  const [selectedTime, setSelectedTime] = useState(''); // Horário selecionado para envio
  const [hasRecurrence, setHasRecurrence] = useState(false); // Ativar recorrência do agendamento
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'custom'>('daily'); // Tipo de recorrência
  const [customDays, setCustomDays] = useState<number>(1); // Dias personalizados para recorrência
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'Instagram' | 'Facebook' | 'Telegram'>('WhatsApp'); // Canal de envio
  const [ticketStatus, setTicketStatus] = useState<'Finalizado' | 'Aguardando' | 'Em Atendimento'>('Aguardando'); // Status do ticket
  const [selectedSector, setSelectedSector] = useState(''); // Setor responsável pelo agendamento

  // Mock data - dados de exemplo para demonstração
  const mockContacts: Contact[] = [
    { id: 1, name: 'João Silva', phone: '(11) 99999-0001', tags: ['Cliente VIP', 'São Paulo'] },
    { id: 2, name: 'Maria Santos', phone: '(11) 99999-0002', tags: ['Prospect', 'Rio de Janeiro'] },
    { id: 3, name: 'Pedro Costa', phone: '(11) 99999-0003', tags: ['Cliente VIP', 'Belo Horizonte'] },
    { id: 4, name: 'Ana Oliveira', phone: '(11) 99999-0004', tags: ['Prospect', 'São Paulo'] },
    { id: 5, name: 'Carlos Pereira', phone: '(11) 99999-0005', tags: ['Cliente Ativo', 'Curitiba'] },
  ];

  // Tags disponíveis para filtrar contatos
  const availableTags = ['Cliente VIP', 'Prospect', 'Cliente Ativo', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'];
  // Setores disponíveis para classificar agendamentos
  const availableSectors = ['Vendas', 'Suporte', 'Marketing', 'Financeiro'];

  // Mock data - agendamentos de exemplo
  const mockAgendamentos: Agendamento[] = [
    {
      id: 1,
      title: 'Promoção Black Friday',
      contacts: [mockContacts[0], mockContacts[2]],
      messageType: 'text',
      message: 'Não perca! Black Friday com até 50% de desconto em todos os produtos!',
      includeSignature: true,
      hasAttachments: true,
      scheduledDate: new Date(2024, 11, 15, 9, 0),
      scheduledTime: '09:00',
      hasRecurrence: false,
      channel: 'WhatsApp',
      ticketStatus: 'Aguardando',
      sector: 'Marketing',
      status: 'Agendado'
    },
    {
      id: 2,
      title: 'Lembrete de Pagamento',
      contacts: [mockContacts[1]],
      messageType: 'text',
      message: 'Olá! Este é um lembrete sobre o vencimento da sua fatura.',
      includeSignature: false,
      hasAttachments: false,
      scheduledDate: new Date(2024, 11, 20, 14, 30),
      scheduledTime: '14:30',
      hasRecurrence: true,
      recurrenceType: 'monthly',
      channel: 'WhatsApp',
      ticketStatus: 'Em Atendimento',
      sector: 'Financeiro',
      status: 'Agendado'
    },
    {
      id: 3,
      title: 'Pesquisa de Satisfação',
      contacts: [mockContacts[3], mockContacts[4]],
      messageType: 'text',
      message: 'Como foi sua experiência conosco? Gostaríamos do seu feedback!',
      includeSignature: true,
      hasAttachments: false,
      scheduledDate: new Date(2024, 11, 18, 16, 0),
      scheduledTime: '16:00',
      hasRecurrence: false,
      channel: 'WhatsApp',
      ticketStatus: 'Finalizado',
      sector: 'Suporte',
      status: 'Agendado'
    },
    {
      id: 4,
      title: 'Oferta Especial',
      contacts: [mockContacts[0], mockContacts[1], mockContacts[2]],
      messageType: 'audio',
      audioUrl: 'audio.mp3',
      includeSignature: false,
      hasAttachments: false,
      scheduledDate: new Date(2024, 11, 22, 10, 0),
      scheduledTime: '10:00',
      hasRecurrence: true,
      recurrenceType: 'weekly',
      channel: 'Telegram',
      ticketStatus: 'Aguardando',
      sector: 'Vendas',
      status: 'Agendado'
    },
    {
      id: 5,
      title: 'Comunicado Importante',
      contacts: [mockContacts[4]],
      messageType: 'text',
      message: 'Informamos sobre as mudanças em nosso horário de funcionamento.',
      includeSignature: true,
      hasAttachments: true,
      scheduledDate: new Date(2024, 11, 25, 8, 0),
      scheduledTime: '08:00',
      hasRecurrence: false,
      channel: 'Instagram',
      ticketStatus: 'Aguardando',
      sector: 'Marketing',
      status: 'Agendado'
    },
    {
      id: 6,
      title: 'Follow-up Vendas',
      contacts: [mockContacts[1], mockContacts[3]],
      messageType: 'text',
      message: 'Olá! Como está indo com o produto que você demonstrou interesse?',
      includeSignature: false,
      hasAttachments: false,
      scheduledDate: new Date(2024, 11, 28, 15, 30),
      scheduledTime: '15:30',
      hasRecurrence: true,
      recurrenceType: 'custom',
      customDays: 7,
      channel: 'WhatsApp',
      ticketStatus: 'Em Atendimento',
      sector: 'Vendas',
      status: 'Agendado'
    }
  ];

  /**
   * Filtro inteligente de agendamentos baseado em múltiplos critérios
   * Aplica filtros de busca por texto, status e período simultaneamente
   */
  const filteredAgendamentos = useMemo(() => {
    return mockAgendamentos.filter(agendamento => {
      // Filtro de busca por título ou nome do contato
      const matchesSearch = agendamento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agendamento.contacts.some(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filtro por status do agendamento
      const matchesStatus = statusFilter === 'all' || agendamento.status === statusFilter;
      
      // Filtro por período de tempo
      let matchesPeriod = true;
      if (periodFilter !== 'all') {
        const today = new Date();
        const scheduleDate = agendamento.scheduledDate;
        
        switch (periodFilter) {
          case 'today':
            matchesPeriod = isSameDay(scheduleDate, today);
            break;
          case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            matchesPeriod = scheduleDate >= weekStart && scheduleDate <= weekEnd;
            break;
          case 'month':
            matchesPeriod = scheduleDate.getMonth() === today.getMonth() && 
                          scheduleDate.getFullYear() === today.getFullYear();
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesPeriod;
    });
  }, [mockAgendamentos, searchTerm, statusFilter, periodFilter]);

  /**
   * Obtém agendamentos para uma data específica
   * Usado para exibir agendamentos no calendário
   */
  const getAgendamentosForDate = (date: Date) => {
    return filteredAgendamentos.filter(agendamento => 
      isSameDay(agendamento.scheduledDate, date)
    );
  };

  /**
   * Filtra contatos baseado na tag selecionada e termo de busca
   * Automaticamente seleciona contatos quando uma tag é aplicada
   */
  const filteredContacts = useMemo(() => {
    let contacts = mockContacts;
    
    // Filtro por tag selecionada
    if (selectedTag && selectedTag !== 'none') {
      contacts = mockContacts.filter(contact =>
        contact.tags.includes(selectedTag)
      );
      
      // Auto-seleção de contatos quando uma tag é escolhida
      if (selectedTag && !selectedContacts.some(sc => contacts.some(c => c.id === sc.id))) {
        setSelectedContacts(contacts);
      }
    }
    
    // Filtro por termo de busca
    if (contactSearch) {
      contacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.phone.includes(contactSearch)
      );
    }
    
    return contacts;
  }, [contactSearch, selectedTag, mockContacts, selectedContacts]);

  /**
   * Navegação para o mês anterior
   * Subtrai um mês da data atual de visualização
   */
  const navigateToPreviousMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1));
  };

  /**
   * Navegação para o próximo mês
   * Adiciona um mês à data atual de visualização
   */
  const navigateToNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1));
  };

  /**
   * Manipula seleção de data no mini calendário
   * Atualiza a data de visualização e fecha o seletor
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(date);
      setShowDatePicker(false);
    }
  };

  /**
   * Salva novo agendamento
   * Processa dados do formulário e envia para backend (mock)
   */
  const handleSaveAgendamento = () => {
    console.log('Salvando agendamento:', {
      contacts: selectedContacts,
      messageType,
      message: messageText,
      includeSignature,
      hasAttachments,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      hasRecurrence,
      recurrenceType: hasRecurrence ? recurrenceType : undefined,
      customDays: recurrenceType === 'custom' ? customDays : undefined,
      channel: selectedChannel,
      ticketStatus,
      sector: selectedSector
    });
    
    resetForm();
    setIsNewAgendamentoOpen(false);
  };

  /**
   * Prepara formulário para edição de agendamento existente
   * Popula todos os campos com dados do agendamento selecionado
   */
  const handleEditAgendamento = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    
    // Preenchimento completo do formulário
    setSelectedContacts(agendamento.contacts);
    setMessageType(agendamento.messageType);
    setMessageText(agendamento.message || '');
    setIncludeSignature(agendamento.includeSignature);
    setHasAttachments(agendamento.hasAttachments);
    setSelectedDate(agendamento.scheduledDate);
    setSelectedTime(agendamento.scheduledTime);
    setHasRecurrence(agendamento.hasRecurrence);
    setRecurrenceType(agendamento.recurrenceType || 'daily');
    setCustomDays(agendamento.customDays || 1);
    setSelectedChannel(agendamento.channel);
    setTicketStatus(agendamento.ticketStatus);
    setSelectedSector(agendamento.sector);
    
    setIsEditAgendamentoOpen(true);
  };

  /**
   * Salva alterações de agendamento editado
   * Atualiza agendamento existente com novos dados
   */
  const handleSaveEditAgendamento = () => {
    console.log('Salvando edição do agendamento:', selectedAgendamento?.id);
    
    resetForm();
    setSelectedAgendamento(null);
    setIsEditAgendamentoOpen(false);
  };

  /**
   * Limpa todos os campos do formulário
   * Usado após salvar ou cancelar operações
   */
  const resetForm = () => {
    setContactSearch('');
    setSelectedContacts([]);
    setSelectedTag('');
    setMessageType('text');
    setMessageText('');
    setIncludeSignature(false);
    setHasAttachments(false);
    setSelectedDate(undefined);
    setSelectedTime('');
    setHasRecurrence(false);
    setRecurrenceType('daily');
    setCustomDays(1);
    setSelectedChannel('WhatsApp');
    setTicketStatus('Aguardando');
    setSelectedSector('');
  };

  /**
   * Descarta novo agendamento sem salvar
   * Limpa formulário e fecha modal
   */
  const handleDiscardAgendamento = () => {
    resetForm();
    setIsNewAgendamentoOpen(false);
  };

  /**
   * Descarta edição de agendamento sem salvar
   * Limpa formulário e fecha modal de edição
   */
  const handleDiscardEditAgendamento = () => {
    resetForm();
    setSelectedAgendamento(null);
    setIsEditAgendamentoOpen(false);
  };

  /**
   * Envia agendamento imediatamente
   * Bypassa agendamento e executa envio instantâneo
   */
  const handleSendNow = (agendamento: Agendamento) => {
    console.log('Enviando agendamento agora:', agendamento.id);
  };

  /**
   * Exclui agendamento permanentemente
   * Remove agendamento da lista (mock)
   */
  const handleDeleteAgendamento = (agendamento: Agendamento) => {
    console.log('Excluindo agendamento:', agendamento.id);
  };

  // Cálculo das datas do calendário baseado na data atual de navegação
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <TooltipProvider>
      {/* Container principal com cores dinâmicas da marca e responsividade completa */}
      <div className="p-3 sm:p-6 bg-background min-h-screen">
        {/* Cabeçalho da página com título e contador de agendamentos */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
            Agendamentos ({filteredAgendamentos.length})
          </h1>

          {/* Barra de pesquisa responsiva com ícone */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar agendamento ou contato"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border bg-background text-foreground"
            />
          </div>

          {/* Container de filtros e controles principais */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center mb-6">
            {/* Seção de filtros responsivos */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Filtro por status com cores dinâmicas */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-border bg-background text-foreground min-w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Agendado">Agendado</SelectItem>
                  <SelectItem value="Enviado">Enviado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              {/* Filtro por período com cores dinâmicas */}
              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="border-border bg-background text-foreground min-w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggle de visualização calendário/lista com cores da marca */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-2",
                  viewMode === 'calendar' 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                Calendário
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "flex items-center gap-2",
                  viewMode === 'list' 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <List className="h-4 w-4" />
                Lista
              </Button>
            </div>

            {/* Botão de novo agendamento com novo modal */}
            <NewScheduleModal
              isOpen={isNewAgendamentoOpen}
              onClose={() => setIsNewAgendamentoOpen(false)}
            />
            <Button 
              onClick={() => setIsNewAgendamentoOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Conteúdo principal: calendário ou lista */}
        {viewMode === 'calendar' ? (
          <div className="bg-card border border-border rounded-lg">
            {/* Nova barra de navegação unificada responsiva */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border gap-4">
              {/* Navegação de mês anterior/próximo */}
              <div className="flex items-center gap-2 order-2 sm:order-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToPreviousMonth}
                  className="border-border flex items-center gap-1 px-2 sm:px-3"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={navigateToNextMonth}
                  className="border-border flex items-center gap-1 px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">Próximo</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Exibição do mês/ano atual com mini calendário */}
              <div className="order-1 sm:order-2">
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-lg sm:text-xl font-semibold hover:bg-accent px-3 py-2"
                    >
                      {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border border-border shadow-lg z-50">
                    <Calendar
                      mode="single"
                      selected={currentDate}
                      onSelect={handleDateSelect}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Espaço para manter alinhamento */}
              <div className="hidden sm:block order-3 w-24"></div>
            </div>

            {/* Grid do calendário responsivo */}
            <div className="p-2 sm:p-4">
              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do calendário com agendamentos */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const dayAgendamentos = getAgendamentosForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-16 sm:min-h-20 p-1 border border-border rounded",
                        !isCurrentMonth && "bg-muted text-muted-foreground"
                      )}
                    >
                      {/* Número do dia */}
                      <div className="text-xs sm:text-sm font-medium mb-1">
                        {format(day, "d")}
                      </div>
                      
                      {/* Agendamentos do dia */}
                      {dayAgendamentos.length > 0 && (
                        <div className="space-y-1">
                          {dayAgendamentos.slice(0, 2).map((agendamento) => (
                            <div
                              key={agendamento.id}
                              className="text-xs p-1 bg-primary/10 text-primary rounded truncate cursor-pointer hover:bg-primary/20 transition-colors"
                              title={agendamento.title}
                            >
                              {agendamento.title}
                            </div>
                          ))}
                          {/* Indicador de mais agendamentos */}
                          {dayAgendamentos.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayAgendamentos.length - 2} mais
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Lista de agendamentos responsiva
          <div className="space-y-4">
            {filteredAgendamentos.map((agendamento) => (
              <div key={agendamento.id} className="bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Informações principais do agendamento */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-foreground">{agendamento.title}</h3>
                      {/* Badges de status e canal */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">
                          {agendamento.channel}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                          {agendamento.status}
                        </span>
                        {/* Indicador de recorrência */}
                        {agendamento.hasRecurrence && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full border border-purple-200">
                            <RefreshCw className="h-3 w-3 inline mr-1" />
                            Recorrente
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Detalhes do agendamento */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(agendamento.scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {agendamento.contacts.length} contato(s)
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="h-4 w-4" />
                        {agendamento.sector}
                      </div>
                    </div>
                    
                    {/* Preview da mensagem */}
                    {agendamento.messageType === 'text' && agendamento.message && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded line-clamp-2">
                        {agendamento.message}
                      </p>
                    )}
                    
                    {/* Lista de contatos */}
                    <div className="flex flex-wrap gap-1">
                      {agendamento.contacts.map((contact) => (
                        <span key={contact.id} className="px-2 py-1 bg-muted text-xs rounded-full border border-border">
                          {contact.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Botões de ação responsivos */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    {/* Botão excluir */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteAgendamento(agendamento)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Excluir Agendamento</p></TooltipContent>
                    </Tooltip>
                    
                    {/* Botão enviar agora */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSendNow(agendamento)}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Enviar Agora</p></TooltipContent>
                    </Tooltip>
                    
                    {/* Botão editar */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAgendamento(agendamento)}
                          className="border-border"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Editar Agendamento</p></TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de edição de agendamento existente */}
        <Dialog open={isEditAgendamentoOpen} onOpenChange={setIsEditAgendamentoOpen}>
          <DialogContent className="sm:max-w-2xl bg-background border border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Agendamento</DialogTitle>
            </DialogHeader>
            
            {selectedAgendamento && (
              <div className="space-y-6">
                {/* Formulário de edição com os mesmos campos do novo agendamento */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Pesquisar Contatos</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Digite o nome ou telefone"
                            value={contactSearch}
                            onChange={(e) => setContactSearch(e.target.value)}
                            className="pl-10 border-gray-300"
                          />
                        </div>
                      </div>
                      <div className="min-w-48">
                        <label className="text-sm font-medium mb-2 block">Filtrar por TAG</label>
                        <Select value={selectedTag} onValueChange={setSelectedTag}>
                          <SelectTrigger className="border-gray-300 bg-white">
                            <SelectValue placeholder="Selecionar TAG" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                            <SelectItem value="none">Nenhuma TAG</SelectItem>
                            {availableTags.map((tag) => (
                              <SelectItem key={tag} value={tag}>
                                {tag}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedContacts.length > 0 && (
                      <div>
                        <label className="text-sm font-medium mb-2 block">Agendamento para:</label>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {selectedContacts.map((contact) => (
                              <span key={contact.id} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-sm rounded-full border border-blue-200">
                                {contact.name}
                                <button
                                  onClick={() => setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id))}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de Mensagem</label>
                    <div className="flex gap-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="messageType"
                          value="text"
                          checked={messageType === 'text'}
                          onChange={(e) => setMessageType(e.target.value as 'text' | 'audio')}
                          className="text-black"
                        />
                        <span>Texto</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="messageType"
                          value="audio"
                          checked={messageType === 'audio'}
                          onChange={(e) => setMessageType(e.target.value as 'text' | 'audio')}
                          className="text-black"
                        />
                        <span>Áudio</span>
                      </label>
                    </div>
                  </div>

                  {/* Conteúdo da Mensagem */}
                  {messageType === 'text' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Mensagem</label>
                        <Textarea
                          placeholder="Digite sua mensagem aqui..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="border-gray-300 min-h-24"
                        />
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={includeSignature}
                            onCheckedChange={(checked) => setIncludeSignature(checked as boolean)}
                          />
                          <span className="text-sm">Incluir assinatura</span>
                        </label>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setHasAttachments(!hasAttachments)}
                          className={cn(
                            "flex items-center gap-2 border-gray-300",
                            hasAttachments && "bg-gray-100"
                          )}
                        >
                          <Paperclip className="h-4 w-4" />
                          Anexar mídia
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Áudio</label>
                      <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                        <Mic className="h-4 w-4" />
                        Gravar áudio
                      </Button>
                    </div>
                  )}

                  {/* Data e Hora */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Data de Envio</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start border-gray-300">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white border border-gray-300 shadow-lg">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Horário de Envio</label>
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="border-gray-300"
                      />
                    </div>
                  </div>

                  {/* Recorrência */}
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={hasRecurrence}
                        onCheckedChange={(checked) => setHasRecurrence(checked as boolean)}
                      />
                      <span className="text-sm font-medium">Cadastrar recorrência</span>
                    </label>
                    
                    {hasRecurrence && (
                      <div className="space-y-4 pl-6">
                        <Select value={recurrenceType} onValueChange={(value) => setRecurrenceType(value as any)}>
                          <SelectTrigger className="border-gray-300 bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                            <SelectItem value="daily">Diária (todo dia)</SelectItem>
                            <SelectItem value="weekly">Semanal</SelectItem>
                            <SelectItem value="monthly">Mensal (todo mês)</SelectItem>
                            <SelectItem value="quarterly">Trimestral (cada 3 meses)</SelectItem>
                            <SelectItem value="semiannual">Semestral (cada 6 meses)</SelectItem>
                            <SelectItem value="annual">Anual (1 vez por ano)</SelectItem>
                            <SelectItem value="custom">Personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {recurrenceType === 'custom' && (
                          <div>
                            <label className="text-sm font-medium mb-2 block">Repetir a cada quantos dias?</label>
                            <Input
                              type="number"
                              min="1"
                              value={customDays}
                              onChange={(e) => setCustomDays(Number(e.target.value))}
                              className="border-gray-300"
                              placeholder="Número de dias"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Canal e Configurações */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Canal de Envio</label>
                      <Select value={selectedChannel} onValueChange={(value) => setSelectedChannel(value as any)}>
                        <SelectTrigger className="border-gray-300 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                          <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                          <SelectItem value="Instagram">Instagram</SelectItem>
                          <SelectItem value="Facebook">Facebook</SelectItem>
                          <SelectItem value="Telegram">Telegram</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Status do Ticket</label>
                      <Select value={ticketStatus} onValueChange={(value) => setTicketStatus(value as any)}>
                        <SelectTrigger className="border-gray-300 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                          <SelectItem value="Finalizado">Finalizado</SelectItem>
                          <SelectItem value="Aguardando">Aguardando</SelectItem>
                          <SelectItem value="Em Atendimento">Em Atendimento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Setor</label>
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger className="border-gray-300 bg-white">
                        <SelectValue placeholder="Selecionar setor" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-300 shadow-lg z-50">
                        {availableSectors.map((sector) => (
                          <SelectItem key={sector} value={sector}>
                            {sector}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Botões de ação do modal de edição */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDiscardEditAgendamento}
                    className="border-border"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Descartar
                  </Button>
                  <Button
                    onClick={handleSaveEditAgendamento}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default Agendamentos;
