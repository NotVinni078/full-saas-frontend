
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Upload, 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  FileText,
  Settings,
  Send
} from 'lucide-react';
import { CampanhaFormData, ConexaoDisponivel, TipoCanal } from '@/types/campanhas';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Schema de validação do formulário
const campanhaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  descricao: z.string().optional(),
  conexaoId: z.string().min(1, 'Conexão é obrigatória'),
  mensagem: z.string().min(1, 'Mensagem é obrigatória').max(4000, 'Mensagem deve ter no máximo 4000 caracteres'),
  configuracaoTempo: z.object({
    mensagensPorIntervalo: z.number().min(1, 'Mínimo 1 mensagem').max(1000, 'Máximo 1000 mensagens'),
    intervaloMinutos: z.number().min(1, 'Mínimo 1 minuto').max(1440, 'Máximo 1440 minutos (24h)'),
    limiteTentativas: z.number().min(1, 'Mínimo 1 tentativa').max(10, 'Máximo 10 tentativas'),
    intervaloEntreTentativas: z.number().min(1, 'Mínimo 1 minuto').max(1440, 'Máximo 1440 minutos')
  }),
  agendamento: z.object({
    dataInicio: z.date().optional(),
    recorrente: z.boolean()
  }).optional(),
  salvarRascunho: z.boolean()
});

type FormData = z.infer<typeof campanhaSchema>;

interface FormularioCampanhaProps {
  onSubmit: (dados: CampanhaFormData) => Promise<void>;
  conexoesDisponiveis: ConexaoDisponivel[];
  isLoading?: boolean;
  onCancel: () => void;
  dadosIniciais?: Partial<CampanhaFormData>;
}

