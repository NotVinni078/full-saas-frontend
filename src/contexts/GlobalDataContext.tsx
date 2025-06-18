
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact, Sector, Tag, User, Connection } from '@/types/global';

interface GlobalDataContextType {
  contacts: Contact[];
  sectors: Sector[];
  tags: Tag[];
  users: User[];
  connections: Connection[];
  updateContact: (contact: Contact) => void;
  updateSector: (sector: Sector) => void;
  updateTag: (tag: Tag) => void;
  updateUser: (user: User) => void;
  updateConnection: (connection: Connection) => void;
  addContact: (contact: Omit<Contact, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  addSector: (sector: Omit<Sector, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  addTag: (tag: Omit<Tag, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  addUser: (user: Omit<User, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  addConnection: (connection: Omit<Connection, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  removeContact: (id: string) => void;
  removeSector: (id: string) => void;
  removeTag: (id: string) => void;
  removeUser: (id: string) => void;
  removeConnection: (id: string) => void;
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

// Dados iniciais mockados com padrão de cores da tela Tags
const initialSectors: Sector[] = [
  {
    id: '1',
    nome: 'Vendas',
    descricao: 'Setor de vendas e relacionamento com clientes',
    cor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Suporte',
    descricao: 'Suporte técnico e atendimento ao cliente',
    cor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '3',
    nome: 'Financeiro',
    descricao: 'Departamento financeiro e cobrança',
    cor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '4',
    nome: 'Gerência',
    descricao: 'Gestão e supervisão',
    cor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  }
];

const initialTags: Tag[] = [
  {
    id: '1',
    nome: 'VIP',
    cor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    descricao: 'Cliente VIP',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Premium',
    cor: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    descricao: 'Cliente Premium',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '3',
    nome: 'Fidelizado',
    cor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    descricao: 'Cliente fidelizado',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '4',
    nome: 'Novo Cliente',
    cor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    descricao: 'Novo cliente',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '5',
    nome: 'Problema',
    cor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    descricao: 'Cliente com problema',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '6',
    nome: 'Urgente',
    cor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    descricao: 'Atendimento urgente',
    ativo: true,
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  }
];

const initialUsers: User[] = [
  {
    id: '1',
    nome: 'João Santos',
    email: 'joao@empresa.com',
    telefone: '(11) 99999-9999',
    setor: '1', // Vendas
    cargo: 'Vendedor',
    avatar: 'JS',
    status: 'ativo',
    perfil: 'atendente',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Maria Costa',
    email: 'maria@empresa.com',
    telefone: '(11) 88888-8888',
    setor: '2', // Suporte
    cargo: 'Analista de Suporte',
    avatar: 'MC',
    status: 'ativo',
    perfil: 'atendente',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '3',
    nome: 'Pedro Lima',
    email: 'pedro@empresa.com',
    telefone: '(11) 77777-7777',
    setor: '3', // Financeiro
    cargo: 'Analista Financeiro',
    avatar: 'PL',
    status: 'ativo',
    perfil: 'atendente',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '4',
    nome: 'Ana Silva',
    email: 'ana@empresa.com',
    telefone: '(11) 66666-6666',
    setor: '4', // Gerência
    cargo: 'Gerente',
    avatar: 'AS',
    status: 'ativo',
    perfil: 'gerente',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '5',
    nome: 'Carlos Mendes',
    email: 'carlos@empresa.com',
    telefone: '(11) 55555-5555',
    setor: '4', // Gerência
    cargo: 'Supervisor',
    avatar: 'CM',
    status: 'ativo',
    perfil: 'gerente',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  }
];

const initialContacts: Contact[] = [
  {
    id: '1',
    nome: 'João Silva',
    telefone: '(11) 99999-9999',
    email: 'joao@email.com',
    endereco: 'Rua das Flores, 123',
    observacoes: 'Cliente preferencial, sempre compra produtos premium',
    tags: ['1', '2', '3'], // VIP, Premium, Fidelizado
    setor: '1', // Vendas
    avatar: 'JS',
    status: 'online',
    canal: 'whatsapp',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Maria Santos',
    telefone: '(11) 88888-8888',
    email: 'maria@email.com',
    endereco: 'Av. Principal, 456',
    observacoes: 'Interessada em produtos para casa',
    tags: ['4'], // Novo Cliente
    setor: '1', // Vendas
    avatar: 'MS',
    status: 'offline',
    canal: 'instagram',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '3',
    nome: 'Pedro Costa',
    telefone: '(11) 77777-7777',
    email: 'pedro@email.com',
    endereco: 'Rua Central, 789',
    observacoes: 'Cliente satisfeito com a compra',
    tags: ['3'], // Fidelizado
    setor: '1', // Vendas
    avatar: 'PC',
    status: 'ausente',
    canal: 'facebook',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '4',
    nome: 'Ana Oliveira',
    telefone: '(11) 66666-6666',
    email: 'ana@email.com',
    endereco: 'Praça da Liberdade, 321',
    observacoes: 'Sempre pergunta sobre prazos',
    tags: [], // Sem tags
    setor: '2', // Suporte
    avatar: 'AO',
    status: 'online',
    canal: 'telegram',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '5',
    nome: 'Roberto Alves',
    telefone: '(11) 33333-3333',
    email: 'roberto@email.com',
    endereco: 'Rua do Comércio, 50',
    observacoes: 'Produto com defeito, precisa de troca urgente',
    tags: ['5', '6'], // Problema, Urgente
    setor: '2', // Suporte
    avatar: 'RA',
    status: 'online',
    canal: 'facebook',
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  }
];

const initialConnections: Connection[] = [
  {
    id: '1',
    nome: 'WhatsApp Vendas',
    tipo: 'whatsapp',
    setor: '1', // Vendas
    status: 'ativo',
    configuracao: { numero: '+5511999999999' },
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Instagram Oficial',
    tipo: 'instagram',
    setor: '1', // Vendas
    status: 'ativo',
    configuracao: { username: '@empresa_oficial' },
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  },
  {
    id: '3',
    nome: 'WhatsApp Suporte',
    tipo: 'whatsapp',
    setor: '2', // Suporte
    status: 'ativo',
    configuracao: { numero: '+5511888888888' },
    criadoEm: new Date('2024-01-01'),
    atualizadoEm: new Date('2024-01-01')
  }
];

export const GlobalDataProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [sectors, setSectors] = useState<Sector[]>(initialSectors);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);

  const updateContact = (contact: Contact) => {
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...contact, atualizadoEm: new Date() } : c));
  };

  const updateSector = (sector: Sector) => {
    setSectors(prev => prev.map(s => s.id === sector.id ? { ...sector, atualizadoEm: new Date() } : s));
  };

  const updateTag = (tag: Tag) => {
    setTags(prev => prev.map(t => t.id === tag.id ? { ...tag, atualizadoEm: new Date() } : t));
  };

  const updateUser = (user: User) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...user, atualizadoEm: new Date() } : u));
  };

  const updateConnection = (connection: Connection) => {
    setConnections(prev => prev.map(c => c.id === connection.id ? { ...connection, atualizadoEm: new Date() } : c));
  };

  const addContact = (contactData: Omit<Contact, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const newContact: Contact = {
      ...contactData,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    setContacts(prev => [...prev, newContact]);
  };

  const addSector = (sectorData: Omit<Sector, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const newSector: Sector = {
      ...sectorData,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    setSectors(prev => [...prev, newSector]);
  };

  const addTag = (tagData: Omit<Tag, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const newTag: Tag = {
      ...tagData,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    setTags(prev => [...prev, newTag]);
  };

  const addUser = (userData: Omit<User, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const addConnection = (connectionData: Omit<Connection, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    const newConnection: Connection = {
      ...connectionData,
      id: Date.now().toString(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const removeSector = (id: string) => {
    setSectors(prev => prev.filter(s => s.id !== id));
  };

  const removeTag = (id: string) => {
    setTags(prev => prev.filter(t => t.id !== id));
  };

  const removeUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const removeConnection = (id: string) => {
    setConnections(prev => prev.filter(c => c.id !== id));
  };

  return (
    <GlobalDataContext.Provider value={{
      contacts,
      sectors,
      tags,
      users,
      connections,
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
      removeConnection
    }}>
      {children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalData = () => {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error('useGlobalData must be used within a GlobalDataProvider');
  }
  return context;
};
