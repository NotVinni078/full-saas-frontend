
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, MessageSquare, Users, Settings } from 'lucide-react';
import { ScheduledMessage, useScheduledMessages } from '@/hooks/useScheduledMessages';
import { useTenantDataContext } from '@/contexts/TenantDataContext';
import DateTimePicker from '@/components/selectors/DateTimePicker';
import RecurrenceSelector from '@/components/selectors/RecurrenceSelector';
import ChannelSelector from '@/components/selectors/ChannelSelector';
import ContactSelector from '@/components/selectors/ContactSelector';

export interface ScheduleFormModalProps {
  schedule?: ScheduledMessage;
  open: boolean;
  onClose: () => void;
}

export const ScheduleFormModal: React.FC<ScheduleFormModalProps> = ({
  schedule,
  open,
  onClose
}) => {
  const { createScheduledMessage, updateScheduledMessage, addContactsToSchedule } = useScheduledMessages();
  const { contacts } = useTenantDataContext();
  
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message_content: '',
    message_type: 'text' as 'text' | 'audio' | 'image' | 'document',
    audio_url: '',
    include_signature: false,
    has_attachments: false,
    scheduled_date: undefined as Date | undefined,
    scheduled_time: '09:00',
    has_recurrence: false,
    recurrence_type: undefined as string | undefined,
    custom_days: 1,
    channel: 'whatsapp' as 'whatsapp' | 'instagram' | 'facebook' | 'telegram',
    ticket_status: 'pending' as 'finished' | 'pending' | 'in_progress',
    sector: ''
  });
  
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  useEffect(() => {
    if (schedule && open) {
      setFormData({
        title: schedule.title,
        message_content: schedule.message_content || '',
        message_type: schedule.message_type,
        audio_url: schedule.audio_url || '',
        include_signature: schedule.include_signature,
        has_attachments: schedule.has_attachments,
        scheduled_date: new Date(schedule.scheduled_date),
        scheduled_time: schedule.scheduled_time,
        has_recurrence: schedule.has_recurrence,
        recurrence_type: schedule.recurrence_type,
        custom_days: schedule.custom_days || 1,
        channel: schedule.channel,
        ticket_status: schedule.ticket_status,
        sector: schedule.sector || ''
      });
      
      setSelectedContacts(schedule.contacts?.map(c => c.contact_id) || []);
    } else if (open) {
      // Reset form for new schedule
      setFormData({
        title: '',
        message_content: '',
        message_type: 'text',
        audio_url: '',
        include_signature: false,
        has_attachments: false,
        scheduled_date: undefined,
        scheduled_time: '09:00',
        has_recurrence: false,
        recurrence_type: undefined,
        custom_days: 1,
        channel: 'whatsapp',
        ticket_status: 'pending',
        sector: ''
      });
      setSelectedContacts([]);
      setCurrentStep(1);
    }
  }, [schedule, open]);

  const handleSubmit = async () => {
    if (!formData.title || !formData.scheduled_date || selectedContacts.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const scheduleData = {
        ...formData,
        scheduled_date: formData.scheduled_date.toISOString().split('T')[0],
        recurrence_type: formData.has_recurrence ? formData.recurrence_type : undefined,
        custom_days: formData.recurrence_type === 'custom' ? formData.custom_days : undefined
      };

      if (schedule) {
        // Update existing schedule
        await updateScheduledMessage(schedule.id, scheduleData);
      } else {
        // Create new schedule
        const newSchedule = await createScheduledMessage(scheduleData);
        if (newSchedule && selectedContacts.length > 0) {
          await addContactsToSchedule(newSchedule.id, selectedContacts);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep = (step: number) => {
    switch (step) {
      case 2:
        return formData.title && formData.message_content;
      case 3:
        return formData.scheduled_date;
      case 4:
        return selectedContacts.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Agendamento *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Promoção Black Friday"
              />
            </div>

            <div>
              <Label htmlFor="message_content">Conteúdo da Mensagem *</Label>
              <Textarea
                id="message_content"
                value={formData.message_content}
                onChange={(e) => setFormData({ ...formData, message_content: e.target.value })}
                placeholder="Digite o conteúdo da mensagem..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="include_signature"
                checked={formData.include_signature}
                onCheckedChange={(checked) => setFormData({ ...formData, include_signature: checked })}
              />
              <Label htmlFor="include_signature">Incluir assinatura</Label>
            </div>

            <div>
              <Label>Canal de Envio</Label>
              <ChannelSelector
                value={formData.channel}
                onValueChange={(channel) => setFormData({ ...formData, channel })}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Data e Hora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DateTimePicker
                  selectedDate={formData.scheduled_date}
                  selectedTime={formData.scheduled_time}
                  onDateChange={(date) => setFormData({ ...formData, scheduled_date: date })}
                  onTimeChange={(time) => setFormData({ ...formData, scheduled_time: time })}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recorrência
                  </CardTitle>
                  <Switch
                    checked={formData.has_recurrence}
                    onCheckedChange={(checked) => setFormData({ ...formData, has_recurrence: checked })}
                  />
                </div>
              </CardHeader>
              {formData.has_recurrence && (
                <CardContent>
                  <RecurrenceSelector
                    value={formData.recurrence_type || ''}
                    customDays={formData.custom_days}
                    onValueChange={(type) => setFormData({ ...formData, recurrence_type: type })}
                    onCustomDaysChange={(days) => setFormData({ ...formData, custom_days: days })}
                  />
                </CardContent>
              )}
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Selecionar Contatos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactSelector
                  selectedContacts={selectedContacts}
                  onContactsChange={setSelectedContacts}
                  contacts={contacts}
                  multiple={true}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <strong>Título:</strong> {formData.title}
                </div>
                <div>
                  <strong>Data:</strong> {formData.scheduled_date ? formData.scheduled_date.toLocaleDateString('pt-BR') : ''} às {formData.scheduled_time}
                </div>
                <div>
                  <strong>Canal:</strong> {formData.channel}
                </div>
                <div>
                  <strong>Contatos:</strong> {selectedContacts.length} selecionados
                </div>
                {formData.has_recurrence && (
                  <div>
                    <strong>Recorrência:</strong> {formData.recurrence_type === 'custom' ? `A cada ${formData.custom_days} dias` : formData.recurrence_type}
                  </div>
                )}
                <Separator />
                <div>
                  <strong>Mensagem:</strong>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{formData.message_content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Conteúdo da Mensagem',
    'Data e Recorrência',
    'Selecionar Contatos',
    'Revisar e Confirmar'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {schedule ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  currentStep > index + 1 ? 'bg-primary border-primary text-primary-foreground' :
                  currentStep === index + 1 ? 'border-primary text-primary' :
                  'border-muted-foreground text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {index < stepTitles.length - 1 && (
                  <div className={`h-0.5 w-8 mx-2 ${
                    currentStep > index + 1 ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="font-medium">{stepTitles[currentStep - 1]}</h3>
          </div>

          <ScrollArea className="max-h-[50vh]">
            <div className="p-1">
              {renderStepContent()}
            </div>
          </ScrollArea>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToStep(currentStep + 1)}
                >
                  Próximo
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Salvando...' : schedule ? 'Salvar Alterações' : 'Criar Agendamento'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
