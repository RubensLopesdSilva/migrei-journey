import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDevelop } from '@/hooks/useDevelop';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { PhaseSteps, type PhaseStep } from '@/components/phases/PhaseSteps';
import { getPhaseIntroData, PHASE_COLORS } from '@/data/phaseIntroData';
import { ResumeBuilder } from '@/components/develop/ResumeBuilder';
import { PitchGenerator } from '@/components/develop/PitchGenerator';
import { LinkedInChecklist } from '@/components/develop/LinkedInChecklist';
import { PortfolioTemplate } from '@/components/develop/PortfolioTemplate';
import { DevelopmentTrack } from '@/components/develop/DevelopmentTrack';
import { DevelopCoachFeedback } from '@/components/develop/DevelopCoachFeedback';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseAccessGate } from '@/components/subscription/PhaseAccessGate';
import { 
  FileText, 
  Mic, 
  Linkedin, 
  Briefcase, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

type Step = 'resume' | 'pitch' | 'linkedin' | 'portfolio' | 'track' | 'feedback';

const steps: PhaseStep[] = [
  { key: 'resume', label: 'Currículo', icon: FileText },
  { key: 'pitch', label: 'Pitch', icon: Mic },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'portfolio', label: 'Portfólio', icon: Briefcase },
  { key: 'track', label: 'Trilha', icon: GraduationCap },
  { key: 'feedback', label: 'Feedback', icon: Sparkles }
];

export default function Fase4Desenvolver() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState<Step>('resume');
  
  const {
    resumes,
    pitch,
    linkedInChecklist,
    portfolioProjects,
    developmentTrack,
    coachFeedback,
    isLoading,
    createResume,
    updateResume,
    deleteResume,
    savePitch,
    recordPitchPractice,
    saveLinkedInChecklist,
    addPortfolioProject,
    updatePortfolioProject,
    deletePortfolioProject,
    addTrackItem,
    updateTrackItem,
    deleteTrackItem,
    getPhaseProgress
  } = useDevelop();

  if (isLoading) {
    return (
      <PageLayout>
        <PageSkeleton variant="dashboard" showHeader={true} />
      </PageLayout>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const phaseProgress = getPhaseProgress();
  const isPhaseComplete = phaseProgress === 100;

  // Calcular steps completos
  const completedSteps = [
    resumes.length > 0,
    !!pitch?.full_pitch,
    (linkedInChecklist?.overall_score || 0) >= 50,
    portfolioProjects.length >= 2,
    developmentTrack.filter(i => i.status === 'completed').length >= 3,
    coachFeedback.length > 0
  ].filter(Boolean).length;

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(4, phaseProgress, isPhaseComplete);

  const renderStepContent = () => {
    switch (activeStep) {
      case 'resume':
        return (
          <ResumeBuilder
            resumes={resumes}
            onCreateResume={createResume}
            onUpdateResume={updateResume}
            onDeleteResume={deleteResume}
          />
        );
      case 'pitch':
        return (
          <PitchGenerator
            pitch={pitch}
            onSave={savePitch}
            onRecordPractice={recordPitchPractice}
          />
        );
      case 'linkedin':
        return (
          <LinkedInChecklist
            checklist={linkedInChecklist}
            onSave={saveLinkedInChecklist}
          />
        );
      case 'portfolio':
        return (
          <PortfolioTemplate
            projects={portfolioProjects}
            onAddProject={addPortfolioProject}
            onUpdateProject={updatePortfolioProject}
            onDeleteProject={deletePortfolioProject}
          />
        );
      case 'track':
        return (
          <DevelopmentTrack
            items={developmentTrack}
            onAddItem={addTrackItem}
            onUpdateItem={updateTrackItem}
            onDeleteItem={deleteTrackItem}
          />
        );
      case 'feedback':
        return (
          <DevelopCoachFeedback
            feedback={coachFeedback}
            phaseProgress={phaseProgress}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PhaseAccessGate phaseNumber={4} phaseName="Fase 4: Desenvolver">
      <PageLayout>
        <PageContent>
          <div className="container mx-auto max-w-6xl space-y-6">
            {/* Breadcrumb */}
            <PageBreadcrumb
              items={[
                { label: "Jornada", href: "/progresso" },
                { label: "Fase 4: Desenvolver", current: true }
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
              phaseColor={PHASE_COLORS[4]}
            />

            {/* Step Content */}
            <div className="mt-6">
              {renderStepContent()}
            </div>

            {/* Floating Coach Button */}
            <FloatingCoachButton
              phase="desenvolver"
              context={`Usuário está na aba: ${activeStep}. Preparando currículo, pitch, LinkedIn e portfólio para a transição de carreira.`}
              greeting="Olá! 👋 Estou aqui na fase de Desenvolver! Vamos preparar você para o mercado. Posso te ajudar com currículo, pitch, LinkedIn ou portfólio. O que você precisa?"
            />
          </div>
        </PageContent>
      </PageLayout>
    </PhaseAccessGate>
  );
}
