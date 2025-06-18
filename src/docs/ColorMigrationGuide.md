
# Guia de Migração: Cores Hardcoded → Sistema de Brand Dinâmico

## 📋 Visão Geral

Este guia fornece instruções detalhadas para migrar cores hardcoded para o sistema de brand dinâmico, garantindo que todas as cores sejam personalizáveis via Gestão de Marca.

## 🎯 Objetivos

- ✅ Eliminar 100% das cores hardcoded
- ✅ Garantir personalização completa via Brand Management
- ✅ Suporte total a temas claro/escuro
- ✅ Manter acessibilidade e contraste adequado

## 🗺️ Mapeamento de Migração

### Cores de Fundo (Background)

| Tailwind Hardcoded | Brand Class | Descrição |
|-------------------|-------------|-----------|
| `bg-white` | `brand-background` | Fundo principal |
| `bg-gray-50` | `brand-gray-50` | Fundo muito claro |
| `bg-gray-100` | `brand-gray-100` | Fundo claro |
| `bg-gray-200` | `brand-gray-200` | Fundo claro médio |
| `bg-gray-500` | `brand-gray-500` | Fundo médio |
| `bg-gray-900` | `brand-gray-900` | Fundo escuro |
| `bg-blue-500` | `brand-primary` | Cor primária |
| `bg-green-500` | `brand-success` | Cor de sucesso |
| `bg-yellow-500` | `brand-warning` | Cor de aviso |
| `bg-red-500` | `brand-error` | Cor de erro |

### Cores de Texto

| Tailwind Hardcoded | Brand Class | Descrição |
|-------------------|-------------|-----------|
| `text-gray-400` | `brand-text-gray-400` | Texto secundário |
| `text-gray-600` | `brand-text-gray-600` | Texto padrão |
| `text-gray-900` | `brand-text-gray-900` | Texto escuro |
| `text-muted-foreground` | `brand-text-muted` | Texto esmaecido |
| `text-blue-500` | `brand-text-primary` | Texto primário |

### Estados Hover

| Tailwind Hardcoded | Brand Class | Descrição |
|-------------------|-------------|-----------|
| `hover:bg-gray-100` | `brand-hover-gray-100` | Hover cinza claro |
| `hover:bg-blue-600` | `brand-hover-primary` | Hover primário |
| `hover:bg-green-600` | `brand-hover-success` | Hover sucesso |

## 🔧 Exemplos Práticos

### ❌ ANTES (Hardcoded)
```tsx
<div className="bg-white border border-gray-200 shadow-sm rounded-lg">
  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
    <h3 className="text-gray-900 font-medium">Título</h3>
    <p className="text-gray-600 text-sm">Descrição</p>
  </div>
  <div className="p-4">
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
      Ação
    </button>
  </div>
</div>
```

### ✅ DEPOIS (Brand System)
```tsx
<div className="brand-card shadow-sm rounded-lg">
  <div className="brand-gray-50 px-4 py-2 brand-border-gray-200 border-b">
    <h3 className="brand-text-foreground font-medium">Título</h3>
    <p className="brand-text-muted text-sm">Descrição</p>
  </div>
  <div className="p-4">
    <button className="brand-primary brand-hover-primary text-white px-4 py-2 rounded">
      Ação
    </button>
  </div>
</div>
```

### ✅ MELHOR AINDA (Usando Componentes)
```tsx
<Card>
  <CardHeader className="brand-gray-50">
    <CardTitle>Título</CardTitle>
    <CardDescription>Descrição</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="default">Ação</Button>
  </CardContent>
</Card>
```

## 🎨 Padrões de Uso

### Cards e Containers
```tsx
// ❌ Não usar
<div className="bg-white border border-gray-200">

// ✅ Usar
<div className="brand-card">
```

### Inputs e Formulários
```tsx
// ❌ Não usar
<input className="bg-white border border-gray-300 focus:border-blue-500">

// ✅ Usar
<input className="brand-input focus:brand-ring-primary">
```

### Estados de Status
```tsx
// ❌ Não usar
<div className="bg-green-100 text-green-800 border border-green-300">
  Sucesso
</div>

// ✅ Usar
<div className="brand-success">
  Sucesso
</div>

// ✅ Melhor ainda
<Badge variant="success">Sucesso</Badge>
```

## 🚦 Estados e Variações

### Status Dinâmico
```tsx
// Função utilitária para status dinâmico
const getStatusClasses = (status: 'success' | 'warning' | 'error' | 'info') => {
  return `brand-${status} brand-hover-${status}`;
};

<button className={getStatusClasses('success')}>
  Salvar
</button>
```

### Gray Scale Dinâmico
```tsx
// Para diferentes níveis de cinza
const grayLevels = {
  subtle: 'brand-gray-50',
  light: 'brand-gray-100',
  medium: 'brand-gray-300',
  strong: 'brand-gray-600',
  dark: 'brand-gray-900',
};
```

## 🔍 Checklist de Migração

Para cada componente, verificar:

- [ ] Substituir todas as classes `bg-*` por `brand-*`
- [ ] Substituir todas as classes `text-*` por `brand-text-*`
- [ ] Substituir todas as classes `border-*` por `brand-border-*`
- [ ] Substituir todos os `hover:*` por `brand-hover-*`
- [ ] Remover cores hex (#), rgb(), hsl() hardcoded
- [ ] Testar no tema claro e escuro
- [ ] Testar com diferentes configurações de marca
- [ ] Verificar contraste e acessibilidade

## 🧪 Testando a Migração

### 1. Teste Manual
- Ir para `/gerenciar-marca`
- Alterar cores primárias e secundárias
- Verificar se o componente atualiza em tempo real

### 2. Teste de Temas
- Alternar entre tema claro e escuro
- Verificar se todas as cores se adaptam corretamente

### 3. Teste de Contraste
- Usar ferramentas de acessibilidade
- Garantir contraste mínimo de 4.5:1 para texto

## ⚠️ Casos Especiais

### Cores Únicas/Específicas
Para cores que não fazem parte do sistema padrão:
```tsx
// ❌ Não usar
<div style={{ backgroundColor: '#ff6b35' }}>

// ✅ Adicionar ao BrandContext se necessário, ou usar CSS custom properties
<div style={{ backgroundColor: 'var(--custom-accent)' }}>
```

### Gradientes
```tsx
// ❌ Evitar hardcoded
<div className="bg-gradient-to-r from-blue-500 to-green-500">

// ✅ Usar CSS custom properties
<div className="bg-gradient-to-r from-[var(--primary)] to-[var(--success)]">
```

## 🎯 Prioridades de Migração

1. **Alta Prioridade**: Componentes visíveis na interface principal
2. **Média Prioridade**: Modais, formulários, páginas administrativas
3. **Baixa Prioridade**: Componentes raros ou de desenvolvimento

## 📝 Notas Finais

- Sempre testar a migração com diferentes configurações de marca
- Documentar qualquer cor personalizada necessária
- Manter consistência visual entre componentes
- Priorizar acessibilidade e usabilidade
