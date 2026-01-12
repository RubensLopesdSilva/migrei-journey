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
    <div className="bg-card border border-border rounded-2xl p-4 hover:border-accent/20 transition-all duration-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="h-8 w-8 rounded-xl bg-accent/10 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-accent" />
        </div>
        <h3 className="font-semibold text-sm text-foreground">Soft Skills</h3>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-2.5 py-1.5 text-[11px] rounded-lg bg-muted/50 border border-border text-foreground hover:border-accent/30 hover:bg-accent/5 transition-all duration-200 cursor-pointer font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
