import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";
import { NextActionCard } from "@/components/dashboard/NextActionCard";
import { DashboardHero } from "@/components/dashboard/DashboardHero";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {/* HERO SECTION - Roda em Destaque Absoluto */}
          <section className="mb-8">
            <DashboardHero />
            
            {/* Roda Migrei - Hero Central */}
            <div className="mt-8 flex justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/8 via-primary/3 to-transparent blur-3xl" />
                </div>
                
                {/* Card container for the circle */}
                <div className="relative card-elevated p-10 rounded-3xl">
                  <MigreiCircle />
                </div>
              </div>
            </div>
          </section>

          {/* CARDS SECTION - Suporte à Jornada */}
          <section className="grid grid-cols-4 gap-5">
            {/* Próxima Ação - Destaque secundário */}
            <div className="col-span-1">
              <NextActionCard />
            </div>

            {/* Missões do Dia */}
            <div className="col-span-1">
              <MissionCard />
            </div>

            {/* Skills */}
            <div className="col-span-1">
              <SkillsCard />
            </div>

            {/* Networking */}
            <div className="col-span-1">
              <NetworkingCard />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Index;
