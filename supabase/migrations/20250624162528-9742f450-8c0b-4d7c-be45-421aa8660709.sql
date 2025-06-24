
-- Criar tabela para armazenar conexões Baileys
CREATE TABLE IF NOT EXISTS public.tenant_baileys_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  channel_type TEXT NOT NULL DEFAULT 'whatsapp-qr',
  sectors TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'disconnected',
  qr_code TEXT,
  qr_expires_at TIMESTAMP WITH TIME ZONE,
  phone_number TEXT,
  session_data JSONB DEFAULT '{}',
  webhook_url TEXT,
  last_activity_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.tenant_baileys_connections ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (ajuste conforme necessário)
CREATE POLICY "Allow all operations on baileys connections" ON public.tenant_baileys_connections
  FOR ALL USING (true);

-- Adicionar suporte a realtime
ALTER TABLE public.tenant_baileys_connections REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.tenant_baileys_connections;

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_baileys_connection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_baileys_connections_updated_at
  BEFORE UPDATE ON public.tenant_baileys_connections
  FOR EACH ROW
  EXECUTE PROCEDURE update_baileys_connection_updated_at();
