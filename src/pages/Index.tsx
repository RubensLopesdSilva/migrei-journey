import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { HeaderSection } from "@/components/dashboard/HeaderSection";
import { MissionsCard } from "@/components/dashboard/MissionsCard";
import { SoftSkillsCard } from "@/components/dashboard/SoftSkillsCard";
import { LeftStatsCards } from "@/components/dashboard/LeftStatsCards";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pl-64 min-h-screen">
        <main className="p-6 space-y-5">
          {/* Header - Greeting + Stats inline */}
          <HeaderSection />

          {/* Main Content - 3 Column Layout */}
          <div className="flex gap-5 items-start">
            {/* Left - Vertical Stats Cards */}
            <LeftStatsCards />

            {/* Center - Roda Migrei (Main Focus) */}
            <div className="flex-1 flex justify-center">
              <MigreiCircle />
            </div>

            {/* Right - Side Cards */}
            <div className="w-60 flex-shrink-0 space-y-3">
              <MissionsCard />
              <SoftSkillsCard />
              <NetworkingCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
