
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { User, Sector } from '@/types/global';

export const useUsers = () => {
  const { users, updateUser, addUser, removeUser, sectors } = useGlobalData();

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  /**
   * ATUALIZADO: Busca usuários por setor considerando múltiplos setores
   * Agora verifica se o setor está incluído no array de setores do usuário
   */
  const getUsersBySetor = (setorId: string): User[] => {
    return users.filter(user => user.setores.includes(setorId));
  };

  const getActiveUsers = (): User[] => {
    return users.filter(user => user.status === 'ativo');
  };

  /**
   * ATUALIZADO: Retorna todos os setores de um usuário
   * Agora retorna um array de setores em vez de um único setor
   */
  const getUserSetores = (user: User): Sector[] => {
    return user.setores.map(setorId => 
      sectors.find(sector => sector.id === setorId)
    ).filter(Boolean) as Sector[];
  };

  /**
   * NOVA FUNÇÃO: Verifica se um usuário pertence a um setor específico
   */
  const userBelongsToSetor = (user: User, setorId: string): boolean => {
    return user.setores.includes(setorId);
  };

  /**
   * ATUALIZADO: Busca usuários considerando múltiplos setores na busca
   * Agora também busca nos nomes dos setores associados ao usuário
   */
  const searchUsers = (searchTerm: string): User[] => {
    const term = searchTerm.toLowerCase();
    return users.filter(user => {
      // Busca básica por nome, email e cargo
      const basicMatch = user.nome.toLowerCase().includes(term) ||
                         user.email.toLowerCase().includes(term) ||
                         user.cargo?.toLowerCase().includes(term);
      
      // Busca nos nomes dos setores do usuário
      const userSetores = getUserSetores(user);
      const sectorMatch = userSetores.some(setor => 
        setor.nome.toLowerCase().includes(term)
      );
      
      return basicMatch || sectorMatch;
    });
  };

  return {
    users,
    updateUser,
    addUser,
    removeUser,
    getUserById,
    getUsersBySetor,
    getActiveUsers,
    getUserSetores, // ATUALIZADO: agora retorna array de setores
    userBelongsToSetor, // NOVA FUNÇÃO
    searchUsers
  };
};
