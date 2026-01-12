import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const softSkills = [
  "Comunicação",
  "Liderança", 
  "Empatia",
  "Resiliência",
  "Criatividade",
  "Adaptabilidade",
];

export function SkillsCard() {
  return (
    <div className="card-elevated h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-phase-descobrir/15 flex items-center justify-center">
            <Sparkles className="h-4.5 w-4.5 text-phase-descobrir" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">Soft Skills</h3>
            <p className="text-[10px] text-muted-foreground">
              Suas competências
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="p-4 flex-1">
        <div className="flex flex-wrap gap-1.5">
          {softSkills.map((skill) => (
            <Badge 
              key={skill}
              variant="secondary"
              className="rounded-full px-2.5 py-1 text-[10px] font-normal hover:bg-primary/10 hover:text-primary transition-colors cursor-default"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
