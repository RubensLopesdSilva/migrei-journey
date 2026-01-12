import { MentoringSession, Mentor } from "@/hooks/useMentoring";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SessionCardProps {
  session: MentoringSession;
  onCancel: (sessionId: string) => void;
}

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  scheduled: { label: "Agendada", variant: "default" },
  completed: { label: "Concluída", variant: "secondary" },
  cancelled: { label: "Cancelada", variant: "destructive" },
};

export function SessionCard({ session, onCancel }: SessionCardProps) {
  const mentor = session.mentor as Mentor | undefined;
  const status = statusLabels[session.status];
  const scheduledDate = new Date(session.scheduled_at);
  const isPast = scheduledDate < new Date();
  const canCancel = session.status === "scheduled" && !isPast;

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

            {session.meeting_url && session.status === "scheduled" && !isPast && (
              <Button size="sm" variant="outline" className="gap-1" asChild>
                <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                  <Video className="h-3 w-3" />
                  Entrar
                </a>
              </Button>
            )}

            {canCancel && (
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive gap-1"
                onClick={() => onCancel(session.id)}
              >
                <X className="h-3 w-3" />
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
