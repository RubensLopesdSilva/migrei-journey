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
    <div className="bg-card border border-border rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <h3 className="font-semibold text-foreground">Soft Skills</h3>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1.5 text-sm rounded-lg bg-muted/50 border border-border text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
