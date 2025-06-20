
-- Criar enum para status dos tenants
CREATE TYPE tenant_status AS ENUM ('active', 'inactive', 'suspended', 'trial');

-- Criar enum para planos de assinatura
CREATE TYPE subscription_plan AS ENUM ('basic', 'professional', 'enterprise', 'custom');

-- Tabela principal de tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  database_url TEXT NOT NULL,
  status tenant_status NOT NULL DEFAULT 'trial',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Informações de contato
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Configurações
  max_users INTEGER DEFAULT 10,
  max_contacts INTEGER DEFAULT 1000,
  features JSONB DEFAULT '{}',
  
  -- Metadados
  metadata JSONB DEFAULT '{}'
);

-- Tabela de assinaturas dos tenants
CREATE TABLE public.tenant_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  price_per_month DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela para logs de atividade dos tenants
CREATE TABLE public.tenant_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  user_id UUID,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_tenants_slug ON public.tenants(slug);
CREATE INDEX idx_tenants_status ON public.tenants(status);
CREATE INDEX idx_tenant_subscriptions_tenant_id ON public.tenant_subscriptions(tenant_id);
CREATE INDEX idx_tenant_activity_logs_tenant_id ON public.tenant_activity_logs(tenant_id);
CREATE INDEX idx_tenant_activity_logs_created_at ON public.tenant_activity_logs(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_subscriptions_updated_at BEFORE UPDATE ON public.tenant_subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo
INSERT INTO public.tenants (name, slug, database_url, status, contact_email, max_users, max_contacts) VALUES
('Empresa Exemplo', 'empresa-exemplo', 'postgresql://user:pass@localhost:5432/tenant_empresa_exemplo', 'active', 'admin@empresa-exemplo.com', 50, 5000),
('Startup Tech', 'startup-tech', 'postgresql://user:pass@localhost:5432/tenant_startup_tech', 'trial', 'contato@startup-tech.com', 10, 1000);

INSERT INTO public.tenant_subscriptions (tenant_id, plan, price_per_month) VALUES
((SELECT id FROM public.tenants WHERE slug = 'empresa-exemplo'), 'professional', 99.90),
((SELECT id FROM public.tenants WHERE slug = 'startup-tech'), 'basic', 29.90);
