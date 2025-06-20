
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChannelSelector } from './ChannelSelector';
import { ContactUpload } from './ContactUpload';
import { MessagePreview } from './MessagePreview';
import { ScheduleSettings } from './ScheduleSettings';
import { Save, X, Eye } from 'lucide-react';

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
 * Formulário para criação e edição de campanhas
 * Permite configurar todos os aspectos de uma campanha de marketing
 * Inclui validação e preview da mensagem
 */
export const CampanhaForm: React.FC<CampanhaFormProps> = ({
  campanha,
  onSalvar,
  onCancelar
}) => {
  // Estados do formulário
  const [nome, setNome] = useState('');
  const [remetente, setRemetente] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [canaisSelecionados, setCanaisSelecionados] = useState<('whatsapp' | 'facebook' | 'instagram' | 'telegram')[]>([]);
  const [contatos, setContatos] = useState<any[]>([]);
  const [agendamento, setAgendamento] = useState({
    imediato: true,
    dataInicio: '',
    horaInicio: '09:00',
    dataFim: undefined as string | undefined,
    horaFim: undefined as string | undefined
  });
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Preenche formulário ao editar campanha
  useEffect(() => {
    if (campanha) {
      setNome(campanha.nome);
      setRemetente(campanha.remetente);
      setMensagem(campanha.mensagem);
      setCanaisSelecionados(campanha.canais);
      
      // Configura agendamento baseado nos dados da campanha
      const agora = new Date();
      const inicioIsFuture = campanha.dataInicio > agora;
      
      setAgendamento({
        imediato: !inicioIsFuture,
        dataInicio: campanha.dataInicio.toISOString().split('T')[0],
        horaInicio: campanha.dataInicio.toTimeString().slice(0, 5),
        dataFim: campanha.dataFim?.toISOString().split('T')[0],
        horaFim: campanha.dataFim?.toTimeString().slice(0, 5)
      });
    } else {
      // Valores padrão para nova campanha
      const hoje = new Date();
      setAgendamento(prev => ({
        ...prev,
        dataInicio: hoje.toISOString().split('T')[0]
      }));
    }
  }, [campanha]);

  /**
   * Valida os dados do formulário
   */
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!nome.trim()) {
      novosErros.nome = 'Nome da campanha é obrigatório';
    }

    if (!remetente.trim()) {
      novosErros.remetente = 'Remetente é obrigatório';
    }

    if (!mensagem.trim()) {
      novosErros.mensagem = 'Mensagem é obrigatória';
    }

    if (canaisSelecionados.length === 0) {
      novosErros.canais = 'Selecione pelo menos um canal';
    }

    if (contatos.length === 0) {
      novosErros.contatos = 'Adicione pelo menos um contato';
    }

    if (!agendamento.imediato) {
      if (!agendamento.dataInicio) {
        novosErros.agendamento = 'Data de início é obrigatória';
      }
      if (!agendamento.horaInicio) {
        novosErros.agendamento = 'Hora de início é obrigatória';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  /**
   * Manipula o envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setSalvando(true);
    
    try {
      // Prepara dados da campanha
      const dataInicio = agendamento.imediato 
        ? new Date()
        : new Date(`${agendamento.dataInicio}T${agendamento.horaInicio}:00`);
        
      const dataFim = agendamento.dataFim && agendamento.horaFim
        ? new Date(`${agendamento.dataFim}T${agendamento.horaFim}:00`)
        : undefined;

      const dadosCampanha: Partial<Campanha> = {
        nome: nome.trim(),
        remetente: remetente.trim(),
        mensagem: mensagem.trim(),
        canais: canaisSelecionados,
        dataInicio,
        dataFim,
        status: agendamento.imediato ? 'em_andamento' : 'agendada',
        contatosTotal: contatos.length,
        contatosEnviados: 0,
        taxaSucesso: 0
      };

      await onSalvar(dadosCampanha);
      
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Informações básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome da Campanha *
              </Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Promoção Black Friday 2024"
                className="mt-1"
              />
              {erros.nome && (
                <p className="text-sm text-red-500 mt-1">{erros.nome}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="remetente" className="text-sm font-medium">
                Remetente *
              </Label>
              <Input
                id="remetente"
                value={remetente}
                onChange={(e) => setRemetente(e.target.value)}
                placeholder="Ex: Loja Principal"
                className="mt-1"
              />
              {erros.remetente && (
                <p className="text-sm text-red-500 mt-1">{erros.remetente}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de canais */}
      <Card>
        <CardHeader>
          <CardTitle>Canais de Envio</CardTitle>
        </CardHeader>
        <CardContent>
          <ChannelSelector
            canaisSelecionados={canaisSelecionados}
            onChange={setCanaisSelecionados}
            error={erros.canais}
          />
        </CardContent>
      </Card>

      {/* Upload de contatos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactUpload
            contatos={contatos}
            onChange={setContatos}
            error={erros.contatos}
          />
        </CardContent>
      </Card>

      {/* Mensagem */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mensagem da Campanha</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setMostrarPreview(!mostrarPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {mostrarPreview ? 'Ocultar' : 'Preview'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mensagem" className="text-sm font-medium">
              Texto da Mensagem *
            </Label>
            <Textarea
              id="mensagem"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              placeholder="Digite sua mensagem aqui... Use {nome} para personalizar com o nome do contato."
              rows={4}
              className="mt-1"
            />
            {erros.mensagem && (
              <p className="text-sm text-red-500 mt-1">{erros.mensagem}</p>
            )}
          </div>
          
          {mostrarPreview && (
            <MessagePreview
              mensagem={mensagem}
              canais={canaisSelecionados}
              contatoExemplo={{ nome: 'João Silva', telefone: '(11) 99999-9999' }}
            />
          )}
        </CardContent>
      </Card>

      {/* Configurações de agendamento */}
      <ScheduleSettings
        agendamento={agendamento}
        onChange={setAgendamento}
        error={erros.agendamento}
      />

      {/* Botões de ação */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onCancelar}
          disabled={salvando}
        >
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        
        <Button
          type="submit"
          disabled={salvando}
          className="min-w-[120px]"
        >
          <Save className="w-4 h-4 mr-2" />
          {salvando ? 'Salvando...' : campanha ? 'Atualizar' : 'Criar Campanha'}
        </Button>
      </div>
    </form>
  );
};
