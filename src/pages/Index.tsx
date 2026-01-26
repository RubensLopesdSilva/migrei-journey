import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { DailyTipCard } from "@/components/dashboard/DailyTipCard";
import { HeroMotivational } from "@/components/dashboard/HeroMotivational";
import { DashboardTour } from "@/components/dashboard/DashboardTour";
import { PhaseWelcomeModal } from "@/components/dashboard/PhaseWelcomeModal";
import { ReengagementCard } from "@/components/dashboard/ReengagementCard";
import { UpgradeNudge, useUpgradeNudgeTrigger } from "@/components/subscription/UpgradeNudge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PageContent } from "@/components/ui/page-transition";
import { useProgress } from "@/hooks/useProgress";
import { useAgent } from "@/hooks/useAgent";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const Index = () => {
  const navigate = useNavigate();
  const { loading: progressLoading } = useProgress();
  const { loading: agentLoading } = useAgent();
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const { shouldShowNudge } = useUpgradeNudgeTrigger();

  const loading = progressLoading || agentLoading;
  const nudgeData = shouldShowNudge();

  const handleTourComplete = () => {
    setTimeout(() => setShowPhaseModal(true), 300);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageContent>
        {/* Top Bar: Hero (greeting + stats) */}
        <HeroMotivational />

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Left: Migrei Circle */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <motion.div 
              className="relative w-full flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="relative p-4 sm:p-6 lg:p-8 w-full">
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-card to-card/60 rounded-3xl border border-border/40"
                  style={{
                    boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.05)'
                  }}
                />
                <div className="relative z-10 flex justify-center">
                  <MigreiCircle />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Action Cards - stacked */}
          <div className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2">
            {loading ? (
              <>
                <Skeleton className="h-14 rounded-2xl" />
                <Skeleton className="flex-1 min-h-[180px] rounded-2xl" />
                <Skeleton className="flex-1 min-h-[180px] rounded-2xl" />
              </>
            ) : (
              <>
                {/* Daily Tip Card - new AI widget */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <DailyTipCard />
                </motion.div>

                {/* Reengagement Card - for inactive users */}
                <ReengagementCard />

                {/* Upgrade Nudge */}
                {nudgeData && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                >
                  <MissionCard />
                </motion.div>

                {/* Networking Card */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <NetworkingCard />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </PageContent>

      {/* Onboarding Tour */}
      <DashboardTour onTourComplete={handleTourComplete} />
      
      {/* Phase Welcome Modal */}
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
