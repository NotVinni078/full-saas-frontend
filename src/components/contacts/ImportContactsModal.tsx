
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Modal para importação de contatos via arquivo JSON
 * Alterado de CSV para JSON para melhor estruturação dos dados
 * Permite upload de arquivo ou colagem direta do JSON
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: any[]) => void;
}

const ImportContactsModal = ({
  isOpen,
  onClose,
  onImport
}: ImportContactsModalProps) => {
  const [jsonContent, setJsonContent] = useState('');
  const [validationError, setValidationError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState('');
  const [previewContacts, setPreviewContacts] = useState<any[]>([]);

  /**
   * Processa arquivo JSON selecionado
   * @param {Event} event - Evento de mudança do input file
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verifica se é arquivo JSON
    if (!file.name.endsWith('.json')) {
      setValidationError('Por favor, selecione um arquivo JSON válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonContent(content);
      validateAndPreviewJson(content);
    };
    reader.readAsText(file);
  };

  /**
   * Valida e faz preview do conteúdo JSON
   * @param {string} content - Conteúdo JSON para validar
   */
  const validateAndPreviewJson = (content: string) => {
    try {
      setValidationError('');
      setValidationSuccess('');
      
      if (!content.trim()) {
        setPreviewContacts([]);
        return;
      }

      const parsedData = JSON.parse(content);
      
      // Verifica se é um array
      if (!Array.isArray(parsedData)) {
        throw new Error('O JSON deve conter um array de contatos.');
      }

      if (parsedData.length === 0) {
        throw new Error('O arquivo JSON está vazio.');
      }

      // Valida estrutura básica dos contatos
      const validContacts = parsedData.map((contact, index) => {
        if (!contact.nome || typeof contact.nome !== 'string') {
          throw new Error(`Contato na linha ${index + 1}: campo 'nome' é obrigatório.`);
        }

        // Converte tags de string para array se necessário
        let tags = [];
        if (contact.tags) {
          if (typeof contact.tags === 'string') {
            // Separa tags por vírgula, ponto e vírgula ou pipe
            tags = contact.tags.split(/[,;|]/).map((tag: string) => tag.trim()).filter((tag: string) => tag);
          } else if (Array.isArray(contact.tags)) {
            tags = contact.tags;
          }
        }

        return {
          nome: contact.nome.trim(),
          telefone: contact.telefone?.trim() || '',
          email: contact.email?.trim() || '',
          endereco: contact.endereco?.trim() || '',
          observacoes: contact.observacoes?.trim() || '',
          tags: tags,
          canal: contact.canal?.trim() || 'whatsapp',
          setor: contact.setor?.trim() || '',
          status: contact.status?.trim() || 'offline'
        };
      });

      setPreviewContacts(validContacts);
      setValidationSuccess(`${validContacts.length} contato(s) válido(s) encontrado(s) e pronto(s) para importação.`);

    } catch (error) {
      setValidationError(`Erro ao processar JSON: ${error.message}`);
      setPreviewContacts([]);
    }
  };

  /**
   * Manipula mudança no textarea de JSON
   * @param {string} value - Novo valor do textarea
   */
  const handleJsonContentChange = (value: string) => {
    setJsonContent(value);
    validateAndPreviewJson(value);
  };

  /**
   * Executa importação dos contatos validados
   */
  const handleImport = () => {
    if (previewContacts.length === 0) {
      setValidationError('Nenhum contato válido encontrado para importação.');
      return;
    }

    onImport(previewContacts);
    handleClose();
  };

  /**
   * Fecha modal e limpa estados
   */
  const handleClose = () => {
    setJsonContent('');
    setValidationError('');
    setValidationSuccess('');
    setPreviewContacts([]);
    onClose();
  };

  /**
   * Gera exemplo de JSON para ajudar o usuário
   */
  const getExampleJson = () => {
    return JSON.stringify([
      {
        "nome": "João Silva",
        "telefone": "(11) 99999-9999",
        "email": "joao@email.com",
        "endereco": "Rua das Flores, 123",
        "observacoes": "Cliente VIP",
        "tags": "VIP; Premium; Fidelizado",
        "canal": "whatsapp",
        "setor": "vendas"
      },
      {
        "nome": "Maria Santos",
        "telefone": "(11) 88888-8888",
        "email": "maria@email.com",
        "endereco": "Av. Principal, 456",
        "observacoes": "Novo cliente",
        "tags": "Novo Cliente",
        "canal": "instagram",
        "setor": "vendas"
      }
    ], null, 2);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl mx-4 bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Contatos via JSON
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações sobre o formato */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-2">Formato esperado:</p>
                <p className="mb-2">• O arquivo deve ser um JSON válido contendo um array de contatos</p>
                <p className="mb-2">• Campo obrigatório: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">nome</code></p>
                <p className="mb-2">• Campos opcionais: telefone, email, endereco, observacoes, tags, canal, setor</p>
                <p>• Tags podem ser separadas por vírgula, ponto e vírgula ou pipe (|)</p>
              </div>
            </div>
          </div>

          {/* Upload de arquivo */}
          <div className="space-y-2">
            <Label htmlFor="file-upload" className="text-foreground">
              Selecionar arquivo JSON
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="bg-background border-border text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
          </div>

          {/* Textarea para colar JSON diretamente */}
          <div className="space-y-2">
            <Label htmlFor="json-content" className="text-foreground">
              Ou cole o conteúdo JSON diretamente
            </Label>
            <Textarea
              id="json-content"
              placeholder="Cole aqui o conteúdo JSON dos contatos..."
              value={jsonContent}
              onChange={(e) => handleJsonContentChange(e.target.value)}
              rows={8}
              className="bg-background border-border text-foreground font-mono text-sm"
            />
          </div>

          {/* Mensagens de validação */}
          {validationError && (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
              <AlertDescription className="text-red-700 dark:text-red-300">
                {validationError}
              </AlertDescription>
            </Alert>
          )}

          {validationSuccess && (
            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-700 dark:text-green-300">
                {validationSuccess}
              </AlertDescription>
            </Alert>
          )}

          {/* Preview dos contatos */}
          {previewContacts.length > 0 && (
            <div className="space-y-2">
              <Label className="text-foreground">Preview dos contatos (primeiros 3)</Label>
              <div className="bg-muted/30 p-4 rounded-lg border border-border max-h-48 overflow-y-auto">
                {previewContacts.slice(0, 3).map((contact, index) => (
                  <div key={index} className="mb-3 pb-3 border-b border-border last:border-b-0 last:mb-0 last:pb-0">
                    <p className="font-medium text-foreground">{contact.nome}</p>
                    <div className="text-sm text-muted-foreground">
                      {contact.telefone && <span>{contact.telefone} • </span>}
                      {contact.email && <span>{contact.email} • </span>}
                      <span>Canal: {contact.canal}</span>
                    </div>
                    {contact.tags && contact.tags.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tags: {Array.isArray(contact.tags) ? contact.tags.join(', ') : contact.tags}
                      </p>
                    )}
                  </div>
                ))}
                {previewContacts.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center pt-2">
                    ... e mais {previewContacts.length - 3} contato(s)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Exemplo de JSON */}
          <details className="bg-muted/30 p-4 rounded-lg border border-border">
            <summary className="cursor-pointer font-medium text-foreground hover:text-primary">
              Ver exemplo de formato JSON
            </summary>
            <pre className="mt-3 text-xs text-muted-foreground overflow-x-auto bg-background p-3 rounded border">
              {getExampleJson()}
            </pre>
          </details>

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
              onClick={handleImport}
              disabled={previewContacts.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importar {previewContacts.length} Contato(s)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;
