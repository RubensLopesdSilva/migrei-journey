import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { HeroMotivational } from "@/components/dashboard/HeroMotivational";
import { QuickStatsBar } from "@/components/dashboard/QuickStatsBar";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { loading, userProgress, getProgressSummary } = useProgress();
  
  const summary = loading ? null : getProgressSummary();
  
  // Calculate days in journey
  const daysInJourney = userProgress?.journey_started_at 
    ? Math.floor((Date.now() - new Date(userProgress.journey_started_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-0 md:pl-64 transition-all duration-300">
        {/* Main Dashboard Content */}
        <main className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Hero Motivacional */}
          <HeroMotivational />

          {/* Quick Stats Bar */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : (
            <QuickStatsBar 
              points={summary?.totalXp || 0}
              days={daysInJourney}
              ranking={1}
              energy={75}
              weeklyProgress={summary?.overallProgress || 0}
              streakDays={summary?.streak || 0}
            />
          )}

          {/* Main Grid: Círculo + Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Center - Migrei Circle */}
            <div className="lg:col-span-7 flex items-start justify-center">
              <div className="card-elevated p-4 md:p-8 w-full flex justify-center">
                <MigreiCircle />
              </div>
            </div>

            {/* Right Sidebar - Reorganized Cards */}
            <div className="lg:col-span-5 space-y-6">
              {/* Missões - Card Principal (maior) */}
              <MissionCard />

              {/* Skills e Networking lado a lado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SkillsCard />
                <NetworkingCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
