
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import PlanModal from '@/components/plans/PlanModal';
import PlanCard from '@/components/plans/PlanCard';
import { usePlans } from '@/hooks/usePlans';

/**
 * Página principal de Gestão de Planos
 * Permite criar, editar, excluir e buscar planos do sistema
 * Utiliza cores dinâmicas da gestão de marca automaticamente
 * Responsiva para desktop, tablet e mobile
 */
const GestaoPlanos = () => {
  // Estado para controlar a abertura/fechamento do modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para controlar qual plano está sendo editado (null = criando novo)
  const [editingPlan, setEditingPlan] = useState(null);
  
  // Estado para o termo de busca dos planos
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hook customizado para gerenciar os dados dos planos
  const { plans, createPlan, updatePlan, deletePlan } = usePlans();

  /**
   * Manipula a abertura do modal para criar um novo plano
   * Limpa o plano sendo editado e abre o modal
   */
  const handleNewPlan = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  /**
   * Manipula a abertura do modal para editar um plano existente
   * Define o plano a ser editado e abre o modal
   */
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  /**
   * Manipula o fechamento do modal
   * Limpa o plano sendo editado e fecha o modal
   */
  const handleCloseModal = () => {
    setEditingPlan(null);
    setIsModalOpen(false);
  };

  /**
   * Manipula o salvamento de um plano (criação ou edição)
   * Chama a função apropriada baseada se está editando ou criando
   */
  const handleSavePlan = (planData) => {
    if (editingPlan) {
      // Editando plano existente
      updatePlan(editingPlan.id, planData);
    } else {
      // Criando novo plano
      createPlan(planData);
    }
    handleCloseModal();
  };

  /**
   * Manipula a exclusão de um plano
   * Remove o plano da lista após confirmação
   */
  const handleDeletePlan = (planId) => {
    if (window.confirm('Tem certeza que deseja excluir este plano?')) {
      deletePlan(planId);
    }
  };

  /**
   * Filtra os planos baseado no termo de busca
   * Busca pelo nome do plano (case-insensitive)
   */
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SidebarLayout>
      {/* Container principal com padding responsivo */}
      <div className="p-4 md:p-6 bg-background min-h-full">
        {/* Cabeçalho da página */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Gestão de Planos
          </h1>
          <p className="text-muted-foreground">
            Configure e gerencie os planos de serviço disponíveis no sistema.
          </p>
        </div>

        {/* Barra de ações - Busca e Novo Plano */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Campo de busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Botão para criar novo plano */}
          <Button
            onClick={handleNewPlan}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {/* Lista de planos em formato de cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredPlans.length > 0 ? (
            filteredPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={() => handleEditPlan(plan)}
                onDelete={() => handleDeletePlan(plan.id)}
              />
            ))
          ) : (
            /* Mensagem quando não há planos */
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm ? (
                  <p>Nenhum plano encontrado para "{searchTerm}"</p>
                ) : (
                  <p>Nenhum plano cadastrado. Clique em "Novo Plano" para começar.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal para criação/edição de planos */}
        <PlanModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePlan}
          plan={editingPlan}
        />
      </div>
    </SidebarLayout>
  );
};

export default GestaoPlanos;
