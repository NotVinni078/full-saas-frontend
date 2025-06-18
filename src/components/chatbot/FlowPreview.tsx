
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: string;
  nodeType?: string;
}

const FlowPreview = ({ nodes, edges }: FlowPreviewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);

  const getTimeStamp = () => {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const getNodeContent = (node: any) => {
    switch (node.type) {
      case 'message':
        return node.data.content || 'Mensagem do bot';
      case 'question':
        return node.data.question || 'Qual é sua pergunta?';
      case 'menu':
        const options = node.data.options?.map((opt: any, i: number) => `${i + 1}. ${opt.text}`).join('\n') || '1. Opção exemplo';
        return `${node.data.title || 'Menu'}\n\n${options}`;
      case 'quick-replies':
        return node.data.text || 'Escolha uma opção:';
      case 'interactive-buttons':
        return node.data.text || 'Botões interativos disponíveis';
      case 'media':
        return `📎 ${node.data.mediaType || 'Mídia'} ${node.data.caption ? `\n${node.data.caption}` : ''}`;
      case 'delay':
        return '⏱️ Processando...';
      case 'transfer':
        return '👤 Transferindo para atendente...';
      case 'end':
        return node.data.message || 'Atendimento encerrado. Obrigado!';
      default:
        return 'Mensagem do chatbot';
    }
  };

  const startConversation = () => {
    if (nodes.length === 0) return;
    
    setMessages([]);
    setCurrentNodeIndex(0);
    setIsWaitingForInput(false);
    
    // Start with the first node
    const firstNode = nodes[0];
    const content = getNodeContent(firstNode);
    
    const botMessage: Message = {
      id: `bot-${Date.now()}`,
      type: 'bot',
      content,
      timestamp: getTimeStamp(),
      nodeType: firstNode.type
    };
    
    setMessages([botMessage]);
    
    // Check if we need user input
    if (firstNode.type === 'question' || firstNode.type === 'menu' || firstNode.type === 'quick-replies') {
      setIsWaitingForInput(true);
    } else {
      // Auto-progress to next node if no input needed
      setTimeout(() => {
        progressToNextNode();
      }, 1000);
    }
  };

  const progressToNextNode = () => {
    const nextIndex = currentNodeIndex + 1;
    if (nextIndex < nodes.length) {
      setCurrentNodeIndex(nextIndex);
      const nextNode = nodes[nextIndex];
      const content = getNodeContent(nextNode);
      
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content,
        timestamp: getTimeStamp(),
        nodeType: nextNode.type
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Check if we need user input for the next node
      if (nextNode.type === 'question' || nextNode.type === 'menu' || nextNode.type === 'quick-replies') {
        setIsWaitingForInput(true);
      } else if (nextNode.type === 'end') {
        setIsWaitingForInput(false);
      } else {
        // Auto-progress if no input needed
        setTimeout(() => {
          progressToNextNode();
        }, 1000);
      }
    } else {
      setIsWaitingForInput(false);
    }
  };

  const sendMessage = () => {
    if (!userInput.trim() || !isWaitingForInput) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: getTimeStamp()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsWaitingForInput(false);
    
    // Progress to next node after user input
    setTimeout(() => {
      progressToNextNode();
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentNodeIndex(0);
    setUserInput('');
    setIsWaitingForInput(false);
  };

  const renderQuickReplies = () => {
    const currentNode = nodes[currentNodeIndex];
    if (currentNode?.type === 'quick-replies' && isWaitingForInput) {
      return (
        <div className="flex flex-wrap gap-2 justify-start mb-2">
          <button 
            className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
            onClick={() => {
              setUserInput('Sim');
              setTimeout(() => sendMessage(), 100);
            }}
          >
            👍 Sim
          </button>
          <button 
            className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
            onClick={() => {
              setUserInput('Não');
              setTimeout(() => sendMessage(), 100);
            }}
          >
            👎 Não
          </button>
          <button 
            className="bg-blue-100 border border-blue-300 rounded-full px-3 py-1 text-xs text-blue-700"
            onClick={() => {
              setUserInput('Mais informações');
              setTimeout(() => sendMessage(), 100);
            }}
          >
            ℹ️ Mais info
          </button>
        </div>
      );
    }
    return null;
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
            <Button size="sm" onClick={startConversation} disabled={nodes.length === 0}>
              <Play className="w-3 h-3 mr-1" />
              Iniciar
            </Button>
            <Button size="sm" variant="outline" onClick={resetConversation}>
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
                  <div className="text-xs opacity-80">
                    {isWaitingForInput ? 'Digitando...' : 'Online'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Video className="w-4 h-4" />
                  <Phone className="w-4 h-4" />
                  <MoreVertical className="w-4 h-4" />
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 bg-gray-100 p-3 overflow-y-auto">
                {nodes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">Adicione nós ao fluxo</p>
                    <p className="text-xs">para ver a simulação</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">▶️</div>
                    <p className="text-sm">Clique em "Iniciar"</p>
                    <p className="text-xs">para testar o fluxo</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`${
                          message.type === 'bot' ? 'bg-white' : 'bg-green-500 text-white'
                        } rounded-lg px-3 py-2 max-w-xs shadow-sm`}>
                          <p className="text-sm whitespace-pre-line">{message.content}</p>
                          <span className={`text-xs ${message.type === 'bot' ? 'text-gray-500' : 'opacity-80'}`}>
                            {message.timestamp}
                          </span>
                        </div>
                      </div>
                    ))}
                    {renderQuickReplies()}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="bg-white border-t p-3 flex items-center gap-2">
                <Smile className="w-5 h-5 text-gray-500" />
                <div className="flex-1 bg-gray-100 rounded-full px-3 py-2 flex items-center gap-2">
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isWaitingForInput ? "Digite sua resposta..." : "Aguardando..."}
                    className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                    disabled={!isWaitingForInput}
                  />
                  <Paperclip className="w-4 h-4 text-gray-500" />
                </div>
                <Button
                  size="sm"
                  className="w-8 h-8 bg-green-500 rounded-full p-0 hover:bg-green-600"
                  onClick={sendMessage}
                  disabled={!isWaitingForInput || !userInput.trim()}
                >
                  <Send className="w-4 h-4 text-white" />
                </Button>
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
