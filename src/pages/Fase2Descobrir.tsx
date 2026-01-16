import { useState } from 'react';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { getPhaseIntroData } from '@/data/phaseIntroData';
import { DiagnosticHub } from '@/components/discovery/DiagnosticHub';
import { CareerWheel } from '@/components/discovery/CareerWheel';
import { DiscoveryDiary } from '@/components/discovery/DiscoveryDiary';
import { ProfessionalTimeline } from '@/components/discovery/ProfessionalTimeline';
import { SkillsRadar } from '@/components/discovery/SkillsRadar';
import { ProfessionRecommendations } from '@/components/discovery/ProfessionRecommendations';
import { ClarityReport } from '@/components/discovery/ClarityReport';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { useDiscovery } from '@/hooks/useDiscovery';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Clock, 
  Radar, 
  Sparkles,
  FileText,
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

  const progress = { percentage: phaseProgress, completed: Math.floor(phaseProgress / 14.3) };
  const isPhaseComplete = progress.percentage === 100;

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(2, phaseProgress, isPhaseComplete);

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
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageContent className="space-y-6">
        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: "Jornada", href: "/progresso" },
            { label: "Fase 2: Descobrir", current: true }
          ]}
        />

        {/* Blocos de Clareza UX - O que vai aprender, Para que serve, O que terá pronto */}
        <PhaseIntroBlock data={phaseIntroData} />

        {/* Main Content - Full Width */}
        <AnimatedTabs value={activeStep} onValueChange={(v) => setActiveStep(v as Step)}>
          <AnimatedTabsList className="grid grid-cols-7 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < progress.completed;
              return (
                <AnimatedTabsTrigger key={step.key} value={step.key} className="relative">
                  <Icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  {step.label}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" aria-hidden="true" />
                    </div>
                  )}
                </AnimatedTabsTrigger>
              );
            })}
          </AnimatedTabsList>

          <AnimatedTabsContent value="diagnosticos">
            <DiagnosticHub />
          </AnimatedTabsContent>
          <AnimatedTabsContent value="roda">
            <CareerWheel />
          </AnimatedTabsContent>
          <AnimatedTabsContent value="diario">
            <DiscoveryDiary />
          </AnimatedTabsContent>
          <AnimatedTabsContent value="timeline">
            <ProfessionalTimeline />
          </AnimatedTabsContent>
          <AnimatedTabsContent value="radar">
            <SkillsRadar />
          </AnimatedTabsContent>
          <AnimatedTabsContent value="profissoes">
            <ProfessionRecommendations />
          </AnimatedTabsContent>
          <AnimatedTabsContent value="relatorio">
            <ClarityReport />
          </AnimatedTabsContent>
        </AnimatedTabs>

        {/* Floating Coach Button */}
        <FloatingCoachButton
          phase="descobrir" 
          context={`Usuário está na etapa: ${activeStep}. ${getCoachContext()}`}
          greeting="Olá! 👋 Estou aqui na fase de Descobrir! Esta é a fase do autoconhecimento profundo. Vamos juntos explorar seus talentos, motivadores e construir seu perfil profissional?"
        />
      </PageContent>
    </PageLayout>
  );
}
