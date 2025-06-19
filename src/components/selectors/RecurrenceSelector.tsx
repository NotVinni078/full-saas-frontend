
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Repeat, Clock } from 'lucide-react';

/**
 * Componente para seleção de recorrência de agendamentos
 * Suporte para múltiplos tipos de recorrência e opção personalizada
 * Design responsivo e integrado com sistema de cores
 */

interface RecurrenceSelectorProps {
  value: string;
  customDays: number;
  onValueChange: (value: string) => void;
  onCustomDaysChange: (days: number) => void;
  className?: string;
}

const RecurrenceSelector = ({
  value,
  customDays,
  onValueChange,
  onCustomDaysChange,
  className
}: RecurrenceSelectorProps) => {

  const recurrenceOptions = [
    { value: 'daily', label: 'Diária', description: 'Todo dia' },
    { value: 'weekly', label: 'Semanal', description: 'Toda semana' },
    { value: 'monthly', label: 'Mensal', description: 'Todo mês' },
    { value: 'quarterly', label: 'Trimestral', description: 'A cada 3 meses' },
    { value: 'semiannual', label: 'Semestral', description: 'A cada 6 meses' },
    { value: 'annual', label: 'Anual', description: '1 vez por ano' },
    { value: 'custom', label: 'Personalizado', description: 'Definir intervalo' }
  ];

  /**
   * Obtém descrição da recorrência selecionada
   */
  const getRecurrenceDescription = () => {
    if (!value) return '';
    
    if (value === 'custom') {
      const days = customDays || 1;
      return `A cada ${days} dia${days > 1 ? 's' : ''}`;
    }
    
    const option = recurrenceOptions.find(opt => opt.value === value);
    return option?.description || '';
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Seletor principal de recorrência */}
        <div>
          <Label className="text-foreground mb-2 block">Tipo de Recorrência</Label>
          <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="bg-background border-border">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Selecionar tipo..." />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {recurrenceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Campo personalizado para dias */}
        {value === 'custom' && (
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div className="flex items-center gap-2 flex-1">
                  <Label className="text-sm text-foreground whitespace-nowrap">
                    A cada
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={customDays}
                    onChange={(e) => onCustomDaysChange(parseInt(e.target.value) || 1)}
                    className="w-20 text-center"
                  />
                  <Label className="text-sm text-foreground">
                    dia{customDays > 1 ? 's' : ''}
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exibir resumo da recorrência selecionada */}
        {value && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                {getRecurrenceDescription()}
              </span>
            </div>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="text-xs text-muted-foreground">
          <p>💡 A recorrência será aplicada a partir da data selecionada</p>
          <p>⚠️ Verifique se o canal suporta agendamentos recorrentes</p>
        </div>
      </div>
    </div>
  );
};

export default RecurrenceSelector;
