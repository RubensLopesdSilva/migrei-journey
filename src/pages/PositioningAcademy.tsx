import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { WeeklyMission } from '@/components/positioning/WeeklyMission';
import { NetworkingPillars } from '@/components/positioning/NetworkingPillars';
import { MyPitch } from '@/components/positioning/MyPitch';
import { AchievementsWall } from '@/components/positioning/AchievementsWall';
import { WeeklyChallenges } from '@/components/positioning/WeeklyChallenges';
import { ScriptViewer } from '@/components/positioning/ScriptViewer';
import { GraduationCap, Target, Sparkles } from 'lucide-react';

type PillarType = 'digital' | 'presencial' | 'onetoone';

const PositioningAcademy = () => {
  const [scriptModal, setScriptModal] = useState<{
    open: boolean;
    pillarId: PillarType;
    scriptIndex: number;
  }>({ open: false, pillarId: 'digital', scriptIndex: 0 });

  const handleSelectScript = (pillarId: PillarType, scriptIndex: number) => {
    setScriptModal({ open: true, pillarId, scriptIndex });
  };

  return (
    <PageLayout>
      <PageContent>
        <PageBreadcrumb
          items={[{ label: "Academia de Posicionamento", current: true }]}
          className="mb-4"
        />

        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Academia de Posicionamento
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4" />
                Treine aqui, aplique no LinkedIn e eventos
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Aprenda a fazer networking de forma autêntica. Use nossos scripts e templates, 
            pratique seu pitch, complete desafios e celebre suas conquistas com a comunidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Weekly Mission */}
            <WeeklyMission />

            {/* Networking Pillars - Scripts */}
            <NetworkingPillars onSelectScript={handleSelectScript} />

            {/* Achievements Wall */}
            <AchievementsWall />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6 order-first lg:order-last">
            {/* My Pitch */}
            <MyPitch />

            {/* Weekly Challenges */}
            <WeeklyChallenges />
          </div>
        </div>

        {/* Script Viewer Modal */}
        <ScriptViewer
          open={scriptModal.open}
          onOpenChange={(open) => setScriptModal(prev => ({ ...prev, open }))}
          pillarId={scriptModal.pillarId}
          scriptIndex={scriptModal.scriptIndex}
        />
      </PageContent>
    </PageLayout>
  );
};

export default PositioningAcademy;
