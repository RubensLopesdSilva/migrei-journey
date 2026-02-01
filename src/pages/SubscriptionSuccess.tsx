import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2, CheckCircle } from "lucide-react";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscription, isSubscribed, status } = useSubscription();
  const [attempts, setAttempts] = useState(0);
  const [verified, setVerified] = useState(false);
  const maxAttempts = 10;

  useEffect(() => {
    const verifySubscription = async () => {
      // Force refresh subscription status
      await checkSubscription();
      
      // Check if subscription is now active
      const hasActiveSubscription = isSubscribed || status === "active" || status === "trialing";
      
      if (hasActiveSubscription) {
        setVerified(true);
        // Wait a moment to show success state, then redirect
        setTimeout(() => {
          navigate("/escolher-agente", { replace: true });
        }, 1500);
      } else if (attempts < maxAttempts) {
        // Retry after 2 seconds if not yet active (webhook might be processing)
        setTimeout(() => {
          setAttempts(prev => prev + 1);
        }, 2000);
      } else {
        // After max attempts, redirect anyway - subscription might sync later
        navigate("/escolher-agente", { replace: true });
      }
    };

    verifySubscription();
  }, [attempts, checkSubscription, isSubscribed, status, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center p-8">
        {verified ? (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Pagamento confirmado!
              </h1>
              <p className="text-muted-foreground">
                Redirecionando para escolher seu agente...
              </p>
            </div>
          </>
        ) : (
          <>
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Confirmando seu pagamento...
              </h1>
              <p className="text-muted-foreground">
                Aguarde enquanto processamos sua assinatura
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
