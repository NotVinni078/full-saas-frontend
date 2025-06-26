
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBaileysApi } from './useBaileysApi';
import { Connection, ConnectionStatus } from '../components/ConnectionCard';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para gerenciar conexões WhatsApp
 * Centraliza toda a lógica de estado e operações de conexão
 */
export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    createConnection: createBaileysConnection,
    getQRCode,
    disconnectConnection: disconnectBaileysConnection,
    getConnectionStatus,
    isLoading: apiLoading,
    error: apiError
  } = useBaileysApi();

  /**
   * Carrega conexões do banco de dados
   */
  const loadConnections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: dbError } = await supabase
        .from('tenant_baileys_connections')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbError) throw dbError;

      const formattedConnections: Connection[] = (data || []).map(conn => ({
        id: conn.id,
        name: conn.name,
        status: conn.status as ConnectionStatus,
        phone_number: conn.phone_number || undefined,
        last_activity_at: conn.last_activity_at || undefined,
        created_at: conn.created_at,
        sectors: conn.sectors || []
      }));

      setConnections(formattedConnections);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar conexões';
      setError(errorMessage);
      console.error('Erro ao carregar conexões:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cria nova conexão
   */
  const createConnection = useCallback(async (name: string, sectors: string[] = []) => {
    const result = await createBaileysConnection(name, sectors);
    
    if (result && !apiError) {
      toast({
        title: "Conexão criada",
        description: `Conexão "${name}" foi criada com sucesso`,
      });
      
      // Recarrega a lista de conexões
      await loadConnections();
    } else if (apiError) {
      toast({
        title: "Erro ao criar conexão",
        description: apiError,
        variant: "destructive"
      });
      throw new Error(apiError);
    }
  }, [createBaileysConnection, apiError, loadConnections]);

  /**
   * Desconecta uma conexão
   */
  const disconnectConnection = useCallback(async (connectionId: string) => {
    const result = await disconnectBaileysConnection(connectionId);
    
    if (result && !apiError) {
      toast({
        title: "Conexão desconectada",
        description: "A conexão foi desconectada com sucesso",
      });
      
      await loadConnections();
    } else if (apiError) {
      toast({
        title: "Erro ao desconectar",
        description: apiError,
        variant: "destructive"
      });
    }
  }, [disconnectBaileysConnection, apiError, loadConnections]);

  /**
   * Exclui uma conexão
   */
  const deleteConnection = useCallback(async (connectionId: string) => {
    try {
      // Primeiro desconecta via API
      await disconnectBaileysConnection(connectionId);
      
      // Depois remove do banco de dados
      const { error: dbError } = await supabase
        .from('tenant_baileys_connections')
        .delete()
        .eq('id', connectionId);

      if (dbError) throw dbError;

      toast({
        title: "Conexão excluída",
        description: "A conexão foi removida permanentemente",
      });
      
      await loadConnections();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir conexão';
      toast({
        title: "Erro ao excluir",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [disconnectBaileysConnection, loadConnections]);

  /**
   * Reconecta uma conexão
   */
  const reconnectConnection = useCallback(async (connectionId: string) => {
    // Para reconectar, obtemos um novo QR Code
    const result = await getQRCode(connectionId);
    
    if (result && !apiError) {
      toast({
        title: "Reconectando",
        description: "QR Code gerado. Escaneie para reconectar.",
      });
      
      await loadConnections();
      return result;
    } else if (apiError) {
      toast({
        title: "Erro ao reconectar",
        description: apiError,
        variant: "destructive"
      });
    }
    
    return null;
  }, [getQRCode, apiError, loadConnections]);

  // Carrega conexões quando o hook é inicializado
  useEffect(() => {
    loadConnections();
  }, [loadConnections]);

  return {
    connections,
    loading: loading || apiLoading,
    error: error || apiError,
    createConnection,
    disconnectConnection,
    deleteConnection,
    reconnectConnection,
    refreshConnections: loadConnections,
    getQRCode
  };
};
