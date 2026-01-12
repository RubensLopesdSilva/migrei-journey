import { useState, useEffect } from "react";
import { MentoringSession, MentorAvailability } from "@/hooks/useMentoring";
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
import { Loader2, Clock, AlertCircle } from "lucide-react";
import { format, addDays, addHours, setHours, setMinutes, isBefore, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BookedSlot } from "@/hooks/useMentoringBooking";

interface RescheduleModalProps {
  session: MentoringSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (sessionId: string, mentorId: string, newScheduledAt: Date) => Promise<boolean>;
  fetchAvailability: (mentorId: string) => Promise<MentorAvailability[]>;
  fetchBookedSlots: (mentorId: string, startDate: Date, endDate: Date) => Promise<BookedSlot[]>;
  minAdvanceHours: number;
}

const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export function RescheduleModal({
  session,
  open,
  onOpenChange,
  onReschedule,
  fetchAvailability,
  fetchBookedSlots,
  minAdvanceHours,
}: RescheduleModalProps) {
  const [availability, setAvailability] = useState<MentorAvailability[]>([]);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);

  const mentor = session?.mentor;

  useEffect(() => {
    if (session?.mentor && open) {
      setLoading(true);
      const startDate = new Date();
      const endDate = addDays(startDate, 30);
      
      Promise.all([
        fetchAvailability(session.mentor_id),
        fetchBookedSlots(session.mentor_id, startDate, endDate),
      ]).then(([availData, bookedData]) => {
        setAvailability(availData);
        setBookedSlots(bookedData);
        setLoading(false);
      });
      
      setSelectedDate(undefined);
      setSelectedTime(null);
    }
  }, [session, open, fetchAvailability, fetchBookedSlots]);

  const isSlotBooked = (date: Date, time: string): boolean => {
    const [hours, minutes] = time.split(":").map(Number);
    const slotDate = setMinutes(setHours(date, hours), minutes);
    
    return bookedSlots.some((slot) => {
      const bookedDate = parseISO(slot.scheduled_at);
      return (
        bookedDate.getTime() === slotDate.getTime() &&
        // Exclude current session from "booked" check
        slot.scheduled_at !== session?.scheduled_at
      );
    });
  };

  const getAvailableTimesForDate = (date: Date): { time: string; available: boolean }[] => {
    const dayOfWeek = date.getDay();
    const dayAvailability = availability.filter((a) => a.day_of_week === dayOfWeek);
    const minBookingTime = addHours(new Date(), minAdvanceHours);

    const times: { time: string; available: boolean }[] = [];
    dayAvailability.forEach((slot) => {
      const [startHour, startMin] = slot.start_time.split(":").map(Number);
      const [endHour, endMin] = slot.end_time.split(":").map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${String(currentHour).padStart(2, "0")}:${String(currentMin).padStart(2, "0")}`;
        const slotDate = setMinutes(setHours(date, currentHour), currentMin);
        
        // Check minimum advance time and if slot is booked
        const isAfterMinAdvance = !isBefore(slotDate, minBookingTime);
        const isBooked = isSlotBooked(date, timeStr);

        if (isAfterMinAdvance) {
          times.push({ time: timeStr, available: !isBooked });
        }

        currentMin += 60;
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

  const handleReschedule = async () => {
    if (!session || !selectedDate || !selectedTime) return;

    setRescheduling(true);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const newScheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

    const success = await onReschedule(session.id, session.mentor_id, newScheduledAt);
    setRescheduling(false);

    if (success) {
      onOpenChange(false);
    }
  };

  if (!session || !mentor) return null;

  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : [];
  const currentScheduled = new Date(session.scheduled_at);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reagendar Mentoria</DialogTitle>
          <DialogDescription>
            Escolha uma nova data e horário para sua sessão.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatar_url || undefined} alt={mentor.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{mentor.name}</p>
            <p className="text-sm text-muted-foreground">{mentor.title}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Agendamento atual:</p>
            <p className="text-sm font-medium">
              {format(currentScheduled, "dd/MM 'às' HH:mm", { locale: ptBR })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <span className="text-amber-700">
            Reagendamentos devem ser feitos com no mínimo {minAdvanceHours}h de antecedência.
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : availability.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Este mentor ainda não definiu horários disponíveis.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-2">Selecione uma nova data</p>
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
                    {availableTimes.map(({ time, available }) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : available ? "outline" : "ghost"}
                        className={`justify-center ${!available ? "opacity-50 line-through" : ""}`}
                        onClick={() => available && setSelectedTime(time)}
                        disabled={!available}
                      >
                        {time}
                        {!available && <span className="ml-1 text-xs">(ocupado)</span>}
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
            onClick={handleReschedule}
            disabled={!selectedDate || !selectedTime || rescheduling}
          >
            {rescheduling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Reagendando...
              </>
            ) : (
              "Confirmar Reagendamento"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
