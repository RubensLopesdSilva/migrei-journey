import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { Loader2, CheckCircle } from "lucide-react";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { checkSubscription } = useSubscription();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let mounted = true;

    const processSuccess = async () => {
      // Dispara verificação em background (não bloqueia)
      checkSubscription();
      
      // Aguarda 2 segundos para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!mounted) return;
      
      // Mostra confirmação
      setVerified(true);
      
      // Redireciona após 1 segundo (total: 3s)
      setTimeout(() => {
        if (mounted) {
          navigate("/escolher-agente", { replace: true });
        }
      }, 1000);
    };

    processSuccess();

    return () => {
      mounted = false;
    };
  }, [checkSubscription, navigate]);

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
            </div>
          </>
        )}
      </div>
    </div>
  );
}