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
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [isNewAgendamentoOpen, setIsNewAgendamentoOpen] = useState(false);
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null);
  const [isEditAgendamentoOpen, setIsEditAgendamentoOpen] = useState(false);
  
  // Estados do calendário
  const [currentDate, setCurrentDate] = useState(new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Estados do formulário
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [messageType, setMessageType] = useState<'text' | 'audio'>('text');
  const [messageText, setMessageText] = useState('');
  const [includeSignature, setIncludeSignature] = useState(false);
  const [hasAttachments, setHasAttachments] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'custom'>('daily');
  const [customDays, setCustomDays] = useState<number>(1);
  const [selectedChannel, setSelectedChannel] = useState<'WhatsApp' | 'Instagram' | 'Facebook' | 'Telegram'>('WhatsApp');
  const [ticketStatus, setTicketStatus] = useState<'Finalizado' | 'Aguardando' | 'Em Atendimento'>('Aguardando');
  const [selectedSector, setSelectedSector] = useState('');

  // Mock data
  const mockContacts: Contact[] = [
    { id: 1, name: 'João Silva', phone: '(11) 99999-0001', tags: ['Cliente VIP', 'São Paulo'] },
    { id: 2, name: 'Maria Santos', phone: '(11) 99999-0002', tags: ['Prospect', 'Rio de Janeiro'] },
    { id: 3, name: 'Pedro Costa', phone: '(11) 99999-0003', tags: ['Cliente VIP', 'Belo Horizonte'] },
    { id: 4, name: 'Ana Oliveira', phone: '(11) 99999-0004', tags: ['Prospect', 'São Paulo'] },
    { id: 5, name: 'Carlos Pereira', phone: '(11) 99999-0005', tags: ['Cliente Ativo', 'Curitiba'] },
  ];

  const availableTags = ['Cliente VIP', 'Prospect', 'Cliente Ativo', 'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'];
  const availableSectors = ['Vendas', 'Suporte', 'Marketing', 'Financeiro'];

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

  const filteredAgendamentos = useMemo(() => {
    return mockAgendamentos.filter(agendamento => {
      const matchesSearch = agendamento.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           agendamento.contacts.some(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || agendamento.status === statusFilter;
      
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

  const getAgendamentosForDate = (date: Date) => {
    return filteredAgendamentos.filter(agendamento => 
      isSameDay(agendamento.scheduledDate, date)
    );
  };

  const filteredContacts = useMemo(() => {
    let contacts = mockContacts;
    
    if (selectedTag) {
      contacts = mockContacts.filter(contact =>
        contact.tags.includes(selectedTag)
      );
      
      // Se uma tag foi selecionada, adiciona todos os contatos com essa tag
      if (selectedTag && !selectedContacts.some(sc => contacts.some(c => c.id === sc.id))) {
        setSelectedContacts(contacts);
      }
    }
    
    if (contactSearch) {
      contacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
        contact.phone.includes(contactSearch)
      );
    }
    
    return contacts;
  }, [contactSearch, selectedTag, mockContacts, selectedContacts]);

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

  const handleEditAgendamento = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento);
    
    // Preenche o formulário com os dados do agendamento
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

  const handleSaveEditAgendamento = () => {
    console.log('Salvando edição do agendamento:', selectedAgendamento?.id);
    
    resetForm();
    setSelectedAgendamento(null);
    setIsEditAgendamentoOpen(false);
  };

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

  const handleDiscardAgendamento = () => {
    resetForm();
    setIsNewAgendamentoOpen(false);
  };

  const handleDiscardEditAgendamento = () => {
    resetForm();
    setSelectedAgendamento(null);
    setIsEditAgendamentoOpen(false);
  };

  const handleSendNow = (agendamento: Agendamento) => {
    console.log('Enviando agendamento agora:', agendamento.id);
  };

  const handleDeleteAgendamento = (agendamento: Agendamento) => {
    console.log('Excluindo agendamento:', agendamento.id);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1);
    } else {
      newDate.setMonth(currentMonth + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setFullYear(currentYear - 1);
    } else {
      newDate.setFullYear(currentYear + 1);
    }
    setCurrentDate(newDate);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <TooltipProvider>
      <div className="p-3 sm:p-6 bg-background dark:bg-background min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground dark:text-foreground mb-4 sm:mb-6">
            Agendamentos ({filteredAgendamentos.length})
          </h1>

          {/* Barra de pesquisa */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar agendamento ou contato"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center mb-6">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground min-w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-background border border-border dark:border-border shadow-lg z-50">
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="Agendado">Agendado</SelectItem>
                  <SelectItem value="Enviado">Enviado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={periodFilter} onValueChange={setPeriodFilter}>
                <SelectTrigger className="border-border dark:border-border bg-background dark:bg-background text-foreground dark:text-foreground min-w-40">
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent className="bg-background dark:bg-background border border-border dark:border-border shadow-lg z-50">
                  <SelectItem value="all">Todos os Períodos</SelectItem>
                  <SelectItem value="today">Hoje</SelectItem>
                  <SelectItem value="week">Esta Semana</SelectItem>
                  <SelectItem value="month">Este Mês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Toggle de visualização */}
            <div className="flex items-center bg-muted dark:bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className={cn(
                  "flex items-center gap-2",
                  viewMode === 'calendar' 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-accent"
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
                    : "text-muted-foreground hover:text-foreground hover:bg-accent dark:hover:bg-accent"
                )}
              >
                <List className="h-4 w-4" />
                Lista
              </Button>
            </div>

            {/* Botão Novo Agendamento */}
            <Dialog open={isNewAgendamentoOpen} onOpenChange={setIsNewAgendamentoOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl bg-background dark:bg-background border border-border dark:border-border max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Seleção de Contatos */}
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
                            <SelectItem value="">Nenhuma TAG</SelectItem>
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

                  {/* Tipo de Mensagem */}
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

                  {/* Botões */}
                  <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleDiscardAgendamento}
                      className="border-gray-300"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Descartar
                    </Button>
                    <Button
                      onClick={handleSaveAgendamento}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Conteúdo Principal */}
        {viewMode === 'calendar' ? (
          <div className="bg-card dark:bg-card border border-border dark:border-border rounded-lg">
            {/* Header do Calendário */}
            <div className="flex items-center justify-between p-4 border-b border-border dark:border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="border-border dark:border-border"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="border-border dark:border-border"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                
                <h2 className="text-lg font-semibold">
                  {format(currentDate, "MMMM", { locale: ptBR })}
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateYear('prev')}
                  className="border-border dark:border-border"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold min-w-16 text-center">{currentYear}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateYear('next')}
                  className="border-border dark:border-border"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid do Calendário */}
            <div className="p-4">
              {/* Cabeçalho dos dias da semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              {/* Dias do calendário */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day) => {
                  const dayAgendamentos = getAgendamentosForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentDate);
                  
                  return (
                    <div
                      key={day.toISOString()}
                      className={cn(
                        "min-h-20 p-1 border border-border dark:border-border rounded",
                        !isCurrentMonth && "bg-muted dark:bg-muted text-muted-foreground"
                      )}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(day, "d")}
                      </div>
                      
                      {dayAgendamentos.length > 0 && (
                        <div className="space-y-1">
                          {dayAgendamentos.slice(0, 2).map((agendamento) => (
                            <div
                              key={agendamento.id}
                              className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate cursor-pointer hover:bg-blue-200"
                              title={agendamento.title}
                            >
                              {agendamento.title}
                            </div>
                          ))}
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
          <div className="space-y-4">
            {filteredAgendamentos.map((agendamento) => (
              <div key={agendamento.id} className="bg-card dark:bg-card border border-border dark:border-border rounded-lg p-4 hover:bg-accent dark:hover:bg-accent transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <h3 className="font-semibold text-foreground dark:text-foreground">{agendamento.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 text-xs rounded-full border border-blue-200">
                          {agendamento.channel}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-xs rounded-full border border-green-200">
                          {agendamento.status}
                        </span>
                        {agendamento.hasRecurrence && (
                          <span className="px-2 py-1 bg-purple-100 text-xs rounded-full border border-purple-200">
                            <RefreshCw className="h-3 w-3 inline mr-1" />
                            Recorrente
                          </span>
                        )}
                      </div>
                    </div>
                    
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
                    
                    {agendamento.messageType === 'text' && agendamento.message && (
                      <p className="text-sm text-muted-foreground bg-muted dark:bg-muted p-2 rounded line-clamp-2">
                        {agendamento.message}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {agendamento.contacts.map((contact) => (
                        <span key={contact.id} className="px-2 py-1 bg-muted dark:bg-muted text-xs rounded-full border border-border dark:border-border">
                          {contact.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-row lg:flex-col gap-2">
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
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditAgendamento(agendamento)}
                          className="border-border dark:border-border"
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

        {/* Dialog de Editar Agendamento */}
        <Dialog open={isEditAgendamentoOpen} onOpenChange={setIsEditAgendamentoOpen}>
          <DialogContent className="sm:max-w-2xl bg-background dark:bg-background border border-border dark:border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Agendamento</DialogTitle>
            </DialogHeader>
            
            {selectedAgendamento && (
              <div className="space-y-6">
                {/* Formulário de edição com os mesmos campos do novo agendamento */}
                <div className="space-y-6">
                  {/* Seleção de Contatos */}
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
                            <SelectItem value="">Nenhuma TAG</SelectItem>
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

                  {/* Tipo de Mensagem */}
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
                
                <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={handleDiscardEditAgendamento}
                    className="border-gray-300"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Descartar
                  </Button>
                  <Button
                    onClick={handleSaveEditAgendamento}
                    className="bg-black text-white hover:bg-gray-800"
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
