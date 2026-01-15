import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { HeroMotivational } from "@/components/dashboard/HeroMotivational";
import { DashboardTour } from "@/components/dashboard/DashboardTour";
import { PhaseWelcomeModal } from "@/components/dashboard/PhaseWelcomeModal";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { PageContent } from "@/components/ui/page-transition";
import { useProgress } from "@/hooks/useProgress";

const Index = () => {
  const { loading } = useProgress();

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageContent>
        {/* Top Bar: Hero (greeting + stats) */}
        <HeroMotivational />

        {/* Main Content Grid - Circle takes most space, cards on right */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Left: Migrei Circle - Hero element, fills most space */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <motion.div 
              className="relative w-full flex justify-center items-center"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
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

          {/* Right: Action Cards - stacked to fill height */}
          <div className="lg:col-span-4 flex flex-col gap-4 order-1 lg:order-2">
            {loading ? (
              <>
                <Skeleton className="flex-1 min-h-[200px] rounded-2xl" />
                <Skeleton className="flex-1 min-h-[200px] rounded-2xl" />
              </>
            ) : (
              <>
                {/* Missions Card - Phase contextual */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                >
                  <MissionCard />
                </motion.div>

                {/* Networking Card - Same height as Missions */}
                <motion.div
                  className="flex-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <NetworkingCard />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </PageContent>

      {/* Onboarding Tour */}
      <DashboardTour />
      
      {/* Phase Welcome Modal */}
      <PhaseWelcomeModal />
    </div>
  );
};

export default Index;
