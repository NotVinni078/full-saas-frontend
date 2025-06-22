import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ScheduledMessage {
  id: string;
  title: string;
  message_content?: string;
  message_type: 'text' | 'audio' | 'image' | 'document';
  audio_url?: string;
  include_signature: boolean;
  has_attachments: boolean;
  scheduled_date: string;
  scheduled_time: string;
  has_recurrence: boolean;
  recurrence_type?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'custom';
  custom_days?: number;
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'telegram';
  ticket_status: 'finished' | 'pending' | 'in_progress';
  sector?: string;
  status: 'scheduled' | 'sent' | 'cancelled' | 'failed';
  created_by?: string;
  created_at: string;
  updated_at: string;
  sent_at?: string;
  next_execution?: string;
  contacts?: ScheduleContact[];
}

export interface ScheduleContact {
  id: string;
  schedule_id: string;
  contact_id: string;
  created_at: string;
  contact?: {
    id: string;
    name: string;
    phone: string;
    email?: string;
  };
}

export interface ScheduleExecution {
  id: string;
  schedule_id: string;
  executed_at: string;
  status: 'success' | 'failed' | 'partial';
  contacts_sent: number;
  contacts_failed: number;
  error_details?: any;
  created_at: string;
}

interface UseScheduledMessagesHook {
  scheduledMessages: ScheduledMessage[];
  scheduleExecutions: ScheduleExecution[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createScheduledMessage: (message: Omit<ScheduledMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<ScheduledMessage>;
  updateScheduledMessage: (id: string, updates: Partial<ScheduledMessage>) => Promise<void>;
  deleteScheduledMessage: (id: string) => Promise<void>;
  
  // Schedule contacts operations
  addContactsToSchedule: (scheduleId: string, contactIds: string[]) => Promise<void>;
  removeContactFromSchedule: (scheduleId: string, contactId: string) => Promise<void>;
  getScheduleContacts: (scheduleId: string) => Promise<ScheduleContact[]>;
  
  // Execution operations
  executeSchedule: (scheduleId: string) => Promise<void>;
  getScheduleExecutions: (scheduleId: string) => Promise<ScheduleExecution[]>;
  
  // Utility operations
  refetchData: () => Promise<void>;
  getUpcomingSchedules: () => ScheduledMessage[];
  getSchedulesByStatus: (status: ScheduledMessage['status']) => ScheduledMessage[];
}

export const useScheduledMessages = (): UseScheduledMessagesHook => {
  const [scheduledMessages, setScheduledMessages] = useState<ScheduledMessage[]>([]);
  const [scheduleExecutions, setScheduleExecutions] = useState<ScheduleExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduledMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_scheduled_messages')
        .select(`
          *,
          tenant_schedule_contacts (
            id,
            contact_id,
            created_at,
            tenant_contacts (
              id,
              name,
              phone,
              email
            )
          )
        `)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      const mappedMessages: ScheduledMessage[] = (data || []).map(msg => ({
        id: msg.id,
        title: msg.title,
        message_content: msg.message_content,
        message_type: msg.message_type as 'text' | 'audio' | 'image' | 'document',
        audio_url: msg.audio_url,
        include_signature: msg.include_signature,
        has_attachments: msg.has_attachments,
        scheduled_date: msg.scheduled_date,
        scheduled_time: msg.scheduled_time,
        has_recurrence: msg.has_recurrence,
        recurrence_type: msg.recurrence_type as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'custom' | undefined,
        custom_days: msg.custom_days,
        channel: msg.channel as 'whatsapp' | 'instagram' | 'facebook' | 'telegram',
        ticket_status: msg.ticket_status as 'finished' | 'pending' | 'in_progress',
        sector: msg.sector,
        status: msg.status as 'scheduled' | 'sent' | 'cancelled' | 'failed',
        created_by: msg.created_by,
        created_at: msg.created_at,
        updated_at: msg.updated_at,
        sent_at: msg.sent_at,
        next_execution: msg.next_execution,
        contacts: msg.tenant_schedule_contacts?.map((sc: any) => ({
          id: sc.id,
          schedule_id: msg.id,
          contact_id: sc.contact_id,
          created_at: sc.created_at,
          contact: sc.tenant_contacts ? {
            id: sc.tenant_contacts.id,
            name: sc.tenant_contacts.name,
            phone: sc.tenant_contacts.phone,
            email: sc.tenant_contacts.email
          } : undefined
        })) || []
      }));

      setScheduledMessages(mappedMessages);
    } catch (error) {
      console.error('Error fetching scheduled messages:', error);
      setError('Erro ao carregar mensagens agendadas');
    }
  };

