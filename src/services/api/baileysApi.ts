
import { supabase } from '@/integrations/supabase/client';

export interface BaileysConnectionRequest {
  action: 'create' | 'get_qr' | 'disconnect' | 'status';
  connectionId?: string;
  name?: string;
  sectors?: string[];
}

export interface BaileysConnectionResponse {
  connection_id?: string;
  qr_code?: string;
  expires_at?: string;
  status?: string;
  phone_number?: string;
  last_activity_at?: string;
  error?: string;
  success?: boolean;
}

/**
 * Service para comunicação com a API Baileys WhatsApp
 * Centraliza todas as chamadas para a Edge Function
 */
export class BaileysApiService {
  private static readonly FUNCTION_NAME = 'baileys-whatsapp';

  /**
   * Executa uma requisição para a Edge Function Baileys
   */
  private static async makeRequest(
    request: BaileysConnectionRequest
  ): Promise<BaileysConnectionResponse> {
    try {
      console.log(`[BaileysAPI] Executando ação: ${request.action}`, request);
      
      const { data, error } = await supabase.functions.invoke(
        this.FUNCTION_NAME,
        {
          body: request,
        }
      );

      if (error) {
        console.error('[BaileysAPI] Erro na requisição:', error);
        throw new Error(error.message || 'Erro na comunicação com a API');
      }

      console.log(`[BaileysAPI] Resposta recebida:`, data);
      return data;
    } catch (error) {
      console.error('[BaileysAPI] Erro inesperado:', error);
      throw error;
    }
  }

  /**
   * Cria uma nova conexão WhatsApp
   */
  static async createConnection(
    name: string,
    sectors: string[] = []
  ): Promise<BaileysConnectionResponse> {
    return this.makeRequest({
      action: 'create',
      name,
      sectors
    });
  }

  /**
   * Obtém QR Code de uma conexão
   */
  static async getQRCode(connectionId: string): Promise<BaileysConnectionResponse> {
    return this.makeRequest({
      action: 'get_qr',
      connectionId
    });
  }

  /**
   * Desconecta uma conexão WhatsApp
   */
  static async disconnectConnection(connectionId: string): Promise<BaileysConnectionResponse> {
    return this.makeRequest({
      action: 'disconnect',
      connectionId
    });
  }

  /**
   * Verifica status de uma conexão
   */
  static async getConnectionStatus(connectionId: string): Promise<BaileysConnectionResponse> {
    return this.makeRequest({
      action: 'status',
      connectionId
    });
  }
}
