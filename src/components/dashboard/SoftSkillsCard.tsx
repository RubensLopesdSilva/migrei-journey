import { Sparkles } from "lucide-react";

const skills = [
  "Comunicação",
  "Liderança", 
  "Empatia",
  "Resiliência",
  "Criatividade",
  "Adaptabilidade",
];

export function SoftSkillsCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">Soft Skills</h3>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-md bg-muted/50 border border-border text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
