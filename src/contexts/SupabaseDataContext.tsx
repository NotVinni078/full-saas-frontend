
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Contact, Sector, Tag, User, Connection } from '@/types/global';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';

interface SupabaseDataContextType {
  contacts: Contact[];
  sectors: Sector[];
  tags: Tag[];
  users: User[];
  connections: Connection[];
  loading: boolean;
  error: string | null;
  
  // CRUD operations
  updateContact: (contact: Contact) => Promise<void>;
  updateSector: (sector: Sector) => Promise<void>;
  updateTag: (tag: Tag) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  updateConnection: (connection: Connection) => Promise<void>;
  
  addContact: (contact: Omit<Contact, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  addSector: (sector: Omit<Sector, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  addTag: (tag: Omit<Tag, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  addUser: (user: Omit<User, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  addConnection: (connection: Omit<Connection, 'id' | 'criadoEm' | 'atualizadoEm'>) => Promise<void>;
  
  removeContact: (id: string) => Promise<void>;
  removeSector: (id: string) => Promise<void>;
  removeTag: (id: string) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
  removeConnection: (id: string) => Promise<void>;
  
  refetchData: () => Promise<void>;
}

const SupabaseDataContext = createContext<SupabaseDataContextType | undefined>(undefined);

export const SupabaseDataProvider = ({ children }: { children: ReactNode }) => {
  const data = useSupabaseData();
  const { toast } = useToast();

  const showSuccessToast = (message: string) => {
    toast({
      title: "Sucesso",
      description: message,
    });
  };

  const showErrorToast = (message: string) => {
    toast({
      title: "Erro",
      description: message,
      variant: "destructive"
    });
  };

  // Contact operations
  const updateContact = async (contact: Contact) => {
    try {
      // Update contact_tags relationship
      await supabase
        .from('contact_tags')
        .delete()
        .eq('contact_id', contact.id);
      
      if (contact.tags.length > 0) {
        const tagInserts = contact.tags.map(tagId => ({
          contact_id: contact.id,
          tag_id: tagId
        }));
        
        await supabase
          .from('contact_tags')
          .insert(tagInserts);
      }

      // Update contact
      const { error } = await supabase
        .from('contacts')
        .update({
          nome: contact.nome,
          telefone: contact.telefone,
          email: contact.email,
          endereco: contact.endereco,
          observacoes: contact.observacoes,
          sector_id: contact.setor || null,
          avatar: contact.avatar,
          status: contact.status,
          canal: contact.canal
        })
        .eq('id', contact.id);

      if (error) throw error;
      showSuccessToast('Contato atualizado com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error updating contact:', error);
      showErrorToast('Erro ao atualizar contato');
    }
  };

  const addContact = async (contactData: Omit<Contact, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      const { data: newContact, error } = await supabase
        .from('contacts')
        .insert({
          nome: contactData.nome,
          telefone: contactData.telefone,
          email: contactData.email,
          endereco: contactData.endereco,
          observacoes: contactData.observacoes,
          sector_id: contactData.setor || null,
          avatar: contactData.avatar,
          status: contactData.status,
          canal: contactData.canal
        })
        .select()
        .single();

      if (error) throw error;

      // Add tags relationship
      if (contactData.tags.length > 0) {
        const tagInserts = contactData.tags.map(tagId => ({
          contact_id: newContact.id,
          tag_id: tagId
        }));
        
        await supabase
          .from('contact_tags')
          .insert(tagInserts);
      }

      showSuccessToast('Contato adicionado com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error adding contact:', error);
      showErrorToast('Erro ao adicionar contato');
    }
  };

  const removeContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccessToast('Contato removido com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error removing contact:', error);
      showErrorToast('Erro ao remover contato');
    }
  };

  // Sector operations
  const updateSector = async (sector: Sector) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .update({
          nome: sector.nome,
          descricao: sector.descricao,
          cor: sector.cor,
          ativo: sector.ativo
        })
        .eq('id', sector.id);

      if (error) throw error;
      showSuccessToast('Setor atualizado com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error updating sector:', error);
      showErrorToast('Erro ao atualizar setor');
    }
  };

  const addSector = async (sectorData: Omit<Sector, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .insert({
          nome: sectorData.nome,
          descricao: sectorData.descricao,
          cor: sectorData.cor,
          ativo: sectorData.ativo
        });

      if (error) throw error;
      showSuccessToast('Setor adicionado com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error adding sector:', error);
      showErrorToast('Erro ao adicionar setor');
    }
  };

  const removeSector = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccessToast('Setor removido com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error removing sector:', error);
      showErrorToast('Erro ao remover setor');
    }
  };

  // Tag operations
  const updateTag = async (tag: Tag) => {
    try {
      const { error } = await supabase
        .from('tags')
        .update({
          nome: tag.nome,
          cor: tag.cor,
          descricao: tag.descricao,
          ativo: tag.ativo
        })
        .eq('id', tag.id);

      if (error) throw error;
      showSuccessToast('Tag atualizada com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error updating tag:', error);
      showErrorToast('Erro ao atualizar tag');
    }
  };

  const addTag = async (tagData: Omit<Tag, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      const { error } = await supabase
        .from('tags')
        .insert({
          nome: tagData.nome,
          cor: tagData.cor,
          descricao: tagData.descricao,
          ativo: tagData.ativo
        });

      if (error) throw error;
      showSuccessToast('Tag adicionada com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error adding tag:', error);
      showErrorToast('Erro ao adicionar tag');
    }
  };

  const removeTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccessToast('Tag removida com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error removing tag:', error);
      showErrorToast('Erro ao remover tag');
    }
  };

  // User operations
  const updateUser = async (user: User) => {
    try {
      // Update user_sectors relationship
      await supabase
        .from('user_sectors')
        .delete()
        .eq('user_id', user.id);
      
      if (user.setores.length > 0) {
        const sectorInserts = user.setores.map(sectorId => ({
          user_id: user.id,
          sector_id: sectorId
        }));
        
        await supabase
          .from('user_sectors')
          .insert(sectorInserts);
      }

      // Update user
      const { error } = await supabase
        .from('users')
        .update({
          nome: user.nome,
          email: user.email,
          telefone: user.telefone,
          cargo: user.cargo,
          avatar: user.avatar,
          status: user.status,
          perfil: user.perfil
        })
        .eq('id', user.id);

      if (error) throw error;
      showSuccessToast('Usuário atualizado com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      showErrorToast('Erro ao atualizar usuário');
    }
  };

  const addUser = async (userData: Omit<User, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      // Generate a UUID for the user (in a real app, this would come from auth)
      const userId = crypto.randomUUID();
      
      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          nome: userData.nome,
          email: userData.email,
          telefone: userData.telefone,
          cargo: userData.cargo,
          avatar: userData.avatar,
          status: userData.status,
          perfil: userData.perfil
        })
        .select()
        .single();

      if (error) throw error;

      // Add sectors relationship
      if (userData.setores.length > 0) {
        const sectorInserts = userData.setores.map(sectorId => ({
          user_id: newUser.id,
          sector_id: sectorId
        }));
        
        await supabase
          .from('user_sectors')
          .insert(sectorInserts);
      }

      showSuccessToast('Usuário adicionado com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error adding user:', error);
      showErrorToast('Erro ao adicionar usuário');
    }
  };

  const removeUser = async (id: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccessToast('Usuário removido com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error removing user:', error);
      showErrorToast('Erro ao remover usuário');
    }
  };

  // Connection operations
  const updateConnection = async (connection: Connection) => {
    try {
      const { error } = await supabase
        .from('connections')
        .update({
          nome: connection.nome,
          tipo: connection.tipo,
          sector_id: connection.setor,
          status: connection.status,
          configuracao: connection.configuracao
        })
        .eq('id', connection.id);

      if (error) throw error;
      showSuccessToast('Conexão atualizada com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error updating connection:', error);
      showErrorToast('Erro ao atualizar conexão');
    }
  };

  const addConnection = async (connectionData: Omit<Connection, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          nome: connectionData.nome,
          tipo: connectionData.tipo,
          sector_id: connectionData.setor,
          status: connectionData.status,
          configuracao: connectionData.configuracao
        });

      if (error) throw error;
      showSuccessToast('Conexão adicionada com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error adding connection:', error);
      showErrorToast('Erro ao adicionar conexão');
    }
  };

  const removeConnection = async (id: string) => {
    try {
      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      showSuccessToast('Conexão removida com sucesso');
      await data.refetchData();
    } catch (error) {
      console.error('Error removing connection:', error);
      showErrorToast('Erro ao remover conexão');
    }
  };

  const refetchData = async () => {
    await data.refetchData();
  };

  return (
    <SupabaseDataContext.Provider value={{
      ...data,
      updateContact,
      updateSector,
      updateTag,
      updateUser,
      updateConnection,
      addContact,
      addSector,
      addTag,
      addUser,
      addConnection,
      removeContact,
      removeSector,
      removeTag,
      removeUser,
      removeConnection,
      refetchData
    }}>
      {children}
    </SupabaseDataContext.Provider>
  );
};

export const useSupabaseDataContext = () => {
  const context = useContext(SupabaseDataContext);
  if (context === undefined) {
    throw new Error('useSupabaseDataContext must be used within a SupabaseDataProvider');
  }
  return context;
};
