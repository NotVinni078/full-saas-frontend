
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, HelpCircle, Menu, UserCheck, XCircle, List, MousePointer } from 'lucide-react';

const nodeTypes = [
  {
    type: 'message',
    label: 'Mensagem',
    icon: MessageSquare,
    color: 'bg-blue-500'
  },
  {
    type: 'question',
    label: 'Pergunta',
    icon: HelpCircle,
    color: 'bg-green-500'
  },
  {
    type: 'menu',
    label: 'Menu',
    icon: Menu,
    color: 'bg-purple-500'
  },
  {
    type: 'menu-list',
    label: 'Menu Lista',
    icon: List,
    color: 'bg-indigo-500'
  },
  {
    type: 'interactive-buttons',
    label: 'Botões Interativos',
    icon: MousePointer,
    color: 'bg-orange-500'
  },
  {
    type: 'transfer',
    label: 'Transferir',
    icon: UserCheck,
    color: 'bg-yellow-500'
  },
  {
    type: 'end',
    label: 'Encerrar',
    icon: XCircle,
    color: 'bg-red-500'
  }
];

const NodesPanel = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Nós Disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {nodeTypes.map((node) => {
            const Icon = node.icon;
            return (
              <div
                key={node.type}
                className="flex items-center gap-2 p-2 rounded border hover:bg-accent cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
              >
                <div className={`w-6 h-6 rounded ${node.color} flex items-center justify-center`}>
                  <Icon className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-medium">{node.label}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default NodesPanel;
