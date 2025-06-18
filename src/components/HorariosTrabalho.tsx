
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface HorarioTrabalho {
  ativo: boolean;
  inicio: string;
  fim: string;
}

interface HorariosTrabalhoProps {
  titulo: string;
  horarios: Record<string, HorarioTrabalho>;
  onChange: (dia: string, horario: HorarioTrabalho) => void;
}

const HorariosTrabalho: React.FC<HorariosTrabalhoProps> = ({ titulo, horarios, onChange }) => {
  const diasSemana = [
    { key: 'segunda', label: 'Segunda-feira' },
    { key: 'terca', label: 'Terça-feira' },
    { key: 'quarta', label: 'Quarta-feira' },
    { key: 'quinta', label: 'Quinta-feira' },
    { key: 'sexta', label: 'Sexta-feira' },
    { key: 'sabado', label: 'Sábado' },
    { key: 'domingo', label: 'Domingo' }
  ];

  const handleToggle = (dia: string, ativo: boolean) => {
    onChange(dia, { ...horarios[dia], ativo });
  };

  const handleHorarioChange = (dia: string, campo: 'inicio' | 'fim', valor: string) => {
    onChange(dia, { ...horarios[dia], [campo]: valor });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg text-card-foreground">{titulo}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure os horários de funcionamento para cada dia da semana
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {diasSemana.map((dia) => (
          <div key={dia.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-foreground">{dia.label}</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={horarios[dia.key]?.ativo || false}
                  onCheckedChange={(checked) => handleToggle(dia.key, checked)}
                  className="data-[state=checked]:bg-foreground data-[state=unchecked]:bg-input"
                />
                <span className="text-xs text-muted-foreground">
                  {horarios[dia.key]?.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            
            {horarios[dia.key]?.ativo && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor={`${dia.key}-inicio`} className="text-xs text-muted-foreground">
                    Início
                  </Label>
                  <Input
                    id={`${dia.key}-inicio`}
                    type="time"
                    value={horarios[dia.key]?.inicio || '08:00'}
                    onChange={(e) => handleHorarioChange(dia.key, 'inicio', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${dia.key}-fim`} className="text-xs text-muted-foreground">
                    Fim
                  </Label>
                  <Input
                    id={`${dia.key}-fim`}
                    type="time"
                    value={horarios[dia.key]?.fim || '18:00'}
                    onChange={(e) => handleHorarioChange(dia.key, 'fim', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HorariosTrabalho;
