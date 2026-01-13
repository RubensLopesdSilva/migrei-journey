import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
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
  FileText
} from 'lucide-react';

const steps = [
  { key: 'diagnosticos', label: 'Diagnósticos', icon: Brain },
  { key: 'roda', label: 'Roda da Carreira', icon: Target },
  { key: 'diario', label: 'Diário', icon: BookOpen },
  { key: 'timeline', label: 'Linha do Tempo', icon: Clock },
  { key: 'radar', label: 'Competências', icon: Radar },
  { key: 'profissoes', label: 'Profissões', icon: Sparkles },
  { key: 'relatorio', label: 'Relatório', icon: FileText },
];

export default function Fase2Descobrir() {
  const [activeStep, setActiveStep] = useState('diagnosticos');
  const { phaseProgress, isLoading } = useDiscovery();

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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Phase Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-2">Fase 2</Badge>
                <h1 className="text-3xl font-bold">Descobrir</h1>
                <p className="text-muted-foreground">Autoconhecimento e diagnóstico profundo</p>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={phaseProgress} className="w-32" />
                <span className="text-sm font-medium">{phaseProgress}%</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeStep} onValueChange={setActiveStep}>
              <TabsList className="grid grid-cols-7 h-auto">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <TabsTrigger
                      key={step.key}
                      value={step.key}
                      className="flex flex-col gap-1 py-2 px-1 text-xs"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline">{step.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <TabsContent value="diagnosticos" className="mt-6">
                <DiagnosticHub />
              </TabsContent>
              <TabsContent value="roda" className="mt-6">
                <CareerWheel />
              </TabsContent>
              <TabsContent value="diario" className="mt-6">
                <DiscoveryDiary />
              </TabsContent>
              <TabsContent value="timeline" className="mt-6">
                <ProfessionalTimeline />
              </TabsContent>
              <TabsContent value="radar" className="mt-6">
                <SkillsRadar />
              </TabsContent>
              <TabsContent value="profissoes" className="mt-6">
                <ProfessionRecommendations />
              </TabsContent>
              <TabsContent value="relatorio" className="mt-6">
                <ClarityReport />
              </TabsContent>
            </Tabs>
          </div>

          {/* Avatar Coach */}
          <AvatarCoach phase="descobrir" context={getCoachContext()} />
        </main>
      </div>
    </div>
  );
}
