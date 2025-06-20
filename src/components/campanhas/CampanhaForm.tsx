
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChannelSelector } from './ChannelSelector';
import { ContactUpload } from './ContactUpload';
import { MessagePreview } from './MessagePreview';
import { ScheduleSettings } from './ScheduleSettings';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Users, MessageSquare, Settings, Eye } from 'lucide-react';

// Interface para dados de campanha
interface Campanha {
  id: string;
  nome: string;
  canais: ('whatsapp' | 'facebook' | 'instagram' | 'telegram')[];
  dataInicio: Date;
  dataFim?: Date;
  status: 'agendada' | 'em_andamento' | 'finalizada' | 'erro';
  contatosEnviados: number;
  contatosTotal: number;
  taxaSucesso: number;
  mensagem: string;
  arquivo?: string;
  remetente: string;
  criadoEm: Date;
  atualizadoEm: Date;
}

interface CampanhaFormProps {
  campanha: Campanha | null;
  onSalvar: (dados: Partial<Campanha>) => Promise<void>;
  onCancelar: () => void;
}

/**
 * Formulário completo para criação/edição de campanhas
 * Contém todas as seções: dados básicos, canais, contatos, mensagem, agendamento
 * Validação de campos obrigatórios com feedback visual
 * Preview da mensagem em tempo real
 * Layout responsivo e modular
 */
export const CampanhaForm: React.FC<CampanhaFormProps> = ({
  campanha,
  onSalvar,
  onCancelar
}) => {
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [canaisSelecionados, setCanaisSelecionados] = useState<('whatsapp' | 'facebook' | 'instagram' | 'telegram')[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [arquivo, setArquivo] = useState<string>('');
  const [contatos, setContatos] = useState<any[]>([]);
  const [remetente, setRemetente] = useState('');
  const [agendamento, setAgendamento] = useState<Date | null>(null);
  const [configuracoes, setConfiguracoes] = useState({
    intervalo: 1,
    unidadeIntervalo: 'minutos' as 'segundos' | 'minutos' | 'horas',
    limiteTentativas: 3
  });

  // Estados de controle
  const [salvando, setSalvando] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();

  /**
   * Carrega dados da campanha para edição
   */
  useEffect(() => {
    if (campanha) {
      setNome(campanha.nome);
      setCanaisSelecionados(campanha.canais);
      setMensagem(campanha.mensagem);
      setArquivo(campanha.arquivo || '');
      setRemetente(campanha.remetente);
      // TODO: Carregar contatos e configurações da API
    }
  }, [campanha]);

  /**
   * Valida os campos obrigatórios do formulário
   */
  const validarFormulario = (): boolean => {
    const novosErrors: Record<string, string> = {};

    if (!nome.trim()) {
      novosErrors.nome = 'Nome da campanha é obrigatório';
    }

    if (canaisSelecionados.length === 0) {
      novosErrors.canais = 'Selecione pelo menos um canal';
    }

    if (!mensagem.trim()) {
      novosErrors.mensagem = 'Mensagem é obrigatória';
    }

    if (contatos.length === 0) {
      novosErrors.contatos = 'Adicione pelo menos um contato';
    }

    if (!remetente.trim()) {
      novosErrors.remetente = 'Remetente é obrigatório';
    }

    setErrors(novosErrors);
    return Object.keys(novosErrors).length === 0;
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (acao: 'salvar' | 'agendar' | 'enviar') => {
    if (!validarFormulario()) {
      toast({
        title: "Erro na validação",
        description: "Corrija os campos destacados antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setSalvando(true);

    try {
      const dadosCampanha: Partial<Campanha> = {
        nome: nome.trim(),
        canais: canaisSelecionados,
        mensagem: mensagem.trim(),
        arquivo: arquivo || undefined,
        remetente: remetente.trim(),
        dataInicio: agendamento || new Date(),
        contatosTotal: contatos.length,
        status: acao === 'enviar' ? 'em_andamento' : 'agendada'
      };

      await onSalvar(dadosCampanha);

      toast({
        title: "Sucesso!",
        description: acao === 'enviar' 
          ? "Campanha iniciada com sucesso!" 
          : "Campanha salva com sucesso!"
      });

    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a campanha. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Seção 1: Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="w-5 h-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nome da campanha */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Campanha *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Promoção Black Friday 2024"
              className={errors.nome ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          {/* Remetente */}
          <div className="space-y-2">
            <Label htmlFor="remetente">Remetente *</Label>
            <Input
              id="remetente"
              value={remetente}
              onChange={(e) => setRemetente(e.target.value)}
              placeholder="Ex: Loja Principal"
              className={errors.remetente ? 'border-red-500 focus:border-red-500' : ''}
            />
            {errors.remetente && (
              <p className="text-sm text-red-500">{errors.remetente}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Seção 2: Seleção de Canais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5" />
            Canais de Envio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelSelector
            canaisSelecionados={canaisSelecionados}
            onChange={setCanaisSelecionados}
            error={errors.canais}
          />
        </CardContent>
      </Card>

      {/* Seção 3: Upload de Contatos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Users className="w-5 h-5" />
            Contatos ({contatos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactUpload
            contatos={contatos}
            onChange={setContatos}
            error={errors.contatos}
          />
        </CardContent>
      </Card>

      {/* Seção 4: Mensagem e Anexos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <MessageSquare className="w-5 h-5" />
            Mensagem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campo de mensagem */}
          <div className="space-y-2">
            <Label htmlFor="mensagem">Texto da Mensagem *</Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem aqui. Use {nome} para personalizar..."
              rows={4}
              className={`resize-none ${errors.mensagem ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.mensagem && (
              <p className="text-sm text-red-500">{errors.mensagem}</p>
            )}
            
            {/* Dica sobre variáveis */}
            <p className="text-xs text-muted-foreground">
              💡 Use variáveis como {'{nome}'}, {'{email}'}, {'{telefone}'} para personalizar a mensagem
            </p>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label>Anexar Arquivo (Opcional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/20 transition-colors">
              <p className="text-sm text-muted-foreground mb-2">
                Arraste um arquivo aqui ou clique para selecionar
              </p>
              <Button variant="outline" size="sm">
                Selecionar Arquivo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Suporte: Imagens, vídeos, documentos (máx. 16MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seção 5: Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5" />
            Agendamento e Configurações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleSettings
            agendamento={agendamento}
            onAgendamentoChange={setAgendamento}
            configuracoes={configuracoes}
            onConfiguracoesChange={setConfiguracoes}
          />
        </CardContent>
      </Card>

      {/* Seção 6: Preview da Mensagem */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Eye className="w-5 h-5" />
            Visualização
          </CardTitle>
        </CardHeader>
        <CardContent>
          <MessagePreview
            canais={canaisSelecionados}
            mensagem={mensagem}
            arquivo={arquivo}
            remetente={remetente}
          />
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={onCancelar}
          disabled={salvando}
          className="order-2 sm:order-1"
        >
          Cancelar
        </Button>

        <div className="flex flex-col sm:flex-row gap-2 order-1 sm:order-2 sm:ml-auto">
          <Button
            variant="outline"
            onClick={() => handleSubmit('salvar')}
            disabled={salvando}
          >
            {salvando ? 'Salvando...' : 'Salvar Rascunho'}
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleSubmit('agendar')}
            disabled={salvando || !agendamento}
          >
            {salvando ? 'Agendando...' : 'Agendar'}
          </Button>

          <Button
            onClick={() => handleSubmit('enviar')}
            disabled={salvando}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {salvando ? 'Enviando...' : 'Enviar Agora'}
          </Button>
        </div>
      </div>
    </div>
  );
};
