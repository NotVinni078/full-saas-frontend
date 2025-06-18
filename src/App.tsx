import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalDataProvider } from "@/contexts/GlobalDataContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
import DashboardGerencial from "./pages/DashboardGerencial";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GlobalDataProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/inicio" element={<Anuncios />} />
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
            <Route path="/dashboard-gerencial" element={<DashboardGerencial />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GlobalDataProvider>
  </QueryClientProvider>
);

export default App;
