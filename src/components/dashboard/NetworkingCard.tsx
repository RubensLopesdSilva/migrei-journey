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
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-primary/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '200ms' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[hsl(var(--phase-deslanchar))]/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-[hsl(var(--phase-deslanchar))]" />
          </div>
          <h3 className="font-semibold text-sm text-foreground">Networking</h3>
        </div>
        <Link 
          to="/comunidade"
          className="h-7 w-7 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Connections */}
      <div className="space-y-1.5 mb-3">
        {connections.map((connection, index) => (
          <div 
            key={index}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/30 border border-transparent hover:border-border transition-all cursor-pointer"
          >
            <Avatar className="h-7 w-7">
              <AvatarFallback className={`${connection.color} text-white text-[10px] font-semibold`}>
                {connection.initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-foreground font-medium">{connection.name}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Button 
        variant="default" 
        size="sm" 
        className="w-full text-xs h-8"
        asChild
      >
        <Link to="/comunidade">Ver conexões</Link>
      </Button>
    </div>
  );
}
