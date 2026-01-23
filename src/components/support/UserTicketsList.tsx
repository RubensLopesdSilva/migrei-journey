import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TicketChat } from "./TicketChat";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, Clock, CheckCircle, AlertCircle, MessagesSquare } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  messages_count?: number;
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
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

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

      // Get message counts for each ticket
      const ticketsWithCounts = await Promise.all(
        (data || []).map(async (ticket) => {
          const { count } = await supabase
            .from("ticket_messages")
            .select("*", { count: "exact", head: true })
            .eq("ticket_id", ticket.id);
          return { ...ticket, messages_count: count || 0 };
        })
      );

      setTickets(ticketsWithCounts);
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
    <>
      <div className="space-y-4">
        {tickets.map((ticket) => {
          const statusConfig = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
          const StatusIcon = statusConfig.icon;

          return (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
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
                  {ticket.messages_count! > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessagesSquare className="h-3 w-3" />
                        {ticket.messages_count} mensagens
                      </span>
                    </>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {ticket.message}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTicket(ticket)}
                  className="gap-2"
                >
                  <MessagesSquare className="h-4 w-4" />
                  Ver conversa
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chat Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4">{selectedTicket?.subject}</span>
              {selectedTicket && (
                <Badge variant={STATUS_CONFIG[selectedTicket.status]?.variant}>
                  {STATUS_CONFIG[selectedTicket.status]?.label}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="flex-1 overflow-hidden">
              <TicketChat
                ticketId={selectedTicket.id}
                isAdmin={false}
                onMessageSent={fetchTickets}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
