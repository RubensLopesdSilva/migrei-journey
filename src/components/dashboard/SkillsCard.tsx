import { Sparkles, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const softSkills = [
  "Comunicação",
  "Liderança", 
  "Empatia",
  "Resiliência",
  "Criatividade",
];

export function SkillsCard() {
  return (
    <div className="card-elevated h-full p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-phase-descobrir/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-phase-descobrir" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Soft Skills</h3>
          <p className="text-xs text-muted-foreground">Suas competências</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 flex-1">
        {softSkills.map((skill) => (
          <Badge 
            key={skill}
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-normal"
          >
            {skill}
          </Badge>
        ))}
        <button className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors">
          <Plus className="h-3 w-3" />
          Adicionar
        </button>
      </div>
    </div>
  );
}
