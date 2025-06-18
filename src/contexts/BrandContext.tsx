
import React, { createContext, useContext, useState, useEffect } from 'react';

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

interface BrandConfig {
  companyName: string;
  pageTitle: string;
  logo: string;
  favicon: string;
  colors: {
    light: BrandColors;
    dark: BrandColors;
  };
}

interface BrandContextType {
  brandConfig: BrandConfig;
  updateBrandConfig: (config: Partial<BrandConfig>) => void;
  updateColors: (theme: 'light' | 'dark', colors: Partial<BrandColors>) => void;
  applyBrandColors: () => void;
}

const defaultBrandConfig: BrandConfig = {
  companyName: 'Minha Empresa',
  pageTitle: 'Sistema de Atendimento',
  logo: '',
  favicon: '/favicon.ico',
  colors: {
    light: {
      primary: '#3b82f6',
      secondary: '#f1f5f9',
      accent: '#f1f5f9',
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0'
    },
    dark: {
      primary: '#f8fafc',
      secondary: '#0f172a',
      accent: '#0f172a',
      background: '#000000',
      foreground: '#f8fafc',
      muted: '#0f172a',
      border: '#1e293b'
    }
  }
};

const BrandContext = createContext<BrandContextType>({
  brandConfig: defaultBrandConfig,
  updateBrandConfig: () => {},
  updateColors: () => {},
  applyBrandColors: () => {}
});

export const useBrand = () => {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider');
  }
  return context;
};

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandConfig, setBrandConfig] = useState<BrandConfig>(() => {
    const stored = localStorage.getItem('brandConfig');
    return stored ? JSON.parse(stored) : defaultBrandConfig;
  });

  const updateBrandConfig = (config: Partial<BrandConfig>) => {
    setBrandConfig(prev => {
      const updated = { ...prev, ...config };
      localStorage.setItem('brandConfig', JSON.stringify(updated));
      return updated;
    });
  };

  const updateColors = (theme: 'light' | 'dark', colors: Partial<BrandColors>) => {
    setBrandConfig(prev => {
      const updated = {
        ...prev,
        colors: {
          ...prev.colors,
          [theme]: { ...prev.colors[theme], ...colors }
        }
      };
      localStorage.setItem('brandConfig', JSON.stringify(updated));
      return updated;
    });
  };

  const applyBrandColors = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const colors = isDark ? brandConfig.colors.dark : brandConfig.colors.light;
    
    const root = document.documentElement;
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--border', colors.border);
    
    // Update page title and favicon
    document.title = brandConfig.pageTitle;
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = brandConfig.favicon;
    }
  };

  useEffect(() => {
    applyBrandColors();
  }, [brandConfig]);

  useEffect(() => {
    // Listen for theme changes
    const observer = new MutationObserver(() => {
      applyBrandColors();
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [brandConfig]);

  return (
    <BrandContext.Provider value={{
      brandConfig,
      updateBrandConfig,
      updateColors,
      applyBrandColors
    }}>
      {children}
    </BrandContext.Provider>
  );
};
