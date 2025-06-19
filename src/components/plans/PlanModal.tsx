
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ChannelRow } from './ChannelLogos';

/**
 * Interface para definir a estrutura de um plano
 */
interface Plan {
  id?: string;
  name: string;
  type: 'Publico' | 'Personalizado';
  userLimit: number;
  value: number;
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

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (planData: Omit<Plan, 'id'>) => void;
  plan?: Plan | null;
}

/**
 * Modal para criação e edição de planos
 * Permite configurar todas as opções disponíveis para um plano
 * Utiliza cores dinâmicas da gestão de marca
 * Responsivo para todos os tamanhos de tela
 * Corrigido dropdown transparente e logos dos canais
 */
const PlanModal = ({ isOpen, onClose, onSave, plan }: PlanModalProps) => {
  // Estado inicial do formulário
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
    name: '',
    type: 'Publico',
    userLimit: 1,
    value: 0,
    features: {
      chatInterno: false,
      agendamentos: false,
      tarefas: false,
      campanhas: false,
      integracaoAPI: false,
      whiteLabel: false,
    },
    channels: {
      whatsappQR: 0,
      whatsappAPI: 0,
      instagram: 0,
      facebook: 0,
      telegram: 0,
      webchat: 0,
    },
  });

  /**
   * Efeito para carregar dados do plano quando estiver editando
   * Reseta o formulário quando o modal é fechado
   */
  useEffect(() => {
    if (plan) {
      // Carregando dados do plano para edição
      setFormData({
        name: plan.name,
        type: plan.type,
        userLimit: plan.userLimit,
        value: plan.value || 0,
        features: { ...plan.features },
        channels: { ...plan.channels },
      });
    } else {
      // Resetando formulário para novo plano
      setFormData({
        name: '',
        type: 'Publico',
        userLimit: 1,
        value: 0,
        features: {
          chatInterno: false,
          agendamentos: false,
          tarefas: false,
          campanhas: false,
          integracaoAPI: false,
          whiteLabel: false,
        },
        channels: {
          whatsappQR: 0,
          whatsappAPI: 0,
          instagram: 0,
          facebook: 0,
          telegram: 0,
          webchat: 0,
        },
      });
    }
  }, [plan, isOpen]);

  /**
   * Manipula mudanças nos campos de texto e número
   */
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Manipula mudanças nos toggles de funcionalidades
   */
  const handleFeatureChange = (feature: string, enabled: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: enabled,
      },
    }));
  };

  /**
   * Manipula mudanças nas quantidades dos canais
   */
  const handleChannelChange = (channel: string, quantity: number) => {
    setFormData(prev => ({
      ...prev,
      channels: {
        ...prev.channels,
        [channel]: Math.max(0, quantity), // Garante que não seja negativo
      },
    }));
  };

  /**
   * Manipula o salvamento do formulário
   * Valida os dados antes de enviar
   */
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('Por favor, digite um nome para o plano.');
      return;
    }

    if (formData.userLimit < 1) {
      alert('A quantidade de usuários deve ser pelo menos 1.');
      return;
    }

    if (formData.value < 0) {
      alert('O valor do plano deve ser maior ou igual a 0.');
      return;
    }

    onSave(formData);
  };

  /**
   * Lista de canais disponíveis com seus nomes para exibição
   */
  const channelsList = [
    { key: 'whatsappQR', name: 'WhatsApp QR Code' },
    { key: 'whatsappAPI', name: 'WhatsApp API Oficial' },
    { key: 'instagram', name: 'Instagram' },
    { key: 'facebook', name: 'Facebook' },
    { key: 'telegram', name: 'Telegram' },
    { key: 'webchat', name: 'WebChat' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-w-[95vw] max-h-[90vh] overflow-y-auto bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            {plan ? 'Editar Plano' : 'Novo Plano'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nome do Plano */}
          <div className="space-y-2">
            <Label htmlFor="planName" className="text-foreground font-medium">
              Nome do Plano *
            </Label>
            <Input
              id="planName"
              placeholder="Digite o nome do plano"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-background border-border text-foreground"
            />
          </div>

          {/* Tipo do Plano - Corrigido dropdown transparente */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium">
              Tipo do Plano
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleInputChange('type', value)}
            >
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background border-border z-50">
                <SelectItem value="Publico" className="text-foreground hover:bg-accent">
                  Público
                </SelectItem>
                <SelectItem value="Personalizado" className="text-foreground hover:bg-accent">
                  Personalizado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quantidade de Usuários */}
            <div className="space-y-2">
              <Label htmlFor="userLimit" className="text-foreground font-medium">
                Quantidade de Usuários
              </Label>
              <Input
                id="userLimit"
                type="number"
                min="1"
                value={formData.userLimit}
                onChange={(e) => handleInputChange('userLimit', parseInt(e.target.value) || 1)}
                className="bg-background border-border text-foreground"
              />
            </div>

            {/* Valor do Plano */}
            <div className="space-y-2">
              <Label htmlFor="planValue" className="text-foreground font-medium">
                Valor do Plano (R$)
              </Label>
              <Input
                id="planValue"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>

          {/* Funcionalidades do Sistema */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium text-lg">
              Funcionalidades do Sistema
            </Label>
            
            <Card className="border-border bg-card">
              <CardContent className="p-4 space-y-4">
                {/* Chat Interno */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="chatInterno" className="text-foreground">
                    Acesso ao Chat Interno
                  </Label>
                  <Switch
                    id="chatInterno"
                    checked={formData.features.chatInterno}
                    onCheckedChange={(checked) => handleFeatureChange('chatInterno', checked)}
                  />
                </div>

                {/* Agendamentos */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="agendamentos" className="text-foreground">
                    Acesso a Agendamentos
                  </Label>
                  <Switch
                    id="agendamentos"
                    checked={formData.features.agendamentos}
                    onCheckedChange={(checked) => handleFeatureChange('agendamentos', checked)}
                  />
                </div>

                {/* Tarefas */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="tarefas" className="text-foreground">
                    Acesso a Tarefas
                  </Label>
                  <Switch
                    id="tarefas"
                    checked={formData.features.tarefas}
                    onCheckedChange={(checked) => handleFeatureChange('tarefas', checked)}
                  />
                </div>

                {/* Campanhas */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="campanhas" className="text-foreground">
                    Acesso a Campanhas
                  </Label>
                  <Switch
                    id="campanhas"
                    checked={formData.features.campanhas}
                    onCheckedChange={(checked) => handleFeatureChange('campanhas', checked)}
                  />
                </div>

                {/* Integração API */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="integracaoAPI" className="text-foreground">
                    Integração via API
                  </Label>
                  <Switch
                    id="integracaoAPI"
                    checked={formData.features.integracaoAPI}
                    onCheckedChange={(checked) => handleFeatureChange('integracaoAPI', checked)}
                  />
                </div>

                {/* White Label */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="whiteLabel" className="text-foreground">
                    White Label
                  </Label>
                  <Switch
                    id="whiteLabel"
                    checked={formData.features.whiteLabel}
                    onCheckedChange={(checked) => handleFeatureChange('whiteLabel', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canais de Comunicação - Com logos reais */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium text-lg">
              Canais de Comunicação
            </Label>
            
            <Card className="border-border bg-card">
              <CardContent className="p-4 space-y-4">
                {channelsList.map((channel) => (
                  <ChannelRow
                    key={channel.key}
                    channel={channel.key}
                    name={channel.name}
                    value={formData.channels[channel.key]}
                    onChange={handleChannelChange}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Botões de Ação */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-border text-foreground hover:bg-accent"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {plan ? 'Salvar Alterações' : 'Criar Plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanModal;
