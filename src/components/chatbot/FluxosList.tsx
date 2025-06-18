
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import { Fluxo } from '@/pages/ChatBot';

interface FluxosListProps {
  fluxos: Fluxo[];
  onCreateFluxo: () => void;
  onEditFluxo: (fluxo: Fluxo) => void;
  onDeleteFluxo: (id: string) => void;
}

const FluxosList = ({ fluxos, onCreateFluxo, onEditFluxo, onDeleteFluxo }: FluxosListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFluxos = fluxos.filter(fluxo => 
    fluxo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fluxo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">ChatBot - Fluxos de Conversa</h1>
        <p className="text-muted-foreground">Gerencie os fluxos automatizados de conversa do seu chatbot</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Pesquisar fluxos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={onCreateFluxo} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Criar Fluxo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFluxos.map((fluxo) => (
          <Card key={fluxo.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{fluxo.name}</CardTitle>
                  <CardDescription className="mt-1">{fluxo.description}</CardDescription>
                </div>
                <Badge variant={fluxo.isActive ? "default" : "secondary"}>
                  {fluxo.isActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{fluxo.nodes.length} nós</span>
                <span>Atualizado em {fluxo.updatedAt.toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditFluxo(fluxo)}
                  className="flex items-center gap-1 flex-1"
                >
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  {fluxo.isActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteFluxo(fluxo.id)}
                  className="flex items-center gap-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFluxos.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchTerm ? 'Nenhum fluxo encontrado com os termos pesquisados' : 'Nenhum fluxo criado ainda'}
          </div>
          {!searchTerm && (
            <Button onClick={onCreateFluxo} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Fluxo
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FluxosList;
