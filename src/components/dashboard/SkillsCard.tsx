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
    <div className="card-elevated p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-lg bg-phase-descobrir/15 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-phase-descobrir" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">Soft Skills</h3>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {softSkills.map((skill) => (
          <Badge 
            key={skill}
            variant="secondary"
            className="rounded-full px-2.5 py-0.5 text-xs font-normal"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
