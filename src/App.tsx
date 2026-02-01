import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { AgentProvider } from "@/hooks/useAgent";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { CelebrationProvider } from "@/components/ui/celebration-provider";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { AppLayout } from "@/components/layout/AppLayout";
import { SkipToContent } from "@/components/ui/focus-ring";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Index";
import Auth from "./pages/Auth";
import AgentSelection from "./pages/AgentSelection";
import ChoosePlan from "./pages/ChoosePlan";
import Settings from "./pages/Settings";
import Mentoring from "./pages/Mentoring";
import MentorDashboard from "./pages/MentorDashboard";
import BecomeMentor from "./pages/BecomeMentor";
import AdminMentors from "./pages/AdminMentors";
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMetrics from "./pages/AdminMetrics";
import AdminSupport from "./pages/AdminSupport";
import AdminNewsletter from "./pages/AdminNewsletter";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import Progress from "./pages/Progress";
import PositioningAcademy from "./pages/PositioningAcademy";
import Fase1Despertar from "./pages/Fase1Despertar";
import Fase2Descobrir from "./pages/Fase2Descobrir";
import Fase3Decidir from "./pages/Fase3Decidir";
import Fase4Desenvolver from "./pages/Fase4Desenvolver";
import Fase5Deslanchar from "./pages/Fase5Deslanchar";
import Fase6Desfrutar from "./pages/Fase6Desfrutar";
import Community from "./pages/Community";
import Landing from "./pages/Landing";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Support from "./pages/Support";
import ResetPassword from "./pages/ResetPassword";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <AgentProvider>
            <SubscriptionProvider>
              <CelebrationProvider>
                <SkipToContent />
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppLayout>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/redefinir-senha" element={<ResetPassword />} />
                      <Route path="/privacidade" element={<PrivacyPolicy />} />
                      <Route path="/termos" element={<TermsConditions />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      
                      {/* Protected routes */}
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/assinatura-sucesso" element={<ProtectedRoute requireSubscription={false}><SubscriptionSuccess /></ProtectedRoute>} />
                      <Route path="/assinar" element={<ProtectedRoute requireSubscription={false}><ChoosePlan /></ProtectedRoute>} />
                      <Route path="/escolher-agente" element={<ProtectedRoute requireSubscription={false}><AgentSelection /></ProtectedRoute>} />
                      <Route path="/configuracoes" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/mentoria" element={<ProtectedRoute><Mentoring /></ProtectedRoute>} />
                      <Route path="/mentor" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
                      <Route path="/seja-mentor" element={<ProtectedRoute><BecomeMentor /></ProtectedRoute>} />
                      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/admin/mentores" element={<ProtectedRoute><AdminMentors /></ProtectedRoute>} />
                      <Route path="/admin/usuarios" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
                      <Route path="/admin/configuracoes" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
                      <Route path="/admin/metricas" element={<ProtectedRoute><AdminMetrics /></ProtectedRoute>} />
                      <Route path="/admin/suporte" element={<ProtectedRoute><AdminSupport /></ProtectedRoute>} />
                      <Route path="/admin/newsletter" element={<ProtectedRoute><AdminNewsletter /></ProtectedRoute>} />
                      <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
                      <Route path="/admin/blog/:id" element={<ProtectedRoute><AdminBlogEditor /></ProtectedRoute>} />
                      <Route path="/progresso" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                      <Route path="/suporte" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                      <Route path="/networking" element={<ProtectedRoute><PositioningAcademy /></ProtectedRoute>} />
                      <Route path="/comunidade" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                      <Route path="/fase" element={<ProtectedRoute><Fase1Despertar /></ProtectedRoute>} />
                      <Route path="/fase/despertar" element={<ProtectedRoute><Fase1Despertar /></ProtectedRoute>} />
                      <Route path="/fase/descobrir" element={<ProtectedRoute><Fase2Descobrir /></ProtectedRoute>} />
                      <Route path="/fase/decidir" element={<ProtectedRoute><Fase3Decidir /></ProtectedRoute>} />
                      <Route path="/fase/desenvolver" element={<ProtectedRoute><Fase4Desenvolver /></ProtectedRoute>} />
                      <Route path="/fase/deslanchar" element={<ProtectedRoute><Fase5Deslanchar /></ProtectedRoute>} />
                      <Route path="/fase/desfrutar" element={<ProtectedRoute><Fase6Desfrutar /></ProtectedRoute>} />
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </BrowserRouter>
              </CelebrationProvider>
            </SubscriptionProvider>
          </AgentProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
