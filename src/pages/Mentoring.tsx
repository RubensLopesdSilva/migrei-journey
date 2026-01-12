import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useMentoring, Mentor } from "@/hooks/useMentoring";
import { MentorCard } from "@/components/mentoring/MentorCard";
import { ScheduleModal } from "@/components/mentoring/ScheduleModal";
import { SessionCard } from "@/components/mentoring/SessionCard";
import { RodaMigreiSection } from "@/components/mentoring/RodaMigreiSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Users, 
  Calendar, 
  Crown,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function Mentoring() {
  const {
    mentors,
    mySessions,
    isPremium,
    remainingSessions,
    loading,
    fetchMentorAvailability,
    bookSession,
    cancelSession,
  } = useMentoring();

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const handleSchedule = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setScheduleModalOpen(true);
  };

  const upcomingSessions = mySessions.filter(
    (s) => s.status === "scheduled" && new Date(s.scheduled_at) >= new Date()
  );
  const pastSessions = mySessions.filter(
    (s) => s.status !== "scheduled" || new Date(s.scheduled_at) < new Date()
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mentoria</h1>
                <p className="text-muted-foreground mt-1">
                  Acelere sua transição com a Roda Migrei e mentorias individuais
                </p>
              </div>

              {isPremium ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Plano Premium</p>
                    <p className="text-xs text-muted-foreground">
                      {remainingSessions} {remainingSessions === 1 ? "mentoria restante" : "mentorias restantes"} este mês
                    </p>
                  </div>
                </div>
              ) : (
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Upgrade para Premium
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Roda Migrei Section - Available for all */}
            <RodaMigreiSection isPremium={isPremium} />

            {/* Mentors Section - Premium Only */}
            <Card>
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
                  <Badge variant="outline" className="gap-1">
                    <Crown className="h-3 w-3" />
                    Premium
                  </Badge>
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
                        isPremium={isPremium}
                        onSchedule={handleSchedule}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Sessions - Premium Only */}
            {isPremium && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Minhas Mentorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upcoming">
                    <TabsList>
                      <TabsTrigger value="upcoming" className="gap-2">
                        Próximas
                        {upcomingSessions.length > 0 && (
                          <Badge variant="secondary" className="ml-1">
                            {upcomingSessions.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                      <TabsTrigger value="past">Histórico</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upcoming" className="mt-4">
                      {upcomingSessions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                          <p>Você não tem mentorias agendadas.</p>
                          <p className="text-sm mt-1">
                            Escolha um mentor acima para agendar uma sessão.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {upcomingSessions.map((session) => (
                            <SessionCard
                              key={session.id}
                              session={session}
                              onCancel={cancelSession}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="past" className="mt-4">
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
                              onCancel={cancelSession}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      <ScheduleModal
        mentor={selectedMentor}
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        onBook={bookSession}
        fetchAvailability={fetchMentorAvailability}
        remainingSessions={remainingSessions}
      />
    </div>
  );
}
