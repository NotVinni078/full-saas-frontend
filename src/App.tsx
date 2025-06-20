
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { GlobalDataProvider } from "@/contexts/GlobalDataContext";
import { AnunciosProvider } from "@/contexts/AnunciosContext";
import { BrandProvider } from "@/contexts/BrandContext";
import { TenantProvider } from "@/contexts/TenantContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Inicio from "./pages/Inicio";
import Anuncios from "./pages/Anuncios";
import Atendimentos from "./pages/Atendimentos";
import ChatInterno from "./pages/ChatInterno";
import PainelAtendimentos from "./pages/PainelAtendimentos";
import Agendamentos from "./pages/Agendamentos";
import RespostasRapidas from "./pages/RespostasRapidas";
import Tarefas from "./pages/Tarefas";
import Campanhas from "./pages/Campanhas";
import GestaoContatos from "./pages/GestaoContatos";
import Tags from "./pages/Tags";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import Conexoes from "./pages/Conexoes";
import DashboardInfraestrutura from "./pages/DashboardInfraestrutura";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardUsuario from "./pages/DashboardUsuario";
import Avaliacao from "./pages/Avaliacao";
import GestaoSetores from "./pages/GestaoSetores";
import AdminEmpresas from "./pages/AdminEmpresas";
import Faturas from "./pages/Faturas";
import Planos from "./pages/Planos";
import GestaoPlanos from "./pages/GestaoPlanos";
import ChatBot from "./pages/ChatBot";
import Documentacao from "./pages/Documentacao";
import Ajustes from "./pages/Ajustes";
import GerenciarMarca from "./pages/GerenciarMarca";
import Integracoes from "./pages/Integracoes";
import TenantManagement from "./pages/TenantManagement";
import NotFound from "./pages/NotFound";
import TestesCores from "./pages/TestesCores";
import TestesTema from "./pages/TestesTema";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrandProvider>
      <TenantProvider>
        <GlobalDataProvider>
          <AnunciosProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/inicio" element={<Inicio />} />
                <Route path="/anuncios" element={<Anuncios />} />
                <Route path="/atendimentos" element={<Atendimentos />} />
                <Route path="/chat-interno" element={<ChatInterno />} />
                <Route path="/painel-atendimentos" element={<PainelAtendimentos />} />
                <Route path="/agendamentos" element={<Agendamentos />} />
                <Route path="/respostas-rapidas" element={<RespostasRapidas />} />
                <Route path="/tarefas" element={<Tarefas />} />
                <Route path="/campanhas" element={<Campanhas />} />
                <Route path="/gestao-contatos" element={<GestaoContatos />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/gestao-usuarios" element={<GestaoUsuarios />} />
                <Route path="/conexoes" element={<Conexoes />} />
                <Route path="/dashboard-infraestrutura" element={<DashboardInfraestrutura />} />
                <Route path="/dashboard-admin" element={<DashboardAdmin />} />
                <Route path="/dashboard-usuario" element={<DashboardUsuario />} />
                <Route path="/avaliacao" element={<Avaliacao />} />
                <Route path="/gestao-setores" element={<GestaoSetores />} />
                <Route path="/admin-empresas" element={<AdminEmpresas />} />
                <Route path="/faturas" element={<Faturas />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/gestao-planos" element={<GestaoPlanos />} />
                <Route path="/chatbot" element={<ChatBot />} />
                <Route path="/documentacao" element={<Documentacao />} />
                <Route path="/ajustes" element={<Ajustes />} />
                <Route path="/gerenciar-marca" element={<GerenciarMarca />} />
                <Route path="/integracoes" element={<Integracoes />} />
                <Route path="/tenant-management" element={<TenantManagement />} />
                <Route path="/testes-cores" element={<TestesCores />} />
                <Route path="/testes-tema" element={<TestesTema />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </AnunciosProvider>
        </GlobalDataProvider>
      </TenantProvider>
    </BrandProvider>
  </QueryClientProvider>
);

export default App;
