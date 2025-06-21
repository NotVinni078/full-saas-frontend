import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Tenant-specific interfaces
export interface TenantContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar: string;
  status: 'active' | 'blocked' | 'archived';
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  tags: string[];
  custom_fields: Record<string, any>;
  last_interaction?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TenantConnection {
  id: string;
  name: string;
  type: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  status: 'active' | 'inactive' | 'error' | 'configuring';
  configuration: Record<string, any>;
  credentials: Record<string, any>;
  webhook_url?: string;
  last_sync?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TenantMessage {
  id: string;
  contact_id: string;
  user_id?: string;
  content: string;
  message_type: 'text' | 'image' | 'audio' | 'video' | 'document';
  direction: 'inbound' | 'outbound';
  channel: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface TenantQuickReply {
  id: string;
  title: string;
  content: string;
  shortcut?: string;
  category?: string;
  tags: string[];
  usage_count: number;
  is_active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

interface TenantDataHook {
  contacts: TenantContact[];
  connections: TenantConnection[];
  messages: TenantMessage[];
  quickReplies: TenantQuickReply[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  
  // CRUD operations for contacts
  createContact: (contact: Omit<TenantContact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<TenantContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // CRUD operations for connections
  createConnection: (connection: Omit<TenantConnection, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateConnection: (id: string, updates: Partial<TenantConnection>) => Promise<void>;
  deleteConnection: (id: string) => Promise<void>;
  
  // CRUD operations for quick replies
  createQuickReply: (reply: Omit<TenantQuickReply, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => Promise<void>;
  updateQuickReply: (id: string, updates: Partial<TenantQuickReply>) => Promise<void>;
  deleteQuickReply: (id: string) => Promise<void>;
}

export const useTenantData = (): TenantDataHook => {
  const [contacts, setContacts] = useState<TenantContact[]>([]);
  const [connections, setConnections] = useState<TenantConnection[]>([]);
  const [messages, setMessages] = useState<TenantMessage[]>([]);
  const [quickReplies, setQuickReplies] = useState<TenantQuickReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_contacts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedContacts: TenantContact[] = data.map(contact => ({
        id: contact.id,
        name: contact.name,
        phone: contact.phone || undefined,
        email: contact.email || undefined,
        avatar: contact.avatar,
        status: contact.status as 'active' | 'blocked' | 'archived',
        channel: contact.channel as 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat',
        tags: contact.tags || [],
        custom_fields: (contact.custom_fields as Record<string, any>) || {},
        last_interaction: contact.last_interaction ? new Date(contact.last_interaction) : undefined,
        created_at: new Date(contact.created_at),
        updated_at: new Date(contact.updated_at)
      }));
      
      setContacts(mappedContacts);
    } catch (err) {
      console.error('Error fetching tenant contacts:', err);
      setError('Erro ao carregar contatos');
    }
  };

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_connections')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedConnections: TenantConnection[] = data.map(conn => ({
        id: conn.id,
        name: conn.name,
        type: conn.type as 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat',
        status: conn.status as 'active' | 'inactive' | 'error' | 'configuring',
        configuration: (conn.configuration as Record<string, any>) || {},
        credentials: (conn.credentials as Record<string, any>) || {},
        webhook_url: conn.webhook_url || undefined,
        last_sync: conn.last_sync ? new Date(conn.last_sync) : undefined,
        created_at: new Date(conn.created_at),
        updated_at: new Date(conn.updated_at)
      }));
      
      setConnections(mappedConnections);
    } catch (err) {
      console.error('Error fetching tenant connections:', err);
      setError('Erro ao carregar conexões');
    }
  };

  const fetchQuickReplies = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_quick_replies')
        .select('*')
        .eq('is_active', true)
        .order('title');
      
      if (error) throw error;
      
      const mappedReplies: TenantQuickReply[] = data.map(reply => ({
        id: reply.id,
        title: reply.title,
        content: reply.content,
        shortcut: reply.shortcut || undefined,
        category: reply.category || undefined,
        tags: reply.tags || [],
        usage_count: reply.usage_count || 0,
        is_active: reply.is_active,
        created_by: reply.created_by || undefined,
        created_at: new Date(reply.created_at),
        updated_at: new Date(reply.updated_at)
      }));
      
      setQuickReplies(mappedReplies);
    } catch (err) {
      console.error('Error fetching quick replies:', err);
      setError('Erro ao carregar respostas rápidas');
    }
  };

  // Contact CRUD operations
  const createContact = async (contactData: Omit<TenantContact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('tenant_contacts')
        .insert({
          name: contactData.name,
          phone: contactData.phone,
          email: contactData.email,
          avatar: contactData.avatar,
          status: contactData.status,
          channel: contactData.channel,
          tags: contactData.tags,
          custom_fields: contactData.custom_fields
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Contato criado com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error creating contact:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar contato",
        variant: "destructive"
      });
    }
  };

  const updateContact = async (id: string, updates: Partial<TenantContact>) => {
    try {
      const { error } = await supabase
        .from('tenant_contacts')
        .update({
          name: updates.name,
          phone: updates.phone,
          email: updates.email,
          avatar: updates.avatar,
          status: updates.status,
          channel: updates.channel,
          tags: updates.tags,
          custom_fields: updates.custom_fields
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Contato atualizado com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar contato",
        variant: "destructive"
      });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenant_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Contato removido com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover contato",
        variant: "destructive"
      });
    }
  };

  // Connection CRUD operations
  const createConnection = async (connectionData: Omit<TenantConnection, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('tenant_connections')
        .insert({
          name: connectionData.name,
          type: connectionData.type,
          status: connectionData.status,
          configuration: connectionData.configuration,
          credentials: connectionData.credentials,
          webhook_url: connectionData.webhook_url
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Conexão criada com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error creating connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar conexão",
        variant: "destructive"
      });
    }
  };

  const updateConnection = async (id: string, updates: Partial<TenantConnection>) => {
    try {
      const { error } = await supabase
        .from('tenant_connections')
        .update({
          name: updates.name,
          type: updates.type,
          status: updates.status,
          configuration: updates.configuration,
          credentials: updates.credentials,
          webhook_url: updates.webhook_url
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Conexão atualizada com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error updating connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar conexão",
        variant: "destructive"
      });
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenant_connections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Conexão removida com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error deleting connection:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover conexão",
        variant: "destructive"
      });
    }
  };

  // Quick Reply CRUD operations
  const createQuickReply = async (replyData: Omit<TenantQuickReply, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => {
    try {
      const { error } = await supabase
        .from('tenant_quick_replies')
        .insert({
          title: replyData.title,
          content: replyData.content,
          shortcut: replyData.shortcut,
          category: replyData.category,
          tags: replyData.tags,
          is_active: replyData.is_active,
          created_by: replyData.created_by
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Resposta rápida criada com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error creating quick reply:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar resposta rápida",
        variant: "destructive"
      });
    }
  };

  const updateQuickReply = async (id: string, updates: Partial<TenantQuickReply>) => {
    try {
      const { error } = await supabase
        .from('tenant_quick_replies')
        .update({
          title: updates.title,
          content: updates.content,
          shortcut: updates.shortcut,
          category: updates.category,
          tags: updates.tags,
          is_active: updates.is_active
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Resposta rápida atualizada com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error updating quick reply:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar resposta rápida",
        variant: "destructive"
      });
    }
  };

  const deleteQuickReply = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tenant_quick_replies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Resposta rápida removida com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error deleting quick reply:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover resposta rápida",
        variant: "destructive"
      });
    }
  };

  const refetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchContacts(),
        fetchConnections(),
        fetchQuickReplies()
      ]);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchData();
  }, []);

  return {
    contacts,
    connections,
    messages,
    quickReplies,
    loading,
    error,
    refetchData,
    createContact,
    updateContact,
    deleteContact,
    createConnection,
    updateConnection,
    deleteConnection,
    createQuickReply,
    updateQuickReply,
    deleteQuickReply
  };
};
