
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
  iosIcon: string;
  androidIcon: string;
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
      border: '214.3 31.8% 91.4%'
    },
    dark: {
      primary: '210 40% 98%',
      secondary: '0 0% 5%',
      accent: '0 0% 5%',
      background: '0 0% 0%',
      foreground: '210 40% 98%',
      muted: '0 0% 5%',
      border: '0 0% 10%'
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

// Convert hex to HSL
const hexToHsl = (hex: string): string => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
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
      const processedColors: Partial<BrandColors> = {};
      
      // Convert hex colors to HSL format
      Object.entries(colors).forEach(([key, value]) => {
        if (value && value.startsWith('#')) {
          processedColors[key as keyof BrandColors] = hexToHsl(value);
        } else {
          processedColors[key as keyof BrandColors] = value;
        }
      });

      const updated = {
        ...prev,
        colors: {
          ...prev.colors,
          [theme]: { ...prev.colors[theme], ...processedColors }
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
    
    // Apply all brand colors to CSS variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--secondary', colors.secondary);
    root.style.setProperty('--accent', colors.accent);
    root.style.setProperty('--background', colors.background);
    root.style.setProperty('--foreground', colors.foreground);
    root.style.setProperty('--muted', colors.muted);
    root.style.setProperty('--border', colors.border);
    
    // Update secondary and accent foreground colors based on background
    root.style.setProperty('--secondary-foreground', colors.foreground);
    root.style.setProperty('--accent-foreground', colors.foreground);
    root.style.setProperty('--muted-foreground', colors.foreground);
    
    // Update card colors to match background
    root.style.setProperty('--card', colors.background);
    root.style.setProperty('--card-foreground', colors.foreground);
    
    // Update primary foreground for better contrast
    root.style.setProperty('--primary-foreground', isDark ? colors.background : '210 40% 98%');
    
    // Update page title and favicon
    document.title = brandConfig.pageTitle;
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon && brandConfig.favicon) {
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
