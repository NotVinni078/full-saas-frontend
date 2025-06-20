
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrandProvider } from "./contexts/BrandContext";
import { AnunciosProvider } from "./contexts/AnunciosContext";
import { SupabaseDataProvider } from "./contexts/SupabaseDataContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BrandProvider>
          <AnunciosProvider>
            <SupabaseDataProvider>
              <App />
            </SupabaseDataProvider>
          </AnunciosProvider>
        </BrandProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
