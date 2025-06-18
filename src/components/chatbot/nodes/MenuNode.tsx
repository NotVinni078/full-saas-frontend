
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Menu, Plus, X } from 'lucide-react';

const MenuNode = memo(({ data, id }: any) => {
  const [title, setTitle] = useState(data.title || 'Escolha uma opção:');
  const [options, setOptions] = useState(data.options || ['Opção 1', 'Opção 2']);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    data.title = value;
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    data.options = newOptions;
  };

  const addOption = () => {
    const newOptions = [...options, `Opção ${options.length + 1}`];
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
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Menu className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Menu</span>
        </div>
        
        <div className="space-y-3">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título do menu"
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Opções:</label>
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Opção ${index + 1}`}
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
            ))}
          </div>
          
          <Button variant="outline" size="sm" onClick={addOption} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Opção
          </Button>
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
            style={{ top: `${30 + (index * 20)}%` }}
            className="w-3 h-3 bg-purple-500 border-2 border-white"
          />
        ))}
      </CardContent>
    </Card>
  );
});

MenuNode.displayName = 'MenuNode';

export default MenuNode;
