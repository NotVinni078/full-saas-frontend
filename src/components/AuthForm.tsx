
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Sun, Moon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthFormProps {
  onAuth: () => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      onAuth();
    }, 1500);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const languages = [
    { code: 'pt-BR', name: 'Português (Brasil)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (USA)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español (España)', flag: '🇪🇸' }
  ];

  const texts = {
    'pt-BR': {
      welcome: 'Bem-vindo',
      loginDesc: 'Entre com suas credenciais para acessar sua conta',
      email: 'Email',
      password: 'Senha',
      forgotPassword: 'Esqueci minha senha',
      login: 'Entrar',
      logging: 'Entrando...',
      companyName: 'NOME DA EMPRESA'
    },
    'en-US': {
      welcome: 'Welcome',
      loginDesc: 'Enter your credentials to access your account',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot password',
      login: 'Login',
      logging: 'Logging in...',
      companyName: 'COMPANY NAME'
    },
    'es-ES': {
      welcome: 'Bienvenido',
      loginDesc: 'Ingresa tus credenciales para acceder a tu cuenta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      forgotPassword: 'Olvidé mi contraseña',
      login: 'Iniciar sesión',
      logging: 'Iniciando sesión...',
      companyName: 'NOMBRE DE LA EMPRESA'
    }
  };

  const t = texts[currentLanguage as keyof typeof texts];
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black"></div>
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Login Background"
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-8 left-8 brand-text-background">
          <h2 className="text-3xl font-bold mb-2">Gerencie seu negócio</h2>
          <p className="text-lg opacity-90">com inteligência e eficiência</p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 brand-gray-50 dark:brand-background transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Logo e Nome da Empresa */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 brand-primary dark:brand-background rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="brand-text-background dark:brand-text-foreground font-bold text-xl">SF</span>
            </div>
            <h1 className="text-2xl font-bold brand-text-foreground">
              {t.companyName}
            </h1>
          </div>

          {/* Formulário */}
          <Card className="border-0 shadow-lg dark:brand-gray-900">
            <CardHeader className="text-center pb-6 relative">
              {/* Botões de tema e idioma */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8 dark:brand-border-gray-600 dark:brand-hover-gray-700"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 dark:brand-border-gray-600 dark:brand-hover-gray-700"
                    >
                      <span className="text-sm">{currentLang?.flag}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 brand-background dark:brand-gray-800 brand-border dark:brand-border-gray-700">
                    {languages.map((language) => (
                      <DropdownMenuItem
                        key={language.code}
                        onClick={() => setCurrentLanguage(language.code)}
                        className="flex items-center space-x-2 cursor-pointer brand-hover-gray-100 dark:brand-hover-gray-700"
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-sm dark:brand-text-background">{language.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <CardTitle className="text-2xl brand-text-foreground">
                {t.welcome}
              </CardTitle>
              <CardDescription className="brand-text-muted">
                {t.loginDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="brand-text-foreground">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 brand-text-muted" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 dark:brand-gray-800 dark:brand-border-gray-600 dark:brand-text-background"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="brand-text-foreground">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 brand-text-muted" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 dark:brand-gray-800 dark:brand-border-gray-600 dark:brand-text-background"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 brand-text-muted brand-hover-text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm brand-text-muted hover:brand-text-foreground transition-colors"
                  >
                    {t.forgotPassword}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full brand-primary brand-hover-primary brand-text-background"
                  disabled={isLoading}
                >
                  {isLoading ? t.logging : t.login}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center brand-text-muted text-sm mt-8">
            © 2024 SaasFlow. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
