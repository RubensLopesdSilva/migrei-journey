import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AgentProvider } from "@/hooks/useAgent";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkipToContent } from "@/components/ui/focus-ring";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AgentSelection from "./pages/AgentSelection";
import Settings from "./pages/Settings";
import Mentoring from "./pages/Mentoring";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import Fase1Despertar from "./pages/Fase1Despertar";
import Fase2Descobrir from "./pages/Fase2Descobrir";
import Fase3Decidir from "./pages/Fase3Decidir";
import Fase4Desenvolver from "./pages/Fase4Desenvolver";
import Fase5Deslanchar from "./pages/Fase5Deslanchar";
import Fase6Desfrutar from "./pages/Fase6Desfrutar";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AgentProvider>
            <SubscriptionProvider>
              <SkipToContent />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/escolher-agente" element={<AgentSelection />} />
                    <Route path="/configuracoes" element={<Settings />} />
                    <Route path="/mentoria" element={<Mentoring />} />
                    <Route path="/progresso" element={<Progress />} />
                    <Route path="/comunidade" element={<Community />} />
                    <Route path="/fase" element={<Fase1Despertar />} />
                    <Route path="/fase/despertar" element={<Fase1Despertar />} />
                    <Route path="/fase/descobrir" element={<Fase2Descobrir />} />
                    <Route path="/fase/decidir" element={<Fase3Decidir />} />
                    <Route path="/fase/desenvolver" element={<Fase4Desenvolver />} />
                    <Route path="/fase/deslanchar" element={<Fase5Deslanchar />} />
                    <Route path="/fase/desfrutar" element={<Fase6Desfrutar />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </BrowserRouter>
            </SubscriptionProvider>
          </AgentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
