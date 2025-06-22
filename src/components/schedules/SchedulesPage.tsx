
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useScheduledMessages } from '@/hooks/useScheduledMessages';
import SchedulesList from './SchedulesList';
import { ScheduleFormModal } from './ScheduleFormModal';

const SchedulesPage: React.FC = () => {
  const { 
    scheduledMessages, 
    loading,
    getUpcomingSchedules,
    getSchedulesByStatus 
  } = useScheduledMessages();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  const upcomingSchedules = getUpcomingSchedules();
  const scheduledCount = getSchedulesByStatus('scheduled').length;
  const sentCount = getSchedulesByStatus('sent').length;
  const failedCount = getSchedulesByStatus('failed').length;

  const getFilteredSchedules = () => {
    let filtered = scheduledMessages;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(schedule => 
        schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.message_content?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by channel
    if (filterChannel !== 'all') {
      filtered = filtered.filter(schedule => schedule.channel === filterChannel);
    }

    return filtered;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Agendamentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas mensagens agendadas
          </p>
        </div>
        
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Agendados</p>
                <p className="text-2xl font-bold">{scheduledCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Enviados</p>
                <p className="text-2xl font-bold">{sentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Falharam</p>
                <p className="text-2xl font-bold">{failedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximos</p>
                <p className="text-2xl font-bold">{upcomingSchedules.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximos agendamentos */}
      {upcomingSchedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingSchedules.slice(0, 3).map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{schedule.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(schedule.next_execution || schedule.scheduled_date).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {schedule.contacts?.length || 0} contatos
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar agendamentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os canais</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schedules List */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="p-4 border-b">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="scheduled">Agendados</TabsTrigger>
                <TabsTrigger value="sent">Enviados</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                <TabsTrigger value="failed">Falharam</TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              <TabsContent value="all">
                <SchedulesList filter="all" />
              </TabsContent>
              <TabsContent value="scheduled">
                <SchedulesList filter="scheduled" />
              </TabsContent>
              <TabsContent value="sent">
                <SchedulesList filter="sent" />
              </TabsContent>
              <TabsContent value="cancelled">
                <SchedulesList filter="cancelled" />
              </TabsContent>
              <TabsContent value="failed">
                <SchedulesList filter="failed" />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Schedule Modal */}
      <ScheduleFormModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default SchedulesPage;
