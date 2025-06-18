
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageSquare, 
  Play, 
  HelpCircle, 
  Menu, 
  UserCheck, 
  XCircle, 
  List, 
  MousePointer, 
  MessageSquareQuote, 
  Bot, 
  Clock, 
  Image 
} from 'lucide-react';

interface FlowPreviewProps {
  nodes: any[];
  edges: any[];
}

const FlowPreview = ({ nodes, edges }: FlowPreviewProps) => {
  const getNodePreview = (node: any) => {
    switch (node.type) {
      case 'message':
        return {
          icon: MessageSquare,
          title: 'Mensagem',
          content: node.data.content || 'Mensagem não definida',
          details: `Texto: "${node.data.content || 'Não definido'}"`
        };
      case 'question':
        return {
          icon: HelpCircle,
          title: 'Pergunta',
          content: node.data.question || 'Pergunta não definida',
          details: `Pergunta: "${node.data.question || 'Não definido'}"`
        };
      case 'menu':
        const options = node.data.options || [];
        return {
          icon: Menu,
          title: 'Menu Interativo',
          content: node.data.title || 'Menu não definido',
          details: `Título: "${node.data.title || 'Não definido'}" • ${options.length} opções • Botão: "${node.data.buttonText || 'Ver opções'}"`
        };
      case 'menu-list':
        return {
          icon: List,
          title: 'Menu Lista',
          content: node.data.title || 'Lista não definida',
          details: `Lista com ${node.data.options?.length || 0} itens`
        };
      case 'interactive-buttons':
        return {
          icon: MousePointer,
          title: 'Botões Interativos',
          content: node.data.text || 'Texto não definido',
          details: `${node.data.buttons?.length || 0} botões disponíveis`
        };
      case 'quick-replies':
        return {
          icon: MessageSquareQuote,
          title: 'Botões Respostas',
          content: node.data.text || 'Texto não definido',
          details: `Texto: "${node.data.text || 'Não definido'}" • ${node.data.replies?.length || 0} respostas rápidas`
        };
      case 'transfer':
        return {
          icon: UserCheck,
          title: 'Transferir',
          content: 'Transferência para atendente',
          details: `Tipo: ${node.data.transferType === 'user' ? 'Usuário' : 'Setor'} • Destino: ${node.data.selectedUser || node.data.selectedSector || 'Não selecionado'}`
        };
      case 'chatbot-transfer':
        return {
          icon: Bot,
          title: 'Transferir Chatbot',
          content: 'Transferência para outro bot',
          details: `Bot: ${node.data.selectedBot === 'custom' ? node.data.customBotName : node.data.selectedBot || 'Não selecionado'}`
        };
      case 'delay':
        const delaySeconds = node.data.delayUnit === 'minutes' ? (node.data.delayValue || 5) * 60 : 
                           node.data.delayUnit === 'hours' ? (node.data.delayValue || 5) * 3600 : 
                           (node.data.delayValue || 5);
        return {
          icon: Clock,
          title: 'Tempo de Espera',
          content: `Aguardar ${node.data.delayValue || 5} ${node.data.delayUnit === 'minutes' ? 'minutos' : node.data.delayUnit === 'hours' ? 'horas' : 'segundos'}`,
          details: `Pausa de ${delaySeconds} segundos no fluxo`
        };
      case 'media':
        return {
          icon: Image,
          title: 'Enviar Mídia',
          content: node.data.mediaType || 'Tipo não definido',
          details: `Tipo: ${node.data.mediaType || 'Não definido'} • ${node.data.caption ? `Legenda: "${node.data.caption}"` : 'Sem legenda'}`
        };
      case 'end':
        return {
          icon: XCircle,
          title: 'Encerrar',
          content: 'Fim do atendimento',
          details: `Mensagem: "${node.data.message || 'Atendimento encerrado'}"`
        };
      default:
        return {
          icon: MessageSquare,
          title: 'Nó Desconhecido',
          content: 'Tipo não reconhecido',
          details: 'Tipo de nó não implementado'
        };
    }
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="w-5 h-5" />
            Preview do Fluxo
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum nó adicionado ainda</p>
              <p className="text-sm">Arraste nós do painel lateral para começar</p>
              <p className="text-sm mt-2">💡 Dica: Use Delete para excluir nós selecionados</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium text-blue-800 mb-1">Estatísticas do Fluxo</div>
                <div className="text-xs text-blue-600">
                  📊 {nodes.length} nó{nodes.length !== 1 ? 's' : ''} • 
                  🔗 {edges.length} conexõe{edges.length !== 1 ? 's' : ''} •
                  🎯 {nodes.filter(n => n.type === 'end').length} ponto{nodes.filter(n => n.type === 'end').length !== 1 ? 's' : ''} de finalização
                </div>
              </div>
              
              {nodes.map((node, index) => {
                const preview = getNodePreview(node);
                const Icon = preview.icon;
                
                return (
                  <div key={node.id} className="p-3 border rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm mb-1">{preview.title} #{index + 1}</div>
                        <div className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {preview.content}
                        </div>
                        <div className="text-xs bg-gray-100 rounded px-2 py-1 text-gray-600">
                          {preview.details}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {edges.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-sm font-medium text-green-800 mb-1">Conexões</div>
                  <div className="text-xs text-green-600">
                    O fluxo possui {edges.length} conexão{edges.length !== 1 ? 'ões' : ''} entre os nós
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowPreview;
