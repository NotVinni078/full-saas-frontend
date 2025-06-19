
import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FiltrosCampanhas, StatusCampanha, TipoCanal, ConexaoDisponivel } from '@/types/campanhas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Props para o componente de filtros
 */
interface FiltrosCampanhasProps {
  /** Filtros atuais aplicados */
  filtros: FiltrosCampanhas;
  /** Callback para aplicar novos filtros */
  onFiltrosChange: (filtros: FiltrosCampanhas) => void;
  /** Callback para limpar todos os filtros */
  onLimparFiltros: () => void;
  /** Conexões disponíveis para filtro */
  conexoesDisponiveis: ConexaoDisponivel[];
  /** Lista de responsáveis para filtro */
  responsaveis: Array<{ id: string; nome: string }>;
  /** Indica se está carregando */
  isLoading?: boolean;
}

/**
 * Componente de filtros avançados para campanhas
 * Permite busca, filtros por status, canal, datas, etc.
 */
export const FiltrosCampanhasComponent: React.FC<FiltrosCampanhasProps> = ({
  filtros,
  onFiltrosChange,
  onLimparFiltros,
  conexoesDisponiveis,
  responsaveis,
  isLoading = false
}) => {
  // Estados locais para controle dos filtros
  const [buscaLocal, setBuscaLocal] = useState(filtros.busca || '');
  const [mostrarFiltrosAvancados, setMostrarFiltrosAvancados] = useState(false);

  /**
   * Aplica a busca por texto após um delay (debounce)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltrosChange({
        ...filtros,
        busca: buscaLocal || undefined
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [buscaLocal]);

  /**
   * Opções de status disponíveis com labels em português
   */
  const statusOptions = [
    { value: StatusCampanha.RASCUNHO, label: 'Rascunho', color: 'bg-gray-100 text-gray-800' },
    { value: StatusCampanha.PENDENTE, label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    { value: StatusCampanha.AGENDADA, label: 'Agendada', color: 'bg-blue-100 text-blue-800' },
    { value: StatusCampanha.EXECUTANDO, label: 'Executando', color: 'bg-green-100 text-green-800' },
    { value: StatusCampanha.PAUSADA, label: 'Pausada', color: 'bg-orange-100 text-orange-800' },
    { value: StatusCampanha.FINALIZADA, label: 'Finalizada', color: 'bg-indigo-100 text-indigo-800' },
    { value: StatusCampanha.CANCELADA, label: 'Cancelada', color: 'bg-red-100 text-red-800' },
    { value: StatusCampanha.ERRO, label: 'Erro', color: 'bg-red-100 text-red-800' }
  ];

  /**
   * Opções de canais disponíveis
   */
  const canalOptions = [
    { value: TipoCanal.WHATSAPP, label: 'WhatsApp', icon: '💬' },
    { value: TipoCanal.EMAIL, label: 'Email', icon: '📧' },
    { value: TipoCanal.SMS, label: 'SMS', icon: '📱' },
    { value: TipoCanal.TELEGRAM, label: 'Telegram', icon: '✈️' },
    { value: TipoCanal.INSTAGRAM, label: 'Instagram', icon: '📷' },
    { value: TipoCanal.FACEBOOK, label: 'Facebook', icon: '📘' }
  ];

  /**
   * Alterna a seleção de um status no filtro
   */
  const toggleStatus = (status: StatusCampanha) => {
    const statusAtuais = filtros.status || [];
    const novoStatus = statusAtuais.includes(status)
      ? statusAtuais.filter(s => s !== status)
      : [...statusAtuais, status];
    
    onFiltrosChange({
      ...filtros,
      status: novoStatus.length > 0 ? novoStatus : undefined
    });
  };

  /**
   * Alterna a seleção de um canal no filtro
   */
  const toggleCanal = (canal: TipoCanal) => {
    const canaisAtuais = filtros.canais || [];
    const novosCanais = canaisAtuais.includes(canal)
      ? canaisAtuais.filter(c => c !== canal)
      : [...canaisAtuais, canal];
    
    onFiltrosChange({
      ...filtros,
      canais: novosCanais.length > 0 ? novosCanais : undefined
    });
  };

  /**
   * Alterna a seleção de uma conexão no filtro
   */
  const toggleConexao = (conexaoId: string) => {
    const conexoesAtuais = filtros.conexoes || [];
    const novasConexoes = conexoesAtuais.includes(conexaoId)
      ? conexoesAtuais.filter(c => c !== conexaoId)
      : [...conexoesAtuais, conexaoId];
    
    onFiltrosChange({
      ...filtros,
      conexoes: novasConexoes.length > 0 ? novasConexoes : undefined
    });
  };

  /**
   * Alterna a seleção de um responsável no filtro
   */
  const toggleResponsavel = (responsavelId: string) => {
    const responsaveisAtuais = filtros.responsaveis || [];
    const novosResponsaveis = responsaveisAtuais.includes(responsavelId)
      ? responsaveisAtuais.filter(r => r !== responsavelId)
      : [...responsaveisAtuais, responsavelId];
    
    onFiltrosChange({
      ...filtros,
      responsaveis: novosResponsaveis.length > 0 ? novosResponsaveis : undefined
    });
  };

  /**
   * Define a data de início do filtro
   */
  const setDataInicio = (data: Date | undefined) => {
    onFiltrosChange({
      ...filtros,
      dataInicio: data
    });
  };

  /**
   * Define a data de fim do filtro
   */
  const setDataFim = (data: Date | undefined) => {
    onFiltrosChange({
      ...filtros,
      dataFim: data
    });
  };

  /**
   * Conta o total de filtros ativos
   */
  const contarFiltrosAtivos = (): number => {
    let count = 0;
    if (filtros.busca) count++;
    if (filtros.status?.length) count++;
    if (filtros.canais?.length) count++;
    if (filtros.conexoes?.length) count++;
    if (filtros.responsaveis?.length) count++;
    if (filtros.dataInicio) count++;
    if (filtros.dataFim) count++;
    return count;
  };

  const filtrosAtivos = contarFiltrosAtivos();

  return (
    <div className="space-y-4">
      {/* Linha principal de filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Campo de busca */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar campanhas por nome, responsável ou conexão..."
            value={buscaLocal}
            onChange={(e) => setBuscaLocal(e.target.value)}
            className="pl-10 pr-10"
            disabled={isLoading}
          />
          {buscaLocal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setBuscaLocal('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Botão de filtros avançados */}
        <div className="flex gap-2">
          <Button
            variant={mostrarFiltrosAvancados ? "default" : "outline"}
            onClick={() => setMostrarFiltrosAvancados(!mostrarFiltrosAvancados)}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Filter className="w-4 h-4" />
            Filtros
            {filtrosAtivos > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {filtrosAtivos}
              </Badge>
            )}
          </Button>

          {/* Botão para limpar filtros */}
          {filtrosAtivos > 0 && (
            <Button
              variant="ghost"
              onClick={onLimparFiltros}
              className="text-muted-foreground hover:text-foreground"
              disabled={isLoading}
            >
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Painel de filtros avançados */}
      {mostrarFiltrosAvancados && (
        <div className="bg-card border rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Filtro por Status */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Status
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {statusOptions.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={filtros.status?.includes(status.value) || false}
                      onCheckedChange={() => toggleStatus(status.value)}
                    />
                    <label
                      htmlFor={`status-${status.value}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <Badge className={status.color} variant="secondary">
                        {status.label}
                      </Badge>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro por Canal */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Canais
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {canalOptions.map((canal) => (
                  <div key={canal.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`canal-${canal.value}`}
                      checked={filtros.canais?.includes(canal.value) || false}
                      onCheckedChange={() => toggleCanal(canal.value)}
                    />
                    <label
                      htmlFor={`canal-${canal.value}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <span>{canal.icon}</span>
                      {canal.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro por Conexão */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Conexões
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {conexoesDisponiveis.map((conexao) => (
                  <div key={conexao.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`conexao-${conexao.id}`}
                      checked={filtros.conexoes?.includes(conexao.id) || false}
                      onCheckedChange={() => toggleConexao(conexao.id)}
                    />
                    <label
                      htmlFor={`conexao-${conexao.id}`}
                      className="text-sm cursor-pointer flex items-center gap-2"
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        conexao.status === 'ativa' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {conexao.nome}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros de data e responsáveis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            {/* Filtro por Data de Início */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data de Início
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filtros.dataInicio ? 
                      format(filtros.dataInicio, 'PPP', { locale: ptBR }) : 
                      'Selecionar data'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filtros.dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro por Data de Fim */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data de Fim
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filtros.dataFim ? 
                      format(filtros.dataFim, 'PPP', { locale: ptBR }) : 
                      'Selecionar data'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={filtros.dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro por Responsável */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Responsável
              </label>
              <Select
                value={filtros.responsaveis?.[0] || 'all'}
                onValueChange={(value) => {
                  if (value === 'all') {
                    onFiltrosChange({
                      ...filtros,
                      responsaveis: undefined
                    });
                  } else {
                    onFiltrosChange({
                      ...filtros,
                      responsaveis: [value]
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os responsáveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os responsáveis</SelectItem>
                  {responsaveis.map((responsavel) => (
                    <SelectItem key={responsavel.id} value={responsavel.id}>
                      {responsavel.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Badges de filtros ativos */}
      {filtrosAtivos > 0 && (
        <div className="flex flex-wrap gap-2">
          {filtros.status?.map((status) => {
            const statusOption = statusOptions.find(s => s.value === status);
            return statusOption && (
              <Badge
                key={status}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {statusOption.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus(status)}
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}
          
          {filtros.canais?.map((canal) => {
            const canalOption = canalOptions.find(c => c.value === canal);
            return canalOption && (
              <Badge
                key={canal}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {canalOption.icon} {canalOption.label}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCanal(canal)}
                  className="h-auto p-0 ml-1 hover:bg-transparent"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
};