  const fetchScheduleExecutions = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_schedule_executions')
        .select('*')
        .order('executed_at', { ascending: false });

      if (error) throw error;
      
      const mappedExecutions: ScheduleExecution[] = (data || []).map(exec => ({
        id: exec.id,
        schedule_id: exec.schedule_id,
        executed_at: exec.executed_at,
        status: exec.status as 'success' | 'failed' | 'partial',
        contacts_sent: exec.contacts_sent,
        contacts_failed: exec.contacts_failed,
        error_details: exec.error_details,
        created_at: exec.created_at
      }));
      
      setScheduleExecutions(mappedExecutions);
    } catch (error) {
      console.error('Error fetching schedule executions:', error);
    }
  };

  const createScheduledMessage = async (messageData: Omit<ScheduledMessage, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<ScheduledMessage> => {
    try {
      const { data, error } = await supabase
        .from('tenant_scheduled_messages')
        .insert({
          ...messageData,
          status: 'scheduled'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Mensagem agendada com sucesso",
      });

      await refetchData();
      
      return {
        id: data.id,
        title: data.title,
        message_content: data.message_content,
        message_type: data.message_type as 'text' | 'audio' | 'image' | 'document',
        audio_url: data.audio_url,
        include_signature: data.include_signature,
        has_attachments: data.has_attachments,
        scheduled_date: data.scheduled_date,
        scheduled_time: data.scheduled_time,
        has_recurrence: data.has_recurrence,
        recurrence_type: data.recurrence_type as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'custom' | undefined,
        custom_days: data.custom_days,
        channel: data.channel as 'whatsapp' | 'instagram' | 'facebook' | 'telegram',
        ticket_status: data.ticket_status as 'finished' | 'pending' | 'in_progress',
        sector: data.sector,
        status: data.status as 'scheduled' | 'sent' | 'cancelled' | 'failed',
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        sent_at: data.sent_at,
        next_execution: data.next_execution,
        contacts: []
      };
    } catch (error) {
      console.error('Error creating scheduled message:', error);
      toast({
        title: "Erro",
        description: "Erro ao agendar mensagem",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateScheduledMessage = async (id: string, updates: Partial<ScheduledMessage>) => {
    try {
      const { error } = await supabase
        .from('tenant_scheduled_messages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Mensagem atualizada com sucesso",
      });

      await refetchData();
    } catch (error) {
      console.error('Error updating scheduled message:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar mensagem",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteScheduledMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenant_scheduled_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Mensagem removida com sucesso",
      });

      await refetchData();
    } catch (error) {
      console.error('Error deleting scheduled message:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover mensagem",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addContactsToSchedule = async (scheduleId: string, contactIds: string[]) => {
    try {
      const contactsData = contactIds.map(contactId => ({
        schedule_id: scheduleId,
        contact_id: contactId
      }));

      const { error } = await supabase
        .from('tenant_schedule_contacts')
        .insert(contactsData);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Contatos adicionados ao agendamento",
      });

      await refetchData();
    } catch (error) {
      console.error('Error adding contacts to schedule:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar contatos",
        variant: "destructive"
      });
      throw error;
    }
  };

  const removeContactFromSchedule = async (scheduleId: string, contactId: string) => {
    try {
      const { error } = await supabase
        .from('tenant_schedule_contacts')
        .delete()
        .eq('schedule_id', scheduleId)
        .eq('contact_id', contactId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Contato removido do agendamento",
      });

      await refetchData();
    } catch (error) {
      console.error('Error removing contact from schedule:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover contato",
        variant: "destructive"
      });
      throw error;
    }
  };

  const getScheduleContacts = async (scheduleId: string): Promise<ScheduleContact[]> => {
    try {
      const { data, error } = await supabase
        .from('tenant_schedule_contacts')
        .select(`
          *,
          tenant_contacts (
            id,
            name,
            phone,
            email
          )
        `)
        .eq('schedule_id', scheduleId);

      if (error) throw error;

      return (data || []).map(sc => ({
        id: sc.id,
        schedule_id: sc.schedule_id,
        contact_id: sc.contact_id,
        created_at: sc.created_at,
        contact: sc.tenant_contacts ? {
          id: sc.tenant_contacts.id,
          name: sc.tenant_contacts.name,
          phone: sc.tenant_contacts.phone,
          email: sc.tenant_contacts.email
        } : undefined
      }));
    } catch (error) {
      console.error('Error fetching schedule contacts:', error);
      return [];
    }
  };

  const executeSchedule = async (scheduleId: string) => {
    try {
      // Esta função seria chamada por um sistema de background jobs
      // Por agora, vamos apenas simular a execução
      const { error } = await supabase
        .from('tenant_schedule_executions')
        .insert({
          schedule_id: scheduleId,
          status: 'success',
          contacts_sent: 1,
          contacts_failed: 0
        });

      if (error) throw error;

      // Atualizar status da mensagem para enviada
      await updateScheduledMessage(scheduleId, { 
        status: 'sent',
        sent_at: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error executing schedule:', error);
      throw error;
    }
  };

  const getScheduleExecutions = async (scheduleId: string): Promise<ScheduleExecution[]> => {
    try {
      const { data, error } = await supabase
        .from('tenant_schedule_executions')
        .select('*')
        .eq('schedule_id', scheduleId)
        .order('executed_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(exec => ({
        id: exec.id,
        schedule_id: exec.schedule_id,
        executed_at: exec.executed_at,
        status: exec.status as 'success' | 'failed' | 'partial',
        contacts_sent: exec.contacts_sent,
        contacts_failed: exec.contacts_failed,
        error_details: exec.error_details,
        created_at: exec.created_at
      }));
    } catch (error) {
      console.error('Error fetching schedule executions:', error);
      return [];
    }
  };

  const refetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchScheduledMessages(),
      fetchScheduleExecutions()
    ]);
    setLoading(false);
  };

  const getUpcomingSchedules = (): ScheduledMessage[] => {
    const now = new Date();
    return scheduledMessages.filter(msg => 
      msg.status === 'scheduled' && 
      new Date(msg.next_execution || msg.scheduled_date) > now
    );
  };

  const getSchedulesByStatus = (status: ScheduledMessage['status']): ScheduledMessage[] => {
    return scheduledMessages.filter(msg => msg.status === status);
  };

  useEffect(() => {
    let mounted = true;
    let realtimeChannel: any = null;

    const initializeData = async () => {
      if (mounted) {
        await refetchData();
      }
    };

    const setupRealtimeSubscription = () => {
      try {
        // Create a unique channel name to avoid conflicts
        const channelName = `scheduled-messages-${Date.now()}-${Math.random()}`;
        
        realtimeChannel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'tenant_scheduled_messages'
            },
            (payload) => {
              if (mounted) {
                console.log('Real-time update received for scheduled messages:', payload);
                refetchData();
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to scheduled messages updates');
            }
          });
      } catch (error) {
        console.error('Error setting up realtime subscription:', error);
      }
    };

    initializeData();
    setupRealtimeSubscription();

    return () => {
      mounted = false;
      if (realtimeChannel) {
        console.log('Cleaning up subscription');
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, []); // Empty dependency array to run only once

  return {
    scheduledMessages,
    scheduleExecutions,
    loading,
    error,
    createScheduledMessage,
    updateScheduledMessage,
    deleteScheduledMessage,
    addContactsToSchedule,
    removeContactFromSchedule,
    getScheduleContacts,
    executeSchedule,
    getScheduleExecutions,
    refetchData,
    getUpcomingSchedules,
    getSchedulesByStatus
  };
};
