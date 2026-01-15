import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Sparkles, ArrowRight } from "lucide-react";
import { LevelInfo } from "@/types/progress";

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: LevelInfo;
  previousLevel: LevelInfo;
}

export function LevelUpModal({ 
  isOpen, 
  onClose, 
  newLevel, 
  previousLevel 
}: LevelUpModalProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti effect using dynamic import
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      });

      // Show content with delay
      setTimeout(() => setShowContent(true), 300);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md text-center p-0 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
        
        <div className="relative p-8">
          {/* Stars animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <Sparkles 
                key={i}
                className="absolute text-primary/40 animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.2}s`,
                  transform: `scale(${0.5 + Math.random() * 0.5})`
                }}
              />
            ))}
          </div>

          {/* Level badge */}
          <div className={`transition-all duration-700 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="relative mx-auto w-28 h-28 mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              <div className="relative h-full w-full rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-bold text-white">{newLevel.level}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-phase-despertar rounded-full p-2 shadow-lg">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-2">
              Fase concluída 🎉
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Você avançou com consciência
            </p>

            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 mb-6">
              <p className="text-3xl font-bold text-primary mb-2">
                {newLevel.name}
              </p>
              <p className="text-muted-foreground">
                {newLevel.description}
              </p>
            </div>

            {/* Level transition */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-1">
                  <span className="font-bold text-muted-foreground">{previousLevel.level}</span>
                </div>
                <span className="text-xs text-muted-foreground">{previousLevel.name}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-primary" />
              <div className="text-center">
                <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-1 shadow-lg">
                  <span className="font-bold text-white">{newLevel.level}</span>
                </div>
                <span className="text-xs text-primary font-medium">{newLevel.name}</span>
              </div>
            </div>

            <Button onClick={onClose} className="w-full" size="lg">
              Continuar jornada
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
