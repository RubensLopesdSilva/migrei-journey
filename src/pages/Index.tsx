import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { HeroMotivational } from "@/components/dashboard/HeroMotivational";
import { QuickStatsBar } from "@/components/dashboard/QuickStatsBar";
import { DashboardTour } from "@/components/dashboard/DashboardTour";
import { useProgress } from "@/hooks/useProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PageContent } from "@/components/ui/page-transition";

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
        <main 
          id="main-content" 
          className="p-4 md:p-8 space-y-4 sm:space-y-6 md:space-y-8"
          role="main"
          aria-label="Dashboard principal"
        >
          <PageContent>
            {/* Hero Motivacional */}
            <HeroMotivational />

            {/* Quick Stats Bar */}
            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 mt-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-20 sm:h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <QuickStatsBar 
                  points={summary?.totalXp || 0}
                  days={daysInJourney}
                  ranking={1}
                  energy={75}
                  weeklyProgress={summary?.overallProgress || 0}
                  streakDays={summary?.streak || 0}
                />
              </div>
            )}

            {/* Main Grid: Círculo + Cards */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-10 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Center - Migrei Circle como palco principal */}
              <div className="lg:col-span-7 flex items-center justify-center order-2 lg:order-1 min-h-[450px] lg:min-h-[520px]">
                <motion.div 
                  className="relative w-full flex justify-center items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  {/* Container limpo - silêncio visual */}
                  <div className="relative p-6 md:p-10">
                    {/* Background sutil para elevação */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-card/80 to-card/40 rounded-3xl border border-border/30"
                      style={{
                        boxShadow: '0 20px 50px -20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
                      }}
                    />
                    
                    {/* A Roda - elemento principal */}
                    <div className="relative z-10">
                      <MigreiCircle />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Sidebar - Cards secundários */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-5 order-1 lg:order-2">
                {/* Missões - Card Principal */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <MissionCard />
                </motion.div>

                {/* Skills e Networking lado a lado */}
                <motion.div 
                  className="grid grid-cols-2 gap-3 sm:gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <SkillsCard />
                  <NetworkingCard />
                </motion.div>
              </div>
            </motion.div>
          </PageContent>
        </main>

        {/* Onboarding Tour */}
        <DashboardTour />
      </div>
    </div>
  );
};

export default Index;
