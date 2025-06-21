import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TenantTicket {
  id: string;
  contact_id: string;
  assigned_user_id?: string;
  title: string;
  description?: string;
  status: 'open' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  tags: string[];
  custom_fields: Record<string, any>;
  last_activity_at?: Date;
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
  closed_at?: Date;
  // Relations
  contact?: {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    avatar: string;
  };
  assigned_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TenantTicketHistory {
  id: string;
  ticket_id: string;
  user_id?: string;
  action: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  notes?: string;
  created_at: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface TenantTicketsHook {
  tickets: TenantTicket[];
  ticketHistory: TenantTicketHistory[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  createTicket: (ticket: Omit<TenantTicket, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<TenantTicket>) => Promise<void>;
  deleteTicket: (id: string) => Promise<void>;
  
  // Utility functions
  getTicketById: (id: string) => TenantTicket | undefined;
  getTicketHistory: (ticketId: string) => Promise<void>;
  assignTicket: (ticketId: string, userId: string) => Promise<void>;
  changeTicketStatus: (ticketId: string, status: TenantTicket['status'], notes?: string) => Promise<void>;
  
  // Data refresh
  refetchTickets: () => Promise<void>;
}

export const useTenantTickets = (): TenantTicketsHook => {
  const [tickets, setTickets] = useState<TenantTicket[]>([]);
  const [ticketHistory, setTicketHistory] = useState<TenantTicketHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_tickets')
        .select(`
          *,
          tenant_contacts!inner(id, name, phone, email, avatar),
          tenant_users!left(id, name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedTickets: TenantTicket[] = data.map(ticket => ({
        id: ticket.id,
        contact_id: ticket.contact_id,
        assigned_user_id: ticket.assigned_user_id || undefined,
        title: ticket.title,
        description: ticket.description || undefined,
        status: ticket.status as TenantTicket['status'],
        priority: ticket.priority as TenantTicket['priority'],
        channel: ticket.channel as TenantTicket['channel'],
        tags: ticket.tags || [],
        custom_fields: (ticket.custom_fields as Record<string, any>) || {},
        last_activity_at: ticket.last_activity_at ? new Date(ticket.last_activity_at) : undefined,
        created_at: new Date(ticket.created_at),
        updated_at: new Date(ticket.updated_at),
        resolved_at: ticket.resolved_at ? new Date(ticket.resolved_at) : undefined,
        closed_at: ticket.closed_at ? new Date(ticket.closed_at) : undefined,
        contact: ticket.tenant_contacts ? {
          id: ticket.tenant_contacts.id,
          name: ticket.tenant_contacts.name,
          phone: ticket.tenant_contacts.phone || undefined,
          email: ticket.tenant_contacts.email || undefined,
          avatar: ticket.tenant_contacts.avatar
        } : undefined,
        assigned_user: ticket.tenant_users ? {
          id: ticket.tenant_users.id,
          name: ticket.tenant_users.name,
          email: ticket.tenant_users.email
        } : undefined
      }));
      
      setTickets(mappedTickets);
    } catch (err) {
      console.error('Error fetching tenant tickets:', err);
      setError('Erro ao carregar tickets');
    }
  };

  const createTicket = async (ticketData: Omit<TenantTicket, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('tenant_tickets')
        .insert({
          contact_id: ticketData.contact_id,
          assigned_user_id: ticketData.assigned_user_id,
          title: ticketData.title,
          description: ticketData.description,
          status: ticketData.status,
          priority: ticketData.priority,
          channel: ticketData.channel,
          tags: ticketData.tags,
          custom_fields: ticketData.custom_fields
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Ticket criado com sucesso",
      });
      
      await refetchTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar ticket",
        variant: "destructive"
      });
    }
  };

  const updateTicket = async (id: string, updates: Partial<TenantTicket>) => {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.assigned_user_id !== undefined) updateData.assigned_user_id = updates.assigned_user_id;
      if (updates.tags !== undefined) updateData.tags = updates.tags;
      if (updates.custom_fields !== undefined) updateData.custom_fields = updates.custom_fields;
      
      // Set resolution/closure timestamps based on status
      if (updates.status === 'resolved' && !updates.resolved_at) {
        updateData.resolved_at = new Date().toISOString();
      }
      if (updates.status === 'closed' && !updates.closed_at) {
        updateData.closed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('tenant_tickets')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Ticket atualizado com sucesso",
      });
      
      await refetchTickets();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar ticket",
        variant: "destructive"
      });
    }
  };

  const deleteTicket = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenant_tickets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Ticket removido com sucesso",
      });
      
      await refetchTickets();
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover ticket",
        variant: "destructive"
      });
    }
  };

  const getTicketHistory = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('tenant_ticket_history')
        .select(`
          *,
          tenant_users!left(id, name, email)
        `)
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedHistory: TenantTicketHistory[] = data.map(entry => ({
        id: entry.id,
        ticket_id: entry.ticket_id,
        user_id: entry.user_id || undefined,
        action: entry.action,
        old_values: (entry.old_values as Record<string, any>) || undefined,
        new_values: (entry.new_values as Record<string, any>) || undefined,
        notes: entry.notes || undefined,
        created_at: new Date(entry.created_at),
        user: entry.tenant_users ? {
          id: entry.tenant_users.id,
          name: entry.tenant_users.name,
          email: entry.tenant_users.email
        } : undefined
      }));
      
      setTicketHistory(mappedHistory);
    } catch (err) {
      console.error('Error fetching ticket history:', err);
      setError('Erro ao carregar histórico do ticket');
    }
  };

  const assignTicket = async (ticketId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('tenant_tickets')
        .update({ assigned_user_id: userId })
        .eq('id', ticketId);

      if (error) throw error;
      
      // Create assignment history entry
      await supabase
        .from('tenant_ticket_history')
        .insert({
          ticket_id: ticketId,
          user_id: userId,
          action: 'assigned',
          notes: `Ticket atribuído para o usuário ${userId}`
        });
      
      toast({
        title: "Sucesso",
        description: "Ticket atribuído com sucesso",
      });
      
      await refetchTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
      toast({
        title: "Erro", 
        description: "Erro ao atribuir ticket",
        variant: "destructive"
      });
    }
  };

  const changeTicketStatus = async (ticketId: string, status: TenantTicket['status'], notes?: string) => {
    try {
      await updateTicket(ticketId, { status });
      
      // Add a manual history entry with notes if provided
      if (notes) {
        await supabase
          .from('tenant_ticket_history')
          .insert({
            ticket_id: ticketId,
            action: `status_changed_to_${status}`,
            notes: notes
          });
      }
    } catch (error) {
      console.error('Error changing ticket status:', error);
    }
  };

  const getTicketById = (id: string): TenantTicket | undefined => {
    return tickets.find(ticket => ticket.id === id);
  };

  const refetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchTickets();
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tickets. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchTickets();
  }, []);

  return {
    tickets,
    ticketHistory,
    loading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    getTicketHistory,
    assignTicket,
    changeTicketStatus,
    refetchTickets
  };
};
