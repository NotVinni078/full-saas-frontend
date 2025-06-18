
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck } from 'lucide-react';

const TransferNode = memo(({ data, id }: any) => {
  const [transferType, setTransferType] = useState(data.transferType || 'setor');
  const [target, setTarget] = useState(data.target || '');

  const handleTransferTypeChange = (value: string) => {
    setTransferType(value);
    data.transferType = value;
  };

  const handleTargetChange = (value: string) => {
    setTarget(value);
    data.target = value;
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
          
          <div>
            <label className="text-sm font-medium">
              {transferType === 'setor' ? 'Nome do setor:' : 'Nome do atendente:'}
            </label>
            <Input
              value={target}
              onChange={(e) => handleTargetChange(e.target.value)}
              placeholder={transferType === 'setor' ? 'Ex: Suporte Técnico' : 'Ex: João Silva'}
              className="mt-1"
            />
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-yellow-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

TransferNode.displayName = 'TransferNode';

export default TransferNode;
