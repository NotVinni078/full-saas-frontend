
import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MousePointer, Plus, X, MessageSquare, Copy, ExternalLink, Phone, MessageCircle, Trash2 } from 'lucide-react';

const InteractiveButtonsNode = memo(({ data, id }: any) => {
  const [text, setText] = useState(data.text || 'Escolha uma ação:');
  const [buttons, setButtons] = useState(data.buttons || [
    { id: '1', text: 'Copiar código', type: 'copy', value: 'CODIGO123' },
    { id: '2', text: 'Visitar site', type: 'url', value: 'https://exemplo.com' }
  ]);
  const { setNodes, setEdges } = useReactFlow();

  const buttonTypes = [
    { value: 'copy', label: 'Copiar texto', icon: Copy },
    { value: 'url', label: 'Abrir link', icon: ExternalLink },
    { value: 'phone', label: 'Ligar', icon: Phone },
    { value: 'sms', label: 'Enviar SMS', icon: MessageCircle }
  ];

  const handleTextChange = (value: string) => {
    setText(value);
    data.text = value;
  };

  const handleButtonChange = (index: number, field: string, value: string) => {
    const newButtons = [...buttons];
    newButtons[index][field] = value;
    setButtons(newButtons);
    data.buttons = newButtons;
  };

  const addButton = () => {
    if (buttons.length < 3) { // WhatsApp limit
      const newButton = {
        id: Date.now().toString(),
        text: `Botão ${buttons.length + 1}`,
        type: 'copy',
        value: ''
      };
      const newButtons = [...buttons, newButton];
      setButtons(newButtons);
      data.buttons = newButtons;
    }
  };

  const removeButton = (index: number) => {
    if (buttons.length > 1) {
      const newButtons = buttons.filter((_, i) => i !== index);
      setButtons(newButtons);
      data.buttons = newButtons;
    }
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const getButtonIcon = (type: string) => {
    const buttonType = buttonTypes.find(bt => bt.value === type);
    return buttonType ? buttonType.icon : Copy;
  };

  const getValuePlaceholder = (type: string) => {
    switch (type) {
      case 'copy': return 'Texto para copiar';
      case 'url': return 'https://exemplo.com';
      case 'phone': return '+5511999999999';
      case 'sms': return '+5511999999999';
      default: return 'Valor';
    }
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <MousePointer className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Botões Interativos</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Mensagem:</label>
            <Textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Digite a mensagem..."
              className="mt-1 min-h-[60px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Botões de ação (máx. 3):</label>
            {buttons.map((button, index) => {
              const Icon = getButtonIcon(button.type);
              return (
                <div key={button.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={button.text}
                      onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                      placeholder={`Texto do botão ${index + 1}`}
                      maxLength={20}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeButton(index)}
                      disabled={buttons.length === 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={button.type}
                      onValueChange={(value) => handleButtonChange(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {buttonTypes.map((type) => {
                          const TypeIcon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <TypeIcon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <Input
                      value={button.value}
                      onChange={(e) => handleButtonChange(index, 'value', e.target.value)}
                      placeholder={getValuePlaceholder(button.type)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addButton} 
            className="w-full"
            disabled={buttons.length >= 3}
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
                  <div className="text-sm mb-2">{text}</div>
                  <div className="space-y-1">
                    {buttons.map((button, index) => {
                      const Icon = getButtonIcon(button.type);
                      return (
                        <div key={index} className="border rounded px-2 py-1 text-xs bg-blue-50 flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          {button.text}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-orange-500 border-2 border-white"
        />
        {buttons.map((_, index) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={`button-${index}`}
            style={{ top: `${30 + (index * 20)}%` }}
            className="w-3 h-3 bg-orange-500 border-2 border-white"
          />
        ))}
      </CardContent>
    </Card>
  );
});

InteractiveButtonsNode.displayName = 'InteractiveButtonsNode';

export default InteractiveButtonsNode;
