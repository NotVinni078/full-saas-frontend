
import React from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Zap, CreditCard, Mail } from 'lucide-react';

const Integracoes = () => {
  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Integrações</h1>
        
        <Tabs defaultValue="automacoes" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="automacoes" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Automações
            </TabsTrigger>
            <TabsTrigger value="pagamento" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Integrações de Pagamento
            </TabsTrigger>
            <TabsTrigger value="smtp" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              SMTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="automacoes" className="space-y-4">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-3">Automações</h2>
              <p className="text-gray-600 mb-4">
                Configure automações para otimizar seus processos de atendimento.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Respostas Automáticas</h3>
                  <p className="text-sm text-gray-600">Configure respostas automáticas para mensagens recebidas fora do horário comercial.</p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Distribuição de Atendimento</h3>
                  <p className="text-sm text-gray-600">Defina regras para distribuição automática de conversas entre atendentes.</p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Webhooks</h3>
                  <p className="text-sm text-gray-600">Configure webhooks para integrar com sistemas externos.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pagamento" className="space-y-4">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-3">Integrações de Pagamento</h2>
              <p className="text-gray-600 mb-4">
                Configure gateways de pagamento para processar transações diretamente no chat.
              </p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Mercado Pago</h3>
                  <p className="text-sm text-gray-600">Integre com Mercado Pago para processar pagamentos via PIX, cartão e boleto.</p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Stripe</h3>
                  <p className="text-sm text-gray-600">Configure Stripe para aceitar pagamentos internacionais com cartão de crédito.</p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">PagSeguro</h3>
                  <p className="text-sm text-gray-600">Integre com PagSeguro para oferecer múltiplas opções de pagamento.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="smtp" className="space-y-4">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-xl font-semibold mb-3">Configuração SMTP</h2>
              <p className="text-gray-600 mb-4">
                Configure seu servidor de email para envio de notificações e relatórios.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Gmail SMTP</h3>
                  <p className="text-sm text-gray-600">Configure Gmail para envio de emails através do sistema.</p>
                </div>
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium mb-2">Servidor Personalizado</h3>
                  <p className="text-sm text-gray-600">Configure um servidor SMTP personalizado para seu domínio.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default Integracoes;
