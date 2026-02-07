import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import {
  Users,
  UserCog,
  Settings,
  ShieldCheck,
  ShieldX,
  ArrowRight,
  BarChart3,
  Headphones,
  Mail,
  FileText,
  Database,
} from "lucide-react";

const adminModules = [
  {
    icon: BarChart3,
    title: "Métricas de Conversão",
    description: "Funil, retenção e análise de cohorts",
    href: "/admin/metricas",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: FileText,
    title: "Blog",
    description: "Crie e gerencie artigos do blog",
    href: "/admin/blog",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: Mail,
    title: "Newsletter",
    description: "Gerencie inscrições e exporte a lista de emails",
    href: "/admin/newsletter",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
  },
  {
    icon: Database,
    title: "Exportar Dados",
    description: "Exporte dados do sistema em CSV",
    href: "/admin/exportar",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: UserCog,
    title: "Gerenciar Mentores",
    description: "Adicione, edite ou remova mentores da plataforma",
    href: "/admin/mentores",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Gerenciar Usuários",
    description: "Visualize e gerencie usuários e suas permissões",
    href: "/admin/usuarios",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Headphones,
    title: "Suporte",
    description: "Gerencie as solicitações de suporte dos usuários",
    href: "/admin/suporte",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Settings,
    title: "Configurações do Sistema",
    description: "Configure parâmetros gerais da plataforma",
    href: "/admin/configuracoes",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  // Loading state
  if (authLoading || adminLoading) {
    return (
      <PageLayout>
        <PageContent>
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
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
            items={[{ label: "Administração", current: true }]}
          />

          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-amber-600" />
              Painel de Administração
            </h1>
            <p className="text-muted-foreground">
              Gerencie mentores, usuários e configurações do sistema
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminModules.map((module) => (
              <Card
                key={module.title}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onClick={() => navigate(module.href)}
              >
                <CardHeader>
                  <div className={`h-14 w-14 rounded-xl ${module.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <module.icon className={`h-7 w-7 ${module.color}`} />
                  </div>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {module.title}
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
