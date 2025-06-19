
import React, { useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  X, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  Info
} from 'lucide-react';

/**
 * Modal de importação de contatos via CSV
 * Suporte a drag & drop e seleção manual de arquivos
 * Validação e preview dos dados antes da importação
 * Design responsivo com cores dinâmicas do sistema de marca
 */

interface ImportContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: any[]) => void;
}

interface ImportedContact {
  nome: string;
  telefone: string;
  email: string;
  observacoes?: string;
  tags?: string[];
  canal: string;
  status: 'valid' | 'warning' | 'error';
  errors: string[];
}

const ImportContactsModal = ({ isOpen, onClose, onImport }: ImportContactsModalProps) => {
  // Estados para controle do processo de importação
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedContacts, setImportedContacts] = useState<ImportedContact[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [step, setStep] = useState<'select' | 'preview' | 'importing' | 'complete'>('select');
  
  // Referência para o input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Valida formato de email
   * @param {string} email - Email a ser validado
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Valida formato de telefone brasileiro
   * @param {string} telefone - Telefone a ser validado
   */
  const isValidPhone = (telefone: string): boolean => {
    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    return phoneRegex.test(telefone) || /^\d{10,11}$/.test(telefone.replace(/\D/g, ''));
  };

  /**
   * Processa arquivo CSV e valida dados
   * @param {File} file - Arquivo CSV selecionado
   */
  const processCSVFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Arquivo deve conter pelo menos um cabeçalho e uma linha de dados');
      }

      // Processa cabeçalho (primeira linha)
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const expectedHeaders = ['nome', 'telefone', 'email', 'observacoes', 'tags', 'canal'];
      
      // Mapeia índices das colunas
      const headerMap = {
        nome: headers.findIndex(h => h.includes('nome')),
        telefone: headers.findIndex(h => h.includes('telefone') || h.includes('phone')),
        email: headers.findIndex(h => h.includes('email')),
        observacoes: headers.findIndex(h => h.includes('observac') || h.includes('obs')),
        tags: headers.findIndex(h => h.includes('tag')),
        canal: headers.findIndex(h => h.includes('canal') || h.includes('channel'))
      };

      const processedContacts: ImportedContact[] = [];
      const totalLines = lines.length - 1; // Exclui cabeçalho

      // Processa cada linha de dados
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/['"]/g, ''));
        const errors: string[] = [];
        
        // Extrai dados da linha atual
        const contact = {
          nome: headerMap.nome >= 0 ? values[headerMap.nome] || '' : '',
          telefone: headerMap.telefone >= 0 ? values[headerMap.telefone] || '' : '',
          email: headerMap.email >= 0 ? values[headerMap.email] || '' : '',
          observacoes: headerMap.observacoes >= 0 ? values[headerMap.observacoes] || '' : '',
          tags: headerMap.tags >= 0 ? values[headerMap.tags]?.split(';').filter(t => t.trim()) || [] : [],
          canal: headerMap.canal >= 0 ? values[headerMap.canal] || 'whatsapp' : 'whatsapp',
          status: 'valid' as const,
          errors: []
        };

        // Validações obrigatórias
        if (!contact.nome) {
          errors.push('Nome é obrigatório');
        }

        if (!contact.telefone) {
          errors.push('Telefone é obrigatório');
        } else if (!isValidPhone(contact.telefone)) {
          errors.push('Formato de telefone inválido');
        }

        // Validações opcionais
        if (contact.email && !isValidEmail(contact.email)) {
          errors.push('Formato de email inválido');
        }

        // Define status baseado nos erros
        if (errors.length > 0) {
          contact.status = errors.some(e => e.includes('obrigatório')) ? 'error' : 'warning';
          contact.errors = errors;
        }

        processedContacts.push(contact);

        // Atualiza progresso
        const progress = Math.round((i / totalLines) * 100);
        setProcessingProgress(progress);
        
        // Pequena pausa para atualizar UI
        if (i % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

      setImportedContacts(processedContacts);
      setStep('preview');
      
    } catch (error) {
      console.error('Erro ao processar CSV:', error);
      alert('Erro ao processar arquivo CSV. Verifique o formato e tente novamente.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  /**
   * Manipula seleção de arquivo via input
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      processCSVFile(file);
    } else {
      alert('Por favor, selecione um arquivo CSV válido');
    }
  };

  /**
   * Manipula eventos de drag & drop
   */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv');
    
    if (csvFile) {
      setSelectedFile(csvFile);
      processCSVFile(csvFile);
    } else {
      alert('Por favor, solte um arquivo CSV válido');
    }
  }, []);

  /**
   * Confirma importação dos contatos válidos
   */
  const handleConfirmImport = async () => {
    const validContacts = importedContacts.filter(c => c.status !== 'error');
    
    if (validContacts.length === 0) {
      alert('Nenhum contato válido para importar');
      return;
    }

    setStep('importing');
    
    // Simula processo de importação
    for (let i = 0; i <= 100; i += 10) {
      setProcessingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Chama função de importação
    onImport(validContacts);
    setStep('complete');
    
    // Fecha modal após sucesso
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  /**
   * Baixa planilha modelo para importação
   */
  const handleDownloadTemplate = () => {
    const csvContent = 'nome,telefone,email,observacoes,tags,canal\n' +
                      'João Silva,(11) 99999-9999,joao@exemplo.com,Cliente VIP,vip;cliente,whatsapp\n' +
                      'Maria Santos,(11) 88888-8888,maria@exemplo.com,Contato comercial,comercial,instagram';
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modelo_importacao_contatos.csv';
    link.click();
  };

  /**
   * Fecha modal e limpa estados
   */
  const handleClose = () => {
    setSelectedFile(null);
    setImportedContacts([]);
    setStep('select');
    setProcessingProgress(0);
    setIsProcessing(false);
    onClose();
  };

  /**
   * Estatísticas dos contatos importados
   */
  const getImportStats = () => {
    const valid = importedContacts.filter(c => c.status === 'valid').length;
    const warning = importedContacts.filter(c => c.status === 'warning').length;
    const error = importedContacts.filter(c => c.status === 'error').length;
    
    return { valid, warning, error, total: importedContacts.length };
  };

  const stats = getImportStats();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] mx-4 max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Contatos via CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Etapa 1: Seleção de arquivo */}
          {step === 'select' && (
            <div className="space-y-4">
              {/* Área de drag & drop */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragOver 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-muted/30 hover:bg-muted/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-3 rounded-full ${isDragOver ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Upload className={`h-8 w-8 ${isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-foreground">
                      {isDragOver ? 'Solte o arquivo aqui' : 'Arraste e solte seu arquivo CSV'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ou clique no botão abaixo para selecionar
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Selecionar Arquivo CSV
                  </Button>
                </div>
              </div>

              {/* Input oculto para seleção de arquivo */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Botão para baixar planilha modelo */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Primeira vez importando contatos?
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                      Baixe nossa planilha modelo com o formato correto e exemplos de dados.
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handleDownloadTemplate}
                      className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-800/50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Planilha Modelo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 2: Preview dos dados */}
          {step === 'preview' && (
            <div className="space-y-4">
              {/* Estatísticas da importação */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">{stats.valid}</div>
                  <div className="text-xs text-green-700 dark:text-green-300">Válidos</div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{stats.warning}</div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-300">Avisos</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.error}</div>
                  <div className="text-xs text-red-700 dark:text-red-300">Erros</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Total</div>
                </div>
              </div>

              {/* Lista de contatos com status */}
              <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
                {importedContacts.slice(0, 20).map((contact, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 bg-background">
                    {/* Ícone de status */}
                    <div className="flex-shrink-0">
                      {contact.status === 'valid' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {contact.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {contact.status === 'error' && <X className="h-4 w-4 text-red-500" />}
                    </div>
                    
                    {/* Dados do contato */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground truncate">{contact.nome || 'Nome não informado'}</div>
                      <div className="text-sm text-muted-foreground truncate">{contact.telefone} • {contact.email}</div>
                      
                      {/* Erros se houver */}
                      {contact.errors.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contact.errors.map((error, errorIndex) => (
                            <Badge key={errorIndex} variant="destructive" className="text-xs">
                              {error}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Indicador se há mais contatos */}
                {importedContacts.length > 20 && (
                  <div className="p-3 text-center text-sm text-muted-foreground bg-muted/30">
                    E mais {importedContacts.length - 20} contatos...
                  </div>
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('select')}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Voltar
                </Button>
                <Button 
                  onClick={handleConfirmImport}
                  disabled={stats.valid === 0}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Importar {stats.valid} Contato(s) Válido(s)
                </Button>
              </div>
            </div>
          )}

          {/* Etapa 3: Processamento */}
          {(step === 'importing' || isProcessing) && (
            <div className="space-y-4 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <div>
                  <p className="font-medium text-foreground">
                    {isProcessing ? 'Processando arquivo...' : 'Importando contatos...'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Por favor, aguarde enquanto processamos seus dados
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={processingProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">{processingProgress}% concluído</p>
              </div>
            </div>
          )}

          {/* Etapa 4: Conclusão */}
          {step === 'complete' && (
            <div className="text-center space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">Importação Concluída!</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.valid} contatos foram importados com sucesso
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;
