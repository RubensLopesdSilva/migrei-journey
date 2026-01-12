import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { WelcomePanel } from "@/components/dashboard/WelcomePanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pl-64 min-h-screen">
        <main className="p-8 min-h-screen flex flex-col">
          {/* Hero Section - Split Layout */}
          <div className="flex-1 flex items-center gap-12 mb-8">
            {/* Left Panel - Welcome & Actions */}
            <div className="w-[380px] flex-shrink-0">
              <WelcomePanel />
            </div>

            {/* Right - Roda Migrei Hero */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                {/* Ambient glow */}
                <div className="absolute -inset-20 bg-gradient-radial from-primary/6 via-transparent to-transparent blur-3xl pointer-events-none" />
                
                {/* Secondary glow */}
                <div className="absolute -inset-10 bg-gradient-radial from-accent/4 via-transparent to-transparent blur-2xl pointer-events-none" />
                
                {/* The Circle */}
                <div className="relative">
                  <MigreiCircle />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cards - Flowing Layout */}
          <div className="flex gap-4 items-stretch">
            <div className="flex-1">
              <MissionCard />
            </div>
            <div className="w-64">
              <SkillsCard />
            </div>
            <div className="w-64">
              <NetworkingCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
