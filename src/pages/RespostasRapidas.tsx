
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit, Trash2, Tag, MessageSquare, Clock } from 'lucide-react';

const RespostasRapidas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const respostas = [
    {
      id: 1,
      titulo: 'Saudação Inicial',
      conteudo: 'Olá! Seja bem-vindo(a) ao nosso atendimento. Como posso ajudá-lo hoje?',
      categoria: 'saudacao',
      tags: ['inicial', 'boas-vindas'],
      usos: 156,
      ultimoUso: '2 horas atrás'
    },
    {
      id: 2,
      titulo: 'Horário de Funcionamento',
      conteudo: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h.',
      categoria: 'informacoes',
      tags: ['horario', 'funcionamento'],
      usos: 89,
      ultimoUso: '1 dia atrás'
    },
    {
      id: 3,
      titulo: 'Despedida',
      conteudo: 'Foi um prazer atendê-lo! Tenha um ótimo dia e não hesite em nos contatar sempre que precisar.',
      categoria: 'despedida',
      tags: ['encerramento', 'obrigado'],
      usos: 203,
      ultimoUso: '30 minutos atrás'
    },
    {
      id: 4,
      titulo: 'Aguardar Informações',
      conteudo: 'Por favor, aguarde um momento enquanto verifico essas informações para você.',
      categoria: 'processo',
      tags: ['aguardar', 'verificar'],
      usos: 45,
      ultimoUso: '3 horas atrás'
    },
    {
      id: 5,
      titulo: 'Transferir Atendimento',
      conteudo: 'Vou transferir você para um especialista que poderá ajudá-lo melhor com essa questão.',
      categoria: 'processo',
      tags: ['transferir', 'especialista'],
      usos: 32,
      ultimoUso: '5 horas atrás'
    }
  ];

  const categorias = [
    { id: 'todas', nome: 'Todas', count: respostas.length },
    { id: 'saudacao', nome: 'Saudação', count: respostas.filter(r => r.categoria === 'saudacao').length },
    { id: 'informacoes', nome: 'Informações', count: respostas.filter(r => r.categoria === 'informacoes').length },
    { id: 'processo', nome: 'Processo', count: respostas.filter(r => r.categoria === 'processo').length },
    { id: 'despedida', nome: 'Despedida', count: respostas.filter(r => r.categoria === 'despedida').length }
  ];

  const filteredRespostas = respostas.filter(resposta => {
    const matchesSearch = resposta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resposta.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resposta.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'todas' || resposta.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Respostas Rápidas</h1>
            <p className="text-muted-foreground">
              Gerencie suas mensagens pré-definidas para agilizar o atendimento
            </p>
          </div>
          
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova Resposta
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barra de Busca */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar respostas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
          </div>

          {/* Categorias */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categorias.map((categoria) => (
              <Button
                key={categoria.id}
                variant={selectedCategory === categoria.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(categoria.id)}
                className="whitespace-nowrap"
              >
                {categoria.nome}
                <Badge variant="secondary" className="ml-2 bg-muted text-muted-foreground">
                  {categoria.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Respostas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRespostas.map((resposta) => (
            <Card key={resposta.id} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground">{resposta.titulo}</CardTitle>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Conteúdo da Resposta */}
                <div className="bg-muted/50 p-3 rounded-lg border border-border">
                  <p className="text-sm text-foreground line-clamp-3">
                    {resposta.conteudo}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {resposta.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs border-border text-foreground"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{resposta.usos}</p>
                      <p className="text-xs text-muted-foreground">Usos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Último uso</p>
                      <p className="text-sm font-medium text-foreground">{resposta.ultimoUso}</p>
                    </div>
                  </div>
                </div>

                {/* Botão de Usar */}
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  Usar Resposta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Estado Vazio */}
        {filteredRespostas.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma resposta encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Tente ajustar os filtros de busca' : 'Comece criando sua primeira resposta rápida'}
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              {searchTerm ? 'Limpar Busca' : 'Nova Resposta'}
            </Button>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default RespostasRapidas;
