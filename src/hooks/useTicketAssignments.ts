
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface TicketAssignment {
  id: string;
  ticket_id: string;
  user_id: string;
  assigned_by?: string;
  assigned_at: Date;
  ticket?: {
    title: string;
    status: string;
    priority: string;
  };
  user?: {
    name: string;
    email: string;
  };
  assigned_by_user?: {
    name: string;
    email: string;
  };
}

interface TicketAssignmentsHook {
  assignments: TicketAssignment[];
  unreadAssignments: TicketAssignment[];
  loading: boolean;
  markAssignmentAsRead: (assignmentId: string) => Promise<void>;
  getAssignmentsForUser: (userId: string) => TicketAssignment[];
  refetchAssignments: () => Promise<void>;
}

export const useTicketAssignments = (): TicketAssignmentsHook => {
  const [assignments, setAssignments] = useState<TicketAssignment[]>([]);
  const [unreadAssignments, setUnreadAssignments] = useState<TicketAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      // Get current user assignments from ticket history
      const { data, error } = await supabase
        .from('tenant_ticket_history')
        .select(`
          *,
          tenant_tickets!inner(id, title, status, priority),
          tenant_users!left(id, name, email)
        `)
        .eq('action', 'assigned')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const mappedAssignments: TicketAssignment[] = data.map(entry => ({
        id: entry.id,
        ticket_id: entry.ticket_id,
        user_id: entry.user_id || '',
        assigned_by: entry.notes || undefined,
        assigned_at: new Date(entry.created_at),
        ticket: entry.tenant_tickets ? {
          title: entry.tenant_tickets.title,
          status: entry.tenant_tickets.status,
          priority: entry.tenant_tickets.priority
        } : undefined,
        user: entry.tenant_users ? {
          name: entry.tenant_users.name,
          email: entry.tenant_users.email
        } : undefined
      }));

      setAssignments(mappedAssignments);
      
      // Filter unread assignments (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const unread = mappedAssignments.filter(
        assignment => assignment.assigned_at > oneDayAgo
      );
      setUnreadAssignments(unread);

    } catch (error) {
      console.error('Error fetching ticket assignments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar atribuições de tickets",
        variant: "destructive"
      });
    }
  };

  const markAssignmentAsRead = async (assignmentId: string) => {
    setUnreadAssignments(prev => 
      prev.filter(assignment => assignment.id !== assignmentId)
    );
  };

  const getAssignmentsForUser = (userId: string): TicketAssignment[] => {
    return assignments.filter(assignment => assignment.user_id === userId);
  };

  const refetchAssignments = async () => {
    setLoading(true);
    await fetchAssignments();
    setLoading(false);
  };

  useEffect(() => {
    refetchAssignments();

    // Set up real-time subscription for new assignments
    const channel = supabase
      .channel('ticket-assignments')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tenant_ticket_history',
          filter: 'action=eq.assigned'
        },
        () => {
          refetchAssignments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    assignments,
    unreadAssignments,
    loading,
    markAssignmentAsRead,
    getAssignmentsForUser,
    refetchAssignments
  };
};
