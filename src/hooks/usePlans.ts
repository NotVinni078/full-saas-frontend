
import { useState, useCallback } from 'react';

/**
 * Interface para definir a estrutura de um plano
 */
export interface Plan {
  id: string;
  name: string;
  type: 'Publico' | 'Personalizado';
  userLimit: number;
  value: number; // Valor do plano em R$
  features: {
    chatInterno: boolean;
    agendamentos: boolean;
    tarefas: boolean;
    campanhas: boolean;
    integracaoAPI: boolean;
    whiteLabel: boolean;
  };
  channels: {
    whatsappQR: number;
    whatsappAPI: number;
    instagram: number;
    facebook: number;
    telegram: number;
    webchat: number;
  };
}

/**
 * Hook customizado para gerenciar os dados dos planos
 * Fornece funções para criar, editar, excluir e buscar planos
 * Utiliza localStorage para persistência dos dados
 */
export const usePlans = () => {
  // Estado inicial com alguns planos de exemplo
  const [plans, setPlans] = useState<Plan[]>(() => {
    const savedPlans = localStorage.getItem('plans');
    if (savedPlans) {
      return JSON.parse(savedPlans);
    }
    
    // Planos de exemplo iniciais com valores
    return [
      {
        id: '1',
        name: 'Plano Básico',
        type: 'Publico' as const,
        userLimit: 5,
        value: 97.90,
        features: {
          chatInterno: true,
          agendamentos: false,
          tarefas: true,
          campanhas: false,
          integracaoAPI: false,
          whiteLabel: false,
        },
        channels: {
          whatsappQR: 2,
          whatsappAPI: 0,
          instagram: 1,
          facebook: 1,
          telegram: 0,
          webchat: 1,
        },
      },
      {
        id: '2',
        name: 'Plano Premium',
        type: 'Publico' as const,
        userLimit: 20,
        value: 197.90,
        features: {
          chatInterno: true,
          agendamentos: true,
          tarefas: true,
          campanhas: true,
          integracaoAPI: true,
          whiteLabel: false,
        },
        channels: {
          whatsappQR: 5,
          whatsappAPI: 3,
          instagram: 3,
          facebook: 3,
          telegram: 2,
          webchat: 5,
        },
      },
      {
        id: '3',
        name: 'Plano Empresarial',
        type: 'Personalizado' as const,
        userLimit: 100,
        value: 497.90,
        features: {
          chatInterno: true,
          agendamentos: true,
          tarefas: true,
          campanhas: true,
          integracaoAPI: true,
          whiteLabel: true,
        },
        channels: {
          whatsappQR: 10,
          whatsappAPI: 10,
          instagram: 5,
          facebook: 5,
          telegram: 5,
          webchat: 10,
        },
      },
    ];
  });

  /**
   * Salva os planos no localStorage
   */
  const savePlansToStorage = useCallback((updatedPlans: Plan[]) => {
    localStorage.setItem('plans', JSON.stringify(updatedPlans));
  }, []);

  /**
   * Gera um ID único para um novo plano
   */
  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  /**
   * Cria um novo plano
   */
  const createPlan = useCallback((planData: Omit<Plan, 'id'>) => {
    const newPlan: Plan = {
      ...planData,
      id: generateId(),
    };

    setPlans(prevPlans => {
      const updatedPlans = [...prevPlans, newPlan];
      savePlansToStorage(updatedPlans);
      return updatedPlans;
    });

    console.log('✅ Novo plano criado:', newPlan);
  }, [generateId, savePlansToStorage]);

  /**
   * Atualiza um plano existente
   */
  const updatePlan = useCallback((planId: string, planData: Omit<Plan, 'id'>) => {
    setPlans(prevPlans => {
      const updatedPlans = prevPlans.map(plan =>
        plan.id === planId ? { ...planData, id: planId } : plan
      );
      savePlansToStorage(updatedPlans);
      return updatedPlans;
    });

    console.log('✏️ Plano atualizado:', planId);
  }, [savePlansToStorage]);

  /**
   * Exclui um plano
   */
  const deletePlan = useCallback((planId: string) => {
    setPlans(prevPlans => {
      const updatedPlans = prevPlans.filter(plan => plan.id !== planId);
      savePlansToStorage(updatedPlans);
      return updatedPlans;
    });

    console.log('🗑️ Plano excluído:', planId);
  }, [savePlansToStorage]);

  /**
   * Busca um plano por ID
   */
  const getPlanById = useCallback((planId: string) => {
    return plans.find(plan => plan.id === planId);
  }, [plans]);

  /**
   * Filtra planos por tipo
   */
  const getPlansByType = useCallback((type: 'Publico' | 'Personalizado') => {
    return plans.filter(plan => plan.type === type);
  }, [plans]);

  return {
    plans,
    createPlan,
    updatePlan,
    deletePlan,
    getPlanById,
    getPlansByType,
  };
};
