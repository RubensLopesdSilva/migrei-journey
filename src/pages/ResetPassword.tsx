import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowRight, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import logoMigrei from "@/assets/logo-migrei.png";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { HeroMigreiWheel } from "@/components/landing/HeroMigreiWheel";
import { motion } from "framer-motion";

const passwordSchema = z.string().min(6, "Senha deve ter pelo menos 6 caracteres");

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Check if user has a valid recovery session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check if this is a password recovery flow
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get("type") || searchParams.get("type");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      
      if (type === "recovery" && accessToken) {
        // Set the session from the recovery link
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });
        
        if (error) {
          console.error("Error setting session:", error);
          setIsValidSession(false);
        } else {
          setIsValidSession(true);
        }
      } else if (session) {
        // User already has a session (maybe came from email link)
        setIsValidSession(true);
      } else {
        setIsValidSession(false);
      }
    };

    checkSession();
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Senha redefinida com sucesso!",
          description: "Você será redirecionado para o login.",
        });
        
        // Sign out and redirect after success
        setTimeout(async () => {
          await supabase.auth.signOut();
          navigate("/auth");
        }, 3000);
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Invalid or expired link
  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Link inválido ou expirado
          </h1>
          <p className="text-muted-foreground mb-6">
            O link de redefinição de senha não é mais válido. Por favor, solicite um novo link.
          </p>
          <Button onClick={() => navigate("/auth")} className="btn-primary-gradient">
            Voltar para o login
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back to login button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/auth")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>

          {/* Logo */}
          <div className="flex items-center justify-start mb-8">
            <img 
              src={logoMigrei} 
              alt="Migrei" 
              className="h-20 w-auto"
            />
          </div>

          {isSuccess ? (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Senha redefinida!</h3>
              <p className="text-muted-foreground mb-6">
                Sua senha foi alterada com sucesso. Você será redirecionado para o login...
              </p>
              <Loader2 className="h-5 w-5 animate-spin mx-auto text-primary" />
            </motion.div>
          ) : (
            <>
              {/* Title */}
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Criar nova senha
              </h2>
              <p className="text-muted-foreground mb-6">
                Digite sua nova senha abaixo
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password}</p>
                  )}
                  <PasswordStrengthIndicator password={password} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary-gradient"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Redefinir senha
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Roda Migrei */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-muted/50 via-background to-muted/30 items-center justify-center p-12">
        <div className="flex flex-col items-center gap-6">
          <HeroMigreiWheel />
          <p className="text-center text-muted-foreground max-w-sm">
            Crie uma senha forte para proteger sua jornada no <span className="font-semibold text-foreground">Ciclo Migrei</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
