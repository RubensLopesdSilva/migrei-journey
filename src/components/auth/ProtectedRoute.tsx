import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { useAgent } from "@/hooks/useAgent";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

// Routes that don't require subscription check
const SUBSCRIPTION_EXEMPT_ROUTES = [
  "/assinar",
  "/assinatura-sucesso",
  "/escolher-agente",
  "/configuracoes",
];

// Admin users exempt from payment requirement
const PAYMENT_EXEMPT_EMAILS = [
  "rubenslopesdsilva@gmail.com",
];

export function ProtectedRoute({ children, requireSubscription = true }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { isSubscribed, isLoading: subLoading, status } = useSubscription();
  const { hasSelectedAgent, loading: agentLoading } = useAgent();
  const location = useLocation();

  // Check if current route is exempt from subscription check
  const isExemptRoute = SUBSCRIPTION_EXEMPT_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );

  // Check if user is exempt from payment
  const isPaymentExemptUser = user?.email && PAYMENT_EXEMPT_EMAILS.includes(user.email);

  // 1. Wait for auth to load FIRST - this is the foundation
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // 2. Redirect to auth if not logged in (auth is done loading at this point)
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // 3. For exempt routes, allow access immediately (no more checks needed)
  if (isExemptRoute) {
    return <>{children}</>;
  }

  // 4. For non-exempt routes, check subscription
  if (requireSubscription) {
    // Wait for BOTH subscription AND agent loading to complete
    // CRITICAL: Both hooks now properly wait for auth to finish before setting their loading to false
    // This prevents race conditions where we redirect based on stale/initial state
    if (subLoading || agentLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando conta...</p>
          </div>
        </div>
      );
    }

    // Now ALL data is loaded - make decision based on complete state
    const hasActiveSubscription = isSubscribed || status === "active" || status === "trialing" || isPaymentExemptUser;
    
    // No subscription? Redirect to subscribe
    if (!hasActiveSubscription) {
      return <Navigate to="/assinar" replace />;
    }

    // Has subscription but no agent? Redirect to agent selection
    if (!hasSelectedAgent) {
      return <Navigate to="/escolher-agente" replace />;
    }
  }

  return <>{children}</>;
}
