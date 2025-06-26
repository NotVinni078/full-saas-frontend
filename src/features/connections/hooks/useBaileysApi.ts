
import { useState, useCallback } from 'react';
import { BaileysApiService, BaileysConnectionResponse } from '@/services/api/baileysApi';

/**
 * Hook para gerenciar operações com a API Baileys
 * Fornece interface limpa para componentes React
 */
export const useBaileysApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const executeOperation = useCallback(async (
    operation: () => Promise<BaileysConnectionResponse>
  ): Promise<BaileysConnectionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('[useBaileysApi] Erro na operação:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createConnection = useCallback(async (name: string, sectors: string[] = []) => {
    return executeOperation(() => BaileysApiService.createConnection(name, sectors));
  }, [executeOperation]);

  const getQRCode = useCallback(async (connectionId: string) => {
    return executeOperation(() => BaileysApiService.getQRCode(connectionId));
  }, [executeOperation]);

  const disconnectConnection = useCallback(async (connectionId: string) => {
    return executeOperation(() => BaileysApiService.disconnectConnection(connectionId));
  }, [executeOperation]);

  const getConnectionStatus = useCallback(async (connectionId: string) => {
    return executeOperation(() => BaileysApiService.getConnectionStatus(connectionId));
  }, [executeOperation]);

  return {
    isLoading,
    error,
    clearError,
    createConnection,
    getQRCode,
    disconnectConnection,
    getConnectionStatus
  };
};
