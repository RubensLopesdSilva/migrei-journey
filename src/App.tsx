import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Mentoring from "./pages/Mentoring";
import Progress from "./pages/Progress";
import Community from "./pages/Community";
import Fase1Despertar from "./pages/Fase1Despertar";
import Fase2Descobrir from "./pages/Fase2Descobrir";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/configuracoes" element={<Settings />} />
              <Route path="/mentoria" element={<Mentoring />} />
              <Route path="/progresso" element={<Progress />} />
              <Route path="/comunidade" element={<Community />} />
              <Route path="/fase" element={<Fase1Despertar />} />
              <Route path="/fase/despertar" element={<Fase1Despertar />} />
              <Route path="/fase/descobrir" element={<Fase2Descobrir />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SubscriptionProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
