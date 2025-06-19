
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, X, Search, Tag, MessageSquare, Mic, Paperclip, Save, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ContactSelector from '@/components/selectors/ContactSelector';
import TagSelector from '@/components/selectors/TagSelector';
import ChannelSelector from '@/components/selectors/ChannelSelector';
import SectorSelector from '@/components/selectors/SectorSelector';
import DateTimePicker from '@/components/selectors/DateTimePicker';
import RecurrenceSelector from '@/components/selectors/RecurrenceSelector';
import AudioRecorder from '@/components/audio/AudioRecorder';
import { useContacts } from '@/hooks/useContacts';
import { useTags } from '@/hooks/useTags';
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { Contact, Tag as TagType, Connection } from '@/types/global';

/**
 * Modal completo para criação de novos agendamentos
 * Inclui seleção de contatos, configuração de mensagens/áudio, 
 * agendamento com recorrência, e validações completas
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface NewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedContacts?: Contact[];
  preSelectedTag?: string;
}

type MessageType = 'text' | 'audio';
type TicketStatus = 'Em Atendimento' | 'Aguardando' | 'Finalizado';

const NewScheduleModal = ({
  isOpen,
  onClose,
  preSelectedContacts = [],
  preSelectedTag
}: NewScheduleModalProps) => {
  // Estados principais
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string>(preSelectedTag || '');
  const [useTagContacts, setUseTagContacts] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>('text');
  const [messageText, setMessageText] = useState('');
  const [includeSignature, setIncludeSignature] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState('');
  const [hasRecurrence, setHasRecurrence] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState('');
  const [customDays, setCustomDays] = useState(1);
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>('Em Atendimento');
  const [selectedSectorId, setSelectedSectorId] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  // Hooks
  const { getContactById, getContactsByTag } = useContacts();
  const { getTagById } = useTags();
  const { connections } = useGlobalData();

  // Estados de validação
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  /**
   * Inicializa contatos pré-selecionados quando o modal abre
   */
  useEffect(() => {
    if (preSelectedContacts.length > 0) {
      setSelectedContacts(preSelectedContacts);
    }
    if (preSelectedTag) {
      setSelectedTagId(preSelectedTag);
      setUseTagContacts(true);
    }
  }, [preSelectedContacts, preSelectedTag]);

  /**
   * Valida compatibilidade entre contatos e canal selecionado
   */
  useEffect(() => {
    validateContactsAndChannel();
  }, [selectedContacts, selectedChannelId, useTagContacts, selectedTagId]);

  /**
   * Valida se todos os contatos são compatíveis com o canal selecionado
   */
  const validateContactsAndChannel = () => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    // Obter contatos finais (individuais ou da tag)
    const finalContacts = useTagContacts && selectedTagId 
      ? getContactsByTag(selectedTagId)
      : selectedContacts;

    if (finalContacts.length === 0) {
      newErrors.push('Selecione pelo menos um contato ou uma tag com contatos');
    }

    // Verificar se todos os contatos têm a mesma origem
    const contactOrigins = [...new Set(finalContacts.map(contact => contact.canal))];
    if (contactOrigins.length > 1) {
      newWarnings.push(`Contatos selecionados possuem origens diferentes: ${contactOrigins.join(', ')}. Isso pode causar problemas no envio.`);
    }

    // Verificar compatibilidade com canal selecionado
    if (selectedChannelId) {
      const selectedChannel = connections.find(conn => conn.id === selectedChannelId);
      if (selectedChannel) {
        const incompatibleContacts = finalContacts.filter(
          contact => contact.canal !== selectedChannel.tipo
        );
        
        if (incompatibleContacts.length > 0) {
          newErrors.push(
            `${incompatibleContacts.length} contato(s) não são compatíveis com o canal ${selectedChannel.nome} (${selectedChannel.tipo})`
          );
        }
      }
    }

    setErrors(newErrors);
    setWarnings(newWarnings);
  };

  /**
   * Adiciona contato à seleção
   */
  const handleAddContact = (contact: Contact) => {
    if (!selectedContacts.find(c => c.id === contact.id)) {
      setSelectedContacts(prev => [...prev, contact]);
      setUseTagContacts(false); // Desativa seleção por tag
    }
  };

  /**
   * Remove contato da seleção
   */
  const handleRemoveContact = (contactId: string) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactId));
  };

  /**
   * Seleciona tag para usar todos os contatos
   */
  const handleTagSelection = (tagId: string) => {
    setSelectedTagId(tagId);
    setUseTagContacts(true);
    setSelectedContacts([]); // Limpa seleção individual
  };

  /**
   * Manipula upload de anexos
   */
  const handleFileUpload = (files: FileList | null) => {
    if (files && messageType === 'text') {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  /**
   * Remove anexo
   */
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  /**
   * Valida formulário antes do envio
   */
  const validateForm = (): boolean => {
    if (errors.length > 0) return false;
    if (!selectedDate || !selectedTime) return false;
    if (messageType === 'text' && !messageText.trim()) return false;
    if (messageType === 'audio' && !audioBlob) return false;
    if (!selectedChannelId || !selectedSectorId) return false;
    return true;
  };

  /**
   * Cria agendamento
   */
  const handleCreateSchedule = () => {
    if (!validateForm()) {
      alert('Por favor, preencha todos os campos obrigatórios e corrija os erros.');
      return;
    }

    // Obter contatos finais
    const finalContacts = useTagContacts && selectedTagId 
      ? getContactsByTag(selectedTagId)
      : selectedContacts;

    const scheduleData = {
      contacts: finalContacts,
      messageType,
      messageText: messageType === 'text' ? messageText : '',
      includeSignature: messageType === 'text' ? includeSignature : false,
      audioBlob: messageType === 'audio' ? audioBlob : null,
      scheduledDate: selectedDate,
      scheduledTime: selectedTime,
      hasRecurrence,
      recurrenceType: hasRecurrence ? recurrenceType : null,
      customDays: recurrenceType === 'custom' ? customDays : null,
      channelId: selectedChannelId,
      ticketStatus,
      sectorId: selectedSectorId,
      attachments: messageType === 'text' ? attachments : [],
      createdAt: new Date()
    };

    console.log('Agendamento criado:', scheduleData);
    // TODO: Implementar lógica de salvamento
    
    handleClose();
  };

  /**
   * Fecha modal e limpa estados
   */
  const handleClose = () => {
    setSelectedContacts([]);
    setSelectedTagId('');
    setUseTagContacts(false);
    setMessageType('text');
    setMessageText('');
    setIncludeSignature(false);
    setAudioBlob(null);
    setSelectedDate(undefined);
    setSelectedTime('');
    setHasRecurrence(false);
    setRecurrenceType('');
    setCustomDays(1);
    setSelectedChannelId('');
    setTicketStatus('Em Atendimento');
    setSelectedSectorId('');
    setAttachments([]);
    setErrors([]);
    setWarnings([]);
    onClose();
  };

  /**
   * Gera iniciais do nome para avatar
   */
  const getInitials = (nome: string): string => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Obter contatos finais para exibição
  const finalContacts = useTagContacts && selectedTagId 
    ? getContactsByTag(selectedTagId)
    : selectedContacts;

  const selectedTag = selectedTagId ? getTagById(selectedTagId) : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl mx-4 bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Novo Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alertas de erro e aviso */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {warnings.length > 0 && (
            <Alert>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Seleção de Contatos */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4" />
                <Label className="text-foreground font-medium">Destinatários</Label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Seletor de contatos individuais */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Selecionar Contatos
                  </Label>
                  <ContactSelector
                    onSelectContact={handleAddContact}
                    placeholder="Buscar contatos..."
                    maxResults={5}
                  />
                </div>

                {/* Seletor de tags */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Ou Selecionar por Tag
                  </Label>
                  <TagSelector
                    value={selectedTagId}
                    onValueChange={handleTagSelection}
                    placeholder="Selecionar tag..."
                  />
                </div>
              </div>

              {/* Exibir seleção atual */}
              {useTagContacts && selectedTag ? (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        Tag: {selectedTag.nome}
                      </span>
                      <Badge variant="secondary">
                        {finalContacts.length} contatos
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setUseTagContacts(false);
                        setSelectedTagId('');
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                finalContacts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {finalContacts.map((contact) => (
                      <div 
                        key={contact.id}
                        className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border border-border"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={contact.avatar} alt={contact.nome} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {getInitials(contact.nome)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground text-sm truncate">
                            {contact.nome}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contact.canal}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(contact.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* Tipo de Mensagem */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-4 w-4" />
                <Label className="text-foreground font-medium">Tipo de Mensagem</Label>
              </div>

              <div className="flex gap-4 mb-4">
                <Button
                  variant={messageType === 'text' ? 'default' : 'outline'}
                  onClick={() => setMessageType('text')}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensagem
                </Button>
                <Button
                  variant={messageType === 'audio' ? 'default' : 'outline'}
                  onClick={() => setMessageType('audio')}
                  className="flex-1"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Áudio
                </Button>
              </div>

              {messageType === 'text' ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="message-text">Mensagem *</Label>
                    <Textarea
                      id="message-text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-signature"
                      checked={includeSignature}
                      onCheckedChange={setIncludeSignature}
                    />
                    <Label htmlFor="include-signature">Incluir assinatura</Label>
                  </div>

                  {/* Anexos */}
                  <div>
                    <Label className="mb-2 block">Anexos</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        Anexar mídia
                      </Button>
                    </div>
                    
                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <AudioRecorder
                  onAudioReady={setAudioBlob}
                  className="w-full"
                />
              )}
            </CardContent>
          </Card>

          {/* Data e Hora */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4" />
                <Label className="text-foreground font-medium">Data e Hora *</Label>
              </div>

              <DateTimePicker
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onDateChange={setSelectedDate}
                onTimeChange={setSelectedTime}
              />
            </CardContent>
          </Card>

          {/* Recorrência */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Label className="text-foreground font-medium">Recorrência</Label>
                <Switch
                  checked={hasRecurrence}
                  onCheckedChange={setHasRecurrence}
                />
              </div>

              {hasRecurrence && (
                <RecurrenceSelector
                  value={recurrenceType}
                  customDays={customDays}
                  onValueChange={setRecurrenceType}
                  onCustomDaysChange={setCustomDays}
                />
              )}
            </CardContent>
          </Card>

          {/* Canal e Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <Label className="text-foreground font-medium mb-3 block">Canal *</Label>
                <ChannelSelector
                  value={selectedChannelId}
                  onValueChange={setSelectedChannelId}
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <Label className="text-foreground font-medium mb-3 block">Setor *</Label>
                <SectorSelector
                  value={selectedSectorId}
                  onValueChange={setSelectedSectorId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Status do Atendimento */}
          <Card>
            <CardContent className="p-4">
              <Label className="text-foreground font-medium mb-3 block">
                Status do Atendimento *
              </Label>
              <Select value={ticketStatus} onValueChange={(value: TicketStatus) => setTicketStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Em Atendimento">Em Atendimento</SelectItem>
                  <SelectItem value="Aguardando">Aguardando</SelectItem>
                  <SelectItem value="Finalizado">Finalizado</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="border-border text-foreground hover:bg-accent"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Descartar
            </Button>
            <Button 
              onClick={handleCreateSchedule}
              disabled={!validateForm()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Agendamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewScheduleModal;
