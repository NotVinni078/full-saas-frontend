
import { useBaileysApi } from '@/features/connections/hooks/useBaileysApi';

/**
 * @deprecated Use useBaileysApi from @/features/connections/hooks/useBaileysApi instead
 * This hook is kept for backward compatibility
 */
export const useBaileysConnections = () => {
  const api = useBaileysApi();
  
  return {
    getQRCode: api.getQRCode,
    getConnectionStatus: api.getConnectionStatus,
    createConnection: api.createConnection,
    disconnectConnection: api.disconnectConnection,
    isLoading: api.isLoading,
    error: api.error
  };
};
