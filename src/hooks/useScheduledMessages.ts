
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
    nome: string;
    telefone: string;
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
  createScheduledMessage: (message: Omit<ScheduledMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => Promise<void>;
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
              nome,
              telefone,
              email
            )
          )
        `)
        .order('scheduled_date', { ascending: true });

      if (error) throw error;

      const mappedMessages: ScheduledMessage[] = data.map(msg => ({
        ...msg,
        contacts: msg.tenant_schedule_contacts?.map((sc: any) => ({
          id: sc.id,
          schedule_id: msg.id,
          contact_id: sc.contact_id,
          created_at: sc.created_at,
          contact: sc.tenant_contacts ? {
            id: sc.tenant_contacts.id,
            nome: sc.tenant_contacts.nome,
            telefone: sc.tenant_contacts.telefone,
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
      setScheduleExecutions(data || []);
    } catch (error) {
      console.error('Error fetching schedule executions:', error);
    }
  };

  const createScheduledMessage = async (messageData: Omit<ScheduledMessage, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
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
      return data;
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
            nome,
            telefone,
            email
          )
        `)
        .eq('schedule_id', scheduleId);

      if (error) throw error;

      return data.map(sc => ({
        id: sc.id,
        schedule_id: sc.schedule_id,
        contact_id: sc.contact_id,
        created_at: sc.created_at,
        contact: sc.tenant_contacts ? {
          id: sc.tenant_contacts.id,
          nome: sc.tenant_contacts.nome,
          telefone: sc.tenant_contacts.telefone,
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
      return data || [];
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
    refetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel('scheduled-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tenant_scheduled_messages'
        },
        () => {
          refetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
