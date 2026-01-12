import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatsBar } from "./StatsBar";

export function HeaderSection() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    if (user) fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) setProfile(data);
  };

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "Rubens";

  return (
    <div className="flex items-center justify-between gap-6">
      {/* Left - Greeting */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="uppercase tracking-wide">Bom dia</span>
        </div>
        <h1 className="text-xl font-heading font-bold text-foreground">
          Olá, <span className="text-primary">{displayName}</span>! 👋
        </h1>
        <p className="text-muted-foreground text-xs">
          O primeiro passo já foi dado!
        </p>
      </div>

      {/* Right - Stats */}
      <div className="flex-1">
        <StatsBar />
      </div>
    </div>
  );
}
