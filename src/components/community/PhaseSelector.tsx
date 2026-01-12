import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  color: string;
  phase_number: number;
}

interface PhaseSelectorProps {
  phases: Phase[];
  currentPhaseId: string | null;
  selectedPhaseId: string | null;
  userPhaseNumber: number;
  onSelect: (phaseId: string) => void;
}

export function PhaseSelector({ 
  phases, 
  currentPhaseId, 
  selectedPhaseId, 
  userPhaseNumber,
  onSelect 
}: PhaseSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {phases.map((phase) => {
        const isLocked = phase.phase_number > userPhaseNumber;
        const isSelected = selectedPhaseId === phase.id;
        const isCurrent = currentPhaseId === phase.id;

        return (
          <button
            key={phase.id}
            onClick={() => !isLocked && onSelect(phase.id)}
            disabled={isLocked}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              isSelected
                ? "bg-primary text-primary-foreground shadow-md"
                : isLocked
                ? "bg-muted/50 text-muted-foreground cursor-not-allowed"
                : "bg-muted hover:bg-muted/80 text-foreground",
              isCurrent && !isSelected && "ring-2 ring-primary/50"
            )}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: phase.color }}
            />
            {phase.name}
            {isLocked && <Lock className="h-3 w-3" />}
            {isCurrent && !isLocked && (
              <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                Atual
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
