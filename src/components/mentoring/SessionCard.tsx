import { useState } from "react";
import { MentoringSession, Mentor } from "@/hooks/useMentoring";
import { CancellationInfo } from "@/hooks/useMentoringBooking";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, Clock, Video, X, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { VideoCallModal } from "./VideoCallModal";

interface SessionCardProps {
  session: MentoringSession;
  onCancel: (sessionId: string) => void;
  onReschedule?: (session: MentoringSession) => void;
  cancellationInfo?: CancellationInfo;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  scheduled: { label: "Agendada", variant: "default" },
  completed: { label: "Concluída", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export function SessionCard({ session, onCancel, onReschedule, cancellationInfo }: SessionCardProps) {
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const mentor = session.mentor as Mentor | undefined;
  const status = statusLabels[session.status];
  const scheduledDate = new Date(session.scheduled_at);
  const isPast = scheduledDate < new Date();
  const canModify = session.status === "scheduled" && !isPast;
  
  // Allow joining 10 minutes before the scheduled time
  const canJoinNow = session.status === "scheduled" && 
    scheduledDate.getTime() - Date.now() <= 10 * 60 * 1000 &&
    !isPast;

  const initials = mentor
    ? mentor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  return (
    <Card className={session.status === "cancelled" ? "opacity-60" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={mentor?.avatar_url || undefined} alt={mentor?.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">{mentor?.name || "Mentor"}</p>
              <p className="text-sm text-muted-foreground">{mentor?.title}</p>

              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(scheduledDate, "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(scheduledDate, "HH:mm")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Badge variant={status.variant}>{status.label}</Badge>

            {/* Join button */}
            {session.status === "scheduled" && !isPast && (
              canJoinNow ? (
                <Button 
                  size="sm" 
                  className="gap-1 bg-green-600 hover:bg-green-700"
                  onClick={() => setVideoCallOpen(true)}
                >
                  <Video className="h-3 w-3" />
                  Entrar na Sala
                </Button>
              ) : (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Clock className="h-3 w-3" />
                  Disponível 10min antes
                </Badge>
              )
            )}

            {/* Action buttons for modifiable sessions */}
            {canModify && (
              <div className="flex gap-1">
                {/* Reschedule button */}
                {onReschedule && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:text-primary gap-1"
                    onClick={() => onReschedule(session)}
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reagendar
                  </Button>
                )}

                {/* Cancel button with confirmation */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive gap-1"
                    >
                      <X className="h-3 w-3" />
                      Cancelar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancelar Mentoria</AlertDialogTitle>
                      <AlertDialogDescription>
                        {cancellationInfo && !cancellationInfo.canCancelFree ? (
                          <>
                            <span className="text-amber-600 font-medium">Atenção:</span> Você já usou seu cancelamento gratuito deste mês. 
                            Este cancelamento será descontado do seu limite de sessões mensais.
                          </>
                        ) : (
                          "Tem certeza que deseja cancelar esta mentoria? Este é seu cancelamento gratuito do mês."
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Manter agendamento</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onCancel(session.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Confirmar cancelamento
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {/* Video Call Modal */}
      <VideoCallModal
        session={session}
        open={videoCallOpen}
        onOpenChange={setVideoCallOpen}
      />
    </Card>
  );
}

