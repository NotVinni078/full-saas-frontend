
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquareQuote, Plus, X, MessageSquare } from 'lucide-react';

const QuickRepliesNode = memo(({ data, id }: any) => {
  const [message, setMessage] = useState(data.message || 'Escolha uma das opções:');
  const [replies, setReplies] = useState(data.replies || [
    { id: '1', text: 'Sim' },
    { id: '2', text: 'Não' },
    { id: '3', text: 'Mais informações' }
  ]);

  const handleMessageChange = (value: string) => {
    setMessage(value);
    data.message = value;
  };

  const handleReplyChange = (index: number, value: string) => {
    const newReplies = [...replies];
    newReplies[index].text = value;
    setReplies(newReplies);
    data.replies = newReplies;
  };

  const addReply = () => {
    if (replies.length < 3) { // WhatsApp limit
      const newReply = {
        id: Date.now().toString(),
        text: `Opção ${replies.length + 1}`
      };
      const newReplies = [...replies, newReply];
      setReplies(newReplies);
      data.replies = newReplies;
    }
  };

  const removeReply = (index: number) => {
    if (replies.length > 1) {
      const newReplies = replies.filter((_, i) => i !== index);
      setReplies(newReplies);
      data.replies = newReplies;
    }
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <MessageSquareQuote className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Botões Respostas</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Mensagem:</label>
            <Textarea
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              placeholder="Digite a mensagem..."
              className="mt-1 min-h-[60px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Botões de resposta (máx. 3):</label>
            {replies.map((reply, index) => (
              <div key={reply.id} className="flex gap-2">
                <Input
                  value={reply.text}
                  onChange={(e) => handleReplyChange(index, e.target.value)}
                  placeholder={`Botão ${index + 1}`}
                  maxLength={20}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeReply(index)}
                  disabled={replies.length === 1}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addReply} 
            className="w-full"
            disabled={replies.length >= 3}
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Botão
          </Button>

          {/* Preview */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500 mb-2">Preview:</div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-green-600 mt-1" />
                <div className="flex-1">
                  <div className="text-sm mb-2">{message}</div>
                  <div className="space-y-1">
                    {replies.map((reply, index) => (
                      <div key={index} className="border rounded px-2 py-1 text-xs text-center bg-gray-50">
                        {reply.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-blue-600 border-2 border-white"
        />
        {replies.map((_, index) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={`reply-${index}`}
            style={{ top: `${30 + (index * 20)}%` }}
            className="w-3 h-3 bg-blue-600 border-2 border-white"
          />
        ))}
      </CardContent>
    </Card>
  );
});

QuickRepliesNode.displayName = 'QuickRepliesNode';

export default QuickRepliesNode;
