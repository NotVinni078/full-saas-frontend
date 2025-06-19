
// Tipos TypeScript para o sistema de Campanhas
// Define todas as interfaces e enums utilizados na funcionalidade

/**
 * Status possíveis de uma campanha
 * Representa o ciclo de vida completo de uma campanha de marketing
 */
export enum StatusCampanha {
  RASCUNHO = 'rascunho',
  PENDENTE = 'pendente',
  AGENDADA = 'agendada',
  EXECUTANDO = 'executando',
  PAUSADA = 'pausada',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
  ERRO = 'erro'
}

/**
 * Tipos de canais de comunicação disponíveis
 * Baseado nas conexões configuradas em /conexoes
 */
export enum TipoCanal {
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  SMS = 'sms',
  EMAIL = 'email',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook'
}

/**
 * Status individual de envio para cada contato
 */
export enum StatusEnvio {
  AGUARDANDO = 'aguardando',
  ENVIADO = 'enviado',
  ENTREGUE = 'entregue',
  LIDO = 'lido',
  RESPONDIDO = 'respondido',
  ERRO = 'erro',
  FALHADO = 'falhado'
}

/**
 * Interface para anexos de mídia na campanha
 */
export interface AnexoCampanha {
  id: string;
  nome: string;
  tipo: 'imagem' | 'video' | 'documento' | 'audio';
  url: string;
  tamanho: number; // em bytes
  mimeType: string;
}

/**
 * Interface para contatos da campanha
 */
export interface ContatoCampanha {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  variaveisPersonalizadas: Record<string, string>; // Para personalização da mensagem
  status: StatusEnvio;
  tentativas: number;
  ultimaTentativa?: Date;
  erroMensagem?: string;
  dataEnvio?: Date;
  dataEntrega?: Date;
  dataLeitura?: Date;
  dataResposta?: Date;
}

/**
 * Interface para configurações de tempo/intervalo entre disparos
 */
export interface ConfiguracaoTempo {
  mensagensPorIntervalo: number; // Quantas mensagens por intervalo
  intervaloMinutos: number; // Intervalo em minutos
  limiteTentativas: number; // Limite de tentativas em caso de falha
  intervaloEntreTentativas: number; // Minutos entre tentativas
}

/**
 * Interface para agendamento de campanha
 */
export interface AgendamentoCampanha {
  dataInicio: Date;
  dataFim?: Date;
  recorrente: boolean;
  configuracaoRecorrencia?: {
    tipo: 'diario' | 'semanal' | 'mensal';
    intervalo: number; // A cada X dias/semanas/meses
    diasSemana?: number[]; // Para recorrência semanal (0=domingo, 1=segunda, etc)
    diaMes?: number; // Para recorrência mensal
  };
}

/**
 * Interface principal para uma campanha
 */
export interface Campanha {
  id: string;
  nome: string;
  descricao?: string;
  conexaoId: string; // ID da conexão utilizada
  conexaoNome: string; // Nome da conexão para exibição
  canal: TipoCanal;
  status: StatusCampanha;
  
  // Conteúdo da mensagem
  mensagem: string;
  anexos: AnexoCampanha[];
  
  // Configurações
  configuracaoTempo: ConfiguracaoTempo;
  agendamento?: AgendamentoCampanha;
  
  // Contatos e resultados
  contatos: ContatoCampanha[];
  totalContatos: number;
  contatosEnviados: number;
  contatosEntregues: number;
  contatosLidos: number;
  contatosRespondidos: number;
  contatosErro: number;
  
  // Metadados
  responsavelId: string;
  responsavelNome: string;
  dataCriacao: Date;
  dataUltimaEdicao: Date;
  dataInicio?: Date;
  dataFim?: Date;
  
  // Estatísticas calculadas
  taxaSucesso: number; // Percentual de sucessos
  progressoExecucao: number; // Percentual de execução (0-100)
  
  // Flags de controle
  isDraft: boolean; // Se é rascunho
  podeSerEditada: boolean;
  podeSerPausada: boolean;
  podeSerCancelada: boolean;
  podeSerClonada: boolean;
}

/**
 * Interface para filtros da listagem de campanhas
 */
export interface FiltrosCampanhas {
  busca?: string;
  status?: StatusCampanha[];
  canais?: TipoCanal[];
  responsaveis?: string[];
  dataInicio?: Date;
  dataFim?: Date;
  conexoes?: string[];
}

/**
 * Interface para estatísticas gerais das campanhas
 */
export interface EstatisticasCampanhas {
  totalCampanhas: number;
  campanhasAtivas: number;
  campanhasFinalizadas: number;
  campanhasComErro: number;
  totalMensagensEnviadas: number;
  taxaSuccessGeral: number;
}

/**
 * Interface para logs de execução da campanha
 */
export interface LogCampanha {
  id: string;
  campanhaId: string;
  timestamp: Date;
  tipo: 'info' | 'warning' | 'error' | 'success';
  titulo: string;
  descricao: string;
  contatoId?: string;
  contatoNome?: string;
  detalhes?: Record<string, any>;
}

/**
 * Interface para dados de criação/edição de campanha
 */
export interface CampanhaFormData {
  nome: string;
  descricao?: string;
  conexaoId: string;
  mensagem: string;
  anexos: File[];
  contatos: File | null; // Arquivo JSON com contatos
  configuracaoTempo: ConfiguracaoTempo;
  agendamento?: AgendamentoCampanha;
  salvarRascunho: boolean;
}

/**
 * Interface para resposta da API ao criar/editar campanha
 */
export interface CampanhaResponse {
  success: boolean;
  data?: Campanha;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Interface para conexões disponíveis (vindas da página /conexoes)
 */
export interface ConexaoDisponivel {
  id: string;
  nome: string;
  canal: TipoCanal;
  status: 'ativa' | 'inativa' | 'erro';
  configuracao: Record<string, any>;
}
