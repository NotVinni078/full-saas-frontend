
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Eye, Play } from 'lucide-react';
import { Fluxo } from '@/pages/ChatBot';
import FlowCanvas from './FlowCanvas';
import FlowPreview from './FlowPreview';

interface FluxoEditorProps {
  fluxo: Fluxo | null;
  onSave: (fluxo: Fluxo) => void;
  onBack: () => void;
}

const FluxoEditor = ({ fluxo, onSave, onBack }: FluxoEditorProps) => {
  const [currentFluxo, setCurrentFluxo] = useState<Fluxo>(fluxo || {
    id: '',
    name: '',
    description: '',
    nodes: [],
    edges: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = () => {
    const updatedFluxo = {
      ...currentFluxo,
      updatedAt: new Date()
    };
    onSave(updatedFluxo);
  };

  const handleNodesChange = useCallback((nodes: any[]) => {
    setCurrentFluxo(prev => ({ ...prev, nodes }));
  }, []);

  const handleEdgesChange = useCallback((edges: any[]) => {
    setCurrentFluxo(prev => ({ ...prev, edges }));
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-background p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex flex-col">
            <Input
              value={currentFluxo.name}
              onChange={(e) => setCurrentFluxo(prev => ({ ...prev, name: e.target.value }))}
              className="font-semibold border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Nome do fluxo"
            />
            <Input
              value={currentFluxo.description}
              onChange={(e) => setCurrentFluxo(prev => ({ ...prev, description: e.target.value }))}
              className="text-sm text-muted-foreground border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Descrição do fluxo"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Testar
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className={`transition-all duration-300 ${showPreview ? 'w-2/3' : 'w-full'}`}>
          <FlowCanvas
            nodes={currentFluxo.nodes}
            edges={currentFluxo.edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
          />
        </div>
        
        {showPreview && (
          <div className="w-1/3 border-l bg-muted/30">
            <FlowPreview 
              nodes={currentFluxo.nodes}
              edges={currentFluxo.edges}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FluxoEditor;
