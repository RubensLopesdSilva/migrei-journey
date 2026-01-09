import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { SkillsCard } from "@/components/dashboard/SkillsCard";
import { NetworkingCard } from "@/components/dashboard/NetworkingCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <Header />

        {/* Dashboard Content */}
        <main className="p-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Center - Migrei Circle */}
            <div className="col-span-8 flex items-center justify-center">
              <div className="card-elevated p-12 w-full flex justify-center">
                <MigreiCircle />
              </div>
            </div>

            {/* Right Sidebar - Cards */}
            <div className="col-span-4 space-y-6">
              <MissionCard />
              <SkillsCard />
              <NetworkingCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
