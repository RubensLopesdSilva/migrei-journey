import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2, CheckCircle } from "lucide-react";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscription, isSubscribed, status } = useSubscription();
  const [verified, setVerified] = useState(false);
  const attemptsRef = useRef(0);
  const maxAttempts = 15;
  const pollingIntervalMs = 1000; // Polling mais rápido: 1 segundo

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let mounted = true;

    const verifySubscription = async () => {
      if (!mounted) return;
      
      attemptsRef.current += 1;
      
      // Force refresh subscription status
      await checkSubscription();
      
      // Check if subscription is now active
      const hasActiveSubscription = isSubscribed || status === "active" || status === "trialing";
      
      if (hasActiveSubscription) {
        setVerified(true);
        // Redirect imediatamente para escolher agente
        setTimeout(() => {
          if (mounted) {
            navigate("/escolher-agente", { replace: true });
          }
        }, 800);
      } else if (attemptsRef.current < maxAttempts) {
        // Retry com polling mais rápido
        timeoutId = setTimeout(verifySubscription, pollingIntervalMs);
      } else {
        // Após máximo de tentativas, redireciona mesmo assim
        // O webhook pode sincronizar depois
        navigate("/escolher-agente", { replace: true });
      }
    };

    // Iniciar verificação imediatamente
    verifySubscription();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [checkSubscription, isSubscribed, status, navigate]);

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
                Redirecionando para escolher seu mentor...
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
              <p className="text-xs text-muted-foreground/60 mt-2">
                Tentativa {attemptsRef.current} de {maxAttempts}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
