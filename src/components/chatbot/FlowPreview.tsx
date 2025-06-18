
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Play } from 'lucide-react';

interface FlowPreviewProps {
  nodes: any[];
  edges: any[];
}

const FlowPreview = ({ nodes, edges }: FlowPreviewProps) => {
  const getNodePreview = (node: any) => {
    switch (node.type) {
      case 'message':
        return {
          icon: MessageSquare,
          title: 'Mensagem',
          content: node.data.content || 'Mensagem não definida'
        };
      case 'question':
        return {
          icon: MessageSquare,
          title: 'Pergunta',
          content: node.data.question || 'Pergunta não definida'
        };
      case 'menu':
        return {
          icon: MessageSquare,
          title: 'Menu',
          content: node.data.title || 'Menu não definido'
        };
      default:
        return {
          icon: MessageSquare,
          title: 'Nó',
          content: 'Conteúdo não definido'
        };
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="w-5 h-5" />
            Preview do Fluxo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum nó adicionado ainda</p>
              <p className="text-sm">Arraste nós do painel lateral para começar</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground mb-3">
                {nodes.length} nó{nodes.length !== 1 ? 's' : ''} • {edges.length} conexõe{edges.length !== 1 ? 's' : ''}
              </p>
              {nodes.map((node, index) => {
                const preview = getNodePreview(node);
                const Icon = preview.icon;
                
                return (
                  <div key={node.id} className="p-3 border rounded-lg bg-muted/50">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 bg-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{preview.title} #{index + 1}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {preview.content}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowPreview;
