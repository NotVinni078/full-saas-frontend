
import React, { useState } from 'react';
import { Plus, MoreHorizontal, Play, Pause, Copy, Trash2, Eye, Edit, TrendingUp, Users, Send, Clock } from 'lucide-react';
import SidebarLayout from '@/components/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { FiltrosCampanhasComponent } from '@/components/campanhas/FiltrosCampanhas';
import { useCampanhas } from '@/hooks/useCampanhas';
import { StatusCampanha, TipoCanal, Campanha } from '@/types/campanhas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Página principal de Campanhas
 * Gerencia criação, listagem, edição e exclusão de campanhas de marketing
 */
const Campanhas = () => {
  // Hook principal para gerenciamento das campanhas
  const {
    campanhas,
    estatisticas,
    conexoesDisponiveis,
    filtros,
    isLoading,
    aplicarFiltros,
    limparFiltros,
    pausarCampanha,
    cancelarCampanha,
    excluirCampanha,
    clonarCampanha,
    carregarDetalhesCampanha
  } = useCampanhas();

  // Estados para controle de modais e ações
  const [campanhaParaExcluir, setCampanhaParaExcluir] = useState<Campanha | null>(null);
  const [campanhaParaCancelar, setCampanhaParaCancelar] = useState<Campanha | null>(null);
  const [mostrarModalCriacao, setMostrarModalCriacao] = useState(false);
  const [mostrarModalDetalhes, setMostrarModalDetalhes] = useState(false);

  /**
   * Lista mock de responsáveis para filtros
   * TODO: Buscar da API de usuários
   */
  const responsaveisDisponiveis = [
    {id: 'user-001', nome: 'João Silva'},
    {id: 'user-002', nome: 'Maria Santos'},
    {id: 'user-003', nome: 'Pedro Costa'}
  ];

  /**
   * Retorna a classe CSS apropriada para o badge de status
   */
  const getStatusBadgeClass = (status: StatusCampanha): string => {
    switch (status) {
      case StatusCampanha.RASCUNHO:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case StatusCampanha.PENDENTE:
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case StatusCampanha.AGENDADA:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case StatusCampanha.EXECUTANDO:
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case StatusCampanha.PAUSADA:
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case StatusCampanha.FINALIZADA:
        return 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200';
      case StatusCampanha.CANCELADA:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case StatusCampanha.ERRO:
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Retorna o texto do status em português
   */
  const getStatusText = (status: StatusCampanha): string => {
    switch (status) {
      case StatusCampanha.RASCUNHO:
        return 'Rascunho';
      case StatusCampanha.PENDENTE:
        return 'Pendente';
      case StatusCampanha.AGENDADA:
        return 'Agendada';
      case StatusCampanha.EXECUTANDO:
        return 'Executando';
      case StatusCampanha.PAUSADA:
        return 'Pausada';
      case StatusCampanha.FINALIZADA:
        return 'Finalizada';
      case StatusCampanha.CANCELADA:
        return 'Cancelada';
      case StatusCampanha.ERRO:
        return 'Erro';
      default:
        return status;
    }
  };

  /**
   * Retorna o ícone apropriado para o tipo de canal
   */
  const getCanalIcon = (canal: TipoCanal): string => {
    switch (canal) {
      case TipoCanal.WHATSAPP:
        return '💬';
      case TipoCanal.EMAIL:
        return '📧';
      case TipoCanal.SMS:
        return '📱';
      case TipoCanal.TELEGRAM:
        return '✈️';
      case TipoCanal.INSTAGRAM:
        return '📷';
      case TipoCanal.FACEBOOK:
        return '📘';
      default:
        return '📨';
    }
  };

  /**
   * Confirma e executa a exclusão de uma campanha
   */
  const confirmarExclusao = async () => {
    if (campanhaParaExcluir) {
      await excluirCampanha(campanhaParaExcluir.id);
      setCampanhaParaExcluir(null);
    }
  };

  /**
   * Confirma e executa o cancelamento de uma campanha
   */
  const confirmarCancelamento = async () => {
    if (campanhaParaCancelar) {
      await cancelarCampanha(campanhaParaCancelar.id);
      setCampanhaParaCancelar(null);
    }
  };

  /**
   * Abre o modal de detalhes de uma campanha
   */
  const abrirDetalhes = (campanha: Campanha) => {
    carregarDetalhesCampanha(campanha.id);
    setMostrarModalDetalhes(true);
  };

  return (
    <SidebarLayout>
      <div className="p-6 bg-background min-h-full space-y-6">
        {/* Header da página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Campanhas</h1>
            <p className="text-muted-foreground mt-1">
              Criação e gerenciamento de campanhas de marketing multicanal
            </p>
          </div>
          
          {/* Botão de nova campanha */}
          <Button 
            onClick={() => setMostrarModalCriacao(true)}
            className="flex items-center gap-2"
            size="lg"
          >
            <Plus className="w-5 h-5" />
            Nova Campanha
          </Button>
        </div>

        {/* Cards de estatísticas */}
        {estatisticas && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total de campanhas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Campanhas
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {estatisticas.totalCampanhas}
                </div>
                <p className="text-xs text-muted-foreground">
                  Todas as campanhas criadas
                </p>
              </CardContent>
            </Card>

            {/* Campanhas ativas */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Campanhas Ativas
                </CardTitle>
                <Play className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {estatisticas.campanhasAtivas}
                </div>
                <p className="text-xs text-muted-foreground">
                  Em execução ou agendadas
                </p>
              </CardContent>
            </Card>

            {/* Total de mensagens */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Mensagens Enviadas
                </CardTitle>
                <Send className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {estatisticas.totalMensagensEnviadas.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total de mensagens disparadas
                </p>
              </CardContent>
            </Card>

            {/* Taxa de sucesso */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Sucesso
                </CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {estatisticas.taxaSuccessGeral.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Média geral de entregas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Componente de filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Campanhas</CardTitle>
            <CardDescription>
              Use os filtros abaixo para encontrar campanhas específicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FiltrosCampanhasComponent
              filtros={filtros}
              onFiltrosChange={aplicarFiltros}
              onLimparFiltros={limparFiltros}
              conexoesDisponiveis={conexoesDisponiveis}
              responsaveis={responsaveisDisponiveis}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        {/* Tabela de campanhas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Campanhas</CardTitle>
                <CardDescription>
                  {campanhas.length} campanha{campanhas.length !== 1 ? 's' : ''} encontrada{campanhas.length !== 1 ? 's' : ''}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              /* Loading state */
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Carregando campanhas...</div>
              </div>
            ) : campanhas.length === 0 ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhuma campanha encontrada
                </h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-4">
                  Não foram encontradas campanhas com os filtros aplicados. 
                  Experimente ajustar os filtros ou criar uma nova campanha.
                </p>
                <Button onClick={() => setMostrarModalCriacao(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Campanha
                </Button>
              </div>
            ) : (
              /* Tabela de campanhas */
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Campanha</TableHead>
                      <TableHead>Canal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progresso</TableHead>
                      <TableHead>Contatos</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Data de Criação</TableHead>
                      <TableHead>Taxa de Sucesso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campanhas.map((campanha) => (
                      <TableRow key={campanha.id} className="hover:bg-muted/50">
                        {/* Nome da campanha */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-foreground">
                              {campanha.nome}
                            </div>
                            {campanha.descricao && (
                              <div className="text-xs text-muted-foreground">
                                {campanha.descricao}
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground">
                              via {campanha.conexaoNome}
                            </div>
                          </div>
                        </TableCell>

                        {/* Canal */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {getCanalIcon(campanha.canal)}
                            </span>
                            <span className="text-sm font-medium">
                              {campanha.canal.toUpperCase()}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Badge className={getStatusBadgeClass(campanha.status)}>
                            {getStatusText(campanha.status)}
                          </Badge>
                        </TableCell>

                        {/* Progresso */}
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{campanha.progressoExecucao}%</span>
                              <span className="text-muted-foreground">
                                {campanha.contatosEnviados}/{campanha.totalContatos}
                              </span>
                            </div>
                            <Progress 
                              value={campanha.progressoExecucao} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>

                        {/* Contatos */}
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">
                              {campanha.totalContatos.toLocaleString('pt-BR')}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {campanha.contatosEnviados > 0 && 
                                `${campanha.contatosEnviados} enviados`
                              }
                            </div>
                          </div>
                        </TableCell>

                        {/* Responsável */}
                        <TableCell>
                          <div className="text-sm">
                            {campanha.responsavelNome}
                          </div>
                        </TableCell>

                        {/* Data de criação */}
                        <TableCell>
                          <div className="text-sm">
                            {format(campanha.dataCriacao, 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(campanha.dataCriacao, 'HH:mm', { locale: ptBR })}
                          </div>
                        </TableCell>

                        {/* Taxa de sucesso */}
                        <TableCell>
                          <div className="text-sm font-medium">
                            {campanha.taxaSucesso.toFixed(1)}%
                          </div>
                        </TableCell>

                        {/* Ações */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              {/* Ver detalhes */}
                              <DropdownMenuItem onClick={() => abrirDetalhes(campanha)}>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                              </DropdownMenuItem>

                              {/* Editar (se permitido) */}
                              {campanha.podeSerEditada && (
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                              )}

                              {/* Pausar (se permitido) */}
                              {campanha.podeSerPausada && (
                                <DropdownMenuItem 
                                  onClick={() => pausarCampanha(campanha.id)}
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pausar
                                </DropdownMenuItem>
                              )}

                              {/* Clonar */}
                              {campanha.podeSerClonada && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => clonarCampanha(campanha.id)}
                                  >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Clonar
                                  </DropdownMenuItem>
                                </>
                              )}

                              {/* Cancelar/Excluir */}
                              <DropdownMenuSeparator />
                              {campanha.podeSerCancelada && campanha.status === StatusCampanha.EXECUTANDO && (
                                <DropdownMenuItem 
                                  onClick={() => setCampanhaParaCancelar(campanha)}
                                  className="text-orange-600"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  Cancelar
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem 
                                onClick={() => setCampanhaParaExcluir(campanha)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal de confirmação para exclusão */}
        <AlertDialog 
          open={!!campanhaParaExcluir} 
          onOpenChange={() => setCampanhaParaExcluir(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a campanha "{campanhaParaExcluir?.nome}"? 
                Esta ação não pode ser desfeita e todos os dados da campanha serão perdidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCampanhaParaExcluir(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmarExclusao}
                className="bg-red-600 hover:bg-red-700"
              >
                Excluir Campanha
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Modal de confirmação para cancelamento */}
        <AlertDialog 
          open={!!campanhaParaCancelar} 
          onOpenChange={() => setCampanhaParaCancelar(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja cancelar a campanha "{campanhaParaCancelar?.nome}"? 
                A campanha será interrompida e não poderá ser retomada.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCampanhaParaCancelar(null)}>
                Não Cancelar
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmarCancelamento}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Cancelar Campanha
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* TODO: Implementar modais de criação e detalhes */}
        {/* Modal de criação será implementado no próximo arquivo */}
        {/* Modal de detalhes será implementado no próximo arquivo */}
      </div>
    </SidebarLayout>
  );
};

export default Campanhas;
