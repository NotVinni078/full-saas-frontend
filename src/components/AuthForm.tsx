
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useBrand } from '@/contexts/BrandContext';

interface AuthFormProps {
  onAuth?: () => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { tempBrandConfig } = useBrand();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular autenticação
    setTimeout(() => {
      setIsLoading(false);
      if (onAuth) {
        onAuth();
      } else {
        navigate('/inicio');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo e Nome da Empresa */}
        <div className="text-center space-y-4">
          {tempBrandConfig.logo ? (
            <img 
              src={tempBrandConfig.logo} 
              alt="Logo" 
              className="h-16 w-auto mx-auto"
            />
          ) : (
            <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-xl">
                {tempBrandConfig.companyName.charAt(0)}
              </span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-brand-foreground">
            {tempBrandConfig.companyName}
          </h1>
        </div>

        {/* Formulário */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-brand-foreground">
              Bem-vindo
            </CardTitle>
            <CardDescription className="text-brand-muted">
              Entre com suas credenciais para acessar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-brand-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-brand-muted" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-brand-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-brand-muted" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-brand-muted hover:text-brand-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-brand-muted hover:text-brand-foreground transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-brand-primary hover:bg-brand-primary text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-brand-muted text-sm">
          © 2024 {tempBrandConfig.companyName}. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
