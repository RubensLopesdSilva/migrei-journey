import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { MissionCard } from "@/components/dashboard/MissionCard";
import { WelcomePanel } from "@/components/dashboard/WelcomePanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pl-64 min-h-screen">
        <main className="p-10 min-h-screen flex flex-col">
          {/* Hero Section - Asymmetric Split */}
          <div className="flex-1 flex items-center gap-16">
            {/* Left Panel - Welcome & Context */}
            <div className="w-[420px] flex-shrink-0 space-y-8">
              <WelcomePanel />
              
              {/* Mission Card - Below Welcome */}
              <MissionCard />
            </div>

            {/* Right - Roda Migrei Hero (Emphasis) */}
            <div className="flex-1 flex items-center justify-center -mt-8">
              <div className="relative">
                {/* Soft ambient glow */}
                <div className="absolute -inset-32 bg-gradient-radial from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none" />
                
                {/* Inner glow */}
                <div className="absolute -inset-16 bg-gradient-radial from-accent/3 via-transparent to-transparent blur-2xl pointer-events-none" />
                
                {/* The Circle - Hero Element */}
                <div className="relative transform scale-110">
                  <MigreiCircle />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
