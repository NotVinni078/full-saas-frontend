
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
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2 text-lg">
          {brandConfig.logo && (
            <img 
              src={brandConfig.logo} 
              alt="Logo" 
              className="w-6 h-6 object-contain flex-shrink-0"
            />
          )}
          <span className="truncate">{brandConfig.companyName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="font-medium text-sm">Preview dos Elementos</h3>
          
          {/* Buttons Preview */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Botões</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="text-xs">Botão Primário</Button>
              <Button variant="secondary" size="sm" className="text-xs">Botão Secundário</Button>
              <Button variant="outline" size="sm" className="text-xs">Botão Outline</Button>
            </div>
          </div>
          
          {/* Icons Preview */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Ícones</p>
            <div className="flex space-x-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              <Users className="w-4 h-4 text-secondary-foreground" />
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          
          {/* Badges Preview */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Badges</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="text-xs">Badge Padrão</Badge>
              <Badge variant="secondary" className="text-xs">Badge Secundário</Badge>
              <Badge variant="outline" className="text-xs">Badge Outline</Badge>
            </div>
          </div>
          
          {/* Card Preview */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Card de Exemplo</p>
            <Card className="p-3 bg-card border-border">
              <h4 className="font-medium text-sm mb-1 text-card-foreground">Card de Exemplo</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Este é um exemplo de como os cards aparecerão com as cores personalizadas aplicadas.
              </p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandPreview;
