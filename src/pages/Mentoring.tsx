import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { useMentoring, Mentor, MentoringSession } from "@/hooks/useMentoring";
import { ScheduleModal } from "@/components/mentoring/ScheduleModal";
import { RescheduleModal } from "@/components/mentoring/RescheduleModal";
import { SessionCard } from "@/components/mentoring/SessionCard";
import { MentoringHero } from "@/components/mentoring/MentoringHero";
import { MentorsGrid } from "@/components/mentoring/MentorsGrid";
import { MentoringPageSkeleton } from "@/components/mentoring/MentoringPageSkeleton";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Crown,
  AlertCircle,
  Zap,
  Info,
  Clock,
  CheckCircle2
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
        <div className="space-y-8">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Mentoria", current: true }
            ]}
          />

          {/* Hero Section */}
          <MentoringHero
            planSlug={planSlug}
            planName={planName}
            sessionLimit={sessionLimit}
            remainingSessions={remainingSessions}
            onUpgrade={handleUpgrade}
          />

          {/* Alerts Section */}
          <div className="space-y-3">
            {/* Session Limit Warning */}
            {sessionLimit > 0 && remainingSessions === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4"
              >
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
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
                  <Button 
                    size="sm" 
                    onClick={handleUpgrade} 
                    variant="outline" 
                    className="border-amber-500/50 text-amber-700 hover:bg-amber-500/10 shrink-0"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Upgrade
                  </Button>
                )}
              </motion.div>
            )}

            {/* Cancellation Info */}
          </div>

          {/* Mentors Grid */}
          <MentorsGrid
            mentors={mentors}
            loading={loading}
            canBookSessions={canBookSessions}
            isFreePlan={isFreePlan}
            remainingSessions={remainingSessions}
            onSchedule={handleSchedule}
            onUpgrade={handleUpgrade}
          />

          {/* My Sessions - Only for paid users */}
          {!isFreePlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Minhas Mentorias
                    </CardTitle>
                    {upcomingSessions.length > 0 && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Clock className="h-3 w-3 mr-1" />
                        {upcomingSessions.length} agendada(s)
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <AnimatedTabs defaultValue="upcoming">
                    <AnimatedTabsList className="mb-4">
                      <AnimatedTabsTrigger value="upcoming" className="gap-2">
                        <Clock className="h-4 w-4" />
                        Próximas
                        {upcomingSessions.length > 0 && (
                          <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                            {upcomingSessions.length}
                          </Badge>
                        )}
                      </AnimatedTabsTrigger>
                      <AnimatedTabsTrigger value="past" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Histórico
                      </AnimatedTabsTrigger>
                    </AnimatedTabsList>

                    <AnimatedTabsContent value="upcoming" className="mt-4">
                      {upcomingSessions.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Nenhuma mentoria agendada</h3>
                          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                            {canBookSessions 
                              ? "Escolha um mentor acima para agendar sua próxima sessão."
                              : "Você atingiu o limite de sessões deste mês."
                            }
                          </p>
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
                        <div className="text-center py-12">
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">Nenhuma mentoria no histórico.</p>
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
            </motion.div>
          )}

          {/* Upgrade CTA for Essential users */}
          {isEssentialPlan && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-amber-500/5 border-amber-500/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/25">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-xl">Quer mais sessões de mentoria?</h3>
                      <p className="text-muted-foreground mt-1">
                        Com o plano Premium você tem <strong>4 sessões por mês</strong>, suporte prioritário e conteúdo exclusivo.
                      </p>
                    </div>
                    <Button 
                      onClick={handleUpgrade}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 gap-2 shadow-lg shrink-0"
                    >
                      <Crown className="h-5 w-5" />
                      Upgrade para Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
