import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useAdminMetrics } from "@/hooks/useAdminMetrics";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserX,
  CreditCard,
  Activity,
  ArrowRight,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const phaseColors = [
  "#F59E0B", // Despertar
  "#3B82F6", // Descobrir
  "#10B981", // Decidir
  "#8B5CF6", // Desenvolver
  "#EC4899", // Deslanchar
  "#F97316", // Desfrutar
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

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
}

function MetricCard({ title, value, subtitle, icon: Icon, trend, trendValue, color = "primary" }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {trend && trendValue && (
              <div className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
              )}>
                {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            `bg-${color}/10`
          )} style={{ backgroundColor: `hsl(var(--${color}) / 0.1)` }}>
            <Icon className="h-6 w-6" style={{ color: `hsl(var(--${color}))` }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminMetrics() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { 
    funnel, 
    dailySignups, 
    phaseDistribution, 
    retentionCohorts,
    conversionRates,
    loading: metricsLoading 
  } = useAdminMetrics();

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
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

  // Format chart data
  const signupChartData = dailySignups?.slice(-14).map(d => ({
    date: format(parseISO(d.day), "dd/MM", { locale: ptBR }),
    signups: d.signups,
    with_agent: d.with_agent,
    paid: d.paid,
  })) || [];

  const funnelChartData = funnel ? [
    { name: "Cadastros", value: funnel.total_signups, fill: "#3B82F6" },
    { name: "Onboarding", value: funnel.completed_onboarding, fill: "#10B981" },
    { name: "Agente", value: funnel.selected_agent, fill: "#8B5CF6" },
    { name: "Fase 1", value: funnel.started_phase1, fill: "#F59E0B" },
    { name: "Pagos", value: funnel.converted_to_paid, fill: "#EC4899" },
  ] : [];

  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Administração", href: "/admin" },
              { label: "Métricas", current: true },
            ]}
          />

          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Métricas de Conversão
            </h1>
            <p className="text-muted-foreground">
              Análise de funil, retenção e distribuição de usuários
            </p>
          </div>

          {metricsLoading ? (
            <div className="grid md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <motion.div 
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MetricCard
                  title="Total Cadastros"
                  value={funnel?.total_signups || 0}
                  subtitle="Últimos 30 dias"
                  icon={Users}
                />
                <MetricCard
                  title="Ativos (7d)"
                  value={funnel?.active_last_7_days || 0}
                  subtitle={conversionRates ? `${conversionRates.signupToOnboarding}% conversão` : undefined}
                  icon={Activity}
                  trend="up"
                  trendValue={conversionRates?.signupToOnboarding + "% onboarding"}
                />
                <MetricCard
                  title="Pagantes"
                  value={funnel?.converted_to_paid || 0}
                  subtitle={conversionRates ? `${conversionRates.freeToPaid}% conversão` : undefined}
                  icon={CreditCard}
                  trend="up"
                  trendValue={conversionRates?.freeToPaid + "% free→paid"}
                />
                <MetricCard
                  title="Churned"
                  value={funnel?.churned_users || 0}
                  subtitle="Inativos 14+ dias"
                  icon={UserX}
                  trend="down"
                  trendValue={conversionRates?.churnRate + "% churn"}
                />
              </motion.div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Signups Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Cadastros Diários (14 dias)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={signupChartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="signups" 
                              stroke="hsl(var(--primary))" 
                              fill="hsl(var(--primary) / 0.2)"
                              name="Cadastros"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="with_agent" 
                              stroke="#8B5CF6" 
                              fill="rgba(139, 92, 246, 0.2)"
                              name="Com agente"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Funnel Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-primary" />
                        Funil de Conversão
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={funnelChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis type="number" className="text-xs" />
                            <YAxis type="category" dataKey="name" className="text-xs" width={80} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                              {funnelChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Phase Distribution & Retention */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Phase Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Distribuição por Fase
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {phaseDistribution?.map((phase, i) => (
                          <div key={phase.phase_number} className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: phaseColors[i] }} 
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium truncate">{phase.phase_name}</span>
                                <span className="text-sm text-muted-foreground">{phase.user_count} users</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full rounded-full transition-all" 
                                  style={{ 
                                    width: `${Math.min(100, (phase.user_count / (funnel?.total_signups || 1)) * 100)}%`,
                                    backgroundColor: phaseColors[i]
                                  }} 
                                />
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                Média: {phase.avg_days_in_phase || 0} dias na fase
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Retention Cohorts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" />
                        Retenção por Cohort
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 font-medium">Semana</th>
                              <th className="text-center py-2 font-medium">Users</th>
                              <th className="text-center py-2 font-medium">S1</th>
                              <th className="text-center py-2 font-medium">S2</th>
                              <th className="text-center py-2 font-medium">S4</th>
                            </tr>
                          </thead>
                          <tbody>
                            {retentionCohorts?.slice(0, 6).map((cohort) => (
                              <tr key={cohort.cohort_week} className="border-b border-border/50">
                                <td className="py-2 text-muted-foreground">
                                  {format(parseISO(cohort.cohort_week), "dd/MM", { locale: ptBR })}
                                </td>
                                <td className="py-2 text-center">{cohort.total_users}</td>
                                <td className="py-2 text-center">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-xs font-medium",
                                    cohort.week_1_retention >= 50 
                                      ? "bg-green-500/10 text-green-600" 
                                      : cohort.week_1_retention >= 30 
                                        ? "bg-yellow-500/10 text-yellow-600"
                                        : "bg-red-500/10 text-red-600"
                                  )}>
                                    {cohort.week_1_retention || 0}%
                                  </span>
                                </td>
                                <td className="py-2 text-center">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-xs font-medium",
                                    cohort.week_2_retention >= 40 
                                      ? "bg-green-500/10 text-green-600" 
                                      : cohort.week_2_retention >= 20 
                                        ? "bg-yellow-500/10 text-yellow-600"
                                        : "bg-red-500/10 text-red-600"
                                  )}>
                                    {cohort.week_2_retention || 0}%
                                  </span>
                                </td>
                                <td className="py-2 text-center">
                                  <span className={cn(
                                    "px-2 py-0.5 rounded text-xs font-medium",
                                    cohort.week_4_retention >= 30 
                                      ? "bg-green-500/10 text-green-600" 
                                      : cohort.week_4_retention >= 15 
                                        ? "bg-yellow-500/10 text-yellow-600"
                                        : "bg-red-500/10 text-red-600"
                                  )}>
                                    {cohort.week_4_retention || 0}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Conversion Rates Summary */}
              {conversionRates && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader>
                      <CardTitle className="text-base">Taxas de Conversão</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                          { label: "Signup → Onboard", value: conversionRates.signupToOnboarding },
                          { label: "Onboard → Agente", value: conversionRates.onboardingToAgent },
                          { label: "Agente → Fase 1", value: conversionRates.agentToPhase1 },
                          { label: "Fase 1 Completa", value: conversionRates.phase1Completion },
                          { label: "Free → Paid", value: conversionRates.freeToPaid },
                          { label: "Churn Rate", value: conversionRates.churnRate, negative: true },
                        ].map((rate) => (
                          <div key={rate.label} className="text-center">
                            <p className={cn(
                              "text-2xl font-bold",
                              rate.negative ? "text-red-600" : "text-primary"
                            )}>
                              {rate.value}%
                            </p>
                            <p className="text-[10px] text-muted-foreground">{rate.label}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </>
          )}
        </div>
      </PageContent>
    </PageLayout>
  );
}
