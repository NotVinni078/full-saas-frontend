
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Campanha, 
  FiltrosCampanhas, 
  EstatisticasCampanhas, 
  LogCampanha, 
  CampanhaFormData,
  CampanhaResponse,
  ConexaoDisponivel,
  StatusCampanha,
  TipoCanal 
} from '@/types/campanhas';

/**
 * Hook personalizado para gerenciamento completo das campanhas
 * Centraliza toda a lógica de estado e comunicação com a API
 */
export const useCampanhas = () => {
  // Estados principais
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<Campanha | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasCampanhas | null>(null);
  const [conexoesDisponiveis, setConexoesDisponiveis] = useState<ConexaoDisponivel[]>([]);
  const [logs, setLogs] = useState<LogCampanha[]>([]);
  
  // Estados de controle
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosCampanhas>({});
  
  const { toast } = useToast();

  /**
   * Carrega a lista de campanhas com filtros aplicados
   */
  const carregarCampanhas = async (filtrosAplicados?: FiltrosCampanhas) => {
    setIsLoading(true);
    try {
      // TODO: Substituir por chamada real à API
      // const response = await fetch('/api/campanhas', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(filtrosAplicados || filtros)
      // });
      // const data = await response.json();

      // Dados mock para desenvolvimento
      const campanhasMock: Campanha[] = [
        {
          id: '1',
          nome: 'Campanha Black Friday 2024',
          descricao: 'Campanha promocional para Black Friday',
          conexaoId: 'whats-001',
          conexaoNome: 'WhatsApp Business',
          canal: TipoCanal.WHATSAPP,
          status: StatusCampanha.EXECUTANDO,
          mensagem: 'Olá {nome}! Aproveite nossa Black Friday com até 70% de desconto!',
          anexos: [],
          configuracaoTempo: {
            mensagensPorIntervalo: 50,
            intervaloMinutos: 10,
            limiteTentativas: 3,
            intervaloEntreTentativas: 30
          },
          contatos: [],
          totalContatos: 1250,
          contatosEnviados: 800,
          contatosEntregues: 750,
          contatosLidos: 650,
          contatosRespondidos: 45,
          contatosErro: 25,
          responsavelId: 'user-001',
          responsavelNome: 'João Silva',
          dataCriacao: new Date('2024-11-15'),
          dataUltimaEdicao: new Date('2024-11-20'),
          dataInicio: new Date('2024-11-25'),
          taxaSucesso: 94.2,
          progressoExecucao: 64,
          isDraft: false,
          podeSerEditada: false,
          podeSerPausada: true,
          podeSerCancelada: true,
          podeSerClonada: true
        },
        {
          id: '2',
          nome: 'Lançamento Produto Natal',
          conexaoId: 'email-001',
          conexaoNome: 'SMTP Gmail',
          canal: TipoCanal.EMAIL,
          status: StatusCampanha.AGENDADA,
          mensagem: 'Prezado(a) {nome}, conheça nossos produtos especiais para o Natal!',
          anexos: [],
          configuracaoTempo: {
            mensagensPorIntervalo: 100,
            intervaloMinutos: 15,
            limiteTentativas: 2,
            intervaloEntreTentativas: 60
          },
          contatos: [],
          totalContatos: 500,
          contatosEnviados: 0,
          contatosEntregues: 0,
          contatosLidos: 0,
          contatosRespondidos: 0,
          contatosErro: 0,
          responsavelId: 'user-002',
          responsavelNome: 'Maria Santos',
          dataCriacao: new Date('2024-11-18'),
          dataUltimaEdicao: new Date('2024-11-19'),
          agendamento: {
            dataInicio: new Date('2024-12-01'),
            recorrente: false
          },
          taxaSucesso: 0,
          progressoExecucao: 0,
          isDraft: false,
          podeSerEditada: true,
          podeSerPausada: false,
          podeSerCancelada: true,
          podeSerClonada: true
        }
      ];

      setCampanhas(campanhasMock);
      console.log('✅ Campanhas carregadas:', campanhasMock.length);
      
    } catch (error) {
      console.error('❌ Erro ao carregar campanhas:', error);
      toast({
        title: 'Erro ao carregar campanhas',
        description: 'Não foi possível carregar a lista de campanhas.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Carrega estatísticas gerais das campanhas
   */
  const carregarEstatisticas = async () => {
    try {
      // TODO: Substituir por chamada real à API
      const estatisticasMock: EstatisticasCampanhas = {
        totalCampanhas: 25,
        campanhasAtivas: 3,
        campanhasFinalizadas: 18,
        campanhasComErro: 2,
        totalMensagensEnviadas: 45680,
        taxaSuccessGeral: 92.5
      };

      setEstatisticas(estatisticasMock);
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  };

  /**
   * Carrega conexões disponíveis da página /conexoes
   */
  const carregarConexoes = async () => {
    try {
      // TODO: Substituir por chamada real à API das conexões
      const conexoesMock: ConexaoDisponivel[] = [
        {
          id: 'whats-001',
          nome: 'WhatsApp Business',
          canal: TipoCanal.WHATSAPP,
          status: 'ativa',
          configuracao: {}
        },
        {
          id: 'email-001',
          nome: 'SMTP Gmail',
          canal: TipoCanal.EMAIL,
          status: 'ativa',
          configuracao: {}
        },
        {
          id: 'sms-001',
          nome: 'Gateway SMS',
          canal: TipoCanal.SMS,
          status: 'inativa',
          configuracao: {}
        }
      ];

      setConexoesDisponiveis(conexoesMock);
    } catch (error) {
      console.error('❌ Erro ao carregar conexões:', error);
    }
  };

  /**
   * Carrega detalhes completos de uma campanha
   */
  const carregarDetalhesCampanha = async (campanhaId: string) => {
    setIsLoadingDetalhes(true);
    try {
      // TODO: Substituir por chamada real à API
      const campanha = campanhas.find(c => c.id === campanhaId);
      if (campanha) {
        setCampanhaSelecionada(campanha);
        
        // Carregar logs da campanha
        const logsMock: LogCampanha[] = [
          {
            id: '1',
            campanhaId,
            timestamp: new Date(),
            tipo: 'info',
            titulo: 'Campanha iniciada',
            descricao: 'A campanha foi iniciada com sucesso'
          }
        ];
        setLogs(logsMock);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar detalhes:', error);
    } finally {
      setIsLoadingDetalhes(false);
    }
  };

  /**
   * Cria uma nova campanha
   */
  const criarCampanha = async (dados: CampanhaFormData): Promise<CampanhaResponse> => {
    setIsLoading(true);
    try {
      // TODO: Implementar upload de arquivos e chamada à API
      console.log('📤 Criando campanha:', dados);
      
      // Mock da resposta
      const novaCampanha: Campanha = {
        id: Date.now().toString(),
        nome: dados.nome,
        descricao: dados.descricao,
        conexaoId: dados.conexaoId,
        conexaoNome: conexoesDisponiveis.find(c => c.id === dados.conexaoId)?.nome || '',
        canal: conexoesDisponiveis.find(c => c.id === dados.conexaoId)?.canal || TipoCanal.WHATSAPP,
        status: dados.salvarRascunho ? StatusCampanha.RASCUNHO : StatusCampanha.PENDENTE,
        mensagem: dados.mensagem,
        anexos: [], // Processar arquivos enviados
        configuracaoTempo: dados.configuracaoTempo,
        agendamento: dados.agendamento,
        contatos: [],
        totalContatos: 0,
        contatosEnviados: 0,
        contatosEntregues: 0,
        contatosLidos: 0,
        contatosRespondidos: 0,
        contatosErro: 0,
        responsavelId: 'current-user',
        responsavelNome: 'Usuário Atual',
        dataCriacao: new Date(),
        dataUltimaEdicao: new Date(),
        taxaSucesso: 0,
        progressoExecucao: 0,
        isDraft: dados.salvarRascunho,
        podeSerEditada: true,
        podeSerPausada: false,
        podeSerCancelada: true,
        podeSerClonada: true
      };

      setCampanhas(prev => [novaCampanha, ...prev]);
      
      toast({
        title: dados.salvarRascunho ? 'Rascunho salvo' : 'Campanha criada',
        description: `A campanha "${dados.nome}" foi ${dados.salvarRascunho ? 'salva como rascunho' : 'criada'} com sucesso.`
      });

      return {
        success: true,
        data: novaCampanha,
        message: 'Campanha criada com sucesso'
      };
      
    } catch (error) {
      console.error('❌ Erro ao criar campanha:', error);
      toast({
        title: 'Erro ao criar campanha',
        description: 'Não foi possível criar a campanha. Tente novamente.',
        variant: 'destructive'
      });
      
      return {
        success: false,
        message: 'Erro ao criar campanha'
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Pausa uma campanha em execução
   */
  const pausarCampanha = async (campanhaId: string) => {
    try {
      // TODO: Chamar API para pausar
      setCampanhas(prev => prev.map(campanha => 
        campanha.id === campanhaId 
          ? { ...campanha, status: StatusCampanha.PAUSADA }
          : campanha
      ));
      
      toast({
        title: 'Campanha pausada',
        description: 'A campanha foi pausada com sucesso.'
      });
    } catch (error) {
      console.error('❌ Erro ao pausar campanha:', error);
      toast({
        title: 'Erro ao pausar campanha',
        description: 'Não foi possível pausar a campanha.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Cancela uma campanha
   */
  const cancelarCampanha = async (campanhaId: string) => {
    try {
      // TODO: Chamar API para cancelar
      setCampanhas(prev => prev.map(campanha => 
        campanha.id === campanhaId 
          ? { ...campanha, status: StatusCampanha.CANCELADA }
          : campanha
      ));
      
      toast({
        title: 'Campanha cancelada',
        description: 'A campanha foi cancelada com sucesso.'
      });
    } catch (error) {
      console.error('❌ Erro ao cancelar campanha:', error);
      toast({
        title: 'Erro ao cancelar campanha',
        description: 'Não foi possível cancelar a campanha.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Exclui uma campanha
   */
  const excluirCampanha = async (campanhaId: string) => {
    try {
      // TODO: Chamar API para excluir
      setCampanhas(prev => prev.filter(campanha => campanha.id !== campanhaId));
      
      toast({
        title: 'Campanha excluída',
        description: 'A campanha foi excluída com sucesso.'
      });
    } catch (error) {
      console.error('❌ Erro ao excluir campanha:', error);
      toast({
        title: 'Erro ao excluir campanha',
        description: 'Não foi possível excluir a campanha.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Clona uma campanha existente
   */
  const clonarCampanha = async (campanhaId: string) => {
    try {
      const campanhaOriginal = campanhas.find(c => c.id === campanhaId);
      if (!campanhaOriginal) return;

      const campanhaClonada: Campanha = {
        ...campanhaOriginal,
        id: Date.now().toString(),
        nome: `${campanhaOriginal.nome} (Cópia)`,
        status: StatusCampanha.RASCUNHO,
        dataCriacao: new Date(),
        dataUltimaEdicao: new Date(),
        dataInicio: undefined,
        dataFim: undefined,
        contatosEnviados: 0,
        contatosEntregues: 0,
        contatosLidos: 0,
        contatosRespondidos: 0,
        contatosErro: 0,
        taxaSucesso: 0,
        progressoExecucao: 0,
        isDraft: true
      };

      setCampanhas(prev => [campanhaClonada, ...prev]);
      
      toast({
        title: 'Campanha clonada',
        description: 'A campanha foi clonada com sucesso.'
      });
    } catch (error) {
      console.error('❌ Erro ao clonar campanha:', error);
      toast({
        title: 'Erro ao clonar campanha',
        description: 'Não foi possível clonar a campanha.',
        variant: 'destructive'
      });
    }
  };

  /**
   * Aplica filtros na listagem
   */
  const aplicarFiltros = (novosFiltros: FiltrosCampanhas) => {
    setFiltros(novosFiltros);
    carregarCampanhas(novosFiltros);
  };

  /**
   * Limpa todos os filtros
   */
  const limparFiltros = () => {
    setFiltros({});
    carregarCampanhas({});
  };

  // Efeito para carregar dados iniciais
  useEffect(() => {
    carregarCampanhas();
    carregarEstatisticas();
    carregarConexoes();
  }, []);

  // Retorna todas as funções e estados disponíveis
  return {
    // Estados
    campanhas,
    campanhaSelecionada,
    estatisticas,
    conexoesDisponiveis,
    logs,
    filtros,
    isLoading,
    isLoadingDetalhes,
    
    // Ações
    carregarCampanhas,
    carregarDetalhesCampanha,
    criarCampanha,
    pausarCampanha,
    cancelarCampanha,
    excluirCampanha,
    clonarCampanha,
    aplicarFiltros,
    limparFiltros,
    
    // Controles de seleção
    setCampanhaSelecionada,
    setFiltros
  };
};
