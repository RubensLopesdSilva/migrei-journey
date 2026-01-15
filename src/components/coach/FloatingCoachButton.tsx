import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarCoach } from '@/components/awakening/AvatarCoach';
import { cn } from '@/lib/utils';
import { useAgent } from '@/hooks/useAgent';

// Import agent avatar images
import lumiAvatar from "@/assets/agents/lumi.png";
import noahAvatar from "@/assets/agents/noah.png";
import emaAvatar from "@/assets/agents/ema.png";
import leoAvatar from "@/assets/agents/leo.png";
import mayaAvatar from "@/assets/agents/maya.png";
import kaiAvatar from "@/assets/agents/kai.png";

const agentAvatars: Record<string, string> = {
  'Lumi': lumiAvatar,
  'Noah': noahAvatar,
  'Ema': emaAvatar,
  'Leo': leoAvatar,
  'Maya': mayaAvatar,
  'Kai': kaiAvatar,
};

interface FloatingCoachButtonProps {
  phase: string;
  context?: string;
  greeting?: string;
}

const phaseLabels: Record<string, string> = {
  despertar: 'Despertar',
  descobrir: 'Descobrir',
  decidir: 'Decidir',
  desenvolver: 'Desenvolver',
  deslanchar: 'Deslanchar',
  desfrutar: 'Desfrutar',
};

export function FloatingCoachButton({ phase, context, greeting }: FloatingCoachButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const { currentAgent, hasSelectedAgent } = useAgent();
  
  const avatarUrl = currentAgent ? agentAvatars[currentAgent.name] || lumiAvatar : lumiAvatar;
  const agentName = currentAgent?.name || 'Coach';
  
  const storageKey = `migrei-coach-tutorial-${phase}`;

  useEffect(() => {
    // Check if this is the first visit to this phase
    const hasSeenTutorial = localStorage.getItem(storageKey);
    
    if (!hasSeenTutorial) {
      // Show tutorial after a short delay
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem(storageKey, 'true');
  };

  const handleOpenCoach = () => {
    dismissTutorial();
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute bottom-20 right-0 w-72 bg-card border border-border rounded-xl shadow-2xl p-4"
            >
              {/* Arrow pointing to button */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-b border-r border-border transform rotate-45" />
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-foreground">
                    Conheça sua Coach Cicle! 🎯
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Na fase <span className="font-medium text-primary">{phaseLabels[phase] || phase}</span>, 
                    estou aqui para te guiar. Clique para conversar comigo!
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="flex-1 text-xs"
                  onClick={dismissTutorial}
                >
                  Depois
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 text-xs"
                  onClick={handleOpenCoach}
                >
                  Falar agora
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
        >
          <Button
            onClick={handleOpenCoach}
            className={cn(
              "h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-all duration-300 p-0 overflow-hidden",
              "bg-gradient-to-br from-primary via-primary to-primary/80",
              "hover:shadow-xl hover:shadow-primary/25",
              showTutorial && "ring-4 ring-primary/30 animate-pulse"
            )}
            aria-label={`Abrir Coach ${agentName}`}
          >
            {hasSelectedAgent && currentAgent ? (
              <img 
                src={avatarUrl}
                alt={agentName}
                className="h-full w-full object-cover"
              />
            ) : (
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            )}
          </Button>
        </motion.div>
      </div>

      {/* Coach Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 gap-0 bg-transparent border-none shadow-none">
          <AvatarCoach 
            phase={phase}
            context={context}
            greeting={greeting}
            onToggle={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
