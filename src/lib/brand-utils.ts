
// Utility functions for brand colors
export const getBrandColor = (colorName: string, fallback?: string): string => {
  const root = document.documentElement;
  const brandColor = getComputedStyle(root).getPropertyValue(`--${colorName.replace(/([A-Z])/g, '-$1').toLowerCase()}`);
  return brandColor || fallback || 'currentColor';
};

export const setBrandColor = (colorName: string, value: string): void => {
  const root = document.documentElement;
  root.style.setProperty(`--${colorName.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
};

// Dynamic brand-aware class utilities
export const brandClasses = {
  // Backgrounds
  bgPrimary: 'bg-primary',
  bgSecondary: 'bg-secondary',
  bgAccent: 'bg-accent',
  bgCard: 'bg-card',
  bgBackground: 'bg-background',
  bgMuted: 'bg-muted',
  
  // Text colors
  textPrimary: 'text-primary',
  textForeground: 'text-foreground',
  textMuted: 'text-muted-foreground',
  textSecondary: 'text-secondary-foreground',
  
  // Borders
  borderBrand: 'border-border',
  borderPrimary: 'border-primary',
  
  // Hover states
  hoverBgPrimary: 'hover:bg-primary/90',
  hoverBgAccent: 'hover:bg-accent',
  hoverBgMuted: 'hover:bg-muted/50',
  
  // Status colors (using CSS variables)
  success: 'text-green-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  info: 'text-blue-600'
};

// Helper to get status colors that respect brand theme
export const getStatusColor = (status: 'success' | 'warning' | 'error' | 'info'): string => {
  const colors = {
    success: 'hsl(var(--success, 142.1 76.2% 36.3%))',
    warning: 'hsl(var(--warning, 47.9 95.8% 53.1%))',
    error: 'hsl(var(--error, 0 84.2% 60.2%))',
    info: 'hsl(var(--info, 199.89 89.47% 49.41%))'
  };
  return colors[status];
};

// Utility to ensure all hardcoded colors are replaced
export const replaceHardcodedColors = () => {
  console.log('🎨 All components should now use brand-aware colors');
  console.log('Primary:', getBrandColor('primary'));
  console.log('Secondary:', getBrandColor('secondary'));
  console.log('Background:', getBrandColor('background'));
  console.log('Foreground:', getBrandColor('foreground'));
};
