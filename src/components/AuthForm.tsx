
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Sun, Moon, Languages } from 'lucide-react';

interface AuthFormProps {
  onAuth: () => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt');

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

  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'pt' ? 'en' : 'pt');
  };

  const texts = {
    pt: {
      welcome: 'Bem-vindo',
      loginDesc: 'Entre com suas credenciais para acessar sua conta',
      email: 'Email',
      password: 'Senha',
      forgotPassword: 'Esqueci minha senha',
      login: 'Entrar',
      logging: 'Entrando...',
      companyName: 'NOME DA EMPRESA'
    },
    en: {
      welcome: 'Welcome',
      loginDesc: 'Enter your credentials to access your account',
      email: 'Email',
      password: 'Password',
      forgotPassword: 'Forgot password',
      login: 'Login',
      logging: 'Logging in...',
      companyName: 'COMPANY NAME'
    }
  };

  const t = texts[currentLanguage as keyof typeof texts];

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'dark' : ''}`}>
      {/* Lado esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700"></div>
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Login Background"
          className="w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Gerencie seu negócio</h2>
          <p className="text-lg opacity-90">com inteligência e eficiência</p>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-black transition-colors duration-300">
        <div className="w-full max-w-md">
          {/* Logo e Nome da Empresa */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">SF</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t.companyName}
            </h1>
          </div>

          {/* Formulário */}
          <Card className="border-0 shadow-lg dark:bg-gray-900">
            <CardHeader className="text-center pb-6 relative">
              {/* Botões de tema e idioma */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleLanguage}
                  className="h-8 w-8 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <Languages className="h-4 w-4" />
                </Button>
              </div>
              
              <CardTitle className="text-2xl text-gray-900 dark:text-white">
                {t.welcome}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                {t.loginDesc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    {t.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    {t.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    {t.forgotPassword}
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? t.logging : t.login}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
            © 2024 SaasFlow. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
