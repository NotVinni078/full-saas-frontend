
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Bell, 
  Calendar, 
  Star, 
  Settings, 
  AlertCircle, 
  Info, 
  CheckCircle,
  Upload,
  X
} from 'lucide-react';
import { useAnuncios } from '@/contexts/AnunciosContext';

interface NovoAnuncioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconOptions = [
  { value: 'FileText', label: 'Documento', icon: FileText },
  { value: 'Bell', label: 'Sino', icon: Bell },
  { value: 'Calendar', label: 'Calendário', icon: Calendar },
  { value: 'Star', label: 'Estrela', icon: Star },
  { value: 'Settings', label: 'Configurações', icon: Settings },
  { value: 'AlertCircle', label: 'Alerta', icon: AlertCircle },
  { value: 'Info', label: 'Informação', icon: Info },
  { value: 'CheckCircle', label: 'Sucesso', icon: CheckCircle },
];

const NovoAnuncioModal = ({ isOpen, onClose }: NovoAnuncioModalProps) => {
  const { addAnuncio, addNotaAtualizacao } = useAnuncios();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '', // 'anuncio' ou 'nota-atualizacao'
    icone: 'FileText'
  });
  const [attachedImages, setAttachedImages] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.descricao || !formData.categoria) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const novoItem = {
      titulo: formData.titulo,
      descricao: formData.descricao,
      data: new Date().toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      }),
      tipo: formData.categoria === 'anuncio' ? 'Anúncio' : 'Nota de Atualização'
    };

    if (formData.categoria === 'anuncio') {
      addAnuncio(novoItem);
    } else {
      addNotaAtualizacao(novoItem);
    }

    // Reset form
    setFormData({
      titulo: '',
      descricao: '',
      categoria: '',
      icone: 'FileText'
    });
    setAttachedImages([]);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getSelectedIcon = () => {
    const selectedOption = iconOptions.find(opt => opt.value === formData.icone);
    return selectedOption ? selectedOption.icon : FileText;
  };

  const SelectedIcon = getSelectedIcon();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto brand-card brand-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 brand-text-foreground">
            <SelectedIcon className="h-5 w-5" />
            <span>Novo Anúncio</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
              placeholder="Digite o título do anúncio"
              required
              className="brand-background brand-border brand-text-foreground brand-placeholder-muted"
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria *</Label>
            <Select 
              value={formData.categoria} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
            >
              <SelectTrigger className="brand-background brand-border brand-text-foreground">
                <SelectValue placeholder="Selecione a categoria" className="brand-placeholder-muted" />
              </SelectTrigger>
              <SelectContent className="brand-card brand-border">
                <SelectItem value="nota-atualizacao" className="brand-text-foreground brand-hover-accent">Nota de Atualização</SelectItem>
                <SelectItem value="anuncio" className="brand-text-foreground brand-hover-accent">Anúncio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seleção de Ícone */}
          <div className="space-y-2">
            <Label className="brand-text-foreground">Ícone</Label>
            <div className="grid grid-cols-4 gap-2">
              {iconOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, icone: option.value }))}
                    className={`p-3 rounded-lg border-2 transition-colors flex flex-col items-center space-y-1 ${
                      formData.icone === option.value 
                        ? 'brand-border-primary brand-primary-subtle' 
                        : 'brand-border brand-hover-border-primary'
                    }`}
                  >
                    <IconComponent className="h-5 w-5 brand-text-foreground" />
                    <span className="text-xs brand-text-foreground">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Conteúdo *</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              placeholder="Digite o conteúdo completo do anúncio..."
              className="min-h-[200px] resize-none brand-background brand-border brand-text-foreground brand-placeholder-muted"
              required
            />
          </div>

          {/* Upload de Imagens */}
          <div className="space-y-2">
            <Label className="brand-text-foreground">Anexar Fotos</Label>
            <div className="border-2 border-dashed brand-border rounded-lg p-4">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center space-y-2 brand-text-muted brand-hover-text-foreground transition-colors"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">Clique para selecionar imagens</span>
              </label>
            </div>

            {/* Preview das imagens anexadas */}
            {attachedImages.length > 0 && (
              <div className="space-y-2">
                <Label className="brand-text-foreground">Imagens Anexadas:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {attachedImages.map((file, index) => (
                    <Card key={index} className="relative brand-card brand-border">
                      <CardContent className="p-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm truncate brand-text-foreground">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="h-6 w-6 p-0 brand-text-muted brand-hover-text-error"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2 pt-4 border-t brand-border">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="brand-border brand-text-foreground brand-hover-accent"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="brand-primary brand-hover-primary brand-text-background"
            >
              Criar Anúncio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NovoAnuncioModal;
