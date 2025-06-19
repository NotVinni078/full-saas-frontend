
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/**
 * Componente de diálogo de confirmação reutilizável
 * Usado para confirmar ações como bloqueio/desbloqueio de contatos
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  contact?: {
    id: string;
    nome: string;
    telefone?: string;
    email?: string;
    avatar?: string;
  };
  variant?: 'default' | 'destructive';
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Cancelar",
  contact,
  variant = 'default'
}: ConfirmationDialogProps) => {

  /**
   * Gera iniciais do nome para avatar
   * @param {string} nome - Nome do contato
   */
  const getIniciais = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  /**
   * Manipula confirmação e fecha diálogo
   */
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px] mx-4 bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Informações do contato se disponível */}
        {contact && (
          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border border-border">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={contact.avatar} alt={contact.nome} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {getIniciais(contact.nome)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-foreground truncate">
                {contact.nome}
              </div>
              <div className="text-sm text-muted-foreground">
                {contact.telefone && <span>{contact.telefone}</span>}
                {contact.telefone && contact.email && <span> • </span>}
                {contact.email && <span className="truncate">{contact.email}</span>}
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={onClose}
            className="border-border text-foreground hover:bg-accent"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={
              variant === 'destructive' 
                ? 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationDialog;
