import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { DiagnosticHub } from '@/components/discovery/DiagnosticHub';
import { CareerWheel } from '@/components/discovery/CareerWheel';
import { DiscoveryDiary } from '@/components/discovery/DiscoveryDiary';
import { ProfessionalTimeline } from '@/components/discovery/ProfessionalTimeline';
import { SkillsRadar } from '@/components/discovery/SkillsRadar';
import { ProfessionRecommendations } from '@/components/discovery/ProfessionRecommendations';
import { ClarityReport } from '@/components/discovery/ClarityReport';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { SEOHead, SEOBreadcrumbs } from '@/components/seo';
import { useDiscovery } from '@/hooks/useDiscovery';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Clock, 
  Radar, 
  Sparkles,
  FileText
} from 'lucide-react';

type Step = 'diagnosticos' | 'roda' | 'diario' | 'timeline' | 'radar' | 'profissoes' | 'relatorio';

const steps: PhaseStep[] = [
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
  const { 
    phaseProgress, 
    isLoading,
    diagnosticResults,
    careerWheel,
    diaryEntries,
    timeline,
    competencies,
    recommendations,
    clarityReport
  } = useDiscovery();

  // Calcular steps completados baseado nos dados reais
  // Cada step é liberado após completar pelo menos 1 ação no step anterior
  const calculateCompletedSteps = () => {
    let completed = 0;
    
    // Step 1: Diagnósticos (pelo menos 1 diagnóstico completo)
    const completedDiagnostics = diagnosticResults.filter(d => d.completed_at).length;
    if (completedDiagnostics >= 1) completed++;
    else return completed;
    
    // Step 2: Roda da Carreira (pelo menos 1 dimensão avaliada)
    if (careerWheel.length >= 1) completed++;
    else return completed;
    
    // Step 3: Diário (pelo menos 1 dia completo)
    const completedDays = diaryEntries.filter(d => d.completed_at).length;
    if (completedDays >= 1) completed++;
    else return completed;
    
    // Step 4: Timeline (pelo menos 1 marco)
    if (timeline.length >= 1) completed++;
    else return completed;
    
    // Step 5: Radar de Competências (pelo menos 1 competência)
    if (competencies.length >= 1) completed++;
    else return completed;
    
    // Step 6: Profissões (recomendações geradas)
    if (recommendations.length > 0) completed++;
    else return completed;
    
    // Step 7: Relatório (relatório gerado)
    if (clarityReport) completed++;
    
    return completed;
  };

  const completedSteps = calculateCompletedSteps();
  const isPhaseComplete = phaseProgress === 100;

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

  const renderStepContent = () => {
    switch (activeStep) {
      case 'diagnosticos': return <DiagnosticHub />;
      case 'roda': return <CareerWheel />;
      case 'diario': return <DiscoveryDiary />;
      case 'timeline': return <ProfessionalTimeline />;
      case 'radar': return <SkillsRadar />;
      case 'profissoes': return <ProfessionRecommendations />;
      case 'relatorio': return <ClarityReport />;
      default: return null;
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
    <>
      <SEOHead
        title="Fase 2: Descobrir - Autoconhecimento Profissional | Migrei"
        description="Descubra seus talentos, valores e competências através de diagnósticos, roda de carreira e relatório de clareza profissional."
        canonical="https://migrei.com/fase/descobrir"
        noIndex={true}
      />
      <SEOBreadcrumbs
        items={[
          { name: "Início", url: "/" },
          { name: "Jornada", url: "/progresso" },
          { name: "Fase 2: Descobrir", url: "/fase/descobrir" }
        ]}
      />
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

          {/* Phase Steps Navigation */}
          <PhaseSteps
            steps={steps}
            activeStep={activeStep}
            onStepChange={(step) => setActiveStep(step as Step)}
            completedSteps={completedSteps}
            phaseColor={PHASE_COLORS[2]}
            lockSequential={true}
          />

          {/* Step Content */}
          <div className="mt-6">
            {renderStepContent()}
          </div>

          {/* Floating Coach Button */}
          <FloatingCoachButton
            phase="descobrir" 
            context={`Usuário está na etapa: ${activeStep}. ${getCoachContext()}`}
            greeting="Olá! 👋 Estou aqui na fase de Descobrir! Esta é a fase do autoconhecimento profundo. Vamos juntos explorar seus talentos, motivadores e construir seu perfil profissional?"
          />
        </PageContent>
      </PageLayout>
    </>
  );
}
