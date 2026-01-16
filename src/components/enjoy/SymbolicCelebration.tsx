import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PartyPopper, Sparkles, Heart, Star, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SymbolicCelebration as SymbolicCelebrationType } from '@/types/enjoy';
import { cn } from '@/lib/utils';

interface Props {
  celebration: SymbolicCelebrationType | null;
  onCreate: (celebrationMessage: string, avatarMessage: string, cycleNumber?: number) => Promise<void>;
}

const AVATAR_MESSAGES = [
  "Você provou que a mudança é possível quando há coragem!",
  "Sua jornada é inspiradora. Você recomeçou!",
  "Você não apenas sonhou, você construiu passo a passo.",
  "Sua transformação é um exemplo de resiliência.",
  "Você chegou até aqui porque acreditou em si!",
];

export const SymbolicCelebration = ({ celebration, onCreate }: Props) => {
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [selectedAvatarMessage, setSelectedAvatarMessage] = useState(AVATAR_MESSAGES[0]);

  const triggerConfetti = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 250);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
  };

  const handleCelebrate = async () => {
    triggerConfetti();
    await onCreate(celebrationMessage, selectedAvatarMessage, 1);
  };

  // Already celebrated
  if (celebration) {
    return (
      <div className="w-full max-w-lg mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold">Celebração Completa! 🎉</h2>
          <p className="text-muted-foreground">Você finalizou sua jornada</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-primary/10 border-2 border-amber-500/30 text-center"
        >
          <div className="flex justify-center gap-1 mb-4">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
          </div>
          
          <p className="text-lg italic mb-4">"{celebration.avatar_message}"</p>
          <p className="text-sm text-muted-foreground">— Seu Coach</p>

          {celebration.celebration_message && (
            <div className="mt-6 pt-6 border-t border-amber-500/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-sm font-medium">Sua mensagem</span>
              </div>
              <p className="text-sm text-muted-foreground">{celebration.celebration_message}</p>
            </div>
          )}
        </motion.div>

        <Button 
          onClick={triggerConfetti} 
          variant="outline" 
          className="w-full h-12 gap-2 border-amber-500/50 text-amber-600 hover:bg-amber-500/10"
        >
          <Sparkles className="h-5 w-5" />
          Celebrar novamente!
        </Button>
      </div>
    );
  }

  // Create celebration
  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-amber-500/10 mx-auto flex items-center justify-center mb-2">
          <PartyPopper className="h-8 w-8 text-amber-500" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold">Hora de Celebrar!</h2>
        <p className="text-muted-foreground">Você completou sua jornada de transição</p>
      </div>

      {/* Avatar Message Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Escolha a mensagem do seu Coach</label>
        <div className="space-y-2">
          {AVATAR_MESSAGES.map((message, index) => {
            const isSelected = selectedAvatarMessage === message;
            return (
              <button
                key={index}
                onClick={() => setSelectedAvatarMessage(message)}
                className={cn(
                  "w-full p-4 rounded-xl text-left text-sm transition-all border-2",
                  isSelected 
                    ? "bg-primary/5 border-primary" 
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
                    isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                  </div>
                  <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                    "{message}"
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* User Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Sua mensagem de celebração <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Textarea
          placeholder="Escreva uma mensagem para si mesmo..."
          value={celebrationMessage}
          onChange={(e) => setCelebrationMessage(e.target.value)}
          rows={3}
          className="resize-none"
        />
      </div>

      <Button 
        onClick={handleCelebrate} 
        className="w-full h-12 gap-2 bg-gradient-to-r from-amber-500 to-primary"
        size="lg"
      >
        <PartyPopper className="h-5 w-5" />
        Celebrar minha conquista!
      </Button>
    </div>
  );
};
