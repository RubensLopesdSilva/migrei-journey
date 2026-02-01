import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { CheckCircle } from "lucide-react";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    // Dispara verificação em background e redireciona instantaneamente
    checkSubscription();
    
    // Redireciona imediatamente para escolher agente (0.5s apenas para mostrar sucesso)
    const timeout = setTimeout(() => {
      navigate("/escolher-agente", { replace: true });
    }, 500);

    return () => clearTimeout(timeout);
  }, [checkSubscription, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center p-8">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Pagamento confirmado!
          </h1>
          <p className="text-muted-foreground">
            Redirecionando...
          </p>
        </div>
      </div>
    </div>
  );
}
