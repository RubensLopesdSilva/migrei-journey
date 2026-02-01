import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

// Routes that don't require subscription check
const SUBSCRIPTION_EXEMPT_ROUTES = [
  "/assinar",
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
  const location = useLocation();

  // Check if current route is exempt from subscription check
  const isExemptRoute = SUBSCRIPTION_EXEMPT_ROUTES.some(route => 
    location.pathname.startsWith(route)
  );

  // Check if user is exempt from payment
  const isPaymentExemptUser = user?.email && PAYMENT_EXEMPT_EMAILS.includes(user.email);

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

  if (!user) {
    // Save the attempted URL for redirecting after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check subscription only for non-exempt routes
  if (requireSubscription && !isExemptRoute) {
    // Wait for subscription check to complete
    if (subLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Verificando assinatura...</p>
          </div>
        </div>
      );
    }

    // Redirect to subscription page if no active subscription (unless exempt)
    const hasActiveSubscription = isSubscribed || status === "active" || status === "trialing" || isPaymentExemptUser;
    if (!hasActiveSubscription) {
      return <Navigate to="/assinar" replace />;
    }
  }

  return <>{children}</>;
}
