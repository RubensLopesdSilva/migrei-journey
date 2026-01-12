import { Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Connection {
  id: string;
  name: string;
  initials: string;
  phase: string;
}

const recentConnections: Connection[] = [
  { id: "1", name: "Ana Silva", initials: "AS", phase: "Descobrir" },
  { id: "2", name: "Carlos O.", initials: "CO", phase: "Despertar" },
  { id: "3", name: "Marina S.", initials: "MS", phase: "Decidir" },
];

export function NetworkingCard() {
  return (
    <div className="card-elevated h-full p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-phase-deslanchar/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-phase-deslanchar" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Networking</h3>
            <p className="text-xs text-muted-foreground">15 conexões</p>
          </div>
        </div>
      </div>

      {/* Stacked Avatars */}
      <div className="flex items-center mb-4">
        <div className="flex -space-x-3">
          {recentConnections.map((connection) => (
            <Avatar 
              key={connection.id} 
              className="h-9 w-9 border-2 border-background ring-2 ring-card"
            >
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-xs font-medium">
                {connection.initials}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="h-9 w-9 rounded-full bg-muted border-2 border-background ring-2 ring-card flex items-center justify-center">
            <span className="text-xs font-medium text-muted-foreground">+12</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link 
        to="/comunidade"
        className="mt-auto flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
      >
        <span className="text-sm font-medium text-foreground">Ver comunidade</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </Link>
    </div>
  );
}
