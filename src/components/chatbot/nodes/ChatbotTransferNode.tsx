
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bot } from 'lucide-react';

const ChatbotTransferNode = memo(({ data, id }: any) => {
  const [selectedBot, setSelectedBot] = useState(data.selectedBot || '');
  const [customBotName, setCustomBotName] = useState(data.customBotName || '');
  const [transferMessage, setTransferMessage] = useState(data.transferMessage || 'Transferindo para outro assistente...');

  // Lista de bots disponíveis (pode ser expandida conforme necessário)
  const availableBots = [
    { id: 'main', name: 'Bot Principal' },
    { id: 'support', name: 'Bot de Suporte' },
    { id: 'sales', name: 'Bot de Vendas' },
    { id: 'custom', name: 'Outro...' }
  ];

  const handleBotChange = (value: string) => {
    setSelectedBot(value);
    data.selectedBot = value;
    if (value !== 'custom') {
      setCustomBotName('');
      data.customBotName = '';
    }
  };

  const handleCustomBotNameChange = (value: string) => {
    setCustomBotName(value);
    data.customBotName = value;
  };

  const handleTransferMessageChange = (value: string) => {
    setTransferMessage(value);
    data.transferMessage = value;
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Transferir Chatbot</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Chatbot de destino:</label>
            <Select value={selectedBot} onValueChange={handleBotChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione um chatbot" />
              </SelectTrigger>
              <SelectContent>
                {availableBots.map((bot) => (
                  <SelectItem key={bot.id} value={bot.id}>
                    {bot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBot === 'custom' && (
            <div>
              <label className="text-sm font-medium">Nome do chatbot:</label>
              <Input
                value={customBotName}
                onChange={(e) => handleCustomBotNameChange(e.target.value)}
                placeholder="Digite o nome do chatbot"
                className="mt-1"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Mensagem de transferência:</label>
            <Input
              value={transferMessage}
              onChange={(e) => handleTransferMessageChange(e.target.value)}
              placeholder="Mensagem exibida durante a transferência"
              className="mt-1"
            />
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-cyan-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-cyan-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

ChatbotTransferNode.displayName = 'ChatbotTransferNode';

export default ChatbotTransferNode;
