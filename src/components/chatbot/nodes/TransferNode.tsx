
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck } from 'lucide-react';
import SectorSelector from '@/components/selectors/SectorSelector';
import UserSelector from '@/components/selectors/UserSelector';
import { User } from '@/types/global';

const TransferNode = memo(({ data, id }: any) => {
  const [transferType, setTransferType] = useState(data.transferType || 'setor');
  const [selectedSector, setSelectedSector] = useState(data.selectedSector || '');
  const [selectedUser, setSelectedUser] = useState(data.selectedUser || '');
  const [showUserSelector, setShowUserSelector] = useState(false);

  const handleTransferTypeChange = (value: string) => {
    setTransferType(value);
    data.transferType = value;
    // Limpar seleções quando mudar o tipo
    if (value === 'setor') {
      setSelectedUser('');
      data.selectedUser = '';
    } else {
      setSelectedSector('');
      data.selectedSector = '';
    }
    setShowUserSelector(false);
  };

  const handleSectorChange = (value: string) => {
    setSelectedSector(value);
    data.selectedSector = value;
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user.id);
    data.selectedUser = user.id;
    data.selectedUserName = user.nome;
    setShowUserSelector(false);
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Transferir</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Tipo de transferência:</label>
            <Select value={transferType} onValueChange={handleTransferTypeChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="setor">Transferir para Setor</SelectItem>
                <SelectItem value="atendente">Transferir para Atendente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {transferType === 'setor' ? (
            <div>
              <label className="text-sm font-medium">Setor:</label>
              <div className="mt-1">
                <SectorSelector
                  value={selectedSector}
                  onValueChange={handleSectorChange}
                  placeholder="Selecione um setor"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Atendente:</label>
              <div className="mt-1">
                <Select value={selectedUser} onValueChange={() => setShowUserSelector(true)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um atendente">
                      {selectedUser && data.selectedUserName}
                    </SelectValue>
                  </SelectTrigger>
                </Select>
                
                {showUserSelector && (
                  <div className="mt-2 border rounded-lg p-3 bg-white">
                    <UserSelector
                      onSelectUser={handleUserSelect}
                      selectedUserId={selectedUser}
                      placeholder="Buscar atendentes..."
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

TransferNode.displayName = 'TransferNode';

export default TransferNode;
