
export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  database_url: string;
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  created_at: Date;
  updated_at: Date;
  contact_email?: string;
  contact_phone?: string;
  max_users: number;
  max_contacts: number;
  features: Record<string, any>;
  metadata: Record<string, any>;
}

export interface TenantSubscription {
  id: string;
  tenant_id: string;
  plan: 'basic' | 'professional' | 'enterprise' | 'custom';
  status: string;
  start_date: Date;
  end_date?: Date;
  price_per_month?: number;
  created_at: Date;
  updated_at: Date;
}

export interface TenantActivityLog {
  id: string;
  tenant_id: string;
  action: string;
  details?: Record<string, any>;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface TenantContext {
  currentTenant: Tenant | null;
  tenants: Tenant[];
  loading: boolean;
  error: string | null;
  switchTenant: (tenantSlug: string) => Promise<void>;
  createTenant: (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  deleteTenant: (tenantId: string) => Promise<void>;
  logActivity: (action: string, details?: Record<string, any>) => Promise<void>;
}
