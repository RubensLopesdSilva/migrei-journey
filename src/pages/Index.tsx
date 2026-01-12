import { Sidebar } from "@/components/layout/Sidebar";
import { MigreiCircle } from "@/components/dashboard/MigreiCircle";
import { HeaderSection } from "@/components/dashboard/HeaderSection";
import { MissionsCard } from "@/components/dashboard/MissionsCard";
import { SoftSkillsCard } from "@/components/dashboard/SoftSkillsCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="pl-64 min-h-screen">
        <main className="p-6 space-y-4">
          {/* Header - Greeting + Stats inline */}
          <HeaderSection />

          {/* Main Content - Circle Card + Side Cards */}
          <div className="flex gap-4 items-start">
            {/* Left - Roda Migrei inside a Card */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-6">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-2.5 w-2.5 rounded-full bg-[hsl(var(--phase-despertar))] animate-pulse-slow" />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Fase atual:</span>
                  <span className="text-sm font-semibold text-[hsl(var(--phase-despertar))]">Despertar</span>
                </div>
                <Link 
                  to="/progresso"
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto"
                >
                  Ver jornada
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* The Circle */}
              <div className="flex justify-center py-2">
                <MigreiCircle />
              </div>
            </div>

            {/* Right - Side Cards */}
            <div className="w-72 flex-shrink-0 space-y-4">
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
