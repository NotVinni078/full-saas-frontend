
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tenant, TenantContext as TenantContextType } from '@/types/tenant';
import { useTenants } from '@/hooks/useTenants';
import { useToast } from '@/hooks/use-toast';

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const { tenants, loading, error, createTenant, updateTenant, deleteTenant, logActivity } = useTenants();
  const { toast } = useToast();

  // Carregar tenant atual do localStorage ou definir o primeiro como padrão
  useEffect(() => {
    if (tenants.length > 0 && !currentTenant) {
      const savedTenantSlug = localStorage.getItem('currentTenantSlug');
      let tenant = null;
      
      if (savedTenantSlug) {
        tenant = tenants.find(t => t.slug === savedTenantSlug);
      }
      
      if (!tenant) {
        tenant = tenants[0];
      }
      
      setCurrentTenant(tenant);
      localStorage.setItem('currentTenantSlug', tenant.slug);
      
      // Log da atividade de inicialização
      logActivity(tenant.id, 'tenant_initialized', { 
        tenant_name: tenant.name,
        tenant_slug: tenant.slug 
      });
    }
  }, [tenants, currentTenant]);

  const switchTenant = async (tenantSlug: string) => {
    const tenant = tenants.find(t => t.slug === tenantSlug);
    if (!tenant) {
      toast({
        title: "Erro",
        description: "Tenant não encontrado",
        variant: "destructive"
      });
      return;
    }

    const previousTenant = currentTenant;
    setCurrentTenant(tenant);
    localStorage.setItem('currentTenantSlug', tenant.slug);
    
    // Log da atividade de mudança de tenant
    await logActivity(tenant.id, 'switch_tenant', { 
      from: previousTenant?.slug, 
      to: tenant.slug,
      from_name: previousTenant?.name,
      to_name: tenant.name
    });

    toast({
      title: "Sucesso",
      description: `Mudou para o tenant: ${tenant.name}`,
    });

    // Força um reload da página para garantir que todos os dados sejam recarregados
    // para o novo tenant (isso pode ser otimizado futuramente)
    window.location.reload();
  };

  const contextValue: TenantContextType = {
    currentTenant,
    tenants,
    loading,
    error,
    switchTenant,
    createTenant,
    updateTenant,
    deleteTenant,
    logActivity: async (action: string, details?: Record<string, any>) => {
      if (currentTenant) {
        await logActivity(currentTenant.id, action, {
          ...details,
          tenant_context: {
            tenant_id: currentTenant.id,
            tenant_name: currentTenant.name,
            tenant_slug: currentTenant.slug
          }
        });
      }
    }
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};