export const FormularioCampanha: React.FC<FormularioCampanhaProps> = ({
  onSubmit,
  conexoesDisponiveis,
  isLoading = false,
  onCancel,
  dadosIniciais
}) => {
  // Estados para arquivos
  const [anexosSelecionados, setAnexosSelecionados] = useState<File[]>([]);
  const [contatosSelecionados, setContatosSelecionados] = useState<File | null>(null);
  const [agendamentoHabilitado, setAgendamentoHabilitado] = useState(false);
  
  const anexosInputRef = useRef<HTMLInputElement>(null);
  const contatosInputRef = useRef<HTMLInputElement>(null);

  // Configuração do formulário
  const form = useForm<FormData>({
    resolver: zodResolver(campanhaSchema),
    defaultValues: {
      nome: dadosIniciais?.nome || '',
      descricao: dadosIniciais?.descricao || '',
      conexaoId: dadosIniciais?.conexaoId || '',
      mensagem: dadosIniciais?.mensagem || '',
      configuracaoTempo: {
        mensagensPorIntervalo: dadosIniciais?.configuracaoTempo?.mensagensPorIntervalo || 50,
        intervaloMinutos: dadosIniciais?.configuracaoTempo?.intervaloMinutos || 10,
        limiteTentativas: dadosIniciais?.configuracaoTempo?.limiteTentativas || 3,
        intervaloEntreTentativas: dadosIniciais?.configuracaoTempo?.intervaloEntreTentativas || 30
      },
      agendamento: {
        dataInicio: dadosIniciais?.agendamento?.dataInicio,
        recorrente: dadosIniciais?.agendamento?.recorrente || false
      },
      salvarRascunho: false
    }
  });

  // Função para obter ícone do canal
  const getCanalIcon = (canal: TipoCanal): string => {
    switch (canal) {
      case TipoCanal.WHATSAPP: return '💬';
      case TipoCanal.EMAIL: return '📧';
      case TipoCanal.SMS: return '📱';
      case TipoCanal.TELEGRAM: return '✈️';
      case TipoCanal.INSTAGRAM: return '📷';
      case TipoCanal.FACEBOOK: return '📘';
      default: return '📨';
    }
  };

  // Handlers para arquivos
  const handleAnexosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAnexosSelecionados(prev => [...prev, ...files]);
  };

  const removeAnexo = (index: number) => {
    setAnexosSelecionados(prev => prev.filter((_, i) => i !== index));
  };

  const handleContatosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setContatosSelecionados(file);
  };

  // Submit do formulário
  const handleSubmit = async (data: FormData, salvarRascunho: boolean = false) => {
    try {
      // Preparar dados do agendamento apenas se habilitado e com data válida
      let agendamentoFinal = undefined;
      if (agendamentoHabilitado && data.agendamento?.dataInicio) {
        agendamentoFinal = {
          dataInicio: data.agendamento.dataInicio,
          recorrente: data.agendamento.recorrente || false
        };
      }

      const dadosCampanha: CampanhaFormData = {
        nome: data.nome,
        descricao: data.descricao,
        conexaoId: data.conexaoId,
        mensagem: data.mensagem,
        configuracaoTempo: {
          mensagensPorIntervalo: data.configuracaoTempo?.mensagensPorIntervalo || 50,
          intervaloMinutos: data.configuracaoTempo?.intervaloMinutos || 10,
          limiteTentativas: data.configuracaoTempo?.limiteTentativas || 3,
          intervaloEntreTentativas: data.configuracaoTempo?.intervaloEntreTentativas || 30
        },
        anexos: anexosSelecionados,
        contatos: contatosSelecionados,
        agendamento: agendamentoFinal,
        salvarRascunho
      };

      await onSubmit(dadosCampanha);
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
    }
  };

  return (
    <form className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Informações Básicas
          </CardTitle>
          <CardDescription>
            Configure o nome, descrição e conexão da campanha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome da campanha */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Campanha *</Label>
            <Input
              id="nome"
              placeholder="Ex: Promoção Black Friday 2024"
              {...form.register('nome')}
              disabled={isLoading}
            />
            {form.formState.errors.nome && (
              <p className="text-sm text-red-600">{form.formState.errors.nome.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva o objetivo desta campanha..."
              rows={3}
              {...form.register('descricao')}
              disabled={isLoading}
            />
          </div>

          {/* Seleção de conexão */}
          <div className="space-y-2">
            <Label>Conexão *</Label>
            <Select
              value={form.watch('conexaoId')}
              onValueChange={(value) => form.setValue('conexaoId', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conexão para envio" />
              </SelectTrigger>
              <SelectContent>
                {conexoesDisponiveis
                  .filter(conexao => conexao.status === 'ativa')
                  .map((conexao) => (
                    <SelectItem key={conexao.id} value={conexao.id}>
                      <div className="flex items-center gap-2">
                        <span>{getCanalIcon(conexao.canal)}</span>
                        <span>{conexao.nome}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {conexao.canal.toUpperCase()}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {form.formState.errors.conexaoId && (
              <p className="text-sm text-red-600">{form.formState.errors.conexaoId.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo da Mensagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Conteúdo da Mensagem
          </CardTitle>
          <CardDescription>
            Configure a mensagem e anexos que serão enviados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="mensagem">Mensagem *</Label>
            <Textarea
              id="mensagem"
              placeholder="Olá {nome}! Temos uma oferta especial para você..."
              rows={6}
              {...form.register('mensagem')}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Use {'{nome}'} para personalizar com o nome do contato. Máximo 4000 caracteres.
            </p>
            {form.formState.errors.mensagem && (
              <p className="text-sm text-red-600">{form.formState.errors.mensagem.message}</p>
            )}
          </div>

          {/* Anexos */}
          <div className="space-y-2">
            <Label>Anexos (Opcional)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => anexosInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Selecionar Arquivos
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Imagens, vídeos, documentos (máx. 10MB por arquivo)
                </p>
              </div>
              <input
                ref={anexosInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleAnexosChange}
                className="hidden"
              />
            </div>
            
            {/* Lista de anexos selecionados */}
            {anexosSelecionados.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos Selecionados:</Label>
                {anexosSelecionados.map((arquivo, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{arquivo.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAnexo(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Lista de Contatos
          </CardTitle>
          <CardDescription>
            Importe um arquivo JSON com os contatos para a campanha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => contatosInputRef.current?.click()}
                  disabled={isLoading}
                >
                  Importar Contatos
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  Arquivo JSON com nome, telefone/email e variáveis personalizadas
                </p>
              </div>
              <input
                ref={contatosInputRef}
                type="file"
                accept=".json"
                onChange={handleContatosChange}
                className="hidden"
              />
            </div>
            
            {contatosSelecionados && (
              <div className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">{contatosSelecionados.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setContatosSelecionados(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Tempo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configurações de Envio
          </CardTitle>
          <CardDescription>
            Configure a velocidade e controle de envio das mensagens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mensagens por Intervalo</Label>
              <Input
                type="number"
                min="1"
                max="1000"
                {...form.register('configuracaoTempo.mensagensPorIntervalo', { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Intervalo (minutos)</Label>
              <Input
                type="number"
                min="1"
                max="1440"
                {...form.register('configuracaoTempo.intervaloMinutos', { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Limite de Tentativas</Label>
              <Input
                type="number"
                min="1"
                max="10"
                {...form.register('configuracaoTempo.limiteTentativas', { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Intervalo entre Tentativas (min)</Label>
              <Input
                type="number"
                min="1"
                max="1440"
                {...form.register('configuracaoTempo.intervaloEntreTentativas', { valueAsNumber: true })}
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Agendamento
          </CardTitle>
          <CardDescription>
            Configure quando a campanha deve ser executada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="agendamento"
              checked={agendamentoHabilitado}
              onCheckedChange={setAgendamentoHabilitado}
              disabled={isLoading}
            />
            <Label htmlFor="agendamento">Agendar execução da campanha</Label>
          </div>

          {agendamentoHabilitado && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Data de Início</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch('agendamento.dataInicio') ? 
                        format(form.watch('agendamento.dataInicio')!, 'PPP', { locale: ptBR }) : 
                        'Selecionar data'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.watch('agendamento.dataInicio')}
                      onSelect={(date) => form.setValue('agendamento.dataInicio', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        
        <Button
          type="button"
          variant="secondary"
          onClick={() => form.handleSubmit((data) => handleSubmit(data, true))()}
          disabled={isLoading}
        >
          Salvar como Rascunho
        </Button>
        
        <Button
          type="button"
          onClick={() => form.handleSubmit((data) => handleSubmit(data, false))()}
          disabled={isLoading}
        >
          {isLoading ? 'Criando...' : 'Criar Campanha'}
        </Button>
      </div>
    </form>
  );
};
