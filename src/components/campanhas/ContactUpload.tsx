
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Users, Download, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Contact {
  nome: string;
  telefone: string;
  email?: string;
}

interface ContactUploadProps {
  contatos: Contact[];
  onChange: (contatos: Contact[]) => void;
  error?: string;
}

/**
 * Componente para upload e gerenciamento de contatos
 * Suporte a upload de CSV e adição manual
 * Visualização em lista com possibilidade de remoção
 * Validação de formato de dados
 */
export const ContactUpload: React.FC<ContactUploadProps> = ({
  contatos,
  onChange,
  error
}) => {
  const [adicionandoManual, setAdicionandoManual] = useState(false);
  const [novoContato, setNovoContato] = useState({ nome: '', telefone: '', email: '' });

  /**
   * Processa upload de arquivo CSV
   * Endpoint sugerido: POST /api/campanhas/contatos/upload
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const novoContatos: Contact[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 2 && values[0].trim() && values[1].trim()) {
            const contato: Contact = {
              nome: values[headers.indexOf('nome') || 0]?.trim() || '',
              telefone: values[headers.indexOf('telefone') || 1]?.trim() || '',
              email: values[headers.indexOf('email') || 2]?.trim() || undefined
            };
            novoContatos.push(contato);
          }
        }
        
        onChange([...contatos, ...novoContatos]);
      } catch (error) {
        console.error('Erro ao processar CSV:', error);
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  /**
   * Adiciona contato manualmente
   */
  const handleAdicionarContato = () => {
    if (novoContato.nome.trim() && novoContato.telefone.trim()) {
      onChange([...contatos, { ...novoContato }]);
      setNovoContato({ nome: '', telefone: '', email: '' });
      setAdicionandoManual(false);
    }
  };

  /**
   * Remove contato da lista
   */
  const handleRemoverContato = (index: number) => {
    onChange(contatos.filter((_, i) => i !== index));
  };

  /**
   * Baixa modelo CSV
   */
  const downloadTemplate = () => {
    const csvContent = 'nome,telefone,email\nJoão Silva,11999999999,joao@email.com\nMaria Santos,11888888888,maria@email.com';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modelo-contatos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload CSV</TabsTrigger>
          <TabsTrigger value="manual">Adicionar Manual</TabsTrigger>
        </TabsList>

        {/* Tab Upload CSV */}
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {/* Área de upload */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/20 transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                
                <h3 className="font-medium text-foreground mb-2">
                  Upload de Arquivo CSV
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione um arquivo CSV com os contatos para importar
                </p>

                <div className="flex flex-col sm:flex-row gap-2 items-center justify-center">
                  <Button asChild>
                    <label className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Selecionar Arquivo
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </Button>

                  <Button variant="outline" onClick={downloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Modelo
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Formato: nome, telefone, email (opcional)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Adicionar Manual */}
        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {!adicionandoManual ? (
                <div className="text-center">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium text-foreground mb-2">
                    Adicionar Contatos Manualmente
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adicione contatos um por vez preenchendo o formulário
                  </p>
                  <Button onClick={() => setAdicionandoManual(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Contato
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Novo Contato</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Nome *</label>
                      <input
                        type="text"
                        value={novoContato.nome}
                        onChange={(e) => setNovoContato({...novoContato, nome: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="João Silva"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground">Telefone *</label>
                      <input
                        type="tel"
                        value={novoContato.telefone}
                        onChange={(e) => setNovoContato({...novoContato, telefone: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="11999999999"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground">E-mail</label>
                      <input
                        type="email"
                        value={novoContato.email}
                        onChange={(e) => setNovoContato({...novoContato, email: e.target.value})}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        placeholder="joao@email.com"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAdicionarContato}>
                      Adicionar
                    </Button>
                    <Button variant="outline" onClick={() => setAdicionandoManual(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lista de contatos adicionados */}
      {contatos.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-foreground">
                Contatos Adicionados ({contatos.length})
              </h3>
              <Badge variant="secondary">
                {contatos.length} {contatos.length === 1 ? 'contato' : 'contatos'}
              </Badge>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {contatos.map((contato, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {contato.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {contato.telefone}
                      {contato.email && ` • ${contato.email}`}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoverContato(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erro de validação */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
