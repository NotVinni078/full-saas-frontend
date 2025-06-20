
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { CampanhasHeader } from '@/components/campanhas/CampanhasHeader';
import { CampanhasFilters } from '@/components/campanhas/CampanhasFilters';
import { CampanhasList } from '@/components/campanhas/CampanhasList';
import { CampanhaModal } from '@/components/campanhas/CampanhaModal';
import { CampanhaDetailsModal } from '@/components/campanhas/CampanhaDetailsModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Interface para dados de campanha - alinhada com o banco
interface CampanhaSupabase {
  id: string;
  nome: string;
  canais: string[];
  data_inicio: string;
  data_fim?: string;
  status: 'rascunho' | 'agendada' | 'em_andamento' | 'pausada' | 'finalizada' | 'cancelada' | 'erro';
  contatos_enviados: number;
  contatos_total: number;
  taxa_sucesso: number;
  mensagem: string;
  arquivo?: string;
  remetente: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Interface para compatibilidade com componentes existentes
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

type StatusFilter = 'todas' | 'agendada' | 'em_andamento' | 'finalizada' | 'erro';

const CampanhasSupabase = () => {
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<StatusFilter>('todas');
  const [modalNovaAberto, setModalNovaAberto] = useState(false);
  const [modalEdicaoAberto, setModalEdicaoAberto] = useState(false);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [campanhaEdicao, setCampanhaEdicao] = useState<Campanha | null>(null);
  const [campanhaDetalhes, setCampanhaDetalhes] = useState<Campanha | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [buscaTexto, setBuscaTexto] = useState('');

  const { toast } = useToast();

  // Função para converter dados do Supabase para o formato do componente
  const mapSupabaseToCampanha = (data: CampanhaSupabase): Campanha => {
    return {
      id: data.id,
      nome: data.nome,
      canais: data.canais as ('whatsapp' | 'facebook' | 'instagram' | 'telegram')[],
      dataInicio: new Date(data.data_inicio),
      dataFim: data.data_fim ? new Date(data.data_fim) : undefined,
      status: data.status === 'rascunho' ? 'agendada' : 
              data.status === 'pausada' ? 'em_andamento' :
              data.status === 'cancelada' ? 'erro' : data.status,
      contatosEnviados: data.contatos_enviados,
      contatosTotal: data.contatos_total,
      taxaSucesso: data.taxa_sucesso,
      mensagem: data.mensagem,
      arquivo: data.arquivo,
      remetente: data.remetente,
      criadoEm: new Date(data.created_at),
      atualizadoEm: new Date(data.updated_at)
    };
  };

  const buscarCampanhas = async () => {
    try {
      setCarregando(true);
      
      let query = supabase
        .from('campanhas')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtro de status se não for 'todas'
      if (filtroAtivo !== 'todas') {
        // Mapear status do filtro para status do banco
        let dbStatus = filtroAtivo;
        if (filtroAtivo === 'agendada') {
          query = query.in('status', ['agendada', 'rascunho']);
        } else if (filtroAtivo === 'em_andamento') {
          query = query.in('status', ['em_andamento', 'pausada']);
        } else if (filtroAtivo === 'erro') {
          query = query.in('status', ['erro', 'cancelada']);
        } else {
          query = query.eq('status', dbStatus);
        }
      }

      // Aplicar filtro de busca
      if (buscaTexto.trim()) {
        query = query.or(`nome.ilike.%${buscaTexto}%,remetente.ilike.%${buscaTexto}%`);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const campanhasMapeadas = data?.map(mapSupabaseToCampanha) || [];
      setCampanhas(campanhasMapeadas);
      
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as campanhas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  };

  const campanhasFiltradas = campanhas.filter(campanha => {
    const matchStatus = filtroAtivo === 'todas' || campanha.status === filtroAtivo;
    const matchBusca = campanha.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
                      campanha.remetente.toLowerCase().includes(buscaTexto.toLowerCase());
    return matchStatus && matchBusca;
  });

  const handleNovaCampanha = () => {
    setCampanhaEdicao(null);
    setModalNovaAberto(true);
  };

  const handleEditarCampanha = (campanha: Campanha) => {
    setCampanhaEdicao(campanha);
    setModalEdicaoAberto(true);
  };

  const handleClonarCampanha = async (campanha: Campanha) => {
    try {
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para clonar campanhas.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('campanhas')
        .insert({
          nome: `${campanha.nome} (Cópia)`,
          canais: campanha.canais,
          data_inicio: new Date().toISOString(),
          status: 'rascunho',
          contatos_enviados: 0,
          contatos_total: campanha.contatosTotal,
          taxa_sucesso: 0,
          mensagem: campanha.mensagem,
          arquivo: campanha.arquivo,
          remetente: campanha.remetente,
          user_id: user.id
        });

      if (error) throw error;
      
      toast({
        title: "Campanha Clonada",
        description: `A campanha "${campanha.nome}" foi clonada com sucesso.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      console.error('Erro ao clonar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível clonar a campanha.",
        variant: "destructive"
      });
    }
  };

  const handlePausarCampanha = async (campanha: Campanha) => {
    try {
      const { error } = await supabase
        .from('campanhas')
        .update({ status: 'pausada' })
        .eq('id', campanha.id);

      if (error) throw error;
      
      toast({
        title: "Campanha Pausada",
        description: `A campanha "${campanha.nome}" foi pausada.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      console.error('Erro ao pausar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível pausar a campanha.",
        variant: "destructive"
      });
    }
  };

  const handleCancelarCampanha = async (campanha: Campanha) => {
    try {
      const { error } = await supabase
        .from('campanhas')
        .update({ status: 'cancelada' })
        .eq('id', campanha.id);

      if (error) throw error;
      
      toast({
        title: "Campanha Cancelada",
        description: `A campanha "${campanha.nome}" foi cancelada.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      console.error('Erro ao cancelar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a campanha.",
        variant: "destructive"
      });
    }
  };

  const handleExcluirCampanha = async (campanha: Campanha) => {
    if (!confirm(`Tem certeza que deseja excluir a campanha "${campanha.nome}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('campanhas')
        .delete()
        .eq('id', campanha.id);

      if (error) throw error;
      
      toast({
        title: "Campanha Excluída",
        description: `A campanha "${campanha.nome}" foi excluída com sucesso.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      console.error('Erro ao excluir campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a campanha.",
        variant: "destructive"
      });
    }
  };

  const handleVerDetalhes = (campanha: Campanha) => {
    setCampanhaDetalhes(campanha);
    setModalDetalhesAberto(true);
  };

  const handleSalvarCampanha = async (dadosCampanha: Partial<Campanha>) => {
    try {
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para criar campanhas.",
          variant: "destructive"
        });
        return;
      }

      if (campanhaEdicao) {
        // Atualizar campanha existente
        const { error } = await supabase
          .from('campanhas')
          .update({
            nome: dadosCampanha.nome,
            canais: dadosCampanha.canais,
            data_inicio: dadosCampanha.dataInicio?.toISOString(),
            data_fim: dadosCampanha.dataFim?.toISOString(),
            status: dadosCampanha.status === 'agendada' ? 'agendada' : 
                   dadosCampanha.status === 'em_andamento' ? 'em_andamento' : 'rascunho',
            contatos_total: dadosCampanha.contatosTotal || 0,
            mensagem: dadosCampanha.mensagem || '',
            arquivo: dadosCampanha.arquivo,
            remetente: dadosCampanha.remetente || ''
          })
          .eq('id', campanhaEdicao.id);

        if (error) throw error;
        
        toast({
          title: "Campanha Atualizada",
          description: "As alterações foram salvas com sucesso."
        });
      } else {
        // Criar nova campanha
        const { error } = await supabase
          .from('campanhas')
          .insert({
            nome: dadosCampanha.nome || '',
            canais: dadosCampanha.canais || [],
            data_inicio: dadosCampanha.dataInicio?.toISOString() || new Date().toISOString(),
            data_fim: dadosCampanha.dataFim?.toISOString(),
            status: dadosCampanha.status === 'agendada' ? 'agendada' : 
                   dadosCampanha.status === 'em_andamento' ? 'em_andamento' : 'rascunho',
            contatos_total: dadosCampanha.contatosTotal || 0,
            contatos_enviados: 0,
            taxa_sucesso: 0,
            mensagem: dadosCampanha.mensagem || '',
            arquivo: dadosCampanha.arquivo,
            remetente: dadosCampanha.remetente || '',
            user_id: user.id
          });

        if (error) throw error;
        
        toast({
          title: "Campanha Criada",
          description: "A nova campanha foi criada com sucesso."
        });
      }

      setModalNovaAberto(false);
      setModalEdicaoAberto(false);
      await buscarCampanhas();
      
    } catch (error) {
      console.error('Erro ao salvar campanha:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a campanha.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    buscarCampanhas();
  }, [filtroAtivo, buscaTexto]);

  return (
    <SidebarLayout>
      <div className="p-4 md:p-6 bg-background min-h-full">
        
        <CampanhasHeader 
          onNovaCampanha={handleNovaCampanha}
          buscaTexto={buscaTexto}
          onBuscaChange={setBuscaTexto}
        />

        <CampanhasFilters 
          filtroAtivo={filtroAtivo}
          onFiltroChange={setFiltroAtivo}
          totalCampanhas={campanhas.length}
        />

        <CampanhasList 
          campanhas={campanhasFiltradas}
          carregando={carregando}
          onEditar={handleEditarCampanha}
          onClonar={handleClonarCampanha}
          onPausar={handlePausarCampanha}
          onCancelar={handleCancelarCampanha}
          onExcluir={handleExcluirCampanha}
          onVerDetalhes={handleVerDetalhes}
        />

        <CampanhaModal 
          open={modalNovaAberto}
          onClose={() => setModalNovaAberto(false)}
          onSalvar={handleSalvarCampanha}
          campanha={null}
          titulo="Nova Campanha"
        />

        <CampanhaModal 
          open={modalEdicaoAberto}
          onClose={() => setModalEdicaoAberto(false)}
          onSalvar={handleSalvarCampanha}
          campanha={campanhaEdicao}
          titulo="Editar Campanha"
        />

        <CampanhaDetailsModal 
          open={modalDetalhesAberto}
          onClose={() => setModalDetalhesAberto(false)}
          campanha={campanhaDetalhes}
        />
      </div>
    </SidebarLayout>
  );
};

export default CampanhasSupabase;
