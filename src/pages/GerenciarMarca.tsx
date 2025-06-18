import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useBrand } from '@/contexts/BrandContext';
import ColorPicker from '@/components/brand/ColorPicker';
import ImageUpload from '@/components/brand/ImageUpload';
import BrandPreview from '@/components/brand/BrandPreview';
import { Palette, Image, Globe, Smartphone, Monitor, Download, Upload, RotateCcw, Apple } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const GerenciarMarca = () => {
  const { brandConfig, updateBrandConfig, updateColors, applyBrandColors } = useBrand();
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState<'light' | 'dark'>('light');

  const handleSave = () => {
    applyBrandColors();
    toast({
      title: "Configurações salvas",
      description: "As personalizações da marca foram aplicadas com sucesso.",
    });
  };

  const handleReset = () => {
    const defaultConfig = {
      companyName: 'Minha Empresa',
      pageTitle: 'Sistema de Atendimento',
      logo: '',
      favicon: '/favicon.ico',
      iosIcon: '',
      androidIcon: '',
      colors: {
        light: {
          primary: '221.2 83.2% 53.3%',
          secondary: '210 40% 96.1%',
          accent: '210 40% 96.1%',
          background: '0 0% 100%',
          foreground: '222.2 84% 4.9%',
          muted: '210 40% 96.1%',
          border: '214.3 31.8% 91.4%',
          // Cores de status
          success: '142.1 76.2% 36.3%',
          warning: '47.9 95.8% 53.1%',
          error: '0 84.2% 60.2%',
          info: '199.89 89.47% 49.41%',
          // Tons de cinza
          gray50: '210 40% 98%',
          gray100: '210 40% 96.1%',
          gray200: '214.3 31.8% 91.4%',
          gray300: '213 27% 84%',
          gray400: '215 20.2% 65.1%',
          gray500: '215 16.3% 46.9%',
          gray600: '215.4 16.3% 46.9%',
          gray700: '215 25% 26.9%',
          gray800: '217 32.6% 17.5%',
          gray900: '222.2 84% 4.9%'
        },
        dark: {
          primary: '210 40% 98%',
          secondary: '0 0% 5%',
          accent: '0 0% 5%',
          background: '0 0% 0%',
          foreground: '210 40% 98%',
          muted: '0 0% 5%',
          border: '0 0% 10%',
          // Cores de status para tema escuro
          success: '142.1 70.6% 45.3%',
          warning: '47.9 95.8% 53.1%',
          error: '0 62.8% 50.6%',
          info: '199.89 89.47% 49.41%',
          // Tons de cinza para tema escuro
          gray50: '0 0% 5%',
          gray100: '0 0% 10%',
          gray200: '0 0% 15%',
          gray300: '0 0% 20%',
          gray400: '0 0% 25%',
          gray500: '0 0% 30%',
          gray600: '0 0% 40%',
          gray700: '0 0% 50%',
          gray800: '0 0% 80%',
          gray900: '210 40% 98%'
        }
      }
    };
    
    updateBrandConfig(defaultConfig);
    toast({
      title: "Configurações restauradas",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  const exportConfig = () => {
    const dataStr = JSON.stringify(brandConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'brand-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          updateBrandConfig(config);
          toast({
            title: "Configurações importadas",
            description: "As configurações foram importadas com sucesso.",
          });
        } catch (error) {
          toast({
            title: "Erro na importação",
            description: "Arquivo de configuração inválido.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Gerenciar Marca</h1>
            <p className="text-muted-foreground">
              Personalize a identidade visual e configurações de white label da sua empresa
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restaurar Padrão
            </Button>
            <Button variant="outline" onClick={exportConfig}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="general" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">
                  <Globe className="w-4 h-4 mr-2" />
                  Geral
                </TabsTrigger>
                <TabsTrigger value="colors">
                  <Palette className="w-4 h-4 mr-2" />
                  Cores
                </TabsTrigger>
                <TabsTrigger value="images">
                  <Image className="w-4 h-4 mr-2" />
                  Imagens
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nome da Empresa</Label>
                      <Input
                        id="companyName"
                        value={brandConfig.companyName}
                        onChange={(e) => updateBrandConfig({ companyName: e.target.value })}
                        placeholder="Digite o nome da empresa"
                      />
                      <p className="text-sm text-muted-foreground">
                        Este nome aparecerá no sistema e nos apps instalados
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pageTitle">Título da Página</Label>
                      <Input
                        id="pageTitle"
                        value={brandConfig.pageTitle}
                        onChange={(e) => updateBrandConfig({ pageTitle: e.target.value })}
                        placeholder="Digite o título que aparecerá na aba do navegador"
                      />
                      <p className="text-sm text-muted-foreground">
                        Este texto aparecerá na aba do navegador
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Colors Tab */}
              <TabsContent value="colors">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Paleta de Cores
                      <div className="flex space-x-1">
                        <Button
                          variant={activeTheme === 'light' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveTheme('light')}
                        >
                          <Monitor className="w-4 h-4 mr-1" />
                          Claro
                        </Button>
                        <Button
                          variant={activeTheme === 'dark' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setActiveTheme('dark')}
                        >
                          <Monitor className="w-4 h-4 mr-1" />
                          Escuro
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Badge variant="outline" className="mb-4">
                      Editando tema: {activeTheme === 'light' ? 'Claro' : 'Escuro'}
                    </Badge>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ColorPicker
                        label="Cor Primária"
                        value={brandConfig.colors[activeTheme].primary}
                        onChange={(color) => updateColors(activeTheme, { primary: color })}
                        description="Cor principal dos botões e elementos destacados"
                      />
                      
                      <ColorPicker
                        label="Cor Secundária"
                        value={brandConfig.colors[activeTheme].secondary}
                        onChange={(color) => updateColors(activeTheme, { secondary: color })}
                        description="Cor de fundo dos elementos secundários"
                      />
                      
                      <ColorPicker
                        label="Cor de Destaque"
                        value={brandConfig.colors[activeTheme].accent}
                        onChange={(color) => updateColors(activeTheme, { accent: color })}
                        description="Cor para elementos em destaque"
                      />
                      
                      <ColorPicker
                        label="Cor de Fundo"
                        value={brandConfig.colors[activeTheme].background}
                        onChange={(color) => updateColors(activeTheme, { background: color })}
                        description="Cor de fundo principal"
                      />
                      
                      <ColorPicker
                        label="Cor do Texto"
                        value={brandConfig.colors[activeTheme].foreground}
                        onChange={(color) => updateColors(activeTheme, { foreground: color })}
                        description="Cor principal do texto"
                      />
                      
                      <ColorPicker
                        label="Cor Esmaecida"
                        value={brandConfig.colors[activeTheme].muted}
                        onChange={(color) => updateColors(activeTheme, { muted: color })}
                        description="Cor para textos secundários"
                      />
                      
                      <ColorPicker
                        label="Cor das Bordas"
                        value={brandConfig.colors[activeTheme].border}
                        onChange={(color) => updateColors(activeTheme, { border: color })}
                        description="Cor das bordas dos elementos"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images">
                <Card>
                  <CardHeader>
                    <CardTitle>Logotipo e Ícones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ImageUpload
                      label="Logotipo"
                      value={brandConfig.logo}
                      onChange={(url) => updateBrandConfig({ logo: url })}
                      description="Logotipo que aparecerá no sistema (recomendado: PNG com fundo transparente)"
                    />
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Ícones para Diferentes Plataformas</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure ícones específicos que aparecerão nos apps instalados e na aba do navegador
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4">
                          <div className="flex items-center mb-3">
                            <Monitor className="w-5 h-5 mr-2" />
                            <h5 className="font-medium">PC (Favicon)</h5>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Ícone da aba do navegador (32x32px)
                          </p>
                          {brandConfig.favicon && brandConfig.favicon !== '/favicon.ico' && (
                            <div className="mb-3">
                              <img
                                src={brandConfig.favicon}
                                alt="Favicon"
                                className="w-8 h-8 object-contain border border-border rounded"
                              />
                            </div>
                          )}
                          <ImageUpload
                            label="Favicon"
                            value={brandConfig.favicon}
                            onChange={(url) => updateBrandConfig({ favicon: url })}
                            accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                          />
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center mb-3">
                            <Apple className="w-5 h-5 mr-2" />
                            <h5 className="font-medium">iOS</h5>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            App instalado no iPhone/iPad (180x180px)
                          </p>
                          {brandConfig.iosIcon && (
                            <div className="mb-3">
                              <img
                                src={brandConfig.iosIcon}
                                alt="iOS Icon"
                                className="w-12 h-12 object-contain border border-border rounded"
                              />
                            </div>
                          )}
                          <ImageUpload
                            label="Ícone iOS"
                            value={brandConfig.iosIcon}
                            onChange={(url) => updateBrandConfig({ iosIcon: url })}
                            accept="image/png"
                          />
                        </Card>
                        
                        <Card className="p-4">
                          <div className="flex items-center mb-3">
                            <Smartphone className="w-5 h-5 mr-2" />
                            <h5 className="font-medium">Android</h5>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            App instalado no Android (192x192px)
                          </p>
                          {brandConfig.androidIcon && (
                            <div className="mb-3">
                              <img
                                src={brandConfig.androidIcon}
                                alt="Android Icon"
                                className="w-12 h-12 object-contain border border-border rounded"
                              />
                            </div>
                          )}
                          <ImageUpload
                            label="Ícone Android"
                            value={brandConfig.androidIcon}
                            onChange={(url) => updateBrandConfig({ androidIcon: url })}
                            accept="image/png"
                          />
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Preview ao Vivo</h3>
              <BrandPreview />
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default GerenciarMarca;
