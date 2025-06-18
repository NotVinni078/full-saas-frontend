
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import AjustesOptions from '@/components/AjustesOptions';
import AjustesMensagensPadroes from '@/components/AjustesMensagensPadroes';
import AjustesExpediente from '@/components/AjustesExpediente';

const Ajustes = () => {
  const [activeSection, setActiveSection] = useState('opcoes');

  const menuItems = [
    { id: 'opcoes', label: 'Opções' },
    { id: 'mensagens', label: 'Mensagens Padrões' },
    { id: 'expediente', label: 'Expediente' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'opcoes':
        return <AjustesOptions />;
      case 'mensagens':
        return <AjustesMensagensPadroes />;
      case 'expediente':
        return <AjustesExpediente />;
      default:
        return <AjustesOptions />;
    }
  };

  return (
    <SidebarLayout>
      <div className="h-full flex flex-col">
        {/* Header da página */}
        <div className="bg-background border-b border-border px-4 sm:px-6 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Gerencie as configurações do sistema</p>
        </div>

        {/* Menu Slider Horizontal */}
        <div className="bg-background border-b border-border px-4 sm:px-6 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 min-w-max">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? 'border-foreground text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto bg-muted/30">
          {renderContent()}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Ajustes;
