
import React, { useState, createContext, useContext } from 'react';
import SidebarLayout from '@/components/SidebarLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AjustesOptions from '@/components/AjustesOptions';
import AjustesMensagensPadroes from '@/components/AjustesMensagensPadroes';
import AjustesExpediente from '@/components/AjustesExpediente';
import { Settings, MessageSquare, Clock } from 'lucide-react';

// Contexto para compartilhar configurações entre componentes
interface AjustesContextType {
  agendamentoTipo: 'empresa' | 'setor' | 'cargo';
  setAgendamentoTipo: (tipo: 'empresa' | 'setor' | 'cargo') => void;
}

const AjustesContext = createContext<AjustesContextType | null>(null);

export const useAjustes = () => {
  const context = useContext(AjustesContext);
  if (!context) {
    throw new Error('useAjustes deve ser usado dentro de AjustesProvider');
  }
  return context;
};

const Ajustes = () => {
  const [agendamentoTipo, setAgendamentoTipo] = useState<'empresa' | 'setor' | 'cargo'>('empresa');

  const contextValue: AjustesContextType = {
    agendamentoTipo,
    setAgendamentoTipo
  };

  return (
    <SidebarLayout>
      <div className="p-6 brand-background min-h-full">
        <h1 className="text-2xl font-bold brand-text-foreground mb-6">Configurações</h1>
        
        <AjustesContext.Provider value={contextValue}>
          <Tabs defaultValue="opcoes" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 brand-card brand-border">
              <TabsTrigger value="opcoes" className="flex items-center gap-2 brand-text-foreground data-[state=active]:brand-primary">
                <Settings className="w-4 h-4" />
                Opções
              </TabsTrigger>
              <TabsTrigger value="mensagens" className="flex items-center gap-2 brand-text-foreground data-[state=active]:brand-primary">
                <MessageSquare className="w-4 h-4" />
                Mensagens Padrões
              </TabsTrigger>
              <TabsTrigger value="expediente" className="flex items-center gap-2 brand-text-foreground data-[state=active]:brand-primary">
                <Clock className="w-4 h-4" />
                Expediente
              </TabsTrigger>
            </TabsList>

            <TabsContent value="opcoes">
              <AjustesOptions />
            </TabsContent>

            <TabsContent value="mensagens">
              <AjustesMensagensPadroes />
            </TabsContent>

            <TabsContent value="expediente">
              <AjustesExpediente />
            </TabsContent>
          </Tabs>
        </AjustesContext.Provider>
      </div>
    </SidebarLayout>
  );
};

export default Ajustes;
