import { Users, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Connection {
  name: string;
  initials: string;
  color: string;
}

const connections: Connection[] = [
  { name: "Ana Silva", initials: "AS", color: "bg-pink-500" },
  { name: "Carlos M.", initials: "CM", color: "bg-blue-500" },
];

export function NetworkingCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Networking</h3>
        </div>
        <Link 
          to="/comunidade"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Connections */}
      <div className="space-y-2 mb-3">
        {connections.map((connection, index) => (
          <div 
            key={index}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/30"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className={`${connection.color} text-white text-xs`}>
                {connection.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-foreground">{connection.name}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button 
        variant="default" 
        size="sm" 
        className="w-full text-xs"
        asChild
      >
        <Link to="/comunidade">Ver conexões</Link>
      </Button>
    </div>
  );
}
