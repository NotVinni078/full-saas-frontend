
import { useGlobalData } from '@/contexts/GlobalDataContext';
import { User } from '@/types/global';

export const useUsers = () => {
  const { users, updateUser, addUser, removeUser, sectors } = useGlobalData();

  const getUserById = (id: string): User | undefined => {
    return users.find(user => user.id === id);
  };

  const getUsersBySetor = (setorId: string): User[] => {
    return users.filter(user => user.setor === setorId);
  };

  const getActiveUsers = (): User[] => {
    return users.filter(user => user.status === 'ativo');
  };

  const getUserSetor = (user: User) => {
    return sectors.find(sector => sector.id === user.setor);
  };

  const searchUsers = (searchTerm: string): User[] => {
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.nome.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.cargo?.toLowerCase().includes(term)
    );
  };

  return {
    users,
    updateUser,
    addUser,
    removeUser,
    getUserById,
    getUsersBySetor,
    getActiveUsers,
    getUserSetor,
    searchUsers
  };
};
