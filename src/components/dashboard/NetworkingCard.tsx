import { Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Connection {
  id: string;
  name: string;
  role: string;
  initials: string;
}

const recentConnections: Connection[] = [
  { id: "1", name: "Ana Silva", role: "Product Manager", initials: "AS" },
  { id: "2", name: "Carlos Oliveira", role: "Tech Lead", initials: "CO" },
  { id: "3", name: "Marina Santos", role: "UX Designer", initials: "MS" },
];

export function NetworkingCard() {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-phase-deslanchar" />
          <h3 className="font-semibold text-foreground">Networking</h3>
        </div>
        <button className="text-primary hover:text-primary/80 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        {recentConnections.map((connection) => (
          <div 
            key={connection.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {connection.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {connection.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {connection.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full btn-primary-gradient text-sm">
        Ver todas conexões
      </button>
    </div>
  );
}
