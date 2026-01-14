import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Rocket, Briefcase, BookOpen, Clock, Video, CalendarCheck } from 'lucide-react';
import { ExecutionPanel } from '@/components/launch/ExecutionPanel';
import { OpportunitiesDiary } from '@/components/launch/OpportunitiesDiary';
import { NetworkingRoutine } from '@/components/launch/NetworkingRoutine';
import { InterviewSimulator } from '@/components/launch/InterviewSimulator';
import { WeeklyCheckin } from '@/components/launch/WeeklyCheckin';
import { useLaunch } from '@/hooks/useLaunch';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function Fase5Deslanchar() {
  const { user, loading: authLoading } = useAuth();
  const { loading, getPhaseProgress } = useLaunch();
  const [activeTab, setActiveTab] = useState('execution');

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 h-auto p-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-3 px-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="execution">
              <ExecutionPanel />
            </TabsContent>

            <TabsContent value="diary">
              <OpportunitiesDiary />
            </TabsContent>

            <TabsContent value="networking">
              <NetworkingRoutine />
            </TabsContent>

            <TabsContent value="interview">
              <InterviewSimulator />
            </TabsContent>

            <TabsContent value="checkin">
              <WeeklyCheckin />
            </TabsContent>
          </Tabs>
        </div>
      </PageContent>
    </PageLayout>
  );
}
