import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Trash2 } from 'lucide-react';

const DelayNode = memo(({ data, id }: any) => {
  const [delayValue, setDelayValue] = useState(data.delayValue || 5);
  const [delayUnit, setDelayUnit] = useState(data.delayUnit || 'seconds');
  const { setNodes, setEdges } = useReactFlow();

  const handleDelayValueChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setDelayValue(numValue);
    data.delayValue = numValue;
  };

  const handleDelayUnitChange = (value: string) => {
    setDelayUnit(value);
    data.delayUnit = value;
  };

  const handleDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const getDelayInSeconds = () => {
    switch (delayUnit) {
      case 'minutes':
        return delayValue * 60;
      case 'hours':
        return delayValue * 3600;
      default:
        return delayValue;
    }
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Tempo de Espera</span>
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
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Tempo:</label>
              <Input
                type="number"
                value={delayValue}
                onChange={(e) => handleDelayValueChange(e.target.value)}
                min="1"
                max="3600"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Unidade:</label>
              <Select value={delayUnit} onValueChange={handleDelayUnitChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Segundos</SelectItem>
                  <SelectItem value="minutes">Minutos</SelectItem>
                  <SelectItem value="hours">Horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-700">
              Tempo total: {getDelayInSeconds()} segundos
            </div>
            <div className="text-xs text-gray-500 mt-1">
              O fluxo será pausado por este período antes de continuar
            </div>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-orange-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-orange-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

DelayNode.displayName = 'DelayNode';

export default DelayNode;
