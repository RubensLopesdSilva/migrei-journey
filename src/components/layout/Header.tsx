import { useState, useEffect } from "react";
import { Star, Calendar, Trophy, Zap, Bell, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface UserStats {
  points: number;
  days: number;
  ranking: number;
  energy: number;
}

export function Header() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null } | null>(null);
  
  const [stats] = useState<UserStats>({
    points: 30,
    days: 100,
    ranking: 1,
    energy: 75,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "Usuário";
  const userInitials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className="h-20 bg-card border-b border-border flex items-center justify-between px-8">
      {/* User Greeting */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback className="bg-secondary text-muted-foreground">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <span className="font-medium text-foreground">
          Olá, <span className="text-primary">{displayName}</span>
        </span>
      </div>

      {/* Stats Badges */}
      <div className="flex items-center gap-3">
        <div className="stat-badge">
          <Star className="h-4 w-4 text-phase-despertar" />
          <span>{stats.points} pontos</span>
        </div>

        <div className="stat-badge">
          <Calendar className="h-4 w-4 text-primary" />
          <span>{stats.days} dias</span>
        </div>

        <div className="stat-badge">
          <Trophy className="h-4 w-4 text-phase-desfrutar" />
          <span>{stats.ranking}º ranking</span>
        </div>

        <div className="stat-badge min-w-[140px]">
          <Zap className="h-4 w-4 text-phase-deslanchar" />
          <Progress value={stats.energy} className="flex-1 h-2" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
        </button>
        <a href="/configuracoes" className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </a>
      </div>
    </header>
  );
}
