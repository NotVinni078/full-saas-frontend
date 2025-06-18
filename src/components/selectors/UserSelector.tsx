
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useSectors } from '@/hooks/useSectors';
import { User } from '@/types/global';

interface UserSelectorProps {
  onSelectUser: (user: User) => void;
  selectedUserId?: string;
  placeholder?: string;
  showSector?: boolean;
  filterBySetor?: string;
}

const UserSelector = ({ 
  onSelectUser, 
  selectedUserId, 
  placeholder = "Buscar usuários...",
  showSector = true,
  filterBySetor
}: UserSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { searchUsers, getActiveUsers, getUsersBySetor } = useUsers();
  const { getSectorById } = useSectors();

  let filteredUsers = searchTerm ? searchUsers(searchTerm) : getActiveUsers();
  
  if (filterBySetor) {
    filteredUsers = filteredUsers.filter(user => user.setor === filterBySetor);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredUsers.map((user) => {
            const userSetor = getSectorById(user.setor);
            return (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                  selectedUserId === user.id ? 'bg-blue-50 dark:bg-blue-950 border-blue-200' : ''
                }`}
                onClick={() => onSelectUser(user)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {user.nome}
                    </p>
                    {showSector && userSetor && (
                      <Badge className={`text-xs px-2 py-1 ${userSetor.cor}`}>
                        {userSetor.nome}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.cargo && `${user.cargo} • `}{user.email}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UserSelector;
