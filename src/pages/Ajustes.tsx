
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
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-1">Gerencie as configurações do sistema</p>
        </div>

        {/* Menu Slider Horizontal */}
        <div className="bg-white border-b border-gray-200 px-6">
          <nav className="flex space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === item.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          {renderContent()}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Ajustes;
