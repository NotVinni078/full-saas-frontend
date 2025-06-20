
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums for better type safety
CREATE TYPE user_profile AS ENUM ('admin', 'gerente', 'atendente');
CREATE TYPE user_status AS ENUM ('ativo', 'inativo');
CREATE TYPE contact_status AS ENUM ('online', 'offline', 'ausente');
CREATE TYPE contact_canal AS ENUM ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat');
CREATE TYPE connection_type AS ENUM ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat');
CREATE TYPE connection_status AS ENUM ('ativo', 'inativo', 'configurando');
CREATE TYPE campanha_status AS ENUM ('rascunho', 'agendada', 'em_andamento', 'pausada', 'finalizada', 'cancelada', 'erro');

-- Create sectors table
CREATE TABLE public.sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT NOT NULL DEFAULT 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  cor TEXT NOT NULL DEFAULT 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create users table (extending auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cargo TEXT,
  avatar TEXT NOT NULL,
  status user_status NOT NULL DEFAULT 'ativo',
  perfil user_profile NOT NULL DEFAULT 'atendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_sectors junction table (many-to-many relationship)
CREATE TABLE public.user_sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sector_id UUID NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, sector_id)
);

-- Create connections table
CREATE TABLE public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  tipo connection_type NOT NULL,
  sector_id UUID NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'configurando',
  configuracao JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contacts table
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  sector_id UUID REFERENCES public.sectors(id),
  avatar TEXT NOT NULL,
  status contact_status NOT NULL DEFAULT 'offline',
  canal contact_canal NOT NULL DEFAULT 'whatsapp',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contact_tags junction table (many-to-many relationship)
CREATE TABLE public.contact_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contact_id, tag_id)
);

-- Create campanhas table
CREATE TABLE public.campanhas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  canais TEXT[] NOT NULL DEFAULT '{}',
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE,
  status campanha_status NOT NULL DEFAULT 'rascunho',
  contatos_enviados INTEGER NOT NULL DEFAULT 0,
  contatos_total INTEGER NOT NULL DEFAULT 0,
  taxa_sucesso DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  mensagem TEXT NOT NULL,
  arquivo TEXT,
  remetente TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campanhas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sectors
CREATE POLICY "Users can view all sectors" ON public.sectors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert sectors" ON public.sectors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update sectors" ON public.sectors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete sectors" ON public.sectors FOR DELETE TO authenticated USING (true);

-- Create RLS policies for tags
CREATE POLICY "Users can view all tags" ON public.tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert tags" ON public.tags FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update tags" ON public.tags FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Users can delete tags" ON public.tags FOR DELETE TO authenticated USING (true);

-- Create RLS policies for users
CREATE POLICY "Users can view all users" ON public.users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create RLS policies for user_sectors
CREATE POLICY "Users can view all user_sectors" ON public.user_sectors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage user_sectors" ON public.user_sectors FOR ALL TO authenticated USING (true);

-- Create RLS policies for connections
CREATE POLICY "Users can view all connections" ON public.connections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage connections" ON public.connections FOR ALL TO authenticated USING (true);

-- Create RLS policies for contacts
CREATE POLICY "Users can view all contacts" ON public.contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage contacts" ON public.contacts FOR ALL TO authenticated USING (true);

-- Create RLS policies for contact_tags
CREATE POLICY "Users can view all contact_tags" ON public.contact_tags FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage contact_tags" ON public.contact_tags FOR ALL TO authenticated USING (true);

-- Create RLS policies for campanhas
CREATE POLICY "Users can view all campanhas" ON public.campanhas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert campanhas" ON public.campanhas FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their campanhas" ON public.campanhas FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their campanhas" ON public.campanhas FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER sectors_updated_at BEFORE UPDATE ON public.sectors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tags_updated_at BEFORE UPDATE ON public.tags FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER connections_updated_at BEFORE UPDATE ON public.connections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER campanhas_updated_at BEFORE UPDATE ON public.campanhas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial data
INSERT INTO public.sectors (id, nome, descricao, cor, ativo) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Vendas', 'Setor de vendas e relacionamento com clientes', 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Suporte', 'Suporte técnico e atendimento ao cliente', 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Financeiro', 'Departamento financeiro e cobrança', 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Gerência', 'Gestão e supervisão', 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', true);

INSERT INTO public.tags (id, nome, cor, descricao, ativo) VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'VIP', 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 'Cliente VIP', true),
  ('650e8400-e29b-41d4-a716-446655440002', 'Premium', 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200', 'Cliente Premium', true),
  ('650e8400-e29b-41d4-a716-446655440003', 'Fidelizado', 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 'Cliente fidelizado', true),
  ('650e8400-e29b-41d4-a716-446655440004', 'Novo Cliente', 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', 'Novo cliente', true),
  ('650e8400-e29b-41d4-a716-446655440005', 'Problema', 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 'Cliente com problema', true),
  ('650e8400-e29b-41d4-a716-446655440006', 'Urgente', 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', 'Atendimento urgente', true);

INSERT INTO public.connections (id, nome, tipo, sector_id, status, configuracao) VALUES 
  ('750e8400-e29b-41d4-a716-446655440001', 'WhatsApp Vendas', 'whatsapp', '550e8400-e29b-41d4-a716-446655440001', 'ativo', '{"numero": "+5511999999999"}'),
  ('750e8400-e29b-41d4-a716-446655440002', 'Instagram Oficial', 'instagram', '550e8400-e29b-41d4-a716-446655440001', 'ativo', '{"username": "@empresa_oficial"}'),
  ('750e8400-e29b-41d4-a716-446655440003', 'WhatsApp Suporte', 'whatsapp', '550e8400-e29b-41d4-a716-446655440002', 'ativo', '{"numero": "+5511888888888"}');
