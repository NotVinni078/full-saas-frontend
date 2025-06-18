
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, HelpCircle, Menu, UserCheck, XCircle, List, MousePointer } from 'lucide-react';

const nodeTypes = [
  {
    type: 'message',
    label: 'Mensagem',
    icon: MessageSquare,
    description: 'Enviar uma mensagem de texto',
    color: 'bg-blue-500'
  },
  {
    type: 'question',
    label: 'Pergunta',
    icon: HelpCircle,
    description: 'Fazer uma pergunta e aguardar resposta',
    color: 'bg-green-500'
  },
  {
    type: 'menu',
    label: 'Menu',
    icon: Menu,
    description: 'Criar um menu de opções',
    color: 'bg-purple-500'
  },
  {
    type: 'menu-list',
    label: 'Menu Lista',
    icon: List,
    description: 'Menu com lista de opções',
    color: 'bg-indigo-500'
  },
  {
    type: 'interactive-buttons',
    label: 'Botões Interativos',
    icon: MousePointer,
    description: 'Botões clicáveis para interação',
    color: 'bg-orange-500'
  },
  {
    type: 'transfer',
    label: 'Transferir',
    icon: UserCheck,
    description: 'Transferir para setor ou atendente',
    color: 'bg-yellow-500'
  },
  {
    type: 'end',
    label: 'Encerrar',
    icon: XCircle,
    description: 'Encerrar o atendimento',
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
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent cursor-grab active:cursor-grabbing transition-colors"
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
              >
                <div className={`w-8 h-8 rounded-lg ${node.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{node.label}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {node.description}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default NodesPanel;
