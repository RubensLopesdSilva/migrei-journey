import { PageLayout } from "@/components/layout/PageLayout";
import { PageContent } from "@/components/ui/page-transition";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportTicketForm } from "@/components/support/SupportTicketForm";
import { UserTicketsList } from "@/components/support/UserTicketsList";
import { Headphones, MessageSquare, Mail, Clock } from "lucide-react";

export default function Support() {
  return (
    <PageLayout>
      <PageContent>
        <div className="space-y-6">
          <PageBreadcrumb
            items={[{ label: "Suporte", current: true }]}
          />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Headphones className="h-8 w-8 text-primary" />
                Central de Suporte
              </h1>
              <p className="text-muted-foreground">
                Tire suas dúvidas e receba ajuda da nossa equipe
              </p>
            </div>

            <SupportTicketForm />
          </div>

          {/* Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Chat de Suporte</p>
                  <p className="text-sm text-muted-foreground">
                    Resposta em até 24h
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    suporte@migrei.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Horário</p>
                  <p className="text-sm text-muted-foreground">
                    Seg-Sex, 9h-18h
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Minhas Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              <UserTicketsList />
            </CardContent>
          </Card>
        </div>
      </PageContent>
    </PageLayout>
  );
}
