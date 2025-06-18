import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodesPanel from './NodesPanel';
import MessageNode from './nodes/MessageNode';
import QuestionNode from './nodes/QuestionNode';
import MenuNode from './nodes/MenuNode';
import TransferNode from './nodes/TransferNode';
import EndNode from './nodes/EndNode';
import QuickRepliesNode from './nodes/QuickRepliesNode';
import ChatbotTransferNode from './nodes/ChatbotTransferNode';
import DelayNode from './nodes/DelayNode';
import MediaNode from './nodes/MediaNode';

const nodeTypes: NodeTypes = {
  message: MessageNode,
  question: QuestionNode,
  menu: MenuNode,
  transfer: TransferNode,
  end: EndNode,
  'quick-replies': QuickRepliesNode,
  'chatbot-transfer': ChatbotTransferNode,
  delay: DelayNode,
  media: MediaNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
}

const FlowCanvas = ({ nodes: initialNodes, edges: initialEdges, onNodesChange, onEdgesChange }: FlowCanvasProps) => {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  // Adicionar listener para tecla Delete
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        const selectedNodes = nodes.filter(node => node.selected);
        const selectedEdges = edges.filter(edge => edge.selected);
        
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          // Remover nós selecionados
          const remainingNodes = nodes.filter(node => !node.selected);
          setNodes(remainingNodes);
          onNodesChange(remainingNodes);
          
          // Remover arestas selecionadas e arestas conectadas aos nós removidos
          const selectedNodeIds = selectedNodes.map(node => node.id);
          const remainingEdges = edges.filter(edge => 
            !edge.selected && 
            !selectedNodeIds.includes(edge.source) && 
            !selectedNodeIds.includes(edge.target)
          );
          setEdges(remainingEdges);
          onEdgesChange(remainingEdges);
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge(params, edges);
      setEdges(newEdges);
      onEdgesChange(newEdges);
    },
    [edges, onEdgesChange, setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type} node`,
          content: type === 'message' ? 'Digite sua mensagem aqui...' : '',
          options: type === 'menu' ? ['Opção 1', 'Opção 2'] : [],
        },
      };

      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      onNodesChange(newNodes);
    },
    [reactFlowInstance, nodes, setNodes, onNodesChange]
  );

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChangeInternal(changes);
    setTimeout(() => {
      setNodes(currentNodes => {
        onNodesChange(currentNodes);
        return currentNodes;
      });
    }, 0);
  }, [onNodesChangeInternal, onNodesChange, setNodes]);

  const handleEdgesChange = useCallback((changes: any) => {
    onEdgesChangeInternal(changes);
    setTimeout(() => {
      setEdges(currentEdges => {
        onEdgesChange(currentEdges);
        return currentEdges;
      });
    }, 0);
  }, [onEdgesChangeInternal, onEdgesChange, setEdges]);

  return (
    <div className="h-full flex">
      <div className="w-64 border-r bg-muted/30">
        <NodesPanel />
      </div>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          deleteKeyCode={['Delete', 'Backspace']}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowCanvas;
