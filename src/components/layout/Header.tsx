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
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-8">
      {/* User Greeting - Simplified */}
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={profile?.avatar_url || ""} />
          <AvatarFallback className="bg-secondary text-muted-foreground text-sm">
            {userInitials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-muted-foreground">
          {displayName}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
        </button>
        <a href="/configuracoes" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors">
          <User className="h-4 w-4 text-muted-foreground" />
        </a>
      </div>
    </header>
  );
}
