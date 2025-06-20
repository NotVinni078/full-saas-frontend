
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tenant, TenantSubscription, TenantActivityLog } from '@/types/tenant';
import { useToast } from '@/hooks/use-toast';

interface TenantsData {
  tenants: Tenant[];
  subscriptions: TenantSubscription[];
  activityLogs: TenantActivityLog[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  createTenant: (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTenant: (tenantId: string, updates: Partial<Tenant>) => Promise<void>;
  deleteTenant: (tenantId: string) => Promise<void>;
  logActivity: (tenantId: string, action: string, details?: Record<string, any>) => Promise<void>;
}

export const useTenants = (): TenantsData => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [subscriptions, setSubscriptions] = useState<TenantSubscription[]>([]);
  const [activityLogs, setActivityLogs] = useState<TenantActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTenants = async () => {
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedTenants: Tenant[] = data.map(tenant => ({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        domain: tenant.domain || undefined,
        database_url: tenant.database_url,
        status: tenant.status as 'active' | 'inactive' | 'suspended' | 'trial',
        created_at: new Date(tenant.created_at),
        updated_at: new Date(tenant.updated_at),
        contact_email: tenant.contact_email || undefined,
        contact_phone: tenant.contact_phone || undefined,
        max_users: tenant.max_users,
        max_contacts: tenant.max_contacts,
        features: (tenant.features && typeof tenant.features === 'object' && !Array.isArray(tenant.features)) 
          ? tenant.features as Record<string, any> 
          : {},
        metadata: (tenant.metadata && typeof tenant.metadata === 'object' && !Array.isArray(tenant.metadata)) 
          ? tenant.metadata as Record<string, any> 
          : {}
      }));
      
      setTenants(mappedTenants);
    } catch (err) {
      console.error('Error fetching tenants:', err);
      setError('Erro ao carregar tenants');
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedSubscriptions: TenantSubscription[] = data.map(sub => ({
        id: sub.id,
        tenant_id: sub.tenant_id,
        plan: sub.plan,
        status: sub.status,
        start_date: new Date(sub.start_date),
        end_date: sub.end_date ? new Date(sub.end_date) : undefined,
        price_per_month: sub.price_per_month || undefined,
        created_at: new Date(sub.created_at),
        updated_at: new Date(sub.updated_at)
      }));
      
      setSubscriptions(mappedSubscriptions);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('Erro ao carregar assinaturas');
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('tenant_activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      const mappedLogs: TenantActivityLog[] = data.map(log => ({
        id: log.id,
        tenant_id: log.tenant_id,
        action: log.action,
        details: (log.details && typeof log.details === 'object' && !Array.isArray(log.details)) 
          ? log.details as Record<string, any> 
          : undefined,
        user_id: log.user_id || undefined,
        ip_address: (log.ip_address && typeof log.ip_address === 'string') ? log.ip_address : undefined,
        user_agent: log.user_agent || undefined,
        created_at: new Date(log.created_at)
      }));
      
      setActivityLogs(mappedLogs);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Erro ao carregar logs de atividade');
    }
  };

  const createTenant = async (tenantData: Omit<Tenant, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .insert({
          name: tenantData.name,
          slug: tenantData.slug,
          domain: tenantData.domain,
          database_url: tenantData.database_url,
          status: tenantData.status,
          contact_email: tenantData.contact_email,
          contact_phone: tenantData.contact_phone,
          max_users: tenantData.max_users,
          max_contacts: tenantData.max_contacts,
          features: tenantData.features,
          metadata: tenantData.metadata
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Tenant criado com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar tenant",
        variant: "destructive"
      });
    }
  };

  const updateTenant = async (tenantId: string, updates: Partial<Tenant>) => {
    try {
      // Convert Date objects to strings for Supabase
      const supabaseUpdates = {
        ...updates,
        created_at: updates.created_at ? updates.created_at.toISOString() : undefined,
        updated_at: updates.updated_at ? updates.updated_at.toISOString() : undefined
      };

      const { error } = await supabase
        .from('tenants')
        .update(supabaseUpdates)
        .eq('id', tenantId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Tenant atualizado com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error updating tenant:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar tenant",
        variant: "destructive"
      });
    }
  };

  const deleteTenant = async (tenantId: string) => {
    try {
      const { error } = await supabase
        .from('tenants')
        .delete()
        .eq('id', tenantId);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Tenant removido com sucesso",
      });
      
      await refetchData();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover tenant",
        variant: "destructive"
      });
    }
  };

  const logActivity = async (tenantId: string, action: string, details?: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('tenant_activity_logs')
        .insert({
          tenant_id: tenantId,
          action,
          details: details || null,
          user_id: null, // TODO: Implementar autenticação
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const refetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchTenants(),
        fetchSubscriptions(),
        fetchActivityLogs()
      ]);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados. Verifique sua conexão.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchData();
  }, []);

  return {
    tenants,
    subscriptions,
    activityLogs,
    loading,
    error,
    refetchData,
    createTenant,
    updateTenant,
    deleteTenant,
    logActivity
  };
};
