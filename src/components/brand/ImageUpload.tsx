
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  description?: string;
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  value, 
  onChange, 
  description,
  accept = "image/*"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-3">
        {value && (
          <div className="relative inline-block">
            <img
              src={value}
              alt={label}
              className="w-20 h-20 object-contain border border-border rounded"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 w-6 h-6"
              onClick={handleRemove}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar {label}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default ImageUpload;
