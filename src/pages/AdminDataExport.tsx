import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SQLSchemaExport } from "@/components/admin/SQLSchemaExport";
import {
  Database,
  Users,
  Bot,
  Calendar,
  FileText,
  Download,
  ShieldX,
  ShieldCheck,
  Loader2,
  MessageSquare,
  Award,
  Target,
  TrendingUp,
  Briefcase,
  Heart,
  Code2,
  Table,
} from "lucide-react";

// Helper function to convert data to CSV
function convertToCSV(data: Record<string, unknown>[]): string {
  if (!data || data.length === 0) return "";
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const stringValue = value === null || value === undefined 
          ? "" 
          : typeof value === "object" 
            ? JSON.stringify(value).replace(/"/g, '""')
            : String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(",")
    )
  ];
  
  return csvRows.join("\n");
}

// Helper function to download CSV
function downloadCSV(data: string, filename: string) {
  const blob = new Blob(["\uFEFF" + data], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface ExportItem {
  id: string;
  label: string;
  table: string;
  description: string;
}

interface ExportCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  items: ExportItem[];
}

const exportCategories: ExportCategory[] = [
  {
    id: "users",
    icon: Users,
    title: "Usuários",
    description: "Perfis, assinaturas e progresso dos usuários",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    items: [
      { id: "profiles", label: "Perfis", table: "profiles", description: "Dados de perfil dos usuários" },
      { id: "user_subscriptions", label: "Assinaturas", table: "user_subscriptions", description: "Histórico de assinaturas" },
      { id: "user_progress", label: "Progresso Geral", table: "user_progress", description: "Progresso atual dos usuários" },
      { id: "user_phase_progress", label: "Progresso por Fase", table: "user_phase_progress", description: "Detalhes do progresso em cada fase" },
      { id: "user_roles", label: "Roles", table: "user_roles", description: "Permissões e roles dos usuários" },
      { id: "user_agents", label: "Agentes Selecionados", table: "user_agents", description: "Agente IA escolhido por cada usuário" },
      { id: "user_streaks", label: "Streaks", table: "user_streaks", description: "Sequências de atividade" },
    ],
  },
  {
    id: "mentoring",
    icon: Calendar,
    title: "Mentorias",
    description: "Sessões, mentores e disponibilidade",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    items: [
      { id: "mentoring_sessions", label: "Sessões", table: "mentoring_sessions", description: "Todas as sessões agendadas" },
      { id: "mentors", label: "Mentores", table: "mentors", description: "Lista de mentores cadastrados" },
      { id: "mentor_availability", label: "Disponibilidade", table: "mentor_availability", description: "Horários disponíveis dos mentores" },
    ],
  },
  {
    id: "phases",
    icon: Target,
    title: "Fases & Atividades",
    description: "Configuração de fases e atividades completadas",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    items: [
      { id: "migrei_phases", label: "Fases", table: "migrei_phases", description: "Configuração das 6 fases" },
      { id: "phase_activities", label: "Atividades", table: "phase_activities", description: "Atividades de cada fase" },
      { id: "user_activity_completions", label: "Conclusões", table: "user_activity_completions", description: "Atividades completadas pelos usuários" },
    ],
  },
  {
    id: "gamification",
    icon: Award,
    title: "Gamificação",
    description: "Badges, missões e conquistas",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    items: [
      { id: "badges", label: "Badges", table: "badges", description: "Lista de badges disponíveis" },
      { id: "user_badges", label: "Badges dos Usuários", table: "user_badges", description: "Badges conquistados" },
      { id: "missions", label: "Missões", table: "missions", description: "Missões disponíveis" },
      { id: "user_missions", label: "Missões dos Usuários", table: "user_missions", description: "Progresso nas missões" },
      { id: "achievements_line", label: "Conquistas", table: "achievements_line", description: "Linha de conquistas" },
    ],
  },
  {
    id: "community",
    icon: MessageSquare,
    title: "Comunidade",
    description: "Posts, eventos e interações da comunidade",
    color: "text-pink-600",
    bgColor: "bg-pink-500/10",
    items: [
      { id: "community_posts", label: "Posts", table: "community_posts", description: "Publicações da comunidade" },
      { id: "post_comments", label: "Comentários", table: "post_comments", description: "Comentários em posts" },
      { id: "post_likes", label: "Curtidas", table: "post_likes", description: "Curtidas em posts" },
      { id: "community_events", label: "Eventos", table: "community_events", description: "Eventos da comunidade" },
      { id: "event_registrations", label: "Inscrições em Eventos", table: "event_registrations", description: "Participantes de eventos" },
      { id: "give_ask_posts", label: "Give & Ask", table: "give_ask_posts", description: "Posts de ofertas e pedidos" },
    ],
  },
  {
    id: "ai",
    icon: Bot,
    title: "Inteligência Artificial",
    description: "Agentes, conversas e recomendações",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
    items: [
      { id: "ai_agents", label: "Agentes IA", table: "ai_agents", description: "Configuração dos agentes" },
      { id: "coach_conversations", label: "Conversas com Coach", table: "coach_conversations", description: "Histórico de conversas" },
    ],
  },
  {
    id: "discovery",
    icon: TrendingUp,
    title: "Descoberta (Fase 2)",
    description: "Diagnósticos, roda da carreira e relatórios",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
    items: [
      { id: "diagnostic_results", label: "Diagnósticos", table: "diagnostic_results", description: "Resultados dos diagnósticos" },
      { id: "career_wheel_assessments", label: "Roda da Carreira", table: "career_wheel_assessments", description: "Avaliações da roda da carreira" },
      { id: "professional_timeline", label: "Linha do Tempo", table: "professional_timeline", description: "Histórico profissional" },
      { id: "competency_assessments", label: "Competências", table: "competency_assessments", description: "Avaliação de competências" },
      { id: "clarity_reports", label: "Relatórios de Clareza", table: "clarity_reports", description: "Relatórios consolidados" },
    ],
  },
  {
    id: "decision",
    icon: Briefcase,
    title: "Decisão (Fase 3)",
    description: "Rotas, metas e planos de ação",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    items: [
      { id: "possibility_routes", label: "Rotas de Possibilidades", table: "possibility_routes", description: "Opções de carreira avaliadas" },
      { id: "decision_checkpoints", label: "Checkpoints de Decisão", table: "decision_checkpoints", description: "Pontos de decisão" },
      { id: "smart_goals", label: "Metas SMART", table: "smart_goals", description: "Metas definidas" },
      { id: "plan_90_days", label: "Plano 90 Dias", table: "plan_90_days", description: "Planos de 90 dias" },
    ],
  },
  {
    id: "content",
    icon: FileText,
    title: "Conteúdo",
    description: "Blog, newsletter e suporte",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
    items: [
      { id: "blog_posts", label: "Posts do Blog", table: "blog_posts", description: "Artigos publicados" },
      { id: "blog_categories", label: "Categorias do Blog", table: "blog_categories", description: "Categorias de artigos" },
      { id: "newsletter_subscriptions", label: "Newsletter", table: "newsletter_subscriptions", description: "Inscritos na newsletter" },
      { id: "support_tickets", label: "Tickets de Suporte", table: "support_tickets", description: "Solicitações de suporte" },
      { id: "ticket_messages", label: "Mensagens de Suporte", table: "ticket_messages", description: "Conversas de suporte" },
    ],
  },
  {
    id: "payments",
    icon: Heart,
    title: "Pagamentos",
    description: "Planos, cupons e resgates",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    items: [
      { id: "subscription_plans", label: "Planos", table: "subscription_plans", description: "Planos disponíveis" },
      { id: "plan_features", label: "Recursos dos Planos", table: "plan_features", description: "Features por plano" },
      { id: "coupons", label: "Cupons", table: "coupons", description: "Cupons de desconto" },
      { id: "coupon_redemptions", label: "Resgates de Cupons", table: "coupon_redemptions", description: "Cupons utilizados" },
    ],
  },
];

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

export default function AdminDataExport() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

  const handleExport = async (item: ExportItem) => {
    setLoadingItems(prev => ({ ...prev, [item.id]: true }));
    
    try {
      const { data, error } = await supabase
        .from(item.table as any)
        .select("*")
        .limit(50000);
      
      if (error) {
        console.error(`Error fetching ${item.table}:`, error);
        toast.error(`Erro ao exportar ${item.label}: ${error.message}`);
        return;
      }
      
      if (!data || data.length === 0) {
        toast.info(`Nenhum dado encontrado em ${item.label}`);
        return;
      }
      
      const csv = convertToCSV(data as unknown as Record<string, unknown>[]);
      downloadCSV(csv, item.table);
      toast.success(`${item.label} exportado com sucesso! (${data.length} registros)`);
    } catch (err) {
      console.error(`Error exporting ${item.table}:`, err);
      toast.error(`Erro ao exportar ${item.label}`);
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }));
    }
  };

  const handleExportAll = async (category: ExportCategory) => {
    toast.info(`Iniciando exportação de ${category.title}...`);
    
    for (const item of category.items) {
      await handleExport(item);
    }
    
    toast.success(`Exportação de ${category.title} concluída!`);
  };

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </PageContent>
      </PageLayout>
    );
  }

  // Not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  // Not an admin
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Administração", href: "/admin" },
              { label: "Exportar Dados", current: true },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Database className="h-8 w-8 text-cyan-600" />
              Exportar Dados
            </h1>
            <p className="text-muted-foreground">
              Exporte dados em CSV ou copie os SQLs para migrar a estrutura do banco
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="csv" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                Exportar CSV
              </TabsTrigger>
              <TabsTrigger value="sql" className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                SQL das Tabelas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="mt-6">
              {/* Export Categories Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {exportCategories.map((category) => (
                  <Card key={category.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-12 w-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                            <category.icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.title}</CardTitle>
                            <CardDescription>{category.description}</CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportAll(category)}
                          className="shrink-0"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Exportar Todos
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{item.label}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {item.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleExport(item)}
                              disabled={loadingItems[item.id]}
                              className="shrink-0 ml-2"
                            >
                              {loadingItems[item.id] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Info Card */}
              <Card className="bg-muted/30 border-dashed mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Informações sobre Exportação</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Os arquivos são exportados em formato CSV compatível com Excel</li>
                        <li>• Dados sensíveis como senhas e tokens não são incluídos</li>
                        <li>• O limite máximo por exportação é de 50.000 registros</li>
                        <li>• Os arquivos incluem a data de exportação no nome</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sql" className="mt-6">
              <SQLSchemaExport />
              
              {/* SQL Info Card */}
              <Card className="bg-muted/30 border-dashed mt-6">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Code2 className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Sobre os SQLs</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Os comandos CREATE TABLE recriam a estrutura das tabelas</li>
                        <li>• Inclui definições de tipos (ENUM), políticas RLS e constraints</li>
                        <li>• Execute os comandos na ordem correta (tabelas base antes das dependentes)</li>
                        <li>• Adapte as foreign keys conforme necessário no novo ambiente</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContent>
    </PageLayout>
  );
}
