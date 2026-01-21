import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageContent } from '@/components/ui/page-transition';
import { PageBreadcrumb } from '@/components/ui/page-breadcrumb';
import { SEOHead, SEOBreadcrumbs } from '@/components/seo';
import { WeeklyMission } from '@/components/positioning/WeeklyMission';
import { NetworkingPillars } from '@/components/positioning/NetworkingPillars';
import { MyPitch } from '@/components/positioning/MyPitch';
import { AchievementsWall } from '@/components/positioning/AchievementsWall';
import { WeeklyChallenges } from '@/components/positioning/WeeklyChallenges';
import { ScriptViewer } from '@/components/positioning/ScriptViewer';
import { Users } from 'lucide-react';

type PillarType = 'digital' | 'presencial' | 'onetoone';

const PositioningAcademy = () => {
  const [scriptModal, setScriptModal] = useState<{
    open: boolean;
    pillarId: PillarType;
    scriptIndex: number;
  }>({ open: false, pillarId: 'digital', scriptIndex: 0 });

  // Track completed challenges count - starts with 1 because one is already complete in mock data
  const [completedChallenges, setCompletedChallenges] = useState(1);

  const handleSelectScript = (pillarId: PillarType, scriptIndex: number) => {
    setScriptModal({ open: true, pillarId, scriptIndex });
  };

  return (
    <>
      <SEOHead
        title="Networking para Transição de Carreira | Migrei"
        description="Construa conexões estratégicas com scripts prontos, desafios semanais e pilares de networking para impulsionar sua transição."
        canonical="https://migrei.com/networking"
        noIndex={true}
      />
      <PageLayout>
        <PageContent>
          <PageBreadcrumb
            items={[{ label: "Networking", current: true }]}
            className="mb-4"
          />

        {/* Hero Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Networking
              </h1>
              <p className="text-sm text-muted-foreground">
                Construa conexões que abrem portas
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Weekly Mission */}
            <WeeklyMission completedCount={completedChallenges} />

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
            <WeeklyChallenges onProgressChange={setCompletedChallenges} />

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
    </>
  );
};

export default PositioningAcademy;
