
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Play, 
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send
} from 'lucide-react';

interface FlowPreviewProps {
  nodes: any[];
  edges: any[];
}

const FlowPreview = ({ nodes, edges }: FlowPreviewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const mockMessages = [
    {
      id: 1,
      type: 'bot',
      content: 'Olá! Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje?',
      timestamp: '14:30'
    },
    {
      id: 2,
      type: 'user',
      content: 'Olá, gostaria de saber sobre produtos',
      timestamp: '14:31'
    },
    {
      id: 3,
      type: 'bot',
      content: 'Perfeito! Temos várias opções disponíveis. Qual categoria te interessa mais?',
      timestamp: '14:31'
    }
  ];

  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(0);
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-gray-50">
      <Card className="max-w-sm mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Preview do Chatbot
          </CardTitle>
          <div className="flex gap-2">
            <Button size="sm" onClick={startSimulation} disabled={isSimulating}>
              <Play className="w-3 h-3 mr-1" />
              Simular
            </Button>
            <Button size="sm" variant="outline" onClick={resetSimulation}>
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Phone Mockup */}
          <div className="bg-black rounded-3xl p-2 mx-auto" style={{ width: '300px', height: '600px' }}>
            <div className="bg-white rounded-2xl h-full flex flex-col overflow-hidden">
              {/* Status Bar */}
              <div className="bg-green-600 text-white px-4 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <div className="text-xs">9:41</div>
                </div>
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* WhatsApp Header */}
              <div className="bg-green-600 text-white px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xs text-gray-600">🤖</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">Chatbot Atendimento</div>
                  <div className="text-xs opacity-80">Online</div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4" />
                  <Phone className="w-4 h-4" />
                  <MoreVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 bg-gray-100 p-3 overflow-y-auto space-y-2">
                {nodes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">Adicione nós ao fluxo</p>
                    <p className="text-xs">para ver a simulação</p>
                  </div>
                ) : (
                  <>
                    {/* Welcome Message */}
                    <div className="flex justify-start">
                      <div className="bg-white rounded-lg px-3 py-2 max-w-xs shadow-sm">
                        <p className="text-sm">Olá! 👋 Seja bem-vindo ao nosso atendimento!</p>
                        <span className="text-xs text-gray-500">14:30</span>
                      </div>
                    </div>

                    {/* Dynamic Messages based on nodes */}
                    {nodes.slice(0, 3).map((node, index) => {
                      let content = '';
                      let isBot = true;

                      switch (node.type) {
                        case 'message':
                          content = node.data.content || 'Mensagem do bot';
                          break;
                        case 'question':
                          content = node.data.question || 'Qual é sua pergunta?';
                          break;
                        case 'menu':
                          content = `${node.data.title || 'Menu'}\n\n${node.data.options?.map((opt: any, i: number) => `${i + 1}. ${opt.text}`).join('\n') || '1. Opção exemplo'}`;
                          break;
                        case 'quick-replies':
                          content = node.data.text || 'Escolha uma opção:';
                          break;
                        case 'interactive-buttons':
                          content = node.data.text || 'Botões interativos disponíveis';
                          break;
                        case 'media':
                          content = `📎 ${node.data.mediaType || 'Mídia'} ${node.data.caption ? `\n${node.data.caption}` : ''}`;
                          break;
                        case 'delay':
                          content = '⏱️ Aguardando...';
                          break;
                        case 'transfer':
                          content = '👤 Transferindo para atendente...';
                          break;
                        case 'end':
                          content = node.data.message || 'Atendimento encerrado. Obrigado!';
                          break;
                        default:
                          content = 'Mensagem do chatbot';
                      }

                      // Simulate user response every other message
                      const messages = [];
                      
                      if (index > 0) {
                        messages.push(
                          <div key={`user-${index}`} className="flex justify-end mb-2">
                            <div className="bg-green-500 text-white rounded-lg px-3 py-2 max-w-xs">
                              <p className="text-sm">Sim, entendi!</p>
                              <span className="text-xs opacity-80">14:{30 + index + 1}</span>
                            </div>
                          </div>
                        );
                      }

                      messages.push(
                        <div key={`bot-${index}`} className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
                          <div className={`${isBot ? 'bg-white' : 'bg-green-500 text-white'} rounded-lg px-3 py-2 max-w-xs shadow-sm`}>
                            <p className="text-sm whitespace-pre-line">{content}</p>
                            <span className={`text-xs ${isBot ? 'text-gray-500' : 'opacity-80'}`}>14:{30 + index + 2}</span>
                          </div>
                        </div>
                      );

                      return messages;
                    })}

                    {/* Quick Replies Simulation */}
                    {nodes.some(n => n.type === 'quick-replies') && (
                      <div className="flex flex-wrap gap-2 justify-start">
                        <button className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700">
                          👍 Sim
                        </button>
                        <button className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700">
                          👎 Não
                        </button>
                        <button className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700">
                          ℹ️ Mais info
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-white border-t p-3 flex items-center gap-2">
                <Smile className="w-5 h-5 text-gray-500" />
                <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 flex items-center gap-2">
                  <span className="text-sm text-gray-500 flex-1">Digite uma mensagem</span>
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </div>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Mic className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Flow Stats */}
          {nodes.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center">
              <div className="text-sm font-medium text-blue-800 mb-1">Estatísticas do Fluxo</div>
              <div className="text-xs text-blue-600">
                📊 {nodes.length} nó{nodes.length !== 1 ? 's' : ''} • 
                🔗 {edges.length} conexão{edges.length !== 1 ? 'ões' : ''} •
                🎯 {nodes.filter(n => n.type === 'end').length} fim{nodes.filter(n => n.type === 'end').length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FlowPreview;
