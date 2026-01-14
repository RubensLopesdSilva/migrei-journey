import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { DiagnosticHub } from '@/components/discovery/DiagnosticHub';
import { CareerWheel } from '@/components/discovery/CareerWheel';
import { DiscoveryDiary } from '@/components/discovery/DiscoveryDiary';
import { ProfessionalTimeline } from '@/components/discovery/ProfessionalTimeline';
import { SkillsRadar } from '@/components/discovery/SkillsRadar';
import { ProfessionRecommendations } from '@/components/discovery/ProfessionRecommendations';
import { ClarityReport } from '@/components/discovery/ClarityReport';
import { AvatarCoach } from '@/components/awakening/AvatarCoach';
import { useDiscovery } from '@/hooks/useDiscovery';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Clock, 
  Radar, 
  Sparkles,
  FileText,
  Search,
  Check
} from 'lucide-react';

type Step = 'diagnosticos' | 'roda' | 'diario' | 'timeline' | 'radar' | 'profissoes' | 'relatorio';

const steps: { key: Step; label: string; icon: typeof Brain }[] = [
  { key: 'diagnosticos', label: 'Diagnósticos', icon: Brain },
  { key: 'roda', label: 'Roda', icon: Target },
  { key: 'diario', label: 'Diário', icon: BookOpen },
  { key: 'timeline', label: 'Timeline', icon: Clock },
  { key: 'radar', label: 'Radar', icon: Radar },
  { key: 'profissoes', label: 'Profissões', icon: Sparkles },
  { key: 'relatorio', label: 'Relatório', icon: FileText },
];

export default function Fase2Descobrir() {
  const [activeStep, setActiveStep] = useState<Step>('diagnosticos');
  const { phaseProgress, isLoading } = useDiscovery();

  const progress = { percentage: phaseProgress, completed: Math.floor(phaseProgress / 14.3) }; // 7 steps = ~14.3% each
  const isPhaseComplete = progress.percentage === 100;

  const getCoachContext = () => {
    switch (activeStep) {
      case 'diagnosticos': return 'Ajudando o usuário a completar diagnósticos de personalidade, motivadores e habilidades.';
      case 'roda': return 'Guiando o usuário na avaliação das dimensões da Roda da Carreira.';
      case 'diario': return 'Apoiando reflexões diárias de autodescoberta profissional.';
      case 'timeline': return 'Ajudando a mapear marcos importantes da trajetória profissional.';
      case 'radar': return 'Auxiliando na identificação de competências fortes e negligenciadas.';
      case 'profissoes': return 'Discutindo recomendações de profissões compatíveis com o perfil.';
      case 'relatorio': return 'Explicando o Relatório de Clareza Profissional gerado.';
      default: return 'Fase de Descobrir - autoconhecimento profundo.';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <PageLayout>
      <PageContent className="space-y-6">
        {/* Phase Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Fase 2: Descobrir</h1>
              <p className="text-muted-foreground">Autoconhecimento e diagnóstico profundo</p>
            </div>
          </div>
          <Badge variant={isPhaseComplete ? 'default' : 'secondary'} className="text-sm">
            {isPhaseComplete ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Fase Completa
              </>
            ) : (
              `${progress.percentage}% concluído`
            )}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Progress value={progress.percentage} className="h-2" />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeStep} onValueChange={(v) => setActiveStep(v as Step)}>
              <TabsList className="grid grid-cols-7 mb-6">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index < progress.completed;
                  return (
                    <TabsTrigger key={step.key} value={step.key} className="relative">
                      <Icon className="h-4 w-4 mr-2" />
                      {step.label}
                      {isCompleted && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="diagnosticos">
                <DiagnosticHub />
              </TabsContent>
              <TabsContent value="roda">
                <CareerWheel />
              </TabsContent>
              <TabsContent value="diario">
                <DiscoveryDiary />
              </TabsContent>
              <TabsContent value="timeline">
                <ProfessionalTimeline />
              </TabsContent>
              <TabsContent value="radar">
                <SkillsRadar />
              </TabsContent>
              <TabsContent value="profissoes">
                <ProfessionRecommendations />
              </TabsContent>
              <TabsContent value="relatorio">
                <ClarityReport />
              </TabsContent>
            </Tabs>
          </div>

          {/* Coach Sidebar */}
          <div className="lg:col-span-4 order-first lg:order-last">
            <AvatarCoach
              phase="descobrir" 
              context={`Usuário está na etapa: ${activeStep}. ${getCoachContext()}`}
            />
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
