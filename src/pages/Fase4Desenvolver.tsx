import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useDevelop } from '@/hooks/useDevelop';
import { Sidebar } from '@/components/layout/Sidebar';
import { ResumeBuilder } from '@/components/develop/ResumeBuilder';
import { PitchGenerator } from '@/components/develop/PitchGenerator';
import { LinkedInChecklist } from '@/components/develop/LinkedInChecklist';
import { PortfolioTemplate } from '@/components/develop/PortfolioTemplate';
import { DevelopmentTrack } from '@/components/develop/DevelopmentTrack';
import { DevelopCoachFeedback } from '@/components/develop/DevelopCoachFeedback';
import { AvatarCoach } from '@/components/awakening/AvatarCoach';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  FileText, 
  Mic, 
  Linkedin, 
  Briefcase, 
  GraduationCap,
  Sparkles,
  ChevronRight
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  const phaseProgress = getPhaseProgress();

  const tabs = [
    { id: 'resume', label: 'Currículo', icon: FileText, completed: resumes.length > 0 },
    { id: 'pitch', label: 'Pitch', icon: Mic, completed: !!pitch?.full_pitch },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, completed: (linkedInChecklist?.overall_score || 0) >= 50 },
    { id: 'portfolio', label: 'Portfólio', icon: Briefcase, completed: portfolioProjects.length >= 2 },
    { id: 'track', label: 'Trilha', icon: GraduationCap, completed: developmentTrack.filter(i => i.status === 'completed').length >= 3 },
    { id: 'feedback', label: 'Feedback', icon: Sparkles, completed: coachFeedback.length > 0 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="pl-0 md:pl-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Phase header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Jornada Migrei</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-orange-600 font-medium">Fase 4</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                <Wrench className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Desenvolver</h1>
                <p className="text-muted-foreground">
                  Prepare-se para ser visto como profissional da nova área
                </p>
              </div>
            </div>

            {/* Progress */}
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progresso da Fase</span>
                  <span className="text-lg font-bold text-orange-600">{phaseProgress}%</span>
                </div>
                <Progress value={phaseProgress} className="h-2" />
                <div className="flex gap-2 mt-3">
                  {tabs.map((tab) => (
                    <Badge 
                      key={tab.id}
                      variant={tab.completed ? 'default' : 'outline'}
                      className={tab.completed ? 'bg-orange-500' : ''}
                    >
                      <tab.icon className="w-3 h-3 mr-1" />
                      {tab.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-6 mb-6">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="relative"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline ml-2">{tab.label}</span>
                      {tab.completed && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="resume">
                  <ResumeBuilder
                    resumes={resumes}
                    onCreateResume={createResume}
                    onUpdateResume={updateResume}
                    onDeleteResume={deleteResume}
                  />
                </TabsContent>

                <TabsContent value="pitch">
                  <PitchGenerator
                    pitch={pitch}
                    onSave={savePitch}
                    onRecordPractice={recordPitchPractice}
                  />
                </TabsContent>

                <TabsContent value="linkedin">
                  <LinkedInChecklist
                    checklist={linkedInChecklist}
                    onSave={saveLinkedInChecklist}
                  />
                </TabsContent>

                <TabsContent value="portfolio">
                  <PortfolioTemplate
                    projects={portfolioProjects}
                    onAddProject={addPortfolioProject}
                    onUpdateProject={updatePortfolioProject}
                    onDeleteProject={deletePortfolioProject}
                  />
                </TabsContent>

                <TabsContent value="track">
                  <DevelopmentTrack
                    items={developmentTrack}
                    onAddItem={addTrackItem}
                    onUpdateItem={updateTrackItem}
                    onDeleteItem={deleteTrackItem}
                  />
                </TabsContent>

                <TabsContent value="feedback">
                  <DevelopCoachFeedback
                    feedback={coachFeedback}
                    phaseProgress={phaseProgress}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Avatar Coach sidebar */}
            <div className="lg:col-span-1">
              <AvatarCoach
                phase="desenvolver"
                context="O usuário está na fase de desenvolvimento, preparando currículo, pitch, LinkedIn e portfólio para a transição de carreira."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
