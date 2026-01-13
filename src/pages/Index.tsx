import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { HeroMotivational } from "@/components/dashboard/HeroMotivational";
import { QuickStatsBar } from "@/components/dashboard/QuickStatsBar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-64">
        {/* Main Dashboard Content */}
        <main className="p-8 space-y-8">
          {/* Hero Motivacional */}
          <HeroMotivational />

          {/* Quick Stats Bar */}
          <QuickStatsBar />

          {/* Main Grid: Círculo + Cards */}
          <div className="grid grid-cols-12 gap-8">
            {/* Center - Migrei Circle */}
            <div className="col-span-7 flex items-start justify-center">
              <div className="card-elevated p-8 w-full flex justify-center">
                <MigreiCircle />
              </div>
            </div>

            {/* Right Sidebar - Reorganized Cards */}
            <div className="col-span-5 space-y-6">
              {/* Missões - Card Principal (maior) */}
              <MissionCard />

              {/* Skills e Networking lado a lado */}
              <div className="grid grid-cols-2 gap-4">
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
