
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { XCircle } from 'lucide-react';

const EndNode = memo(({ data, id }: any) => {
  const [message, setMessage] = useState(data.message || 'Atendimento encerrado. Obrigado pelo contato!');

  const handleMessageChange = (value: string) => {
    setMessage(value);
    data.message = value;
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <XCircle className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Encerrar</span>
        </div>
        
        <div>
          <label className="text-sm font-medium">Mensagem de encerramento:</label>
          <Textarea
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Digite a mensagem final..."
            className="mt-1 min-h-[80px] resize-none"
          />
        </div>
        
        <Handle
          type="target"
          position={Position.Top}
          className="w-3 h-3 bg-red-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

EndNode.displayName = 'EndNode';

export default EndNode;
