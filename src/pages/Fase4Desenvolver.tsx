import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDevelop } from '@/hooks/useDevelop';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageSkeleton } from '@/components/layout/PageSkeleton';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { PhaseIntroBlock } from '@/components/phases/PhaseIntroBlock';
import { getPhaseIntroData } from '@/data/phaseIntroData';
import { ResumeBuilder } from '@/components/develop/ResumeBuilder';
import { PitchGenerator } from '@/components/develop/PitchGenerator';
import { LinkedInChecklist } from '@/components/develop/LinkedInChecklist';
import { PortfolioTemplate } from '@/components/develop/PortfolioTemplate';
import { DevelopmentTrack } from '@/components/develop/DevelopmentTrack';
import { DevelopCoachFeedback } from '@/components/develop/DevelopCoachFeedback';
import { FloatingCoachButton } from '@/components/coach/FloatingCoachButton';
import { PhaseAccessGate } from '@/components/subscription/PhaseAccessGate';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { 
  FileText, 
  Mic, 
  Linkedin, 
  Briefcase, 
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function Fase4Desenvolver() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('resume');
  
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

  // Dados do bloco introdutório com clareza UX
  const phaseIntroData = getPhaseIntroData(4, phaseProgress, isPhaseComplete);

  const tabs = [
    { id: 'resume', label: 'Currículo', icon: FileText, completed: resumes.length > 0 },
    { id: 'pitch', label: 'Pitch', icon: Mic, completed: !!pitch?.full_pitch },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, completed: (linkedInChecklist?.overall_score || 0) >= 50 },
    { id: 'portfolio', label: 'Portfólio', icon: Briefcase, completed: portfolioProjects.length >= 2 },
    { id: 'track', label: 'Trilha', icon: GraduationCap, completed: developmentTrack.filter(i => i.status === 'completed').length >= 3 },
    { id: 'feedback', label: 'Feedback', icon: Sparkles, completed: coachFeedback.length > 0 }
  ];

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

            {/* Main content - Full Width */}
            <AnimatedTabs value={activeTab} onValueChange={setActiveTab}>
              <AnimatedTabsList className="grid w-full grid-cols-6 mb-6">
                {tabs.map((tab) => (
                  <AnimatedTabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="relative"
                  >
                    <tab.icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline ml-2">{tab.label}</span>
                    {tab.completed && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" aria-label="Completo" />
                    )}
                  </AnimatedTabsTrigger>
                ))}
              </AnimatedTabsList>

              <AnimatedTabsContent value="resume">
                <ResumeBuilder
                  resumes={resumes}
                  onCreateResume={createResume}
                  onUpdateResume={updateResume}
                  onDeleteResume={deleteResume}
                />
              </AnimatedTabsContent>

              <AnimatedTabsContent value="pitch">
                <PitchGenerator
                  pitch={pitch}
                  onSave={savePitch}
                  onRecordPractice={recordPitchPractice}
                />
              </AnimatedTabsContent>

              <AnimatedTabsContent value="linkedin">
                <LinkedInChecklist
                  checklist={linkedInChecklist}
                  onSave={saveLinkedInChecklist}
                />
              </AnimatedTabsContent>

              <AnimatedTabsContent value="portfolio">
                <PortfolioTemplate
                  projects={portfolioProjects}
                  onAddProject={addPortfolioProject}
                  onUpdateProject={updatePortfolioProject}
                  onDeleteProject={deletePortfolioProject}
                />
              </AnimatedTabsContent>

              <AnimatedTabsContent value="track">
                <DevelopmentTrack
                  items={developmentTrack}
                  onAddItem={addTrackItem}
                  onUpdateItem={updateTrackItem}
                  onDeleteItem={deleteTrackItem}
                />
              </AnimatedTabsContent>

              <AnimatedTabsContent value="feedback">
                <DevelopCoachFeedback
                  feedback={coachFeedback}
                  phaseProgress={phaseProgress}
                />
              </AnimatedTabsContent>
            </AnimatedTabs>

            {/* Floating Coach Button */}
            <FloatingCoachButton
              phase="desenvolver"
              context={`Usuário está na aba: ${activeTab}. Preparando currículo, pitch, LinkedIn e portfólio para a transição de carreira.`}
              greeting="Olá! 👋 Estou aqui na fase de Desenvolver! Vamos preparar você para o mercado. Posso te ajudar com currículo, pitch, LinkedIn ou portfólio. O que você precisa?"
            />
          </div>
        </PageContent>
      </PageLayout>
    </PhaseAccessGate>
  );
}
