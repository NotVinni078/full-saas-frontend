
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBrand } from '@/contexts/BrandContext';
import { MessageSquare, Users, Settings } from 'lucide-react';

const BrandPreview: React.FC = () => {
  const { brandConfig } = useBrand();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {brandConfig.logo && (
            <img 
              src={brandConfig.logo} 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
          )}
          <span>{brandConfig.companyName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">Preview dos Elementos</h3>
          
          {/* Buttons Preview */}
          <div className="flex space-x-2">
            <Button>Botão Primário</Button>
            <Button variant="secondary">Botão Secundário</Button>
            <Button variant="outline">Botão Outline</Button>
          </div>
          
          {/* Icons Preview */}
          <div className="flex space-x-4 py-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <Users className="w-5 h-5 text-secondary-foreground" />
            <Settings className="w-5 h-5 text-muted-foreground" />
          </div>
          
          {/* Badges Preview */}
          <div className="flex space-x-2">
            <Badge>Badge Padrão</Badge>
            <Badge variant="secondary">Badge Secundário</Badge>
            <Badge variant="outline">Badge Outline</Badge>
          </div>
          
          {/* Card Preview */}
          <Card className="p-4">
            <h4 className="font-medium mb-2">Card de Exemplo</h4>
            <p className="text-muted-foreground text-sm">
              Este é um exemplo de como os cards aparecerão com as cores personalizadas.
            </p>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandPreview;
