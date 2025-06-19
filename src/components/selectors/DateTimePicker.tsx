
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from "@/lib/utils";

/**
 * Componente para seleção de data e hora
 * Inclui mini-calendário para seleção de data e campo de tempo
 * Design responsivo e integrado com sistema de cores
 */

interface DateTimePickerProps {
  selectedDate?: Date;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
  className?: string;
}

const DateTimePicker = ({
  selectedDate,
  selectedTime,
  onDateChange,
  onTimeChange,
  className
}: DateTimePickerProps) => {
  
  /**
   * Formata data para exibição
   */
  const formatDate = (date: Date | undefined): string => {
    if (!date || !isValid(date)) return '';
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
  };

  /**
   * Gera opções de horário (intervalos de 30 minutos)
   */
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {/* Seletor de Data */}
      <div className="space-y-2">
        <Label className="text-foreground">Data *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? formatDate(selectedDate) : "Selecionar data"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateChange}
              disabled={(date) => date < new Date()} // Impede seleção de datas passadas
              initialFocus
              className="pointer-events-auto"
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Seletor de Hora */}
      <div className="space-y-2">
        <Label className="text-foreground">Hora *</Label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className="pl-10 bg-background border-border text-foreground"
            step="1800" // Intervalos de 30 minutos
            min="00:00"
            max="23:59"
          />
        </div>
        
        {/* Horários sugeridos */}
        <div className="flex flex-wrap gap-1 mt-2">
          {['08:00', '09:00', '14:00', '15:00', '18:00'].map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeChange(time)}
              className="text-xs px-2 py-1 h-auto"
            >
              {time}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
