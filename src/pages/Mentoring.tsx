import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { useMentoring, Mentor, MentoringSession } from "@/hooks/useMentoring";
import { MentorCard } from "@/components/mentoring/MentorCard";
import { ScheduleModal } from "@/components/mentoring/ScheduleModal";
import { RescheduleModal } from "@/components/mentoring/RescheduleModal";
import { SessionCard } from "@/components/mentoring/SessionCard";
import { RodaMigreiSection } from "@/components/mentoring/RodaMigreiSection";
import { MentoringPageSkeleton } from "@/components/mentoring/MentoringPageSkeleton";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Calendar, 
  Crown,
  Sparkles,
  ArrowRight,
  Lock,
  AlertCircle,
  Zap,
  Info
} from "lucide-react";

export default function Mentoring() {
  const navigate = useNavigate();
  const {
    mentors,
    mySessions,
    sessionLimit,
    remainingSessions,
    canBookSessions,
    planSlug,
    planName,
    isSubscribed,
    hasAIAssistant,
    hasPrioritySupport,
    loading,
    fetchMentorAvailability,
    fetchBookedSlots,
    bookSession,
    cancelSession,
    rescheduleSession,
    cancellationInfo,
    minAdvanceHours,
  } = useMentoring();

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [sessionToReschedule, setSessionToReschedule] = useState<MentoringSession | null>(null);

  const handleSchedule = (mentor: Mentor) => {
    if (!canBookSessions) {
      return;
    }
    setSelectedMentor(mentor);
    setScheduleModalOpen(true);
  };

  const handleReschedule = (session: MentoringSession) => {
    setSessionToReschedule(session);
    setRescheduleModalOpen(true);
  };

  const handleCancelSession = async (sessionId: string) => {
    await cancelSession(sessionId);
  };

  const handleUpgrade = () => {
    navigate("/configuracoes");
  };

  const upcomingSessions = mySessions.filter(
    (s) => s.status === "scheduled" && new Date(s.scheduled_at) >= new Date()
  );
  const pastSessions = mySessions.filter(
    (s) => s.status !== "scheduled" || new Date(s.scheduled_at) < new Date()
  );

  const isPremiumPlan = planSlug === "premium";
  const isEssentialPlan = planSlug === "essential";
  const isFreePlan = planSlug === "free" || !planSlug;

  // Calculate session usage percentage
  const sessionUsagePercent = sessionLimit > 0 
    ? ((sessionLimit - remainingSessions) / sessionLimit) * 100 
    : 0;

  if (loading) {
    return (
      <PageLayout>
        <PageContent className="p-4 md:p-6 lg:p-8">
          <MentoringPageSkeleton />
        </PageContent>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
            {/* Breadcrumb */}
            <PageBreadcrumb
              items={[
                { label: "Mentoria", current: true }
              ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mentoria com especialistas</h1>
                <p className="text-muted-foreground mt-1">
                  Receba orientação de quem já percorreu caminhos semelhantes ao seu.
                </p>
              </div>

              {/* Plan Status Badge */}
              {isPremiumPlan ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                  <Crown className="h-5 w-5 text-amber-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-700">Plano Premium</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={sessionUsagePercent} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">
                        {remainingSessions}/{sessionLimit} sessões
                      </span>
                    </div>
                  </div>
                </div>
              ) : isEssentialPlan ? (
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-lg border border-blue-500/20">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-700">Plano Essencial</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={sessionUsagePercent} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">
                        {remainingSessions}/{sessionLimit} sessões
                      </span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleUpgrade}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  >
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Plano Gratuito</p>
                  </div>
                  <Button onClick={handleUpgrade} className="gap-2 btn-primary-gradient">
                    <Sparkles className="h-4 w-4" />
                    Fazer Upgrade
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Session Limit Warning */}
            {sessionLimit > 0 && remainingSessions === 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-700">
                    Você atingiu o limite de sessões deste mês
                  </p>
                  <p className="text-xs text-amber-600/80 mt-0.5">
                    {isPremiumPlan 
                      ? "Aguarde a renovação do seu plano para novas sessões."
                      : "Faça upgrade para o Premium e tenha mais sessões de mentoria."}
                  </p>
                </div>
                {!isPremiumPlan && (
                  <Button size="sm" onClick={handleUpgrade} variant="outline" className="border-amber-500/50 text-amber-700 hover:bg-amber-500/10">
                    <Zap className="h-3 w-3 mr-1" />
                    Upgrade
                  </Button>
                )}
              </div>
            )}

            {/* Cancellation Info */}
            {!isFreePlan && cancellationInfo && (
              <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3 text-sm">
                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">
                  {cancellationInfo.canCancelFree 
                    ? "Você tem 1 cancelamento gratuito disponível este mês."
                    : `Cancelamentos adicionais serão descontados do seu plano. (${cancellationInfo.paidCancellations} cancelamento(s) pago(s) este mês)`
                  }
                </span>
              </div>
            )}

            {/* Roda Migrei Section - Available for all */}
            <RodaMigreiSection isPremium={!isFreePlan} />

            {/* Mentors Section */}
            <Card className={isFreePlan ? "relative" : ""}>
              {/* Overlay for free users */}
              {isFreePlan && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-6">
                  <div className="text-center max-w-md">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Mentorias Exclusivas</h3>
                    <p className="text-muted-foreground mb-6">
                      Faça upgrade para o plano Essencial ou Premium para acessar mentorias 
                      individuais com profissionais experientes que já passaram pela transição de carreira.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handleUpgrade} className="gap-2 btn-primary-gradient">
                        <Sparkles className="h-4 w-4" />
                        Ver Planos
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Mentores Disponíveis
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Converse com profissionais que já passaram pela transição
                    </p>
                  </div>
                  {!isFreePlan && (
                    <Badge 
                      variant="outline" 
                      className={`gap-1 ${isPremiumPlan ? "border-amber-500/50 text-amber-600" : "border-blue-500/50 text-blue-600"}`}
                    >
                      {isPremiumPlan ? <Crown className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                      {planName}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-16 w-full mt-4" />
                          <div className="flex gap-2 mt-4">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : mentors.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum mentor disponível no momento.</p>
                    <p className="text-sm mt-2">Volte em breve para ver novos mentores.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentors.map((mentor) => (
                      <MentorCard
                        key={mentor.id}
                        mentor={mentor}
                        isPremium={canBookSessions}
                        onSchedule={handleSchedule}
                        disabled={!canBookSessions}
                        disabledReason={
                          isFreePlan 
                            ? "Faça upgrade para agendar" 
                            : remainingSessions === 0 
                              ? "Limite de sessões atingido"
                              : undefined
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Sessions - Only for paid users */}
            {!isFreePlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Minhas Mentorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AnimatedTabs defaultValue="upcoming">
                    <AnimatedTabsList>
                      <AnimatedTabsTrigger value="upcoming" className="gap-2">
                        Próximas
                        {upcomingSessions.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {upcomingSessions.length}
                          </Badge>
                        )}
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="past">Histórico</AnimatedTabsTrigger>
                    </AnimatedTabsList>

                    <AnimatedTabsContent value="upcoming" className="mt-4">
                      {upcomingSessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" aria-hidden="true" />
                          <p>Você não tem mentorias agendadas.</p>
                          {canBookSessions ? (
                            <p className="text-sm mt-1">
                              Escolha um mentor acima para agendar uma sessão.
                            </p>
                          ) : (
                            <p className="text-sm mt-1">
                              Você atingiu o limite de sessões deste mês.
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {upcomingSessions.map((session) => (
                            <SessionCard
                              key={session.id}
                              session={session}
                              onCancel={handleCancelSession}
                              onReschedule={handleReschedule}
                              cancellationInfo={cancellationInfo}
                            />
                          ))}
                        </div>
                      )}
                    </AnimatedTabsContent>

                    <AnimatedTabsContent value="past" className="mt-4">
                      {pastSessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Nenhuma mentoria no histórico.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pastSessions.map((session) => (
                            <SessionCard
                              key={session.id}
                              session={session}
                              onCancel={handleCancelSession}
                              cancellationInfo={cancellationInfo}
                            />
                          ))}
                        </div>
                      )}
                    </AnimatedTabsContent>
                  </AnimatedTabs>
                </CardContent>
              </Card>
            )}

            {/* Upgrade CTA for Essential users */}
            {isEssentialPlan && (
              <Card className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/20">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-semibold text-lg">Quer mais sessões de mentoria?</h3>
                      <p className="text-muted-foreground text-sm">
                        Com o plano Premium você tem 4 sessões por mês, suporte prioritário e conteúdo exclusivo.
                      </p>
                    </div>
                    <Button 
                      onClick={handleUpgrade}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 gap-2"
                    >
                      <Crown className="h-4 w-4" />
                      Upgrade para Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>

        <ScheduleModal
          mentor={selectedMentor}
          open={scheduleModalOpen}
          onOpenChange={setScheduleModalOpen}
          onBook={bookSession}
          fetchAvailability={fetchMentorAvailability}
          fetchBookedSlots={fetchBookedSlots}
          remainingSessions={remainingSessions}
          minAdvanceHours={minAdvanceHours}
        />

        <RescheduleModal
          session={sessionToReschedule}
          open={rescheduleModalOpen}
          onOpenChange={setRescheduleModalOpen}
          onReschedule={rescheduleSession}
          fetchAvailability={fetchMentorAvailability}
          fetchBookedSlots={fetchBookedSlots}
          minAdvanceHours={minAdvanceHours}
        />
      </PageContent>
    </PageLayout>
  );
}
