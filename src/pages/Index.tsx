import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { HeroMotivational } from "@/components/dashboard/HeroMotivational";
import { QuickStatsBar } from "@/components/dashboard/QuickStatsBar";
import { NextActionCard } from "@/components/dashboard/NextActionCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-64">
        {/* Main Dashboard Content */}
        <main className="p-8 space-y-8">
          {/* Hero Motivacional - Compacto */}
          <HeroMotivational />

          {/* Layout Principal: Roda em Destaque Central */}
          <div className="grid grid-cols-12 gap-6">
            {/* Coluna Esquerda - Próxima Ação + Skills */}
            <div className="col-span-3 space-y-4">
              <NextActionCard />
              <SkillsCard />
            </div>

            {/* Centro - RODA MIGREI EM DESTAQUE */}
            <div className="col-span-6">
              <div className="card-elevated p-6 relative overflow-hidden">
                {/* Glow effect behind circle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary/10 via-transparent to-transparent blur-3xl" />
                </div>
                
                {/* Circle centered */}
                <div className="relative flex justify-center">
                  <MigreiCircle />
                </div>
              </div>

              {/* Quick Stats abaixo da roda */}
              <div className="mt-6">
                <QuickStatsBar />
              </div>
            </div>

            {/* Coluna Direita - Missões + Networking */}
            <div className="col-span-3 space-y-4">
              <MissionCard />
              <NetworkingCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
