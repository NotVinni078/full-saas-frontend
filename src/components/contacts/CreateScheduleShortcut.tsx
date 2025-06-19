
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Clock, User, MessageSquare, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * Componente de atalho para criar agendamento
 * Reutiliza a funcionalidade da página de agendamentos
 * Modal simplificado para criação rápida de agendamentos
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface CreateScheduleShortcutProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
  };
}

const CreateScheduleShortcut = ({ isOpen, onClose, contact }: CreateScheduleShortcutProps) => {
  // Estados para o formulário de agendamento
  const [scheduleData, setScheduleData] = useState({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    tipo: 'ligacao',
    prioridade: 'media'
  });

  /**
   * Manipula mudanças nos campos do formulário
   * @param {string} field - Campo sendo alterado
   * @param {string} value - Novo valor do campo
   */
  const handleFieldChange = (field: string, value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Salva o agendamento
   */
  const handleSaveSchedule = () => {
    // Validações básicas
    if (!scheduleData.titulo || !scheduleData.data || !scheduleData.hora) {
      alert('Por favor, preencha os campos obrigatórios (título, data e hora)');
      return;
    }

    // Cria objeto do agendamento
    const newSchedule = {
      id: Date.now().toString(),
      titulo: scheduleData.titulo,
      descricao: scheduleData.descricao,
      data: scheduleData.data,
      hora: scheduleData.hora,
      tipo: scheduleData.tipo,
      prioridade: scheduleData.prioridade,
      contato: contact ? {
        id: contact.id,
        nome: contact.nome,
        telefone: contact.telefone,
        email: contact.email
      } : null,
      status: 'agendado',
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    // Aqui você integraria com o sistema de agendamentos existente
    console.log('Novo agendamento criado:', newSchedule);
    
    // TODO: Integrar com hook ou context de agendamentos
    // addSchedule(newSchedule);
    
    // Limpa formulário e fecha modal
    setScheduleData({
      titulo: '',
      descricao: '',
      data: '',
      hora: '',
      tipo: 'ligacao',
      prioridade: 'media'
    });
    
    alert('Agendamento criado com sucesso!');
    onClose();
  };

  /**
   * Fecha modal e limpa dados
   */
  const handleClose = () => {
    setScheduleData({
      titulo: '',
      descricao: '',
      data: '',
      hora: '',
      tipo: 'ligacao',
      prioridade: 'media'
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] mx-4 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Criar Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Informações do contato se disponível */}
          {contact && (
            <div className="bg-muted/30 p-3 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="font-medium text-foreground">{contact.nome}</span>
                  {contact.telefone && (
                    <span className="text-muted-foreground ml-2">• {contact.telefone}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Formulário de agendamento */}
          <div className="grid gap-4">
            {/* Título do agendamento */}
            <div className="space-y-2">
              <Label htmlFor="titulo" className="text-foreground">
                Título do Agendamento *
              </Label>
              <Input
                id="titulo"
                placeholder="Ex: Retorno sobre proposta"
                value={scheduleData.titulo}
                onChange={(e) => handleFieldChange('titulo', e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Data e hora */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data" className="text-foreground">
                  Data *
                </Label>
                <Input
                  id="data"
                  type="date"
                  value={scheduleData.data}
                  onChange={(e) => handleFieldChange('data', e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hora" className="text-foreground">
                  Hora *
                </Label>
                <Input
                  id="hora"
                  type="time"
                  value={scheduleData.hora}
                  onChange={(e) => handleFieldChange('hora', e.target.value)}
                  className="bg-background border-border text-foreground"
                />
              </div>
            </div>

            {/* Tipo e prioridade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Tipo</Label>
                <Select value={scheduleData.tipo} onValueChange={(value) => handleFieldChange('tipo', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="ligacao">Ligação</SelectItem>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="visita">Visita</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Prioridade</Label>
                <Select value={scheduleData.prioridade} onValueChange={(value) => handleFieldChange('prioridade', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-foreground">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                placeholder="Descreva os detalhes do agendamento..."
                rows={3}
                value={scheduleData.descricao}
                onChange={(e) => handleFieldChange('descricao', e.target.value)}
                className="bg-background border-border text-foreground resize-none"
              />
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="border-border text-foreground hover:bg-accent"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveSchedule}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Criar Agendamento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateScheduleShortcut;
