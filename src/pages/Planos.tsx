
import React, { useState, useMemo } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Crown, Star } from 'lucide-react';
import { usePlans } from '@/hooks/usePlans';
import ChannelLogo from '@/components/plans/ChannelLogos';

/**
 * Página principal de catálogo de planos públicos
 * Exibe planos disponíveis para contratação, com destaque para o plano ativo
 * Utiliza cores dinâmicas da gestão de marca automaticamente
 * Responsiva para desktop, tablet e mobile (tablet e mobile com mesmo comportamento)
 */
const Planos = () => {
  // Estado para controlar o termo de busca dos planos
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook personalizado para acessar os dados dos planos
  const { plans, getPlansByType } = usePlans();

  // Simula o plano ativo do usuário (primeiro plano público como exemplo)
  // Em uma implementação real, isso viria de um contexto de usuário ou API
  const activePlan = useMemo(() => {
    const publicPlans = getPlansByType('Publico');
    return publicPlans.length > 0 ? publicPlans[0] : null;
  }, [getPlansByType]);

  // Filtra apenas os planos públicos para exibição no catálogo
  const publicPlans = useMemo(() => {
    return getPlansByType('Publico');
  }, [getPlansByType]);

  // Aplica filtro de busca nos planos públicos
  const filteredPublicPlans = useMemo(() => {
    return publicPlans.filter(plan =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [publicPlans, searchTerm]);

  /**
   * Formata o valor do plano para exibição em moeda brasileira
   */
  const formatPrice = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  /**
   * Calcula o total de funcionalidades ativas em um plano
   */
  const getActiveFeaturesCount = (features: any): number => {
    return Object.values(features).filter(Boolean).length;
  };

  /**
   * Calcula o total de conexões permitidas somando todos os canais
   */
  const getTotalConnections = (channels: any): number => {
    return Object.values(channels).reduce((sum: number, count: unknown) => sum + (count as number), 0);
  };

  /**
   * Manipula a ação de contratar/obter informações sobre um plano
   */
  const handlePlanAction = (planId: string, planName: string) => {
    // Aqui seria implementada a lógica de contratação ou exibição de mais informações
    console.log(`Ação solicitada para o plano: ${planName} (ID: ${planId})`);
    alert(`Mais informações sobre o plano "${planName}" em breve!`);
  };

  return (
    <SidebarLayout>
      {/* Container principal com padding responsivo */}
      <div className="p-4 md:p-6 bg-background min-h-full">
        
        {/* Cabeçalho da página com título principal */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Planos
          </h1>
          <p className="text-muted-foreground">
            Conheça nossos planos disponíveis e escolha o ideal para sua empresa.
          </p>
        </div>

        {/* Barra de pesquisa para filtrar planos */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Layout responsivo principal: desktop (2 colunas), tablet/mobile (1 coluna) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
          
          {/* Seção "Meu Plano" - Plano ativo do usuário */}
          <div className="xl:col-span-4">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Meu Plano
              </h2>
              <p className="text-sm text-muted-foreground">
                Seu plano atual ativo
              </p>
            </div>

            {/* Card do plano ativo */}
            {activePlan ? (
              <Card className="bg-card border-primary/20 shadow-lg relative overflow-hidden">
                {/* Destaque visual para o plano ativo */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-foreground text-lg">
                          {activePlan.name}
                        </CardTitle>
                        <Badge variant="default" className="text-xs bg-primary text-primary-foreground">
                          ATIVO
                        </Badge>
                      </div>
                      
                      {/* Valor do plano em destaque */}
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(activePlan.value)}
                      </div>
                    </div>
                    
                    {/* Ícone de estrela para destacar o plano ativo */}
                    <Star className="h-6 w-6 text-primary fill-current" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Informações básicas do plano ativo */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Usuários</p>
                      <p className="font-medium text-foreground">{activePlan.userLimit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conexões</p>
                      <p className="font-medium text-foreground">{getTotalConnections(activePlan.channels)}</p>
                    </div>
                  </div>

                  {/* Contador de funcionalidades */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Funcionalidades ({getActiveFeaturesCount(activePlan.features)}/6)
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(activePlan.features).map(([key, enabled]) => (
                        enabled && (
                          <Badge
                            key={key}
                            variant="outline"
                            className="text-xs border-primary/20 text-primary bg-primary/5"
                          >
                            {key === 'chatInterno' && 'Chat Interno'}
                            {key === 'agendamentos' && 'Agendamentos'}
                            {key === 'tarefas' && 'Tarefas'}
                            {key === 'campanhas' && 'Campanhas'}
                            {key === 'integracaoAPI' && 'API'}
                            {key === 'whiteLabel' && 'White Label'}
                          </Badge>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Canais ativos com logos */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      Canais Ativos
                    </p>
                    <div className="space-y-2">
                      {Object.entries(activePlan.channels).map(([key, count]) => (
                        count > 0 && (
                          <div key={key} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <ChannelLogo channel={key} size="sm" />
                              <span className="text-xs text-muted-foreground">
                                {key === 'whatsappQR' && 'WhatsApp QR'}
                                {key === 'whatsappAPI' && 'WhatsApp API'}
                                {key === 'instagram' && 'Instagram'}
                                {key === 'facebook' && 'Facebook'}
                                {key === 'telegram' && 'Telegram'}
                                {key === 'webchat' && 'WebChat'}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {count}
                            </Badge>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Mensagem quando não há plano ativo */
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    Você ainda não possui um plano ativo.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Escolha um dos planos disponíveis abaixo.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Seção de planos públicos disponíveis */}
          <div className="xl:col-span-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Planos Disponíveis
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore nossos planos públicos disponíveis para contratação
              </p>
            </div>

            {/* Grid responsivo dos cards de planos públicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {filteredPublicPlans.length > 0 ? (
                filteredPublicPlans.map((plan) => (
                  <Card key={plan.id} className="bg-card border-border hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <div className="space-y-2">
                        <CardTitle className="text-foreground text-lg">
                          {plan.name}
                        </CardTitle>
                        
                        {/* Valor do plano em destaque */}
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(plan.value)}
                        </div>
                        
                        {/* Badge indicando que é plano público */}
                        <Badge variant="outline" className="text-xs w-fit">
                          Público
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Informações resumidas do plano */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Usuários</p>
                          <p className="font-medium text-foreground">{plan.userLimit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Conexões</p>
                          <p className="font-medium text-foreground">{getTotalConnections(plan.channels)}</p>
                        </div>
                      </div>

                      {/* Funcionalidades principais */}
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">
                          Funcionalidades ({getActiveFeaturesCount(plan.features)}/6)
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(plan.features).slice(0, 3).map(([key, enabled]) => (
                            enabled && (
                              <Badge
                                key={key}
                                variant="outline"
                                className="text-xs border-primary/20 text-primary bg-primary/5"
                              >
                                {key === 'chatInterno' && 'Chat'}
                                {key === 'agendamentos' && 'Agenda'}
                                {key === 'tarefas' && 'Tarefas'}
                                {key === 'campanhas' && 'Campanhas'}
                                {key === 'integracaoAPI' && 'API'}
                                {key === 'whiteLabel' && 'White Label'}
                              </Badge>
                            )
                          ))}
                          {getActiveFeaturesCount(plan.features) > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{getActiveFeaturesCount(plan.features) - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Botão de ação para contratar/obter informações */}
                      <div className="pt-2">
                        <Button
                          onClick={() => handlePlanAction(plan.id, plan.name)}
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                          size="sm"
                        >
                          Obter mais informações ou Contratar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                /* Mensagem quando não há planos públicos encontrados */
                <div className="col-span-full text-center py-12">
                  <div className="text-muted-foreground">
                    {searchTerm ? (
                      <div>
                        <p>Nenhum plano encontrado para "{searchTerm}"</p>
                        <p className="text-sm mt-2">Tente buscar com outros termos.</p>
                      </div>
                    ) : (
                      <div>
                        <p>Nenhum plano público disponível no momento.</p>
                        <p className="text-sm mt-2">Em breve novos planos serão disponibilizados.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Planos;
