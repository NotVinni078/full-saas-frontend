
import React, { useState, useEffect } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { CampanhasHeader } from '@/components/campanhas/CampanhasHeader';
import { CampanhasFilters } from '@/components/campanhas/CampanhasFilters';
import { CampanhasList } from '@/components/campanhas/CampanhasList';
import { CampanhaModal } from '@/components/campanhas/CampanhaModal';
import { CampanhaDetailsModal } from '@/components/campanhas/CampanhaDetailsModal';
import { useToast } from '@/hooks/use-toast';

// Interfaces para tipagem dos dados das campanhas
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

// Tipos para filtros de status das campanhas
type StatusFilter = 'todas' | 'agendada' | 'em_andamento' | 'finalizada' | 'erro';

/**
 * Componente principal da página de Campanhas
 * Gerencia todo o sistema de campanhas de marketing
 * Integra com as cores dinâmicas da gestão de marca
 * Responsivo para desktop, tablet e mobile
 */
const Campanhas = () => {
  // Estados para controle da interface e dados
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

  /**
   * Busca as campanhas da API
   * Endpoint sugerido: GET /api/campanhas
   * Inclui paginação e filtros de busca
   */
  const buscarCampanhas = async () => {
    try {
      setCarregando(true);
      
      // TODO: Integrar com API real
      // const response = await fetch('/api/campanhas?status=' + filtroAtivo + '&busca=' + buscaTexto);
      // const data = await response.json();
      // setCampanhas(data.campanhas);

      // Dados mockados para demonstração - REMOVER ao integrar com API
      const campanhasMock: Campanha[] = [
        {
          id: '1',
          nome: 'Promoção Black Friday 2024',
          canais: ['whatsapp', 'facebook', 'instagram'],
          dataInicio: new Date('2024-11-25T09:00:00'),
          dataFim: new Date('2024-11-25T18:00:00'),
          status: 'finalizada',
          contatosEnviados: 1250,
          contatosTotal: 1500,
          taxaSucesso: 83.3,
          mensagem: 'Olá {nome}! Não perca nossa mega promoção Black Friday com até 70% OFF!',
          remetente: 'Loja Principal',
          criadoEm: new Date('2024-11-20T10:00:00'),
          atualizadoEm: new Date('2024-11-25T18:30:00')
        },
        {
          id: '2',
          nome: 'Lançamento Produto Dezembro',
          canais: ['whatsapp', 'telegram'],
          dataInicio: new Date('2024-12-15T14:00:00'),
          status: 'agendada',
          contatosEnviados: 0,
          contatosTotal: 800,
          taxaSucesso: 0,
          mensagem: 'Ei {nome}! Nosso novo produto chegou! Seja um dos primeiros a conhecer.',
          remetente: 'Equipe Marketing',
          criadoEm: new Date('2024-12-01T08:00:00'),
          atualizadoEm: new Date('2024-12-01T08:00:00')
        },
        {
          id: '3',
          nome: 'Newsletter Semanal',
          canais: ['whatsapp'],
          dataInicio: new Date(),
          status: 'em_andamento',
          contatosEnviados: 450,
          contatosTotal: 2000,
          taxaSucesso: 91.2,
          mensagem: 'Bom dia {nome}! Confira as novidades desta semana.',
          remetente: 'Newsletter Bot',
          criadoEm: new Date('2024-12-18T07:00:00'),
          atualizadoEm: new Date()
        }
      ];
      
      setCampanhas(campanhasMock);
      
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

  /**
   * Filtra as campanhas baseado no status selecionado e texto de busca
   */
  const campanhasFiltradas = campanhas.filter(campanha => {
    const matchStatus = filtroAtivo === 'todas' || campanha.status === filtroAtivo;
    const matchBusca = campanha.nome.toLowerCase().includes(buscaTexto.toLowerCase()) ||
                      campanha.remetente.toLowerCase().includes(buscaTexto.toLowerCase());
    return matchStatus && matchBusca;
  });

  /**
   * Abre modal para criar nova campanha
   */
  const handleNovaCampanha = () => {
    setCampanhaEdicao(null);
    setModalNovaAberto(true);
  };

  /**
   * Abre modal para editar campanha existente
   * Endpoint sugerido: PUT /api/campanhas/:id
   */
  const handleEditarCampanha = (campanha: Campanha) => {
    setCampanhaEdicao(campanha);
    setModalEdicaoAberto(true);
  };

  /**
   * Clona uma campanha existente
   * Endpoint sugerido: POST /api/campanhas/:id/clonar
   */
  const handleClonarCampanha = async (campanha: Campanha) => {
    try {
      // TODO: Integrar com API
      // await fetch(`/api/campanhas/${campanha.id}/clonar`, { method: 'POST' });
      
      toast({
        title: "Campanha Clonada",
        description: `A campanha "${campanha.nome}" foi clonada com sucesso.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível clonar a campanha.",
        variant: "destructive"
      });
    }
  };

  /**
   * Pausa uma campanha em andamento
   * Endpoint sugerido: PUT /api/campanhas/:id/pausar
   */
  const handlePausarCampanha = async (campanha: Campanha) => {
    try {
      // TODO: Integrar com API
      // await fetch(`/api/campanhas/${campanha.id}/pausar`, { method: 'PUT' });
      
      toast({
        title: "Campanha Pausada",
        description: `A campanha "${campanha.nome}" foi pausada.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível pausar a campanha.",
        variant: "destructive"
      });
    }
  };

  /**
   * Cancela uma campanha agendada
   * Endpoint sugerido: PUT /api/campanhas/:id/cancelar
   */
  const handleCancelarCampanha = async (campanha: Campanha) => {
    try {
      // TODO: Integrar com API
      // await fetch(`/api/campanhas/${campanha.id}/cancelar`, { method: 'PUT' });
      
      toast({
        title: "Campanha Cancelada",
        description: `A campanha "${campanha.nome}" foi cancelada.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a campanha.",
        variant: "destructive"
      });
    }
  };

  /**
   * Exclui uma campanha
   * Endpoint sugerido: DELETE /api/campanhas/:id
   */
  const handleExcluirCampanha = async (campanha: Campanha) => {
    if (!confirm(`Tem certeza que deseja excluir a campanha "${campanha.nome}"?`)) {
      return;
    }

    try {
      // TODO: Integrar com API
      // await fetch(`/api/campanhas/${campanha.id}`, { method: 'DELETE' });
      
      toast({
        title: "Campanha Excluída",
        description: `A campanha "${campanha.nome}" foi excluída com sucesso.`
      });
      
      await buscarCampanhas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a campanha.",
        variant: "destructive"
      });
    }
  };

  /**
   * Abre modal com detalhes da campanha
   */
  const handleVerDetalhes = (campanha: Campanha) => {
    setCampanhaDetalhes(campanha);
    setModalDetalhesAberto(true);
  };

  /**
   * Salva nova campanha ou edições
   * Endpoints sugeridos: POST /api/campanhas ou PUT /api/campanhas/:id
   */
  const handleSalvarCampanha = async (dadosCampanha: Partial<Campanha>) => {
    try {
      if (campanhaEdicao) {
        // TODO: Integrar com API para edição
        // await fetch(`/api/campanhas/${campanhaEdicao.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dadosCampanha)
        // });
        
        toast({
          title: "Campanha Atualizada",
          description: "As alterações foram salvas com sucesso."
        });
      } else {
        // TODO: Integrar com API para criação
        // await fetch('/api/campanhas', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(dadosCampanha)
        // });
        
        toast({
          title: "Campanha Criada",
          description: "A nova campanha foi criada com sucesso."
        });
      }

      setModalNovaAberto(false);
      setModalEdicaoAberto(false);
      await buscarCampanhas();
      
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar a campanha.",
        variant: "destructive"
      });
    }
  };

  // Carrega campanhas ao montar o componente
  useEffect(() => {
    buscarCampanhas();
  }, [filtroAtivo, buscaTexto]);

  return (
    <SidebarLayout>
      {/* Container principal da página de campanhas */}
      <div className="p-4 md:p-6 bg-background min-h-full">
        
        {/* Header da página com título e botão de nova campanha */}
        <CampanhasHeader 
          onNovaCampanha={handleNovaCampanha}
          buscaTexto={buscaTexto}
          onBuscaChange={setBuscaTexto}
        />

        {/* Filtros por status das campanhas */}
        <CampanhasFilters 
          filtroAtivo={filtroAtivo}
          onFiltroChange={setFiltroAtivo}
          totalCampanhas={campanhas.length}
        />

        {/* Lista de campanhas */}
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

        {/* Modal para criar nova campanha */}
        <CampanhaModal 
          open={modalNovaAberto}
          onClose={() => setModalNovaAberto(false)}
          onSalvar={handleSalvarCampanha}
          campanha={null}
          titulo="Nova Campanha"
        />

        {/* Modal para editar campanha existente */}
        <CampanhaModal 
          open={modalEdicaoAberto}
          onClose={() => setModalEdicaoAberto(false)}
          onSalvar={handleSalvarCampanha}
          campanha={campanhaEdicao}
          titulo="Editar Campanha"
        />

        {/* Modal com detalhes da campanha */}
        <CampanhaDetailsModal 
          open={modalDetalhesAberto}
          onClose={() => setModalDetalhesAberto(false)}
          campanha={campanhaDetalhes}
        />
      </div>
    </SidebarLayout>
  );
};

export default Campanhas;
