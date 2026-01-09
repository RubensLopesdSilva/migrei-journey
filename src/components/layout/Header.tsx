import { Star, Calendar, Trophy, Zap, Bell, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UserStats {
  name: string;
  points: number;
  days: number;
  ranking: number;
  energy: number;
}

const userStats: UserStats = {
  name: "Rubens",
  points: 30,
  days: 100,
  ranking: 1,
  energy: 75,
};

export function Header() {
  return (
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-8">
      {/* User Greeting */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <span className="font-medium text-foreground">
          Olá, <span className="text-primary">{userStats.name}</span>
        </span>
      </div>

      {/* Stats Badges */}
      <div className="flex items-center gap-3">
        <div className="stat-badge">
          <Star className="h-4 w-4 text-phase-despertar" />
          <span>{userStats.points} pontos</span>
        </div>

        <div className="stat-badge">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{userStats.days} dias</span>
        </div>

        <div className="stat-badge">
          <Trophy className="h-4 w-4 text-phase-desfrutar" />
          <span>{userStats.ranking}º ranking</span>
        </div>

        <div className="stat-badge min-w-[140px]">
          <Zap className="h-4 w-4 text-phase-deslanchar" />
          <Progress value={userStats.energy} className="flex-1 h-2" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <User className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}
