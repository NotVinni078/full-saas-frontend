
import React, { useState } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import AjustesOptions from '@/components/AjustesOptions';
import AjustesMensagensPadroes from '@/components/AjustesMensagensPadroes';
import AjustesExpediente from '@/components/AjustesExpediente';

const Ajustes = () => {
  const [activeSection, setActiveSection] = useState('opcoes');

  const menuItems = [
    { id: 'opcoes', label: 'Opções', icon: 'options' },
    { id: 'mensagens', label: 'Mensagens Padrões', icon: 'message-square' },
    { id: 'expediente', label: 'Expediente', icon: 'clock' }
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
      <div className="flex h-full">
        {/* Menu Slider Lateral */}
        <div className="w-64 bg-white border-r border-gray-200 h-full">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Configurações</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Ajustes;
