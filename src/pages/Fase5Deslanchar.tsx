import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Rocket, Briefcase, BookOpen, Clock, Video, CalendarCheck } from 'lucide-react';
import { ExecutionPanel } from '@/components/launch/ExecutionPanel';
import { OpportunitiesDiary } from '@/components/launch/OpportunitiesDiary';
import { NetworkingRoutine } from '@/components/launch/NetworkingRoutine';
import { InterviewSimulator } from '@/components/launch/InterviewSimulator';
import { WeeklyCheckin } from '@/components/launch/WeeklyCheckin';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { useLaunch } from '@/hooks/useLaunch';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Fase5Deslanchar() {
  const { user, loading: authLoading } = useAuth();
  const { loading, getPhaseProgress } = useLaunch();
  const [activeTab, setActiveTab] = useState('execution');

  if (authLoading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const progress = getPhaseProgress();

  const tabs = [
    { id: 'execution', label: 'Painel de Execução', icon: Briefcase },
    { id: 'diary', label: 'Diário', icon: BookOpen },
    { id: 'networking', label: 'Networking', icon: Clock },
    { id: 'interview', label: 'Entrevistas', icon: Video },
    { id: 'checkin', label: 'Check-in', icon: CalendarCheck }
  ];

  return (
    <PageLayout>
      <PageContent>
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <PageBreadcrumb
            items={[
              { label: "Jornada", href: "/progresso" },
              { label: "Fase 5: Deslanchar", current: true }
            ]}
            className="mb-4"
          />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <Rocket className="h-8 w-8 text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">Fase 5: Deslanchar</h1>
                  <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                    Execução
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Coloque seu plano em movimento e gere oportunidades reais
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="bg-card rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso da Fase</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Tabs Navigation */}
          <AnimatedTabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <AnimatedTabsList className="grid w-full grid-cols-5 h-auto p-1">
              {tabs.map((tab) => (
                <AnimatedTabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2"
                >
                  <tab.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </AnimatedTabsTrigger>
              ))}
            </AnimatedTabsList>

            <AnimatedTabsContent value="execution">
              <ExecutionPanel />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="diary">
              <OpportunitiesDiary />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="networking">
              <NetworkingRoutine />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="interview">
              <InterviewSimulator />
            </AnimatedTabsContent>

            <AnimatedTabsContent value="checkin">
              <WeeklyCheckin />
            </AnimatedTabsContent>
          </AnimatedTabs>

          {/* Floating Coach Button */}
          <FloatingCoachButton
            phase="deslanchar"
            context={`Usuário está na aba: ${activeTab}. Fase de execução do plano e geração de oportunidades.`}
            greeting="Olá! 👋 Estou aqui na fase de Deslanchar! Esta é a hora da ação. Posso te ajudar com networking, preparação para entrevistas ou acompanhar sua execução. Como posso apoiar?"
          />
        </div>
      </PageContent>
    </PageLayout>
  );
}
