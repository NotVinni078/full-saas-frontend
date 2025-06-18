
import React, { useState, useEffect } from 'react';
import HorariosTrabalho from './HorariosTrabalho';
import { useAjustes } from '@/pages/Ajustes';

interface HorarioTrabalho {
  ativo: boolean;
  inicio: string;
  fim: string;
}

interface Setor {
  id: string;
  nome: string;
  horarios: Record<string, HorarioTrabalho>;
}

const AjustesExpediente = () => {
  const { agendamentoTipo } = useAjustes();
  const [horariosEmpresa, setHorariosEmpresa] = useState<Record<string, HorarioTrabalho>>({});
  const [setores, setSetores] = useState<Setor[]>([]);
  const [horariosCargos, setHorariosCargos] = useState<Record<string, Record<string, HorarioTrabalho>>>({});

  // Simulação de dados dos setores (normalmente viriam da API)
  useEffect(() => {
    // Simulando setores existentes
    const setoresSimulados: Setor[] = [
      { id: '1', nome: 'Vendas', horarios: {} },
      { id: '2', nome: 'Suporte', horarios: {} },
      { id: '3', nome: 'Financeiro', horarios: {} }
    ];
    setSetores(setoresSimulados);

    // Inicializar horários padrão
    const horariosDefault: Record<string, HorarioTrabalho> = {
      segunda: { ativo: true, inicio: '08:00', fim: '18:00' },
      terca: { ativo: true, inicio: '08:00', fim: '18:00' },
      quarta: { ativo: true, inicio: '08:00', fim: '18:00' },
      quinta: { ativo: true, inicio: '08:00', fim: '18:00' },
      sexta: { ativo: true, inicio: '08:00', fim: '18:00' },
      sabado: { ativo: false, inicio: '08:00', fim: '12:00' },
      domingo: { ativo: false, inicio: '08:00', fim: '12:00' }
    };

    setHorariosEmpresa(horariosDefault);

    // Inicializar horários para cargos
    setHorariosCargos({
      supervisor: { ...horariosDefault },
      atendente: { ...horariosDefault }
    });
  }, []);

  const handleHorarioEmpresaChange = (dia: string, horario: HorarioTrabalho) => {
    setHorariosEmpresa(prev => ({
      ...prev,
      [dia]: horario
    }));
  };

  const handleHorarioSetorChange = (setorId: string, dia: string, horario: HorarioTrabalho) => {
    setSetores(prev => prev.map(setor => 
      setor.id === setorId 
        ? { ...setor, horarios: { ...setor.horarios, [dia]: horario } }
        : setor
    ));
  };

  const handleHorarioCargoChange = (cargo: string, dia: string, horario: HorarioTrabalho) => {
    setHorariosCargos(prev => ({
      ...prev,
      [cargo]: {
        ...prev[cargo],
        [dia]: horario
      }
    }));
  };

  const renderContent = () => {
    switch (agendamentoTipo) {
      case 'empresa':
        return (
          <HorariosTrabalho
            titulo="Horários da Empresa"
            horarios={horariosEmpresa}
            onChange={handleHorarioEmpresaChange}
          />
        );

      case 'setor':
        return (
          <div className="space-y-6">
            {setores.map((setor) => (
              <HorariosTrabalho
                key={setor.id}
                titulo={`Horários do Setor: ${setor.nome}`}
                horarios={setor.horarios}
                onChange={(dia, horario) => handleHorarioSetorChange(setor.id, dia, horario)}
              />
            ))}
          </div>
        );

      case 'cargo':
        return (
          <div className="space-y-6">
            <HorariosTrabalho
              titulo="Horários - Supervisor"
              horarios={horariosCargos.supervisor || {}}
              onChange={(dia, horario) => handleHorarioCargoChange('supervisor', dia, horario)}
            />
            <HorariosTrabalho
              titulo="Horários - Atendente"
              horarios={horariosCargos.atendente || {}}
              onChange={(dia, horario) => handleHorarioCargoChange('atendente', dia, horario)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Expediente</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Configure os horários de expediente baseado no tipo selecionado em Opções: <span className="font-semibold capitalize">{agendamentoTipo}</span>
        </p>
      </div>
      
      {renderContent()}
    </div>
  );
};

export default AjustesExpediente;
