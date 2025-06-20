
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Contact, Sector, Tag, User, Connection } from '@/types/global';
import { useToast } from '@/hooks/use-toast';

interface SupabaseData {
  contacts: Contact[];
  sectors: Sector[];
  tags: Tag[];
  users: User[];
  connections: Connection[];
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

export const useSupabaseData = (): SupabaseData => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      
      const mappedSectors: Sector[] = data.map(sector => ({
        id: sector.id,
        nome: sector.nome,
        descricao: sector.descricao || '',
        cor: sector.cor,
        ativo: sector.ativo,
        criadoEm: new Date(sector.created_at),
        atualizadoEm: new Date(sector.updated_at)
      }));
      
      setSectors(mappedSectors);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError('Erro ao carregar setores');
    }
  };

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      
      const mappedTags: Tag[] = data.map(tag => ({
        id: tag.id,
        nome: tag.nome,
        cor: tag.cor,
        descricao: tag.descricao || '',
        ativo: tag.ativo,
        criadoEm: new Date(tag.created_at),
        atualizadoEm: new Date(tag.updated_at)
      }));
      
      setTags(mappedTags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Erro ao carregar tags');
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_sectors (
            sector_id
          )
        `)
        .order('nome');
      
      if (error) throw error;
      
      const mappedUsers: User[] = data.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone || '',
        setores: user.user_sectors.map((us: any) => us.sector_id),
        cargo: user.cargo || '',
        avatar: user.avatar,
        status: user.status,
        perfil: user.perfil,
        criadoEm: new Date(user.created_at),
        atualizadoEm: new Date(user.updated_at)
      }));
      
      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Erro ao carregar usuários');
    }
  };

  const fetchConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      
      const mappedConnections: Connection[] = data.map(connection => ({
        id: connection.id,
        nome: connection.nome,
        tipo: connection.tipo,
        setor: connection.sector_id,
        status: connection.status,
        configuracao: typeof connection.configuracao === 'object' && connection.configuracao !== null 
          ? connection.configuracao as Record<string, any>
          : {},
        criadoEm: new Date(connection.created_at),
        atualizadoEm: new Date(connection.updated_at)
      }));
      
      setConnections(mappedConnections);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Erro ao carregar conexões');
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select(`
          *,
          contact_tags (
            tag_id
          )
        `)
        .order('nome');
      
      if (error) throw error;
      
      const mappedContacts: Contact[] = data.map(contact => ({
        id: contact.id,
        nome: contact.nome,
        telefone: contact.telefone || '',
        email: contact.email || '',
        endereco: contact.endereco || '',
        observacoes: contact.observacoes || '',
        tags: contact.contact_tags.map((ct: any) => ct.tag_id),
        setor: contact.sector_id || '',
        avatar: contact.avatar,
        status: contact.status,
        canal: contact.canal,
        criadoEm: new Date(contact.created_at),
        atualizadoEm: new Date(contact.updated_at)
      }));
      
      setContacts(mappedContacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Erro ao carregar contatos');
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchSectors(),
        fetchTags(),
        fetchUsers(),
        fetchConnections(),
        fetchContacts()
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

  const refetchData = async () => {
    await fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    contacts,
    sectors,
    tags,
    users,
    connections,
    loading,
    error,
    refetchData
  };
};
