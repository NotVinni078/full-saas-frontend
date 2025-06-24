import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface BaileysConnection {
  id: string;
  name: string;
  channel_type: string;
  sectors: string[];
  status: 'disconnected' | 'connecting' | 'waiting_scan' | 'connected' | 'error';
  qr_code?: string;
  qr_expires_at?: string;
  phone_number?: string;
  last_activity_at?: string;
  created_at: string;
  updated_at: string;
}

interface CreateConnectionData {
  name: string;
  sectors: string[];
}

interface CreateConnectionResponse {
  connection_id: string;
  qr_code: string;
  expires_at: string;
  status: string;
}

export const useBaileysConnections = () => {
  const [connections, setConnections] = useState<BaileysConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar conexões do banco de dados
  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_baileys_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData: BaileysConnection[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        channel_type: item.channel_type,
        sectors: item.sectors || [],
        status: (item.status as 'disconnected' | 'connecting' | 'waiting_scan' | 'connected' | 'error') || 'disconnected',
        qr_code: item.qr_code,
        qr_expires_at: item.qr_expires_at,
        phone_number: item.phone_number,
        last_activity_at: item.last_activity_at,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      setConnections(transformedData);
    } catch (err) {
      console.error('Erro ao buscar conexões:', err);
      setError('Erro ao carregar conexões');
    } finally {
      setLoading(false);
    }
  };

  // Criar nova conexão
  const createConnection = async (connectionData: CreateConnectionData): Promise<CreateConnectionResponse | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('baileys-whatsapp', {
        body: {
          action: 'create',
          name: connectionData.name,
          sectors: connectionData.sectors
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conexão criada com sucesso",
      });

      // Recarregar lista de conexões
      await fetchConnections();

      return data;
    } catch (err) {
      console.error('Erro ao criar conexão:', err);
      toast({
        title: "Erro",
        description: "Erro ao criar conexão",
        variant: "destructive"
      });
      return null;
    }
  };

  // Obter QR Code atual
  const getQRCode = async (connectionId: string): Promise<{ qr_code: string; expires_at: string; status: string } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('baileys-whatsapp', {
        body: {
          action: 'get_qr',
          connectionId
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao obter QR Code:', err);
      return null;
    }
  };

  // Desconectar conexão
  const disconnectConnection = async (connectionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('baileys-whatsapp', {
        body: {
          action: 'disconnect',
          connectionId
        }
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conexão desconectada com sucesso",
      });

      // Recarregar lista de conexões
      await fetchConnections();
      return true;
    } catch (err) {
      console.error('Erro ao desconectar:', err);
      toast({
        title: "Erro",
        description: "Erro ao desconectar",
        variant: "destructive"
      });
      return false;
    }
  };

  // Obter status da conexão
  const getConnectionStatus = async (connectionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('baileys-whatsapp', {
        body: {
          action: 'status',
          connectionId
        }
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erro ao obter status:', err);
      return null;
    }
  };

  // Deletar conexão
  const deleteConnection = async (connectionId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tenant_baileys_connections')
        .delete()
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Conexão removida com sucesso",
      });

      // Recarregar lista de conexões
      await fetchConnections();
      return true;
    } catch (err) {
      console.error('Erro ao deletar conexão:', err);
      toast({
        title: "Erro",
        description: "Erro ao remover conexão",
        variant: "destructive"
      });
      return false;
    }
  };

  // Configurar realtime subscriptions
  useEffect(() => {
    let mounted = true;
    let realtimeChannel: any = null;

    const initializeData = async () => {
      if (mounted) {
        await fetchConnections();
      }
    };

    const setupRealtimeSubscription = () => {
      try {
        const channelName = `baileys-connections-${Date.now()}-${Math.random()}`;
        
        realtimeChannel = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'tenant_baileys_connections'
            },
            (payload) => {
              if (mounted) {
                console.log('Real-time update received:', payload);
                fetchConnections();
              }
            }
          )
          .subscribe((status) => {
            console.log('Subscription status:', status);
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
  }, []);

  return {
    connections,
    loading,
    error,
    createConnection,
    getQRCode,
    disconnectConnection,
    getConnectionStatus,
    deleteConnection,
    refetchConnections: fetchConnections
  };
};
