import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { HeaderSection } from "@/components/dashboard/HeaderSection";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { MissionsCard } from "@/components/dashboard/MissionsCard";
import { SoftSkillsCard } from "@/components/dashboard/SoftSkillsCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pl-64 min-h-screen">
        <main className="p-8 space-y-6">
          {/* Header - Greeting + Phase Badge + Achievement */}
          <HeaderSection />

          {/* Stats Bar - 5 stat cards */}
          <StatsBar />

          {/* Main Content - Circle + Side Cards */}
          <div className="flex gap-6 items-start">
            {/* Left - Roda Migrei (Hero) */}
            <div className="flex-1 flex justify-center py-4">
              <div className="relative">
                {/* Soft ambient glow */}
                <div className="absolute -inset-24 bg-gradient-radial from-primary/4 via-transparent to-transparent blur-3xl pointer-events-none" />
                
                {/* The Circle */}
                <div className="relative">
                  <MigreiCircle />
                </div>
              </div>
            </div>

            {/* Right - Side Cards */}
            <div className="w-80 flex-shrink-0 space-y-4">
              <MissionsCard />
              <SoftSkillsCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
