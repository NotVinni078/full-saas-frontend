
/**
 * Utilitários para migração de cores hardcoded para o sistema de brand dinâmico
 */

// Mapeamento de cores Tailwind para classes brand equivalentes
export const TAILWIND_TO_BRAND_MAP = {
  // Backgrounds
  'bg-white': 'brand-background',
  'bg-gray-50': 'brand-gray-50',
  'bg-gray-100': 'brand-gray-100',
  'bg-gray-200': 'brand-gray-200',
  'bg-gray-300': 'brand-gray-300',
  'bg-gray-400': 'brand-gray-400',
  'bg-gray-500': 'brand-gray-500',
  'bg-gray-600': 'brand-gray-600',
  'bg-gray-700': 'brand-gray-700',
  'bg-gray-800': 'brand-gray-800',
  'bg-gray-900': 'brand-gray-900',
  'bg-blue-500': 'brand-primary',
  'bg-blue-600': 'brand-primary',
  'bg-green-500': 'brand-success',
  'bg-green-600': 'brand-success',
  'bg-yellow-500': 'brand-warning',
  'bg-yellow-600': 'brand-warning',
  'bg-red-500': 'brand-error',
  'bg-red-600': 'brand-error',
  
  // Text colors
  'text-white': 'brand-text-foreground',
  'text-black': 'brand-text-foreground',
  'text-gray-300': 'brand-text-gray-300',
  'text-gray-400': 'brand-text-gray-400',
  'text-gray-500': 'brand-text-gray-500',
  'text-gray-600': 'brand-text-gray-600',
  'text-gray-700': 'brand-text-gray-700',
  'text-gray-800': 'brand-text-gray-800',
  'text-gray-900': 'brand-text-gray-900',
  'text-blue-500': 'brand-text-primary',
  'text-blue-600': 'brand-text-primary',
  'text-green-500': 'brand-text-success',
  'text-green-600': 'brand-text-success',
  'text-yellow-500': 'brand-text-warning',
  'text-yellow-600': 'brand-text-warning',
  'text-red-500': 'brand-text-error',
  'text-red-600': 'brand-text-error',
  'text-muted-foreground': 'brand-text-muted',
  
  // Borders
  'border-gray-100': 'brand-border-gray-100',
  'border-gray-200': 'brand-border-gray-200',
  'border-gray-300': 'brand-border-gray-300',
  'border-gray-400': 'brand-border-gray-400',
  'border-gray-500': 'brand-border-gray-500',
  'border-gray-600': 'brand-border-gray-600',
  'border-gray-700': 'brand-border-gray-700',
  'border-gray-800': 'brand-border-gray-800',
  'border-gray-900': 'brand-border-gray-900',
  'border-blue-500': 'brand-border-primary',
  'border-green-500': 'border-success',
  'border-red-500': 'border-error',
  
  // Hover states
  'hover:bg-gray-50': 'brand-hover-gray-50',
  'hover:bg-gray-100': 'brand-hover-gray-100',
  'hover:bg-gray-200': 'brand-hover-gray-200',
  'hover:bg-gray-300': 'brand-hover-gray-300',
  'hover:bg-blue-600': 'brand-hover-primary',
  'hover:bg-green-600': 'brand-hover-success',
  'hover:bg-red-600': 'brand-hover-error',
} as const;

// Padrões regex para detectar cores hardcoded
export const HARDCODED_COLOR_PATTERNS = [
  // Tailwind classes
  /\b(bg|text|border|hover:bg|hover:text|hover:border|focus:bg|focus:text|focus:border|ring)-(gray|blue|green|red|yellow|purple|pink|indigo)-(50|100|200|300|400|500|600|700|800|900)\b/g,
  // Cores específicas
  /\b(bg|text|border)-(white|black)\b/g,
  // Hex colors
  /#[0-9a-fA-F]{3,6}\b/g,
  // RGB/RGBA
  /rgba?\([^)]+\)/g,
  // HSL/HSLA
  /hsla?\([^)]+\)/g,
];

/**
 * Detecta cores hardcoded em uma string de código
 */
export function detectHardcodedColors(code: string): string[] {
  const matches: string[] = [];
  
  HARDCODED_COLOR_PATTERNS.forEach(pattern => {
    const found = code.match(pattern);
    if (found) {
      matches.push(...found);
    }
  });
  
  return [...new Set(matches)]; // Remove duplicatas
}

/**
 * Sugere substituições para cores hardcoded
 */
export function suggestBrandReplacement(hardcodedColor: string): string | null {
  return TAILWIND_TO_BRAND_MAP[hardcodedColor as keyof typeof TAILWIND_TO_BRAND_MAP] || null;
}

/**
 * Gera relatório de cores hardcoded em um componente
 */
export function generateColorAuditReport(componentName: string, code: string) {
  const hardcodedColors = detectHardcodedColors(code);
  
  return {
    component: componentName,
    totalHardcodedColors: hardcodedColors.length,
    colors: hardcodedColors.map(color => ({
      hardcoded: color,
      suggested: suggestBrandReplacement(color) || 'MANUAL_REVIEW_NEEDED',
    })),
    needsManualReview: hardcodedColors.filter(color => !suggestBrandReplacement(color)),
  };
}

/**
 * Classes CSS dinâmicas que podem ser utilizadas com template strings
 */
export const DYNAMIC_BRAND_CLASSES = {
  // Status baseado em condição
  statusBackground: (status: 'success' | 'warning' | 'error' | 'info') => `brand-${status}`,
  statusText: (status: 'success' | 'warning' | 'error' | 'info') => `brand-text-${status}`,
  statusBorder: (status: 'success' | 'warning' | 'error' | 'info') => `brand-border-${status}`,
  
  // Gray scale dinâmico
  grayBackground: (level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => `brand-gray-${level}`,
  grayText: (level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => `brand-text-gray-${level}`,
  grayBorder: (level: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900) => `brand-border-gray-${level}`,
  
  // Hover states dinâmicos
  hoverBackground: (color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info') => `brand-hover-${color}`,
};

/**
 * Guia de migração com exemplos práticos
 */
export const MIGRATION_GUIDE = {
  examples: {
    'bg-gray-100': {
      before: 'className="bg-gray-100 p-4"',
      after: 'className="brand-gray-100 p-4"',
      description: 'Fundo cinza claro que se adapta ao tema',
    },
    'text-gray-600': {
      before: 'className="text-gray-600"',
      after: 'className="brand-text-gray-600"',
      description: 'Texto cinza médio que respeita a marca',
    },
    'hover:bg-blue-600': {
      before: 'className="bg-blue-500 hover:bg-blue-600"',
      after: 'className="brand-primary brand-hover-primary"',
      description: 'Botão primário com hover personalizado',
    },
  },
  patterns: {
    cards: 'Use brand-card para cartões que seguem o tema',
    inputs: 'Use brand-input para campos de formulário',
    buttons: 'Use os variants do Button component (success, warning, info)',
    borders: 'Use brand-border-* para bordas dinâmicas',
  },
};
