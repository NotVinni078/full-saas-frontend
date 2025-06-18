
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';

const MessageNode = memo(({ data, id }: any) => {
  const [content, setContent] = useState(data.content || 'Digite sua mensagem aqui...');

  const handleContentChange = (value: string) => {
    setContent(value);
    data.content = value;
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Mensagem</span>
        </div>
        
        <div>
          <label className="text-sm font-medium">Mensagem que será enviada:</label>
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Digite a mensagem que o chatbot enviará..."
            className="mt-1 min-h-[100px] resize-none"
          />
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-blue-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

MessageNode.displayName = 'MessageNode';

export default MessageNode;
