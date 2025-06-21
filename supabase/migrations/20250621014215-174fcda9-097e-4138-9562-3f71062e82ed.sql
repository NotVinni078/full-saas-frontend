
-- Criar tabelas específicas para cada tenant (estas devem ser criadas no banco de dados de cada tenant)

-- Tabela de mensagens do tenant
CREATE TABLE public.tenant_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL,
  user_id UUID,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document')),
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat')),
  status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de conexões do tenant
CREATE TABLE public.tenant_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat')),
  status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'error', 'configuring')),
  configuration JSONB NOT NULL DEFAULT '{}',
  credentials JSONB DEFAULT '{}',
  webhook_url TEXT,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de configurações do tenant
CREATE TABLE public.tenant_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de contatos do tenant
CREATE TABLE public.tenant_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar TEXT DEFAULT '/placeholder.svg',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'archived')),
  channel VARCHAR(20) DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat')),
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de respostas rápidas do tenant
CREATE TABLE public.tenant_quick_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  shortcut TEXT UNIQUE,
  category VARCHAR(50),
  tags TEXT[] DEFAULT '{}',
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de campanhas do tenant
CREATE TABLE public.tenant_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  message_content TEXT NOT NULL,
  target_contacts UUID[] DEFAULT '{}',
  channels TEXT[] DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  total_contacts INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de usuários do tenant
CREATE TABLE public.tenant_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  global_user_id UUID NOT NULL, -- Referência ao usuário global
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('admin', 'manager', 'agent')),
  permissions JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(global_user_id)
);

-- Tabela de conversas/chats do tenant
CREATE TABLE public.tenant_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.tenant_contacts(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES public.tenant_users(id),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'waiting', 'resolved')),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  tags TEXT[] DEFAULT '{}',
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fluxos de chatbot do tenant
CREATE TABLE public.tenant_chatbot_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_keywords TEXT[] DEFAULT '{}',
  flow_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  channels TEXT[] DEFAULT '{}',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de relatórios e analytics do tenant
CREATE TABLE public.tenant_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type VARCHAR(20) NOT NULL CHECK (metric_type IN ('counter', 'gauge', 'histogram')),
  dimensions JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE
);

-- Índices para performance
CREATE INDEX idx_tenant_messages_contact_id ON public.tenant_messages(contact_id);
CREATE INDEX idx_tenant_messages_created_at ON public.tenant_messages(created_at);
CREATE INDEX idx_tenant_messages_channel ON public.tenant_messages(channel);

CREATE INDEX idx_tenant_connections_type ON public.tenant_connections(type);
CREATE INDEX idx_tenant_connections_status ON public.tenant_connections(status);

CREATE INDEX idx_tenant_contacts_phone ON public.tenant_contacts(phone);
CREATE INDEX idx_tenant_contacts_email ON public.tenant_contacts(email);
CREATE INDEX idx_tenant_contacts_status ON public.tenant_contacts(status);

CREATE INDEX idx_tenant_conversations_contact_id ON public.tenant_conversations(contact_id);
CREATE INDEX idx_tenant_conversations_assigned_user_id ON public.tenant_conversations(assigned_user_id);
CREATE INDEX idx_tenant_conversations_status ON public.tenant_conversations(status);

CREATE INDEX idx_tenant_campaigns_status ON public.tenant_campaigns(status);
CREATE INDEX idx_tenant_campaigns_scheduled_at ON public.tenant_campaigns(scheduled_at);

CREATE INDEX idx_tenant_analytics_metric_name ON public.tenant_analytics(metric_name);
CREATE INDEX idx_tenant_analytics_recorded_at ON public.tenant_analytics(recorded_at);

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_tenant_messages_updated_at BEFORE UPDATE ON public.tenant_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_connections_updated_at BEFORE UPDATE ON public.tenant_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_settings_updated_at BEFORE UPDATE ON public.tenant_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_contacts_updated_at BEFORE UPDATE ON public.tenant_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_quick_replies_updated_at BEFORE UPDATE ON public.tenant_quick_replies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_campaigns_updated_at BEFORE UPDATE ON public.tenant_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_users_updated_at BEFORE UPDATE ON public.tenant_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_conversations_updated_at BEFORE UPDATE ON public.tenant_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_chatbot_flows_updated_at BEFORE UPDATE ON public.tenant_chatbot_flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações padrão para cada tenant
INSERT INTO public.tenant_settings (key, value, category, description, is_public) VALUES
('business_hours', '{"start": "09:00", "end": "18:00", "timezone": "America/Sao_Paulo"}', 'general', 'Horário de funcionamento', true),
('auto_reply_enabled', 'true', 'automation', 'Resposta automática habilitada', false),
('max_simultaneous_chats', '5', 'limits', 'Máximo de chats simultâneos por agente', false),
('welcome_message', '"Olá! Como posso ajudá-lo hoje?"', 'messages', 'Mensagem de boas-vindas', true),
('away_message', '"No momento não temos agentes disponíveis. Deixe sua mensagem que retornaremos em breve."', 'messages', 'Mensagem de ausência', true);

-- Inserir algumas respostas rápidas padrão
INSERT INTO public.tenant_quick_replies (title, content, shortcut, category) VALUES
('Saudação', 'Olá! Como posso ajudá-lo hoje?', '/ola', 'saudacoes'),
('Despedida', 'Obrigado pelo contato! Tenha um ótimo dia!', '/tchau', 'saudacoes'),
('Aguarde', 'Por favor, aguarde um momento enquanto verifico essas informações para você.', '/aguarde', 'atendimento'),
('Transferir', 'Vou transferir você para um especialista que poderá ajudá-lo melhor.', '/transferir', 'atendimento');
