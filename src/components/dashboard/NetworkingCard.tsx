import { Users, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Connection {
  id: string;
  name: string;
  initials: string;
}

const recentConnections: Connection[] = [
  { id: "1", name: "Ana Silva", initials: "AS" },
  { id: "2", name: "Carlos O.", initials: "CO" },
  { id: "3", name: "Marina S.", initials: "MS" },
];

export function NetworkingCard() {
  return (
    <div className="card-elevated h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-phase-deslanchar/15 flex items-center justify-center">
            <Users className="h-4.5 w-4.5 text-phase-deslanchar" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Networking</h3>
            <p className="text-[10px] text-muted-foreground">
              Conexões recentes
            </p>
          </div>
        </div>
      </div>

      {/* Connections */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-4">
          {/* Stacked avatars */}
          <div className="flex -space-x-2">
            {recentConnections.map((connection) => (
              <Avatar key={connection.id} className="h-8 w-8 border-2 border-background">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-medium">
                  {connection.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
              <span className="text-[10px] font-medium text-muted-foreground">+12</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground ml-2">15 conexões</span>
        </div>

        <Link to="/comunidade">
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-2">
            <MessageCircle className="h-3.5 w-3.5" />
            Ver comunidade
          </Button>
        </Link>
      </div>
    </div>
  );
}
