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
import { Target, Users } from 'lucide-react';

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
          items={[{ label: "Networking", current: true }]}
          className="mb-4"
        />

        {/* Hero Header - Simplified */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Academia de Networking
              </h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" />
                Treine aqui, aplique no LinkedIn e eventos
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Weekly Mission */}
            <WeeklyMission />

            {/* Networking Pillars - Scripts */}
            <NetworkingPillars onSelectScript={handleSelectScript} />

            {/* Achievements Wall - Desktop only in main */}
            <div className="hidden lg:block">
              <AchievementsWall />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* My Pitch */}
            <MyPitch />

            {/* Weekly Challenges */}
            <WeeklyChallenges />

            {/* Achievements Wall - Mobile/Tablet */}
            <div className="lg:hidden">
              <AchievementsWall />
            </div>
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
