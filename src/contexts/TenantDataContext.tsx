
import React, { createContext, useContext, ReactNode } from 'react';
import { useTenantData, TenantContact, TenantConnection, TenantMessage, TenantQuickReply } from '@/hooks/useTenantData';

interface TenantDataContextType {
  contacts: TenantContact[];
  connections: TenantConnection[];
  messages: TenantMessage[];
  quickReplies: TenantQuickReply[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
  
  // CRUD operations for contacts
  createContact: (contact: Omit<TenantContact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateContact: (id: string, updates: Partial<TenantContact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  
  // CRUD operations for connections
  createConnection: (connection: Omit<TenantConnection, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateConnection: (id: string, updates: Partial<TenantConnection>) => Promise<void>;
  deleteConnection: (id: string) => Promise<void>;
  
  // CRUD operations for quick replies
  createQuickReply: (reply: Omit<TenantQuickReply, 'id' | 'created_at' | 'updated_at' | 'usage_count'>) => Promise<void>;
  updateQuickReply: (id: string, updates: Partial<TenantQuickReply>) => Promise<void>;
  deleteQuickReply: (id: string) => Promise<void>;
}

const TenantDataContext = createContext<TenantDataContextType | undefined>(undefined);

export const TenantDataProvider = ({ children }: { children: ReactNode }) => {
  const tenantData = useTenantData();

  return (
    <TenantDataContext.Provider value={tenantData}>
      {children}
    </TenantDataContext.Provider>
  );
};

export const useTenantDataContext = () => {
  const context = useContext(TenantDataContext);
  if (context === undefined) {
    throw new Error('useTenantDataContext must be used within a TenantDataProvider');
  }
  return context;
};
