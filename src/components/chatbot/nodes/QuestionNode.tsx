
import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpCircle, Trash2 } from 'lucide-react';

const QuestionNode = memo(({ data, id }: any) => {
  const [question, setQuestion] = useState(data.question || 'Digite sua pergunta...');
  const [variable, setVariable] = useState(data.variable || 'resposta');
  const { setNodes, setEdges } = useReactFlow();

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    data.question = value;
  };

  const handleVariableChange = (value: string) => {
    setVariable(value);
    data.variable = value;
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
            <div className="w-8 h-8 brand-success rounded-lg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 brand-text-background" />
            </div>
            <span className="font-medium brand-text-foreground">Pergunta</span>
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
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium brand-text-foreground">Pergunta a ser enviada:</label>
            <Textarea
              value={question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder="Digite a pergunta que o chatbot fará..."
              className="mt-1 min-h-[80px] resize-none"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium brand-text-foreground">Nome da variável para salvar a resposta:</label>
            <Input
              value={variable}
              onChange={(e) => handleVariableChange(e.target.value)}
              placeholder="Ex: nome_cliente, email, telefone"
              className="mt-1"
            />
            <p className="text-xs brand-text-muted mt-1">
              A resposta do usuário será salva nesta variável para uso posterior no fluxo
            </p>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 brand-success border-2 brand-border-background"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 brand-success border-2 brand-border-background"
        />
      </CardContent>
    </Card>
  );
});

QuestionNode.displayName = 'QuestionNode';

export default QuestionNode;
