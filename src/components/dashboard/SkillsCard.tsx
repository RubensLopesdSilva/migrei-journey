import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const softSkills = [
  "Comunicação",
  "Liderança",
  "Empatia",
  "Resiliência",
  "Criatividade",
  "Trabalho em equipe",
  "Gestão de tempo",
  "Adaptabilidade",
];

export function SkillsCard() {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-phase-descobrir" />
        <h3 className="font-semibold text-foreground">Soft Skills</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {softSkills.map((skill) => (
          <Badge 
            key={skill}
            variant="secondary"
            className="rounded-full px-3 py-1 text-xs font-normal"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  );
}
