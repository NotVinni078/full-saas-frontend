
import React from 'react';
import { CampanhaCard } from './CampanhaCard';
import { Loader2, Megaphone } from 'lucide-react';

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

interface CampanhasListProps {
  campanhas: Campanha[];
  carregando: boolean;
  onEditar: (campanha: Campanha) => void;
  onClonar: (campanha: Campanha) => void;
  onPausar: (campanha: Campanha) => void;
  onCancelar: (campanha: Campanha) => void;
  onExcluir: (campanha: Campanha) => void;
  onVerDetalhes: (campanha: Campanha) => void;
}

/**
 * Componente da lista de campanhas
 * Exibe as campanhas em cards responsivos
 * Gerencia estados de carregamento e lista vazia
 * Layout adaptável para desktop, tablet e mobile
 */
export const CampanhasList: React.FC<CampanhasListProps> = ({
  campanhas,
  carregando,
  onEditar,
  onClonar,
  onPausar,
  onCancelar,
  onExcluir,
  onVerDetalhes
}) => {

  // Estado de carregamento
  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando campanhas...</p>
        </div>
      </div>
    );
  }

  // Estado de lista vazia
  if (campanhas.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center max-w-md">
          {/* Ícone de campanha */}
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-muted-foreground" />
          </div>
          
          {/* Mensagem de estado vazio */}
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhuma campanha encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece criando sua primeira campanha de marketing multicanal
          </p>
          
          {/* Dica visual */}
          <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border">
            💡 <strong>Dica:</strong> Use campanhas para enviar mensagens em massa 
            através do WhatsApp, Facebook, Instagram e Telegram
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Grid responsivo de campanhas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {campanhas.map((campanha) => (
          <CampanhaCard
            key={campanha.id}
            campanha={campanha}
            onEditar={() => onEditar(campanha)}
            onClonar={() => onClonar(campanha)}
            onPausar={() => onPausar(campanha)}
            onCancelar={() => onCancelar(campanha)}
            onExcluir={() => onExcluir(campanha)}
            onVerDetalhes={() => onVerDetalhes(campanha)}
          />
        ))}
      </div>

      {/* Resumo de campanhas no final da lista */}
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground text-center">
          Exibindo {campanhas.length} {campanhas.length === 1 ? 'campanha' : 'campanhas'}
        </p>
      </div>
    </div>
  );
};
