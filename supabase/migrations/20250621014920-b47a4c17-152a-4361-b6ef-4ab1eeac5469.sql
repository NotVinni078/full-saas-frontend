
-- Create tickets table to manage customer service tickets
CREATE TABLE public.tenant_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.tenant_contacts(id) ON DELETE CASCADE,
  assigned_user_id UUID REFERENCES public.tenant_users(id),
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'in_progress', 'resolved', 'closed')),
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  channel VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'telegram', 'webchat')),
  tags TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create ticket history table for tracking changes
CREATE TABLE public.tenant_ticket_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.tenant_tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.tenant_users(id),
  action VARCHAR(50) NOT NULL,
  old_values JSONB DEFAULT '{}',
  new_values JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Update the existing tenant_conversations table to link with tickets
ALTER TABLE public.tenant_conversations 
ADD COLUMN ticket_id UUID REFERENCES public.tenant_tickets(id);

-- Add indexes for better performance
CREATE INDEX idx_tenant_tickets_contact_id ON public.tenant_tickets(contact_id);
CREATE INDEX idx_tenant_tickets_assigned_user_id ON public.tenant_tickets(assigned_user_id);
CREATE INDEX idx_tenant_tickets_status ON public.tenant_tickets(status);
CREATE INDEX idx_tenant_tickets_priority ON public.tenant_tickets(priority);
CREATE INDEX idx_tenant_tickets_created_at ON public.tenant_tickets(created_at);
CREATE INDEX idx_tenant_tickets_channel ON public.tenant_tickets(channel);

CREATE INDEX idx_tenant_ticket_history_ticket_id ON public.tenant_ticket_history(ticket_id);
CREATE INDEX idx_tenant_ticket_history_created_at ON public.tenant_ticket_history(created_at);

-- Add triggers for automatic updated_at
CREATE TRIGGER update_tenant_tickets_updated_at 
  BEFORE UPDATE ON public.tenant_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to automatically create ticket history entries
CREATE OR REPLACE FUNCTION public.create_ticket_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create history for updates, not inserts
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.tenant_ticket_history (
      ticket_id,
      user_id,
      action,
      old_values,
      new_values
    ) VALUES (
      NEW.id,
      NEW.assigned_user_id,
      'updated',
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_ticket_history_trigger
  AFTER UPDATE ON public.tenant_tickets
  FOR EACH ROW EXECUTE FUNCTION public.create_ticket_history();

-- Insert some default ticket statuses and priorities for better organization
INSERT INTO public.tenant_settings (key, value, category, description, is_public) VALUES
('ticket_auto_assign', 'false', 'tickets', 'Automatically assign tickets to available agents', false),
('ticket_response_time_sla', '{"low": 24, "normal": 8, "high": 4, "urgent": 1}', 'tickets', 'Response time SLA in hours by priority', false),
('ticket_resolution_time_sla', '{"low": 72, "normal": 24, "high": 8, "urgent": 4}', 'tickets', 'Resolution time SLA in hours by priority', false);
