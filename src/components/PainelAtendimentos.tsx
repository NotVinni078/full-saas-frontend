import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, X, Search, Users, Clock, MessageSquare } from 'lucide-react';

interface Atendimento {
  id: string;
  cliente: string;
  canal: string;
  assunto: string;
  tempo: string;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'em-atendimento';
}

interface Usuario {
  id: string;
  nome: string;
  avatar?: string;
  departamento: string;
  status: 'online' | 'offline' | 'away';
  atendimentos: Atendimento[];
}

const PainelAtendimentos = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const usuarios: Usuario[] = [
    {
      id: '1',
      nome: 'João Silva',
      departamento: 'Suporte Técnico',
      status: 'online',
      atendimentos: [
        {
          id: '1',
          cliente: 'Maria Santos',
          canal: 'WhatsApp',
          assunto: 'Problema no sistema',
          tempo: '15 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '2',
          cliente: 'Pedro Costa',
          canal: 'Email',
          assunto: 'Dúvida sobre produto',
          tempo: '8 min',
          prioridade: 'media',
          status: 'em-atendimento'
        },
        {
          id: '3',
          cliente: 'Carlos Silva',
          canal: 'Chat',
          assunto: 'Instalação do software',
          tempo: '25 min',
          prioridade: 'baixa',
          status: 'em-atendimento'
        }
      ]
    },
    {
      id: '2',
      nome: 'Ana Oliveira',
      departamento: 'Vendas',
      status: 'online',
      atendimentos: [
        {
          id: '3',
          cliente: 'Carlos Lima',
          canal: 'Chat',
          assunto: 'Cotação de serviços',
          tempo: '22 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '4',
          cliente: 'Luciana Ferreira',
          canal: 'WhatsApp',
          assunto: 'Informações sobre planos',
          tempo: '5 min',
          prioridade: 'baixa',
          status: 'em-atendimento'
        },
        {
          id: '5',
          cliente: 'Roberto Alves',
          canal: 'Telefone',
          assunto: 'Renovação de contrato',
          tempo: '12 min',
          prioridade: 'media',
          status: 'em-atendimento'
        }
      ]
    },
    {
      id: '3',
      nome: 'Gabriel Pereira',
      departamento: 'Suporte Técnico',
      status: 'away',
      atendimentos: [
        {
          id: '6',
          cliente: 'Fernanda Souza',
          canal: 'Email',
          assunto: 'Bug no aplicativo',
          tempo: '31 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '7',
          cliente: 'Rafael Santos',
          canal: 'WhatsApp',
          assunto: 'Erro na sincronização',
          tempo: '18 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '8',
          cliente: 'Amanda Costa',
          canal: 'Chat',
          assunto: 'Problema de performance',
          tempo: '42 min',
          prioridade: 'media',
          status: 'em-atendimento'
        }
      ]
    },
    {
      id: '4',
      nome: 'Julia Mendes',
      departamento: 'Atendimento',
      status: 'online',
      atendimentos: [
        {
          id: '9',
          cliente: 'Rafael Torres',
          canal: 'Chat',
          assunto: 'Cancelamento de serviço',
          tempo: '18 min',
          prioridade: 'media',
          status: 'em-atendimento'
        },
        {
          id: '10',
          cliente: 'Camila Rocha',
          canal: 'WhatsApp',
          assunto: 'Alteração de dados',
          tempo: '3 min',
          prioridade: 'baixa',
          status: 'em-atendimento'
        },
        {
          id: '11',
          cliente: 'Bruno Silva',
          canal: 'Telefone',
          assunto: 'Dúvida sobre fatura',
          tempo: '14 min',
          prioridade: 'baixa',
          status: 'em-atendimento'
        }
      ]
    },
    {
      id: '5',
      nome: 'Ricardo Mendes',
      departamento: 'Vendas',
      status: 'online',
      atendimentos: [
        {
          id: '12',
          cliente: 'Patricia Lima',
          canal: 'Email',
          assunto: 'Proposta comercial',
          tempo: '28 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '13',
          cliente: 'Diego Santos',
          canal: 'WhatsApp',
          assunto: 'Negociação de preços',
          tempo: '16 min',
          prioridade: 'media',
          status: 'em-atendimento'
        },
        {
          id: '14',
          cliente: 'Larissa Costa',
          canal: 'Chat',
          assunto: 'Demonstração do produto',
          tempo: '35 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        }
      ]
    },
    {
      id: '6',
      nome: 'Beatriz Silva',
      departamento: 'Suporte Técnico',
      status: 'offline',
      atendimentos: [
        {
          id: '15',
          cliente: 'André Barbosa',
          canal: 'Email',
          assunto: 'Integração com API',
          tempo: '45 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '16',
          cliente: 'Marcos Oliveira',
          canal: 'Chat',
          assunto: 'Configuração de servidor',
          tempo: '52 min',
          prioridade: 'alta',
          status: 'em-atendimento'
        },
        {
          id: '17',
          cliente: 'Juliana Rocha',
          canal: 'WhatsApp',
          assunto: 'Backup de dados',
          tempo: '29 min',
          prioridade: 'media',
          status: 'em-atendimento'
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Ausente';
      case 'offline': return 'Offline';
      default: return 'Offline';
    }
  };

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case 'alta': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'media': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'baixa': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'WhatsApp': return '📱';
      case 'Email': return '📧';
      case 'Chat': return '💬';
      case 'Telefone': return '📞';
      default: return '💬';
    }
  };

  const handleTransferirAtendimento = (usuarioId: string, atendimentoId: string) => {
    console.log(`Transferindo atendimento ${atendimentoId} do usuário ${usuarioId}`);
  };

  const handleTransferirTodos = (usuarioId: string) => {
    console.log(`Transferindo todos os atendimentos do usuário ${usuarioId}`);
  };

  const handleFecharTodos = (usuarioId: string) => {
    console.log(`Fechando todos os atendimentos do usuário ${usuarioId}`);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.departamento.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAtendimentos = usuarios.reduce((total, usuario) => total + usuario.atendimentos.length, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Painel de Atendimentos</h1>
          <p className="text-muted-foreground">Monitore todos os atendimentos em andamento</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por usuário ou departamento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsuarios.map((usuario) => (
          <Card key={usuario.id} className="flex flex-col h-[500px]">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={usuario.avatar} />
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {usuario.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${getStatusColor(usuario.status)}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{usuario.nome}</CardTitle>
                  <p className="text-xs text-muted-foreground">{usuario.departamento}</p>
                  <p className="text-xs text-muted-foreground">{getStatusText(usuario.status)}</p>
                </div>
              </div>
              
              {/* Contador de atendimentos */}
              <div className="flex items-center justify-between pt-2">
                <Badge variant="secondary" className="text-xs">
                  {usuario.atendimentos.length} em atendimento
                </Badge>
                {usuario.atendimentos.length > 0 && (
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTransferirTodos(usuario.id)}
                      className="h-7 px-2 text-xs"
                    >
                      <ArrowRightLeft className="h-3 w-3 mr-1" />
                      Transferir Todos
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 flex flex-col">
              {usuario.atendimentos.length > 0 ? (
                <div className="space-y-3 flex-1 flex flex-col">
                  <ScrollArea className="flex-1">
                    <div className="space-y-3 pr-4">
                      {usuario.atendimentos.map((atendimento) => (
                        <div
                          key={atendimento.id}
                          className="p-3 rounded-lg bg-muted/50 border border-border/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{atendimento.cliente}</h4>
                              <p className="text-xs text-muted-foreground truncate">{atendimento.assunto}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleTransferirAtendimento(usuario.id, atendimento.id)}
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <ArrowRightLeft className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs">{getCanalIcon(atendimento.canal)}</span>
                              <span className="text-xs text-muted-foreground">{atendimento.canal}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getPrioridadeColor(atendimento.prioridade)}`}
                              >
                                {atendimento.prioridade}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{atendimento.tempo}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {/* Botão Fechar Todos */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleFecharTodos(usuario.id)}
                    className="w-full mt-3"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Fechar Todos os Atendimentos
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 flex-1 flex items-center justify-center">
                  <div>
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhum atendimento ativo</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredUsuarios.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum usuário encontrado para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default PainelAtendimentos;
