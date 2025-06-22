
-- Criar tabela de agendamentos
CREATE TABLE public.tenant_scheduled_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message_content TEXT,
  message_type VARCHAR(10) NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image', 'document')),
  audio_url TEXT,
  include_signature BOOLEAN NOT NULL DEFAULT false,
  has_attachments BOOLEAN NOT NULL DEFAULT false,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  scheduled_time TIME NOT NULL,
  has_recurrence BOOLEAN NOT NULL DEFAULT false,
  recurrence_type VARCHAR(20) CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'quarterly', 'semiannual', 'annual', 'custom')),
  custom_days INTEGER,
  channel VARCHAR(20) NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'telegram')),
  ticket_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (ticket_status IN ('finished', 'pending', 'in_progress')),
  sector VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'sent', 'cancelled', 'failed')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_at TIMESTAMP WITH TIME ZONE,
  next_execution TIMESTAMP WITH TIME ZONE
);

-- Criar tabela de contatos do agendamento
CREATE TABLE public.tenant_schedule_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.tenant_scheduled_messages(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.tenant_contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(schedule_id, contact_id)
);

-- Criar tabela de histórico de execuções
CREATE TABLE public.tenant_schedule_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.tenant_scheduled_messages(id) ON DELETE CASCADE,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status VARCHAR(20) NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed', 'partial')),
  contacts_sent INTEGER NOT NULL DEFAULT 0,
  contacts_failed INTEGER NOT NULL DEFAULT 0,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.tenant_scheduled_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_schedule_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_schedule_executions ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS básicas (assumindo que existe autenticação por tenant)
CREATE POLICY "Users can manage their own scheduled messages" 
  ON public.tenant_scheduled_messages 
  FOR ALL 
  USING (true);

CREATE POLICY "Users can manage their own schedule contacts" 
  ON public.tenant_schedule_contacts 
  FOR ALL 
  USING (true);

CREATE POLICY "Users can view their own schedule executions" 
  ON public.tenant_schedule_executions 
  FOR ALL 
  USING (true);

-- Criar índices para performance
CREATE INDEX idx_scheduled_messages_next_execution ON public.tenant_scheduled_messages(next_execution) WHERE status = 'scheduled';
CREATE INDEX idx_scheduled_messages_status ON public.tenant_scheduled_messages(status);
CREATE INDEX idx_schedule_contacts_schedule_id ON public.tenant_schedule_contacts(schedule_id);
CREATE INDEX idx_schedule_executions_schedule_id ON public.tenant_schedule_executions(schedule_id);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_scheduled_messages_updated_at
  BEFORE UPDATE ON public.tenant_scheduled_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para calcular próxima execução de recorrência (corrigida)
CREATE OR REPLACE FUNCTION calculate_next_execution(
  base_date TIMESTAMP WITH TIME ZONE,
  recurrence_type VARCHAR(20),
  custom_days INTEGER DEFAULT NULL
) RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
  CASE recurrence_type
    WHEN 'daily' THEN
      RETURN base_date + INTERVAL '1 day';
    WHEN 'weekly' THEN
      RETURN base_date + INTERVAL '1 week';
    WHEN 'monthly' THEN
      RETURN base_date + INTERVAL '1 month';
    WHEN 'quarterly' THEN
      RETURN base_date + INTERVAL '3 months';
    WHEN 'semiannual' THEN
      RETURN base_date + INTERVAL '6 months';
    WHEN 'annual' THEN
      RETURN base_date + INTERVAL '1 year';
    WHEN 'custom' THEN
      RETURN base_date + INTERVAL '1 day' * COALESCE(custom_days, 1);
    ELSE
      RETURN NULL;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular next_execution automaticamente
CREATE OR REPLACE FUNCTION set_next_execution() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.has_recurrence AND NEW.recurrence_type IS NOT NULL THEN
    NEW.next_execution := calculate_next_execution(
      NEW.scheduled_date,
      NEW.recurrence_type,
      NEW.custom_days
    );
  ELSE
    NEW.next_execution := NEW.scheduled_date;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_next_execution
  BEFORE INSERT OR UPDATE ON public.tenant_scheduled_messages
  FOR EACH ROW
  EXECUTE FUNCTION set_next_execution();
