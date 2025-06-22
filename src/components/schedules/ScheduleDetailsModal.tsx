import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Repeat, 
  History,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { ScheduledMessage, ScheduleContact, ScheduleExecution, useScheduledMessages } from '@/hooks/useScheduledMessages';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface ScheduleDetailsModalProps {
  schedule: ScheduledMessage;
  open: boolean;
  onClose: () => void;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  schedule,
  open,
  onClose
}) => {
  const { getScheduleContacts, getScheduleExecutions } = useScheduledMessages();
  const [contacts, setContacts] = useState<ScheduleContact[]>([]);
  const [executions, setExecutions] = useState<ScheduleExecution[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingExecutions, setLoadingExecutions] = useState(true);

  useEffect(() => {
    if (open && schedule.id) {
      loadScheduleData();
    }
  }, [open, schedule.id]);

  const loadScheduleData = async () => {
    setLoadingContacts(true);
    setLoadingExecutions(true);

    try {
      const [contactsData, executionsData] = await Promise.all([
        getScheduleContacts(schedule.id),
        getScheduleExecutions(schedule.id)
      ]);
      
      setContacts(contactsData);
      setExecutions(executionsData);
    } catch (error) {
      console.error('Error loading schedule data:', error);
    } finally {
      setLoadingContacts(false);
      setLoadingExecutions(false);
    }
  };

  const getStatusColor = (status: ScheduledMessage['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getRecurrenceDescription = () => {
    if (!schedule.has_recurrence || !schedule.recurrence_type) return '';
    
    switch (schedule.recurrence_type) {
      case 'daily':
        return 'Diária';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensal';
      case 'quarterly':
        return 'Trimestral';
      case 'semiannual':
        return 'Semestral';
      case 'annual':
        return 'Anual';
      case 'custom':
        return `A cada ${schedule.custom_days} dias`;
      default:
        return schedule.recurrence_type;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return '💬';
      case 'instagram':
        return '📷';
      case 'facebook':
        return '👥';
      case 'telegram':
        return '✈️';
      default:
        return '📱';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {schedule.title}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)]">
          <div className="space-y-6 p-1">
            {/* Status e informações básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(schedule.status)}>
                    {schedule.status === 'scheduled' ? 'Agendado' :
                     schedule.status === 'sent' ? 'Enviado' :
                     schedule.status === 'cancelled' ? 'Cancelado' : 'Falhou'}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <span>{getChannelIcon(schedule.channel)}</span>
                    {schedule.channel}
                  </Badge>
                  {schedule.has_recurrence && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Repeat className="h-3 w-3" />
                      {getRecurrenceDescription()}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(schedule.scheduled_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{schedule.scheduled_time}</span>
                  </div>
                </div>

                {schedule.sector && (
                  <div>
                    <span className="text-sm text-muted-foreground">Setor: </span>
                    <span className="text-sm">{schedule.sector}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conteúdo da mensagem */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conteúdo da Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                {schedule.message_content ? (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="whitespace-pre-wrap">{schedule.message_content}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum conteúdo definido</p>
                )}

                {schedule.message_type !== 'text' && (
                  <div className="mt-3">
                    <Badge variant="outline">
                      Tipo: {schedule.message_type === 'audio' ? 'Áudio' :
                             schedule.message_type === 'image' ? 'Imagem' : 'Documento'}
                    </Badge>
                  </div>
                )}

                {schedule.include_signature && (
                  <div className="mt-3">
                    <Badge variant="outline">Incluir assinatura</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lista de contatos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contatos ({contacts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingContacts ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : contacts.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhum contato selecionado</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {contacts.map((scheduleContact) => (
                      <div key={scheduleContact.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {scheduleContact.contact?.name?.charAt(0)?.toUpperCase() || <User className="h-4 w-4" />}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {scheduleContact.contact?.name || 'Nome não disponível'}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {scheduleContact.contact?.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {scheduleContact.contact.phone}
                              </div>
                            )}
                            {scheduleContact.contact?.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {scheduleContact.contact.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Histórico de execuções */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico de Execuções
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingExecutions ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : executions.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nenhuma execução registrada</p>
                ) : (
                  <div className="space-y-3">
                    {executions.map((execution) => (
                      <div key={execution.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={
                            execution.status === 'success' ? 'bg-green-100 text-green-800' :
                            execution.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {execution.status === 'success' ? 'Sucesso' :
                             execution.status === 'partial' ? 'Parcial' : 'Falha'}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(execution.executed_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {execution.contacts_sent} enviados, {execution.contacts_failed} falharam
                        </div>
                        {execution.error_details && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                            {JSON.stringify(execution.error_details)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
