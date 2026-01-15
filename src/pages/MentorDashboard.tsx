import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { useMentor, MentorSession } from "@/hooks/useMentor";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "@/components/ui/animated-tabs";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Video,
  FileText,
  Settings,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

function MentorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </div>
  );
}

function AccessDenied() {
  const navigate = useNavigate();
  
  return (
    <PageLayout>
      <PageContent>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldCheck className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Esta área é exclusiva para mentores cadastrados na plataforma. 
            Se você é um mentor, verifique se sua conta está vinculada corretamente.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </PageContent>
    </PageLayout>
  );
}

interface SessionNotesModalProps {
  session: MentorSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (sessionId: string, notes: string) => Promise<boolean>;
}

function SessionNotesModal({ session, open, onOpenChange, onSave }: SessionNotesModalProps) {
  const [notes, setNotes] = useState(session?.notes || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!session) return;
    setSaving(true);
    const success = await onSave(session.id, notes);
    setSaving(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Anotações da Sessão</DialogTitle>
          <DialogDescription>
            {session && (
              <>
                Sessão com {session.mentee?.full_name || "Mentorado"} em{" "}
                {format(new Date(session.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Adicione anotações sobre a sessão, pontos discutidos, próximos passos..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Salvando..." : "Salvar Anotações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface AvailabilitySlot {
  day: number;
  name: string;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
}

interface AvailabilitySlotEditorProps {
  slot: AvailabilitySlot;
  isUpdating: boolean;
  onToggle: () => void;
  onUpdateTime: (startTime: string, endTime: string) => void;
}

function AvailabilitySlotEditor({ slot, isUpdating, onToggle, onUpdateTime }: AvailabilitySlotEditorProps) {
  const [startTime, setStartTime] = useState(slot.startTime);
  const [endTime, setEndTime] = useState(slot.endTime);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdateTime(startTime, endTime);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setIsEditing(false);
  };

  return (
    <div className={`p-3 rounded-lg border transition-colors ${slot.isAvailable ? 'bg-primary/5 border-primary/20' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            checked={slot.isAvailable}
            onCheckedChange={onToggle}
            disabled={isUpdating}
          />
          <Label className={slot.isAvailable ? "font-medium" : "text-muted-foreground"}>
            {slot.name}
          </Label>
        </div>
        
        {slot.isAvailable && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-sm"
            onClick={() => setIsEditing(true)}
          >
            <Clock className="h-3 w-3" />
            {slot.startTime} - {slot.endTime}
          </Button>
        )}
      </div>

      {slot.isAvailable && isEditing && (
        <div className="mt-3 pt-3 border-t space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Início</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">Fim</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MentorDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    isMentor,
    mentorProfile,
    loading,
    getFormattedAvailability,
    getSessionsByStatus,
    getStats,
    dayNames,
    toggleDayAvailability,
    updateAvailability,
    updateSessionStatus,
    addSessionNotes,
  } = useMentor();

  const [selectedSession, setSelectedSession] = useState<MentorSession | null>(null);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [sessionToCancel, setSessionToCancel] = useState<string | null>(null);
  const [updatingAvailability, setUpdatingAvailability] = useState<number | null>(null);

  // Loading state
  if (authLoading || loading) {
    return (
      <PageLayout>
        <PageContent>
          <MentorDashboardSkeleton />
        </PageContent>
      </PageLayout>
    );
  }

  // Not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Not a mentor
  if (!isMentor || !mentorProfile) {
    return <AccessDenied />;
  }

  const availabilitySlots = getFormattedAvailability();
  const { upcoming, past, cancelled } = getSessionsByStatus();
  const stats = getStats();

  const handleToggleDay = async (dayOfWeek: number) => {
    setUpdatingAvailability(dayOfWeek);
    await toggleDayAvailability(dayOfWeek);
    setUpdatingAvailability(null);
  };

  const handleUpdateTime = async (dayOfWeek: number, startTime: string, endTime: string) => {
    setUpdatingAvailability(dayOfWeek);
    await updateAvailability(dayOfWeek, startTime, endTime, true);
    setUpdatingAvailability(null);
  };

  const handleCancelSession = async () => {
    if (!sessionToCancel) return;
    await updateSessionStatus(sessionToCancel, "cancelled");
    setCancelDialogOpen(false);
    setSessionToCancel(null);
  };

  const handleCompleteSession = async (sessionId: string) => {
    await updateSessionStatus(sessionId, "completed");
  };

  const openNotesModal = (session: MentorSession) => {
    setSelectedSession(session);
    setNotesModalOpen(true);
  };

  const confirmCancelSession = (sessionId: string) => {
    setSessionToCancel(sessionId);
    setCancelDialogOpen(true);
  };

  const getMeetingUrl = (session: MentorSession) => {
    if (session.meeting_url) return session.meeting_url;
    return `https://meet.google.com/migrei-${session.id.slice(0, 8)}`;
  };

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[{ label: "Área do Mentor", current: true }]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Olá, {mentorProfile.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas mentorias e disponibilidade
              </p>
            </div>
            <Badge variant="outline" className="gap-2 px-4 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Mentor Verificado
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.upcomingSessions}</p>
                    <p className="text-xs text-muted-foreground">Próximas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.completedSessions}</p>
                    <p className="text-xs text-muted-foreground">Concluídas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.thisMonthSessions}</p>
                    <p className="text-xs text-muted-foreground">Este mês</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalSessions}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sessions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Minhas Sessões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatedTabs defaultValue="upcoming">
                  <AnimatedTabsList>
                    <AnimatedTabsTrigger value="upcoming" className="gap-2">
                      Próximas
                      {upcoming.length > 0 && (
                        <Badge variant="secondary">{upcoming.length}</Badge>
                      )}
                    </AnimatedTabsTrigger>
                    <AnimatedTabsTrigger value="past">Histórico</AnimatedTabsTrigger>
                  </AnimatedTabsList>

                  <AnimatedTabsContent value="upcoming" className="mt-4">
                    {upcoming.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma sessão agendada</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {upcoming.map((session) => (
                          <div
                            key={session.id}
                            className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={session.mentee?.avatar_url || undefined} />
                                  <AvatarFallback>
                                    {session.mentee?.full_name?.[0] || "M"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {session.mentee?.full_name || "Mentorado"}
                                  </p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {format(
                                      new Date(session.scheduled_at),
                                      "EEEE, dd/MM 'às' HH:mm",
                                      { locale: ptBR }
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                  onClick={() => openNotesModal(session)}
                                >
                                  <FileText className="h-3 w-3" />
                                  Notas
                                </Button>
                                <Button
                                  size="sm"
                                  className="gap-1"
                                  onClick={() => window.open(getMeetingUrl(session), "_blank")}
                                >
                                  <Video className="h-3 w-3" />
                                  Entrar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => confirmCancelSession(session.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatedTabsContent>

                  <AnimatedTabsContent value="past" className="mt-4">
                    {past.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Nenhuma sessão no histórico</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {past.slice(0, 10).map((session) => (
                          <div
                            key={session.id}
                            className="p-4 rounded-lg border bg-muted/30"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={session.mentee?.avatar_url || undefined} />
                                  <AvatarFallback>
                                    {session.mentee?.full_name?.[0] || "M"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {session.mentee?.full_name || "Mentorado"}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {format(
                                      new Date(session.scheduled_at),
                                      "dd/MM/yyyy 'às' HH:mm",
                                      { locale: ptBR }
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={session.status === "completed" ? "default" : "secondary"}
                                >
                                  {session.status === "completed" ? "Concluída" : "Passada"}
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => openNotesModal(session)}
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            {session.notes && (
                              <p className="mt-2 text-sm text-muted-foreground pl-13">
                                {session.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </AnimatedTabsContent>
                </AnimatedTabs>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Disponibilidade
                </CardTitle>
                <CardDescription>
                  Defina os dias e horários em que você pode receber mentorados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availabilitySlots.map((slot) => (
                    <AvailabilitySlotEditor
                      key={slot.day}
                      slot={slot}
                      isUpdating={updatingAvailability === slot.day}
                      onToggle={() => handleToggleDay(slot.day)}
                      onUpdateTime={(startTime, endTime) => handleUpdateTime(slot.day, startTime, endTime)}
                    />
                  ))}
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Dica</p>
                      <p>Mentorados só podem agendar nos horários que você definir para cada dia.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notes Modal */}
        <SessionNotesModal
          session={selectedSession}
          open={notesModalOpen}
          onOpenChange={setNotesModalOpen}
          onSave={addSessionNotes}
        />

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancelar sessão?</AlertDialogTitle>
              <AlertDialogDescription>
                O mentorado será notificado sobre o cancelamento. 
                Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelSession}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Cancelar Sessão
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageContent>
    </PageLayout>
  );
}
