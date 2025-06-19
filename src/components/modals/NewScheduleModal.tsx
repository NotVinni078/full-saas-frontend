
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, X, Search, Tag, MessageSquare, Mic, Paperclip, Save, Trash2, AlertTriangle } from 'lucide-react';
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
 * Melhorias implementadas:
 * - Seleção de contatos aprimorada (apenas ao digitar)
 * - Remoção de status online/offline
 * - Ícones de redes sociais com logos reais
 * - Avisos com melhor destaque e textos corretos
 * - Remoção do aviso de QR Code
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
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
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
      setSelectedTagIds([preSelectedTag]);
      setUseTagContacts(true);
    }
  }, [preSelectedContacts, preSelectedTag]);

  /**
   * Valida compatibilidade entre contatos e canal selecionado
   */
  useEffect(() => {
    validateContactsAndChannel();
  }, [selectedContacts, selectedChannelId, useTagContacts, selectedTagIds]);

  /**
   * Valida se todos os contatos são compatíveis com o canal selecionado
   */
  const validateContactsAndChannel = () => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    // Obter contatos finais (individuais ou das tags)
    const finalContacts = useTagContacts && selectedTagIds.length > 0
      ? selectedTagIds.flatMap(tagId => getContactsByTag(tagId))
      : selectedContacts;

    if (finalContacts.length === 0) {
      newErrors.push('Selecione pelo menos um contato ou uma tag com contatos');
    }

    // Verificar se todos os contatos têm a mesma origem
    const contactOrigins = [...new Set(finalContacts.map(contact => contact.canal))];
    if (contactOrigins.length > 1) {
      newWarnings.push(`Contatos selecionados possuem origens diferentes: ${contactOrigins.join(', ')}. Não é possível enviar para contatos de origem diferente.`);
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
   * Seleciona tags para usar todos os contatos
   */
  const handleTagsSelection = (tagIds: string[]) => {
    setSelectedTagIds(tagIds);
    setUseTagContacts(tagIds.length > 0);
    if (tagIds.length > 0) {
      setSelectedContacts([]); // Limpa seleção individual
    }
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
    const finalContacts = useTagContacts && selectedTagIds.length > 0
      ? selectedTagIds.flatMap(tagId => getContactsByTag(tagId))
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
    setSelectedTagIds([]);
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

  /**
   * Obtém ícone do canal com logos reais das redes sociais
   */
  const getChannelIcon = (canal: string) => {
    const iconClasses = "h-4 w-4 flex-shrink-0";
    
    switch (canal.toLowerCase()) {
      case 'whatsapp':
        return (
          <div className={`${iconClasses} rounded-full bg-green-500 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.426"/>
            </svg>
          </div>
        );
      case 'instagram':
        return (
          <div className={`${iconClasses} rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
        );
      case 'facebook':
        return (
          <div className={`${iconClasses} rounded-full bg-blue-600 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
        );
      case 'telegram':
        return (
          <div className={`${iconClasses} rounded-full bg-blue-500 flex items-center justify-center`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className={`${iconClasses} rounded-full bg-gray-500 flex items-center justify-center`}>
            <MessageSquare className="h-3 w-3 text-white" />
          </div>
        );
    }
  };

  // Obter contatos finais para exibição
  const finalContacts = useTagContacts && selectedTagIds.length > 0
    ? selectedTagIds.flatMap(tagId => getContactsByTag(tagId))
    : selectedContacts;

  const selectedTags = selectedTagIds.map(tagId => getTagById(tagId)).filter(Boolean);

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
          {/* Alertas de erro com melhor destaque */}
          {errors.length > 0 && (
            <Alert variant="destructive" className="border-2 border-red-200 dark:border-red-800">
              <AlertTriangle className="h-5 w-5" />
              <AlertDescription className="font-medium">
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Avisos com melhor destaque e texto corrigido */}
          {warnings.length > 0 && (
            <Alert className="border-2 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="font-medium text-orange-800 dark:text-orange-200">
                <ul className="list-disc list-inside space-y-1">
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
                {/* Seletor de contatos individuais - sem pré-visualização */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Selecionar Contatos
                  </Label>
                  <ContactSelector
                    onSelectContact={handleAddContact}
                    placeholder="Digite para buscar contatos..."
                    maxResults={5}
                    showTags={true}
                  />
                </div>

                {/* Seletor de tags */}
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Ou Selecionar por Tags
                  </Label>
                  <TagSelector
                    selectedTagIds={selectedTagIds}
                    onTagsChange={handleTagsSelection}
                    placeholder="Selecionar tags..."
                  />
                </div>
              </div>

              {/* Exibir seleção atual */}
              {useTagContacts && selectedTags.length > 0 ? (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-medium text-foreground">
                        Tags: {selectedTags.map(tag => tag.nome).join(', ')}
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
                        setSelectedTagIds([]);
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
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={contact.avatar} alt={contact.nome} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {getInitials(contact.nome)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="font-medium text-foreground text-sm truncate">
                              {contact.nome}
                            </div>
                            {getChannelIcon(contact.canal)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {contact.telefone}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveContact(contact.id)}
                          className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
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
