import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { NextActionCard } from "@/components/dashboard/NextActionCard";
import { DynamicGreeting } from "@/components/dashboard/DynamicGreeting";
import { InactivityBanner } from "@/components/dashboard/InactivityBanner";
import { MobilePhaseCarousel } from "@/components/dashboard/MobilePhaseCarousel";
import { DashboardTour } from "@/components/dashboard/DashboardTour";
import { PhaseWelcomeModal } from "@/components/dashboard/PhaseWelcomeModal";
import { ReengagementCard } from "@/components/dashboard/ReengagementCard";
import { QuickStatsBar } from "@/components/dashboard/QuickStatsBar";
import { UpgradeNudge, useUpgradeNudgeTrigger } from "@/components/subscription/UpgradeNudge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PageContent } from "@/components/ui/page-transition";
import { useProgress } from "@/hooks/useProgress";
import { useAgent } from "@/hooks/useAgent";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Index = () => {
  const navigate = useNavigate();
  const { loading: progressLoading, userProgress, getProgressSummary, currentPhase } = useProgress();
  const { loading: agentLoading } = useAgent();
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const { shouldShowNudge } = useUpgradeNudgeTrigger();
  const isMobile = useIsMobile();

  const loading = progressLoading || agentLoading;
  const nudgeData = shouldShowNudge();
  const summary = loading ? null : getProgressSummary();

  const daysInJourney = userProgress?.journey_started_at 
    ? Math.floor((Date.now() - new Date(userProgress.journey_started_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleTourComplete = () => {
    // Show phase modal after tour completes
    setTimeout(() => setShowPhaseModal(true), 300);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <PageContent>
        {/* Top Bar: Greeting + Stats */}
        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DynamicGreeting />
          
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <QuickStatsBar 
              points={summary?.totalXp || 0}
              days={daysInJourney}
              weeklyProgress={summary?.overallProgress || 0}
              currentPhase={currentPhase ? { 
                name: currentPhase.name, 
                number: currentPhase.phase_number 
              } : undefined}
            />
          </motion.div>
        </motion.div>

        {/* Inactivity Banner - shows when user has been inactive */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <InactivityBanner />
        </motion.div>

        {/* Hero: Next Action Card - Most important CTA */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <NextActionCard />
        </motion.div>

        {/* Mobile: Phase Carousel (replaces Circle) */}
        {isMobile && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <MobilePhaseCarousel />
          </motion.div>
        )}

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Left: Migrei Circle - Hidden on mobile (replaced by carousel) */}
          {!isMobile && (
            <div className="lg:col-span-8">
              <motion.div 
                className="relative w-full flex justify-center items-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {/* Clean container with subtle elevation */}
                <div className="relative p-4 sm:p-6 lg:p-8 w-full">
                  {/* Subtle background */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-card to-card/60 rounded-3xl border border-border/40"
                    style={{
                      boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05)'
                    }}
                  />
                  
                  {/* The Circle - main element */}
                  <div className="relative z-10 flex justify-center">
                    <MigreiCircle />
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Right: Action Cards */}
          <div className={`${isMobile ? 'space-y-4' : 'lg:col-span-4 flex flex-col gap-4'}`}>
            {loading ? (
              <>
                <Skeleton className="flex-1 min-h-[200px] rounded-2xl" />
                <Skeleton className="flex-1 min-h-[200px] rounded-2xl" />
              </>
            ) : (
              <>
                {/* Reengagement Card - for inactive users */}
                <ReengagementCard />

                {/* Upgrade Nudge - appears after achievements for free users */}
                {nudgeData && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <UpgradeNudge 
                      trigger={nudgeData.trigger} 
                      context={nudgeData.context} 
                    />
                  </motion.div>
                )}

                {/* Missions Card */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <MissionCard />
                </motion.div>

                {/* Networking Card */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <NetworkingCard />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </PageContent>

      {/* Onboarding Tour - only on first visit */}
      <DashboardTour onTourComplete={handleTourComplete} />
      
      {/* Phase Welcome Modal - shown after tour completes */}
      <PhaseWelcomeModal forceOpen={showPhaseModal} />

      {/* Floating Support Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => navigate("/configuracoes?tab=support")}
            size="icon"
            variant="outline"
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-border/50 hover:bg-primary hover:text-primary-foreground transition-all z-40"
          >
            <Headphones className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Precisa de ajuda?</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Index;
