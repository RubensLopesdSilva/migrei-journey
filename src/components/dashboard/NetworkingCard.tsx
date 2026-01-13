import { Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface Connection {
  id: string;
  name: string;
  role: string;
  initials: string;
}

const recentConnections: Connection[] = [
  { id: "1", name: "Ana Silva", role: "Product Manager", initials: "AS" },
  { id: "2", name: "Carlos O.", role: "Tech Lead", initials: "CO" },
];

export function NetworkingCard() {
  return (
    <div className="card-elevated p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-phase-deslanchar/15 flex items-center justify-center">
            <Users className="h-4 w-4 text-phase-deslanchar" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Networking</h3>
        </div>
        <Link to="/comunidade" className="text-primary hover:text-primary/80 transition-colors">
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-2 flex-1">
        {recentConnections.map((connection) => (
          <div 
            key={connection.id}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {connection.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {connection.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {connection.role}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link 
        to="/comunidade"
        className="mt-3 w-full btn-primary-gradient text-xs py-2 text-center block"
      >
        Ver conexões
      </Link>
    </div>
  );
}
