import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TicketChat } from "@/components/support/TicketChat";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Headphones,
  ShieldX,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  MessagesSquare,
} from "lucide-react";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  messages_count?: number;
}

interface UserProfile {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const STATUS_OPTIONS = [
  { value: "open", label: "Aberto", color: "bg-yellow-500" },
  { value: "in_progress", label: "Em Andamento", color: "bg-blue-500" },
  { value: "resolved", label: "Resolvido", color: "bg-green-500" },
  { value: "closed", label: "Fechado", color: "bg-gray-500" },
];

const CATEGORY_LABELS: Record<string, string> = {
  general: "Dúvida Geral",
  technical: "Problema Técnico",
  billing: "Cobrança",
  mentoring: "Mentoria",
  account: "Minha Conta",
  suggestion: "Sugestão",
};

function AccessDenied() {
  const navigate = useNavigate();
  return (
    <PageLayout>
      <PageContent>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-muted-foreground mb-6 max-w-md">
            Esta área é exclusiva para administradores do sistema.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Voltar ao início
          </Button>
        </div>
      </PageContent>
    </PageLayout>
  );
}

export default function AdminSupport() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { toast } = useToast();

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (isAdmin) {
      fetchTickets();
    }
  }, [isAdmin]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .order("updated_at", { ascending: false });

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

      // Fetch user profiles
      const userIds = [...new Set((data || []).map((t) => t.user_id))];
      if (userIds.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        if (profilesData) {
          const profilesMap: Record<string, UserProfile> = {};
          profilesData.forEach((p) => {
            profilesMap[p.user_id] = p;
          });
          setProfiles(profilesMap);
        }
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("support_tickets")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status do ticket foi alterado com sucesso.",
      });

      fetchTickets();
      
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const filteredTickets = statusFilter === "all" 
    ? tickets 
    : tickets.filter(t => t.status === statusFilter);

  const openCount = tickets.filter((t) => t.status === "open").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
          <PageBreadcrumb
            items={[
              { label: "Administração", href: "/admin" },
              { label: "Suporte", current: true },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Headphones className="h-8 w-8 text-blue-600" />
                Central de Suporte
              </h1>
              <p className="text-muted-foreground">
                Gerencie as solicitações dos usuários
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {openCount} abertos
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {inProgressCount} em andamento
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tickets Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Solicitações ({filteredTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma solicitação encontrada.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Mensagens</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Atualizado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => {
                      const profile = profiles[ticket.user_id];
                      const statusConfig = STATUS_OPTIONS.find(
                        (s) => s.value === ticket.status
                      );

                      return (
                        <TableRow key={ticket.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-4 w-4" />
                              </div>
                              <span className="font-medium">
                                {profile?.full_name || "Usuário"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {ticket.subject}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {CATEGORY_LABELS[ticket.category] || ticket.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MessagesSquare className="h-4 w-4 text-muted-foreground" />
                              {ticket.messages_count || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={ticket.status}
                              onValueChange={(value) => handleStatusChange(ticket.id, value)}
                            >
                              <SelectTrigger className="w-[130px] h-8">
                                <Badge className={`${statusConfig?.color} text-white`}>
                                  {statusConfig?.label}
                                </Badge>
                              </SelectTrigger>
                              <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(ticket.updated_at), "dd/MM HH:mm", {
                                locale: ptBR,
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedTicket(ticket)}
                              className="gap-2"
                            >
                              <MessagesSquare className="h-4 w-4" />
                              Conversa
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Dialog */}
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-4 border-b">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="truncate mb-1">
                    {selectedTicket?.subject}
                  </DialogTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                      {selectedTicket && profiles[selectedTicket.user_id]?.full_name || "Usuário"}
                    </span>
                    <span>•</span>
                    <Badge variant="outline">
                      {selectedTicket && CATEGORY_LABELS[selectedTicket.category]}
                    </Badge>
                  </div>
                </div>
                {selectedTicket && (
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Original message */}
              {selectedTicket && (
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Mensagem original:</p>
                  <p className="text-sm">{selectedTicket.message}</p>
                </div>
              )}
            </DialogHeader>

            {selectedTicket && (
              <div className="flex-1 overflow-hidden">
                <TicketChat
                  ticketId={selectedTicket.id}
                  isAdmin={true}
                  onMessageSent={fetchTickets}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </PageContent>
    </PageLayout>
  );
}
