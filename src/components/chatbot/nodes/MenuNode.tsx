
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Menu, Plus, X, MessageSquare } from 'lucide-react';

const MenuNode = memo(({ data, id }: any) => {
  const [title, setTitle] = useState(data.title || 'Escolha uma opção:');
  const [description, setDescription] = useState(data.description || 'Selecione uma das opções abaixo:');
  const [options, setOptions] = useState(data.options || [
    { id: '1', title: 'Opção 1', description: 'Descrição da opção 1' },
    { id: '2', title: 'Opção 2', description: 'Descrição da opção 2' }
  ]);
  const [buttonText, setButtonText] = useState(data.buttonText || 'Ver opções');

  const handleTitleChange = (value: string) => {
    setTitle(value);
    data.title = value;
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    data.description = value;
  };

  const handleButtonTextChange = (value: string) => {
    setButtonText(value);
    data.buttonText = value;
  };

  const handleOptionChange = (index: number, field: string, value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
    data.options = newOptions;
  };

  const addOption = () => {
    const newOption = {
      id: Date.now().toString(),
      title: `Opção ${options.length + 1}`,
      description: `Descrição da opção ${options.length + 1}`
    };
    const newOptions = [...options, newOption];
    setOptions(newOptions);
    data.options = newOptions;
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      data.options = newOptions;
    }
  };

  return (
    <Card className="w-96 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Menu className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Menu Interativo</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Título da mensagem:</label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Título do menu"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição:</label>
            <Textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Descrição do menu"
              className="mt-1 min-h-[60px] resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Texto do botão:</label>
            <Input
              value={buttonText}
              onChange={(e) => handleButtonTextChange(e.target.value)}
              placeholder="Ver opções"
              className="mt-1"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Opções da lista:</label>
            {options.map((option, index) => (
              <div key={option.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={option.title}
                    onChange={(e) => handleOptionChange(index, 'title', e.target.value)}
                    placeholder={`Título da opção ${index + 1}`}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={options.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  value={option.description}
                  onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
                  placeholder={`Descrição da opção ${index + 1}`}
                />
              </div>
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={addOption} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Opção
          </Button>

          {/* Preview do Menu */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-500 mb-2">Preview:</div>
            <div className="bg-white rounded-lg p-3 border">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-green-600 mt-1" />
                <div className="flex-1">
                  <div className="font-medium text-sm">{title}</div>
                  <div className="text-sm text-gray-600 mt-1">{description}</div>
                  <Button variant="outline" size="sm" className="mt-2 text-xs">
                    {buttonText} ({options.length})
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
        {options.map((_, index) => (
          <Handle
            key={index}
            type="source"
            position={Position.Right}
            id={`option-${index}`}
            style={{ top: `${30 + (index * 15)}%` }}
            className="w-3 h-3 bg-purple-500 border-2 border-white"
          />
        ))}
      </CardContent>
    </Card>
  );
});

MenuNode.displayName = 'MenuNode';

export default MenuNode;
