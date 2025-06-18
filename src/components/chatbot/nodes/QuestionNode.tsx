
import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { HelpCircle } from 'lucide-react';

const QuestionNode = memo(({ data, id }: any) => {
  const [question, setQuestion] = useState(data.question || 'Digite sua pergunta...');
  const [variable, setVariable] = useState(data.variable || 'resposta');

  const handleQuestionChange = (value: string) => {
    setQuestion(value);
    data.question = value;
  };

  const handleVariableChange = (value: string) => {
    setVariable(value);
    data.variable = value;
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-white" />
          </div>
          <span className="font-medium">Pergunta</span>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Pergunta a ser enviada:</label>
            <Textarea
              value={question}
              onChange={(e) => handleQuestionChange(e.target.value)}
              placeholder="Digite a pergunta que o chatbot fará..."
              className="mt-1 min-h-[80px] resize-none"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Nome da variável para salvar a resposta:</label>
            <Input
              value={variable}
              onChange={(e) => handleVariableChange(e.target.value)}
              placeholder="Ex: nome_cliente, email, telefone"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              A resposta do usuário será salva nesta variável para uso posterior no fluxo
            </p>
          </div>
        </div>
        
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
});

QuestionNode.displayName = 'QuestionNode';

export default QuestionNode;
