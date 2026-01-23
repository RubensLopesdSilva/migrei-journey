import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_response: string | null;
  responded_at: string | null;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  open: { label: "Aberto", variant: "default", icon: Clock },
  in_progress: { label: "Em Andamento", variant: "secondary", icon: AlertCircle },
  resolved: { label: "Resolvido", variant: "outline", icon: CheckCircle },
  closed: { label: "Fechado", variant: "outline", icon: CheckCircle },
};

const CATEGORY_LABELS: Record<string, string> = {
  general: "Dúvida Geral",
  technical: "Problema Técnico",
  billing: "Cobrança",
  mentoring: "Mentoria",
  account: "Minha Conta",
  suggestion: "Sugestão",
};

export function UserTicketsList() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Você ainda não tem solicitações de suporte.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => {
        const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
        const StatusIcon = statusConfig.icon;

        return (
          <Card key={ticket.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base font-medium">
                  {ticket.subject}
                </CardTitle>
                <Badge variant={statusConfig.variant} className="shrink-0">
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {CATEGORY_LABELS[ticket.category] || ticket.category}
                </Badge>
                <span>•</span>
                <span>
                  {format(new Date(ticket.created_at), "dd 'de' MMM, HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {ticket.message}
              </p>

              {ticket.admin_response && (
                <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-primary">
                  <p className="text-xs font-medium text-primary mb-1">
                    Resposta da equipe
                  </p>
                  <p className="text-sm">{ticket.admin_response}</p>
                  {ticket.responded_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {format(new Date(ticket.responded_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
