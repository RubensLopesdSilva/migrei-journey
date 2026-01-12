import { useState, useEffect } from "react";
import { Mentor, MentorAvailability } from "@/hooks/useMentoring";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Clock } from "lucide-react";
import { format, addDays, setHours, setMinutes, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ScheduleModalProps {
  mentor: Mentor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBook: (mentorId: string, scheduledAt: Date) => Promise<boolean>;
  fetchAvailability: (mentorId: string) => Promise<MentorAvailability[]>;
  remainingSessions: number;
}

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function ScheduleModal({
  mentor,
  open,
  onOpenChange,
  onBook,
  fetchAvailability,
  remainingSessions,
}: ScheduleModalProps) {
  const [availability, setAvailability] = useState<MentorAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (mentor && open) {
      setLoading(true);
      fetchAvailability(mentor.id).then((data) => {
        setAvailability(data);
        setLoading(false);
      });
      setSelectedDate(undefined);
      setSelectedTime(null);
    }
  }, [mentor, open, fetchAvailability]);

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek);

    const times: string[] = [];
    dayAvailability.forEach((slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
        
        // Check if this time slot is in the future
        const slotDate = setMinutes(setHours(date, currentHour), currentMin);
        if (!isBefore(slotDate, new Date())) {
          times.push(timeStr);
        }

        currentMin += 60; // 1 hour slots
        if (currentMin >= 60) {
          currentHour += 1;
          currentMin = 0;
        }
      }
    });

    return times;
  };

  const isDateAvailable = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return availability.some((a) => a.day_of_week === dayOfWeek);
  };

  const handleBook = async () => {
    if (!mentor || !selectedDate || !selectedTime) return;

    setBooking(true);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

    const success = await onBook(mentor.id, scheduledAt);
    setBooking(false);

    if (success) {
      onOpenChange(false);
    }
  };

  if (!mentor) return null;

  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Agendar Mentoria</DialogTitle>
          <DialogDescription>
            Escolha uma data e horário disponível para sua sessão de mentoria.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{mentor.name}</p>
            <p className="text-sm text-muted-foreground">{mentor.title}</p>
          </div>
          <Badge variant="outline" className="ml-auto">
            {remainingSessions} {remainingSessions === 1 ? "sessão restante" : "sessões restantes"}
          </Badge>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : availability.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Este mentor ainda não definiu horários disponíveis.</p>
            <p className="text-sm mt-2">Tente novamente mais tarde.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">Selecione uma data</p>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today || date > addDays(today, 30) || !isDateAvailable(date);
                }}
                locale={ptBR}
                className="rounded-md border"
              />
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Disponibilidade semanal:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {availability.map((slot) => (
                    <Badge key={slot.id} variant="secondary" className="text-xs">
                      {dayNames[slot.day_of_week].slice(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">
                {selectedDate
                  ? `Horários para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}`
                  : "Selecione uma data primeiro"}
              </p>

              {selectedDate && availableTimes.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  Nenhum horário disponível para esta data.
                </p>
              ) : (
                <ScrollArea className="h-[280px]">
                  <div className="grid grid-cols-2 gap-2 pr-4">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        className="justify-center"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleBook}
            disabled={!selectedDate || !selectedTime || booking}
          >
            {booking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Agendando...
              </>
            ) : (
              "Confirmar Agendamento"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
