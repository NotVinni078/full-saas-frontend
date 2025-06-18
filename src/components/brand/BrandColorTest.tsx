
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useBrand } from '@/contexts/BrandContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const BrandColorTest: React.FC = () => {
  const { brandConfig } = useBrand();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Sistema de Cores Dinâmicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Test 1: Basic Brand Colors */}
          <div className="space-y-3">
            <h3 className="font-medium">1. Cores Básicas da Marca</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="brand-primary p-3 rounded text-center text-sm">
                Primária
              </div>
              <div className="brand-secondary p-3 rounded text-center text-sm">
                Secundária
              </div>
              <div className="brand-accent p-3 rounded text-center text-sm">
                Destaque
              </div>
              <div className="brand-muted p-3 rounded text-center text-sm">
                Esmaecida
              </div>
            </div>
          </div>

          <Separator />

          {/* Test 2: Button Variants */}
          <div className="space-y-3">
            <h3 className="font-medium">2. Variações de Botões</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Botão Primário</Button>
              <Button variant="secondary">Botão Secundário</Button>
              <Button variant="outline">Botão Outline</Button>
              <Button variant="ghost">Botão Ghost</Button>
              <Button variant="success">Sucesso</Button>
              <Button variant="warning">Aviso</Button>
              <Button variant="info">Info</Button>
            </div>
          </div>

          <Separator />

          {/* Test 3: Status Colors */}
          <div className="space-y-3">
            <h3 className="font-medium">3. Cores de Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="brand-success p-3 rounded text-center text-sm">
                Sucesso
              </div>
              <div className="brand-warning p-3 rounded text-center text-sm">
                Aviso
              </div>
              <div className="brand-error p-3 rounded text-center text-sm">
                Erro
              </div>
              <div className="brand-info p-3 rounded text-center text-sm">
                Informação
              </div>
            </div>
          </div>

          <Separator />

          {/* Test 4: Badges */}
          <div className="space-y-3">
            <h3 className="font-medium">4. Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Badge Padrão</Badge>
              <Badge variant="secondary">Badge Secundário</Badge>
              <Badge variant="outline">Badge Outline</Badge>
              <Badge variant="success">Badge Sucesso</Badge>
              <Badge variant="warning">Badge Aviso</Badge>
              <Badge variant="info">Badge Info</Badge>
            </div>
          </div>

          <Separator />

          {/* Test 5: Alerts */}
          <div className="space-y-3">
            <h3 className="font-medium">5. Alertas</h3>
            <div className="space-y-3">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Padrão</AlertTitle>
                <AlertDescription>
                  Este é um alerta padrão usando as cores da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="success">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Sucesso</AlertTitle>
                <AlertDescription>
                  Este é um alerta de sucesso usando as cores da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="warning">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Aviso</AlertTitle>
                <AlertDescription>
                  Este é um alerta de aviso usando as cores da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Este é um alerta de erro usando as cores da marca.
                </AlertDescription>
              </Alert>
              
              <Alert variant="info">
                <Info className="h-4 w-4" />
                <AlertTitle>Informação</AlertTitle>
                <AlertDescription>
                  Este é um alerta informativo usando as cores da marca.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <Separator />

          {/* Test 6: Form Elements */}
          <div className="space-y-3">
            <h3 className="font-medium">6. Elementos de Formulário</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="test-checkbox" />
                <label htmlFor="test-checkbox" className="text-sm brand-text-foreground">
                  Checkbox
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="test-switch" />
                <label htmlFor="test-switch" className="text-sm brand-text-foreground">
                  Switch
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Test 7: Gray Scale */}
          <div className="space-y-3">
            <h3 className="font-medium">7. Escala de Cinza</h3>
            <div className="grid grid-cols-5 gap-2">
              <div className="brand-gray-100 p-2 rounded text-center text-xs">
                Gray 100
              </div>
              <div className="brand-gray-300 p-2 rounded text-center text-xs">
                Gray 300
              </div>
              <div className="brand-gray-500 p-2 rounded text-center text-xs brand-text-foreground">
                Gray 500
              </div>
              <div className="brand-gray-700 p-2 rounded text-center text-xs brand-text-gray-100">
                Gray 700
              </div>
              <div className="brand-gray-900 p-2 rounded text-center text-xs brand-text-gray-100">
                Gray 900
              </div>
            </div>
          </div>

          <Separator />

          {/* Test 8: Configuration Info */}
          <div className="space-y-3">
            <h3 className="font-medium">8. Configuração Atual</h3>
            <Card className="brand-card">
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <p><strong>Empresa:</strong> {brandConfig.companyName}</p>
                  <p><strong>Título:</strong> {brandConfig.pageTitle}</p>
                  <p><strong>Logo:</strong> {brandConfig.logo ? 'Configurado' : 'Não configurado'}</p>
                  <p><strong>Favicon:</strong> {brandConfig.favicon && brandConfig.favicon !== '/favicon.ico' ? 'Personalizado' : 'Padrão'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandColorTest;
