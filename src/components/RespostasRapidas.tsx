
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, MessageSquare, Hash, Eye, EyeOff } from "lucide-react";

interface RespostaRapida {
  id: string;
  titulo: string;
  atalho: string;
  conteudo: string;
  criadoPor: string;
  visivelParaTodos: boolean;
  dataCriacao: Date;
}

const RespostasRapidas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState<'minhas' | 'todas'>('minhas');
  const [searchTerm, setSearchTerm] = useState('');
  const [novaResposta, setNovaResposta] = useState({
    titulo: '',
    atalho: '',
    conteudo: '',
    visivelParaTodos: false
  });

  // Mock data - respostas de exemplo
  const respostasRapidas: RespostaRapida[] = [
    {
      id: '1',
      titulo: 'Saudação Inicial',
      atalho: '/oi',
      conteudo: 'Olá! Seja bem-vindo(a) ao nosso atendimento. Como posso ajudá-lo(a) hoje?',
      criadoPor: 'Ana Silva',
      visivelParaTodos: true,
      dataCriacao: new Date('2024-06-15')
    },
    {
      id: '2',
      titulo: 'Solicitação de Dados',
      atalho: '/dados',
      conteudo: 'Para prosseguir com seu atendimento, preciso de algumas informações. Poderia me informar seu nome completo e CPF?',
      criadoPor: 'João Santos',
      visivelParaTodos: false,
      dataCriacao: new Date('2024-06-14')
    },
    {
      id: '3',
      titulo: 'Agradecimento',
      atalho: '/obrigado',
      conteudo: 'Muito obrigado(a) pelo contato! Caso tenha outras dúvidas, não hesite em nos procurar.',
      criadoPor: 'Ana Silva',
      visivelParaTodos: true,
      dataCriacao: new Date('2024-06-13')
    },
    {
      id: '4',
      titulo: 'Transferência para Supervisor',
      atalho: '/supervisor',
      conteudo: 'Vou transferir você para meu supervisor que poderá resolver melhor essa questão. Aguarde um momento, por favor.',
      criadoPor: 'Maria Costa',
      visivelParaTodos: false,
      dataCriacao: new Date('2024-06-12')
    },
    {
      id: '5',
      titulo: 'Horário de Funcionamento',
      atalho: '/horario',
      conteudo: 'Nosso horário de atendimento é de segunda a sexta-feira, das 8h às 18h. Sábados das 8h às 12h.',
      criadoPor: 'Ana Silva',
      visivelParaTodos: true,
      dataCriacao: new Date('2024-06-11')
    }
  ];

  const usuarioAtual = 'João Santos'; // Mock do usuário logado

  const filtrarRespostas = () => {
    let respostasFiltradas = respostasRapidas;

    if (filtroAtivo === 'minhas') {
      respostasFiltradas = respostasFiltradas.filter(resposta => resposta.criadoPor === usuarioAtual);
    }

    if (searchTerm) {
      respostasFiltradas = respostasFiltradas.filter(resposta =>
        resposta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resposta.atalho.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resposta.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return respostasFiltradas;
  };

  const contarRespostas = () => {
    return {
      minhas: respostasRapidas.filter(r => r.criadoPor === usuarioAtual).length,
      todas: respostasRapidas.length
    };
  };

  const handleCriarResposta = () => {
    console.log('Nova resposta rápida:', novaResposta);
    setIsDialogOpen(false);
    setNovaResposta({ titulo: '', atalho: '', conteudo: '', visivelParaTodos: false });
  };

  const handleEditarResposta = (respostaId: string) => {
    console.log('Editar resposta:', respostaId);
  };

  const handleExcluirResposta = (respostaId: string) => {
    console.log('Excluir resposta:', respostaId);
  };

  const contadores = contarRespostas();

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Respostas Rápidas</h1>
          <p className="text-gray-400 mt-1 text-sm lg:text-base">Gerencie mensagens pré-definidas para atendimento</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Criar Resposta Rápida
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] mx-4 bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Criar Nova Resposta Rápida</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="titulo" className="text-gray-300">Título da Resposta Rápida</Label>
                <Input
                  id="titulo"
                  value={novaResposta.titulo}
                  onChange={(e) => setNovaResposta({...novaResposta, titulo: e.target.value})}
                  placeholder="Digite o título da resposta"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="atalho" className="text-gray-300">Atalho da Resposta Rápida</Label>
                <Input
                  id="atalho"
                  value={novaResposta.atalho}
                  onChange={(e) => setNovaResposta({...novaResposta, atalho: e.target.value})}
                  placeholder="/atalho"
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="conteudo" className="text-gray-300">Conteúdo da Resposta Rápida</Label>
                <Textarea
                  id="conteudo"
                  value={novaResposta.conteudo}
                  onChange={(e) => setNovaResposta({...novaResposta, conteudo: e.target.value})}
                  placeholder="Digite o conteúdo da mensagem"
                  rows={4}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="flex items-center justify-center space-x-4 py-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto border-gray-600 text-gray-300 hover:bg-gray-700">
                  Descartar
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="visibility"
                    checked={novaResposta.visivelParaTodos}
                    onCheckedChange={(checked) => setNovaResposta({...novaResposta, visivelParaTodos: checked})}
                  />
                  <Label htmlFor="visibility" className="text-gray-300 text-sm">
                    Visível para todos
                  </Label>
                </div>
                
                <Button onClick={handleCriarResposta} className="bg-black hover:bg-gray-800 text-white w-full sm:w-auto">
                  Salvar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Barra de pesquisa */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Buscar respostas rápidas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filtroAtivo === 'minhas' ? 'default' : 'outline'}
          onClick={() => setFiltroAtivo('minhas')}
          className={`text-xs sm:text-sm ${
            filtroAtivo === 'minhas' 
              ? 'bg-black hover:bg-gray-800 text-white' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-800'
          }`}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Minhas Respostas Rápidas ({contadores.minhas})
        </Button>
        <Button
          variant={filtroAtivo === 'todas' ? 'default' : 'outline'}
          onClick={() => setFiltroAtivo('todas')}
          className={`text-xs sm:text-sm ${
            filtroAtivo === 'todas' 
              ? 'bg-black hover:bg-gray-800 text-white' 
              : 'border-gray-600 text-gray-300 hover:bg-gray-800'
          }`}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Todas as Respostas Rápidas ({contadores.todas})
        </Button>
      </div>

      {/* Lista de Respostas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtrarRespostas().map((resposta) => (
          <Card key={resposta.id} className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <CardTitle className="text-white text-lg break-words">{resposta.titulo}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-gray-700 text-gray-300 border-gray-600">
                      <Hash className="h-3 w-3 mr-1" />
                      {resposta.atalho}
                    </Badge>
                    <Badge className={`${resposta.visivelParaTodos ? 'bg-green-900 text-green-300' : 'bg-orange-900 text-orange-300'}`}>
                      {resposta.visivelParaTodos ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                      {resposta.visivelParaTodos ? 'Público' : 'Privado'}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditarResposta(resposta.id)}
                    className="text-gray-400 hover:text-white hover:bg-gray-700 p-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleExcluirResposta(resposta.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-gray-700 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-300 text-sm leading-relaxed break-words">
                {resposta.conteudo}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500">
                  Criado por: <span className="text-gray-400">{resposta.criadoPor}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtrarRespostas().length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium text-white">Nenhuma resposta rápida encontrada</p>
              <p className="text-sm mt-1 text-gray-400">Tente ajustar os filtros ou criar uma nova resposta rápida</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RespostasRapidas;
