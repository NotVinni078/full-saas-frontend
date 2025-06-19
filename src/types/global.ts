
export interface Contact {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  endereco?: string;
  observacoes?: string;
  tags: string[];
  setor?: string;
  avatar: string;
  status: 'online' | 'offline' | 'ausente';
  canal: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Sector {
  id: string;
  nome: string;
  descricao?: string;
  cor: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Tag {
  id: string;
  nome: string;
  cor: string;
  descricao?: string;
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  setores: string[]; // ALTERADO: agora é um array de IDs de setores
  cargo?: string;
  avatar: string;
  status: 'ativo' | 'inativo';
  perfil: 'admin' | 'gerente' | 'atendente';
  criadoEm: Date;
  atualizadoEm: Date;
}

export interface Connection {
  id: string;
  nome: string;
  tipo: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'webchat';
  setor: string;
  status: 'ativo' | 'inativo' | 'configurando';
  configuracao: Record<string, any>;
  criadoEm: Date;
  atualizadoEm: Date;
}
