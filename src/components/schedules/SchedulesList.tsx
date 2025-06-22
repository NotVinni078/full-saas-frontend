
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  Users, 
  MessageSquare, 
  Play, 
  Pause, 
  Trash2, 
  Edit, 
  Repeat,
  Eye
} from 'lucide-react';
import { useScheduledMessages, ScheduledMessage } from '@/hooks/useScheduledMessages';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScheduleDetailsModal } from './ScheduleDetailsModal';
import { ScheduleFormModal } from './ScheduleFormModal';

interface SchedulesListProps {
  filter?: 'all' | 'scheduled' | 'sent' | 'cancelled' | 'failed';
  onScheduleSelect?: (schedule: ScheduledMessage) => void;
}

const SchedulesList: React.FC<SchedulesListProps> = ({ 
  filter = 'all', 
  onScheduleSelect 
}) => {
  const { 
    scheduledMessages, 
    loading, 
    deleteScheduledMessage, 
    updateScheduledMessage 
  } = useScheduledMessages();
  
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledMessage | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledMessage | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const filteredSchedules = scheduledMessages.filter(schedule => {
    if (filter === 'all') return true;
    return schedule.status === filter;
  });

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

  const getStatusLabel = (status: ScheduledMessage['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado';
      case 'sent':
        return 'Enviado';
      case 'cancelled':
        return 'Cancelado';
      case 'failed':
        return 'Falhou';
      default:
        return status;
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

  const handleCancelSchedule = async (schedule: ScheduledMessage) => {
    if (schedule.status === 'scheduled') {
      await updateScheduledMessage(schedule.id, { status: 'cancelled' });
    }
  };

  const handleDeleteSchedule = async (schedule: ScheduledMessage) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      await deleteScheduledMessage(schedule.id);
    }
  };

  const handleEditSchedule = (schedule: ScheduledMessage) => {
    setEditingSchedule(schedule);
    setShowEditForm(true);
  };

  const handleViewDetails = (schedule: ScheduledMessage) => {
    setSelectedSchedule(schedule);
    setShowDetails(true);
    onScheduleSelect?.(schedule);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Nenhuma mensagem agendada encontrada
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSchedules.map((schedule) => (
              <Card key={schedule.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{schedule.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(schedule.status)}>
                          {getStatusLabel(schedule.status)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <span>{getChannelIcon(schedule.channel)}</span>
                          {schedule.channel}
                        </Badge>
                        {schedule.has_recurrence && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Repeat className="h-3 w-3" />
                            Recorrente
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(schedule)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {schedule.status === 'scheduled' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelSchedule(schedule)}
                          >
                            <Pause className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Preview da mensagem */}
                    {schedule.message_content && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm line-clamp-2">
                          {schedule.message_content}
                        </p>
                      </div>
                    )}
                    
                    {/* Informações de agendamento */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(schedule.scheduled_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {schedule.scheduled_time}
                      </div>
                      {schedule.contacts && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {schedule.contacts.length} contatos
                        </div>
                      )}
                    </div>
                    
                    {/* Próxima execução (para recorrentes) */}
                    {schedule.has_recurrence && schedule.next_execution && schedule.status === 'scheduled' && (
                      <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          Próxima execução: {formatDistanceToNow(new Date(schedule.next_execution), { 
                            locale: ptBR, 
                            addSuffix: true 
                          })}
                        </p>
                      </div>
                    )}
                    
                    {/* Data de envio (para enviadas) */}
                    {schedule.sent_at && (
                      <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Enviado: {format(new Date(schedule.sent_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Modal de detalhes */}
      {selectedSchedule && (
        <ScheduleDetailsModal
          schedule={selectedSchedule}
          open={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedSchedule(null);
          }}
        />
      )}

      {/* Modal de edição */}
      {editingSchedule && (
        <ScheduleFormModal
          schedule={editingSchedule}
          open={showEditForm}
          onClose={() => {
            setShowEditForm(false);
            setEditingSchedule(null);
          }}
        />
      )}
    </>
  );
};

export default SchedulesList;
