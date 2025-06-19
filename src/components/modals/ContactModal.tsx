
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, Save, User, Phone, Mail, FileText } from 'lucide-react';
import TagSelector from '../selectors/TagSelector';

/**
 * Modal para criação e edição de contatos
 * Utiliza cores dinâmicas do sistema de marca
 * Responsivo para todos os tamanhos de tela
 */

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditMode: boolean;
  contact?: any;
  onSave: (contactData: any) => void;
}

const ContactModal = ({ isOpen, onClose, isEditMode, contact, onSave }: ContactModalProps) => {
  // Estados para controle dos campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: '',
    tags: [] as string[],
    canal: 'whatsapp' // Canal padrão para novos contatos
  });

  // Estados de validação e controle de interface
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carrega dados do contato quando em modo de edição
   * Limpa formulário quando em modo de criação
   */
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && contact) {
        // Preenche formulário com dados existentes do contato
        setFormData({
          nome: contact.nome || '',
          telefone: contact.telefone || '',
          email: contact.email || '',
          observacoes: contact.observacoes || '',
          tags: contact.tags || [],
          canal: contact.canal || 'whatsapp'
        });
      } else {
        // Limpa formulário para novo contato
        setFormData({
          nome: '',
          telefone: '',
          email: '',
          observacoes: '',
          tags: [],
          canal: 'whatsapp'
        });
      }
      // Limpa erros de validação
      setErrors({});
    }
  }, [isOpen, isEditMode, contact]);

  /**
   * Atualiza campo específico do formulário
   * @param {string} field - Nome do campo
   * @param {any} value - Novo valor do campo
   */
  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Remove erro de validação quando campo é corrigido
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  /**
   * Valida formulário antes do salvamento
   * @returns {boolean} - True se formulário é válido
   */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Nome é obrigatório
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    // Telefone é obrigatório e deve ter formato válido
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.telefone)) {
      // Valida formato (11) 99999-9999 ou (11) 9999-9999
      newErrors.telefone = 'Formato inválido. Use: (11) 99999-9999';
    }

    // Email deve ter formato válido se preenchido
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Formata telefone automaticamente durante digitação
   * @param {string} value - Valor digitado
   */
  const formatTelefone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica formatação baseada na quantidade de dígitos
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  /**
   * Manipula mudança no campo telefone com formatação automática
   * @param {Event} e - Evento de mudança
   */
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatTelefone(e.target.value);
    handleFieldChange('telefone', formatted);
  };

  /**
   * Salva contato após validação
   */
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepara dados para salvamento
      const contactData = {
        ...formData,
        // Gera avatar com iniciais se não existir
        avatar: contact?.avatar || formData.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        // Define status padrão para novos contatos
        status: contact?.status || 'offline'
      };

      // Chama função de salvamento
      onSave(contactData);
      
      console.log(isEditMode ? 'Contato editado:' : 'Novo contato criado:', contactData);
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fecha modal e limpa estados
   */
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] mx-4 max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <User className="h-5 w-5" />
            {isEditMode ? 'Editar Contato' : 'Novo Contato'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Campo Nome - Obrigatório */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome *
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              placeholder="Digite o nome completo do contato"
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
                errors.nome ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.nome}</p>
            )}
          </div>

          {/* Campo Telefone - Obrigatório com formatação automática */}
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={handleTelefoneChange}
              placeholder="(11) 99999-9999"
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
                errors.telefone ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
              maxLength={15}
            />
            {errors.telefone && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.telefone}</p>
            )}
          </div>

          {/* Campo Email - Opcional */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="contato@exemplo.com"
              className={`bg-background border-border text-foreground placeholder:text-muted-foreground ${
                errors.email ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Campo Observações - Texto livre */}
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Observações
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleFieldChange('observacoes', e.target.value)}
              placeholder="Adicione observações ou notas sobre este contato..."
              className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-[80px]"
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Seletor de Tags - Opcional */}
          <div className="space-y-2">
            <Label className="text-foreground">Tags</Label>
            <TagSelector
              selectedTagIds={formData.tags}
              on TagsChange={(tags) => handleFieldChange('tags', tags)}
              placeholder="Selecione tags para organizar o contato..."
            />
          </div>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-border">
            {/* Botão Cancelar */}
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={isLoading}
              className="w-full sm:w-auto border-border text-foreground hover:bg-accent"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            
            {/* Botão Salvar */}
            <Button 
              onClick={handleSave} 
              disabled={isLoading || !formData.nome.trim() || !formData.telefone.trim()}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Salvar Contato')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
