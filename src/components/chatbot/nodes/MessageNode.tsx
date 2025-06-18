
import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Trash2 } from 'lucide-react';

const MessageNode = memo(({ data, id }: any) => {
  const [content, setContent] = useState(data.content || 'Digite sua mensagem aqui...');
  const { setNodes, setEdges } = useReactFlow();

  const handleContentChange = (value: string) => {
    setContent(value);
    data.content = value;
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  return (
    <Card className="w-80 shadow-lg brand-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 brand-info rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 brand-text-background" />
            </div>
            <span className="font-medium brand-text-foreground">Mensagem</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-6 w-6 p-0 brand-text-error hover:brand-text-error hover:brand-hover-error"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div>
          <label className="text-sm font-medium brand-text-foreground">Mensagem que será enviada:</label>
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
          className="w-3 h-3 brand-info border-2 brand-border-background"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 brand-info border-2 brand-border-background"
        />
      </CardContent>
    </Card>
  );
});

MessageNode.displayName = 'MessageNode';

export default MessageNode;
