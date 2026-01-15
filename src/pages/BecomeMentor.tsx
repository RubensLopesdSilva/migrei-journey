import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { MentorRegistrationModal } from "@/components/mentoring/MentorRegistrationModal";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Heart,
  Star,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Impacto Real",
    description:
      "Ajude profissionais em transição de carreira a encontrarem seu caminho e alcançarem seus objetivos.",
  },
  {
    icon: Star,
    title: "Reconhecimento",
    description:
      "Seja reconhecido como especialista na comunidade e construa sua reputação como mentor.",
  },
  {
    icon: Clock,
    title: "Flexibilidade",
    description:
      "Defina sua própria disponibilidade e horários que se encaixam na sua rotina.",
  },
  {
    icon: Award,
    title: "Desenvolvimento",
    description:
      "Aprimore suas habilidades de liderança e comunicação enquanto ajuda outros.",
  },
];

const requirements = [
  "Experiência profissional de pelo menos 3 anos",
  "Ter passado por transição de carreira ou ter experiência relevante",
  "Disponibilidade de pelo menos 2 horas por mês",
  "Compromisso com o desenvolvimento dos mentorados",
  "Boa comunicação e empatia",
];

export default function BecomeMentor() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [isMentor, setIsMentor] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkMentorStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      const { data } = await supabase
        .from("mentors")
        .select("id")
        .eq("user_id", user.id)
        .single();

      setIsMentor(!!data);
      setChecking(false);
    };

    if (!authLoading) {
      checkMentorStatus();
    }
  }, [user, authLoading]);

  const handleStartRegistration = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setRegistrationModalOpen(true);
  };

  const handleRegistrationSuccess = () => {
    navigate("/mentor");
  };

  if (authLoading || checking) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-48 rounded-xl" />
              <Skeleton className="h-48 rounded-xl" />
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  // Already a mentor - redirect or show status
  if (isMentor) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <PageBreadcrumb
              items={[{ label: "Seja um Mentor", current: true }]}
            />

            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                Você já é um mentor! 🎉
              </h1>
              <p className="text-muted-foreground mb-6 max-w-md">
                Acesse sua área de mentor para gerenciar suas sessões e
                disponibilidade.
              </p>
              <Button onClick={() => navigate("/mentor")} className="gap-2">
                Ir para Área do Mentor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-8">
          {/* Breadcrumb */}
          <PageBreadcrumb items={[{ label: "Seja um Mentor", current: true }]} />

          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
            <div className="absolute inset-0 bg-grid-white/10" />
            <div className="relative px-6 py-12 md:px-12 md:py-16">
              <div className="max-w-2xl">
                <Badge className="mb-4 gap-2" variant="secondary">
                  <Sparkles className="h-3 w-3" />
                  Programa de Mentores
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Compartilhe sua experiência e
                  <span className="text-primary"> impacte vidas</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Torne-se mentor na plataforma Migrei e ajude profissionais em
                  transição de carreira a alcançarem seus objetivos. Sua
                  experiência pode fazer a diferença na jornada de alguém.
                </p>
                <Button
                  size="lg"
                  className="gap-2 btn-primary-gradient"
                  onClick={handleStartRegistration}
                >
                  <Users className="h-5 w-5" />
                  {user ? "Começar Cadastro" : "Entrar para Começar"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Por que ser um mentor?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <Card>
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">
                Requisitos para ser mentor
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                    <span className="text-sm">{req}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How it Works */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Como funciona?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="relative">
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <CardContent className="p-6 pt-8">
                  <h3 className="font-semibold mb-2">Faça seu cadastro</h3>
                  <p className="text-sm text-muted-foreground">
                    Preencha suas informações profissionais, áreas de expertise
                    e experiência.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <CardContent className="p-6 pt-8">
                  <h3 className="font-semibold mb-2">Configure sua agenda</h3>
                  <p className="text-sm text-muted-foreground">
                    Defina os dias e horários em que você está disponível para
                    mentorias.
                  </p>
                </CardContent>
              </Card>

              <Card className="relative">
                <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <CardContent className="p-6 pt-8">
                  <h3 className="font-semibold mb-2">Comece a mentorar</h3>
                  <p className="text-sm text-muted-foreground">
                    Receba agendamentos de mentorados e faça a diferença na
                    carreira de alguém.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-3">
                Pronto para começar sua jornada como mentor?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Junte-se à nossa comunidade de mentores e ajude a transformar
                carreiras. O cadastro é rápido e simples.
              </p>
              <Button
                size="lg"
                className="gap-2 btn-primary-gradient"
                onClick={handleStartRegistration}
              >
                <Users className="h-5 w-5" />
                {user ? "Cadastrar-se como Mentor" : "Entrar e Cadastrar"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Registration Modal */}
        <MentorRegistrationModal
          open={registrationModalOpen}
          onOpenChange={setRegistrationModalOpen}
          onSuccess={handleRegistrationSuccess}
        />
      </PageContent>
    </PageLayout>
  );
}
