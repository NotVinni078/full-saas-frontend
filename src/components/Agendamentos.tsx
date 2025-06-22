
import React from 'react';
import SchedulesPage from './schedules/SchedulesPage';

/**
 * Componente de Agendamentos - Sistema completo de mensagens agendadas
 * Integra com Supabase para persistência de dados
 * Suporte a recorrência e múltiplos canais
 */
const Agendamentos: React.FC = () => {
  return <SchedulesPage />;
};

export default Agendamentos;
