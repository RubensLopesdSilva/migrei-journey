import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, Users, CheckCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { CommunityEvent } from '@/types/community';
import { EVENT_TYPE_LABELS } from '@/types/community';

interface EventsSectionProps {
  events: CommunityEvent[];
  onRegister: (eventId: string) => void;
}

export function EventsSection({ events, onRegister }: EventsSectionProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="font-semibold mb-2">Nenhum evento agendado</h3>
        <p className="text-muted-foreground">
          Em breve teremos novos eventos para você participar!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Próximos Eventos</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} onRegister={onRegister} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event, onRegister }: { event: CommunityEvent; onRegister: (id: string) => void }) {
  const startDate = new Date(event.starts_at);
  const endDate = new Date(event.ends_at);

  return (
    <Card className={cn(
      "card-elevated overflow-hidden",
      event.is_registered && "ring-2 ring-green-500/50"
    )}>
      <div 
        className="h-2" 
        style={{ backgroundColor: event.phase?.color || 'hsl(var(--primary))' }}
      />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {EVENT_TYPE_LABELS[event.event_type]}
            </Badge>
            <CardTitle className="text-lg">{event.title}</CardTitle>
          </div>
          {event.is_registered && (
            <Badge className="bg-green-500 text-white gap-1">
              <CheckCircle className="h-3 w-3" />
              Inscrito
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{event.description}</p>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(startDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}
            </span>
          </div>
          {event.max_participants && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>Máximo {event.max_participants} participantes</span>
            </div>
          )}
        </div>

        {event.phase && (
          <div className="flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: event.phase.color }}
            />
            <span className="text-xs text-muted-foreground">{event.phase.name}</span>
          </div>
        )}

        <div className="pt-2">
          {event.is_registered ? (
            event.meeting_url ? (
              <Button asChild className="w-full gap-2">
                <a href={event.meeting_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Acessar Evento
                </a>
              </Button>
            ) : (
              <Button disabled className="w-full">
                Link disponível em breve
              </Button>
            )
          ) : (
            <Button onClick={() => onRegister(event.id)} className="w-full">
              Inscrever-se
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
