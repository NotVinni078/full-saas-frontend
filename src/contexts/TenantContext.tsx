
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

    setCurrentTenant(tenant);
    localStorage.setItem('currentTenantSlug', tenant.slug);
    
    // Log da atividade de mudança de tenant
    await logActivity(tenant.id, 'switch_tenant', { 
      from: currentTenant?.slug, 
      to: tenant.slug 
    });

    toast({
      title: "Sucesso",
      description: `Mudou para o tenant: ${tenant.name}`,
    });
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
        await logActivity(currentTenant.id, action, details);
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
