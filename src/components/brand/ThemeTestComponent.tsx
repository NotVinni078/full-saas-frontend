
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useBrand } from '@/contexts/BrandContext';
import { CheckCircle, AlertTriangle, Info, Sun, Moon } from 'lucide-react';

const ThemeTestComponent: React.FC = () => {
  const { tempBrandConfig } = useBrand();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <div className="p-6 space-y-6 brand-background min-h-screen">
      <Card className="brand-card brand-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between brand-text-foreground">
            Teste de Tema {isDark ? 'Escuro' : 'Claro'}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="brand-border brand-text-foreground brand-hover-muted"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test Current Theme Colors */}
          <div className="space-y-4">
            <h3 className="font-medium brand-text-foreground">Cores do Tema Atual</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="brand-primary p-4 rounded-lg text-center">
                <span className="text-sm font-medium brand-text-background">Primária</span>
              </div>
              <div className="brand-secondary p-4 rounded-lg text-center brand-border">
                <span className="text-sm font-medium brand-text-foreground">Secundária</span>
              </div>
              <div className="brand-accent p-4 rounded-lg text-center brand-border">
                <span className="text-sm font-medium brand-text-foreground">Destaque</span>
              </div>
              <div className="brand-muted p-4 rounded-lg text-center">
                <span className="text-sm font-medium brand-text-foreground">Esmaecida</span>
              </div>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Test Buttons */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Botões</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Primário</Button>
              <Button variant="secondary">Secundário</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Sucesso</Button>
              <Button variant="warning">Aviso</Button>
              <Button variant="info">Info</Button>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Test Status Colors */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Cores de Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="brand-success p-3 rounded text-center">
                <span className="text-sm font-medium brand-text-background">Sucesso</span>
              </div>
              <div className="brand-warning p-3 rounded text-center">
                <span className="text-sm font-medium brand-text-background">Aviso</span>
              </div>
              <div className="brand-error p-3 rounded text-center">
                <span className="text-sm font-medium brand-text-background">Erro</span>
              </div>
              <div className="brand-info p-3 rounded text-center">
                <span className="text-sm font-medium brand-text-background">Info</span>
              </div>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Test Form Elements */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Elementos de Formulário</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test-input" className="brand-text-foreground">Campo de Texto</Label>
                <Input 
                  id="test-input" 
                  placeholder="Digite algo aqui..." 
                  className="brand-input brand-border brand-text-foreground brand-placeholder-muted"
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch id="test-switch" />
                  <Label htmlFor="test-switch" className="brand-text-foreground">Switch</Label>
                </div>
              </div>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Test Alerts */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Alertas</h3>
            <div className="space-y-3">
              <Alert className="brand-card brand-border">
                <CheckCircle className="h-4 w-4 brand-text-foreground" />
                <AlertTitle className="brand-text-foreground">Padrão</AlertTitle>
                <AlertDescription className="brand-text-muted">
                  Este é um alerta padrão usando as cores dinâmicas da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>
                  Este é um alerta de sucesso usando as cores dinâmicas da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Aviso</AlertTitle>
                <AlertDescription>
                  Este é um alerta de aviso usando as cores dinâmicas da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="info">
                <Info className="h-4 w-4" />
                <AlertTitle>Informação</AlertTitle>
                <AlertDescription>
                  Este é um alerta informativo usando as cores dinâmicas da marca.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Test Badges */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Padrão</Badge>
              <Badge variant="secondary">Secundário</Badge>
              <Badge variant="outline" className="brand-border brand-text-foreground">Outline</Badge>
              <Badge variant="success">Sucesso</Badge>
              <Badge variant="warning">Aviso</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Test Gray Scale */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Escala de Cinza Dinâmica</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="brand-gray-100 p-3 rounded text-center">
                <span className="text-xs brand-text-foreground">Gray 100</span>
              </div>
              <div className="brand-gray-300 p-3 rounded text-center">
                <span className="text-xs brand-text-foreground">Gray 300</span>
              </div>
              <div className="brand-gray-500 p-3 rounded text-center">
                <span className="text-xs brand-text-background">Gray 500</span>
              </div>
              <div className="brand-gray-700 p-3 rounded text-center">
                <span className="text-xs brand-text-background">Gray 700</span>
              </div>
              <div className="brand-gray-900 p-3 rounded text-center">
                <span className="text-xs brand-text-background">Gray 900</span>
              </div>
            </div>
          </div>

          <Separator className="brand-border" />

          {/* Current Configuration */}
          <div className="space-y-3">
            <h3 className="font-medium brand-text-foreground">Configuração Atual</h3>
            <Card className="brand-card brand-border">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm brand-text-foreground">
                  <p><strong>Empresa:</strong> {tempBrandConfig.companyName}</p>
                  <p><strong>Tema:</strong> {isDark ? 'Escuro' : 'Claro'}</p>
                  <p><strong>Modo:</strong> Cores dinâmicas ativas</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeTestComponent;
