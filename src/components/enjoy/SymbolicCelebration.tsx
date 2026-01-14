import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PartyPopper, MessageCircle, Sparkles, Heart, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SymbolicCelebration as SymbolicCelebrationType } from '@/types/enjoy';

interface Props {
  celebration: SymbolicCelebrationType | null;
  onCreate: (celebrationMessage: string, avatarMessage: string, cycleNumber?: number) => Promise<void>;
}

const AVATAR_MESSAGES = [
  "Você provou que a mudança é possível quando há coragem e determinação!",
  "Sua jornada é inspiradora. Você é a prova viva de que nunca é tarde para recomeçar.",
  "Parabéns! Você não apenas sonhou com a mudança, você a construiu passo a passo.",
  "Sua transformação profissional é um exemplo de resiliência e autoconhecimento.",
  "Você chegou até aqui porque acreditou em si mesmo. Continue sempre assim!",
];

export const SymbolicCelebration = ({ celebration, onCreate }: Props) => {
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [selectedAvatarMessage, setSelectedAvatarMessage] = useState(AVATAR_MESSAGES[0]);
  const [showConfetti, setShowConfetti] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 250);
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 400);
  };

  const handleCelebrate = async () => {
    triggerConfetti();
    setShowConfetti(true);
    await onCreate(celebrationMessage, selectedAvatarMessage, 1);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (celebration) {
    return (
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-primary/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-amber-500" />
            Celebração Simbólica
            <Badge className="ml-2 bg-amber-500">Ciclo {celebration.cycle_number}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          {/* Avatar Message */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-6 relative">
            <div className="absolute -top-3 left-4">
              <div className="bg-primary rounded-full p-2">
                <MessageCircle className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-lg italic mt-2 text-center">
              "{celebration.avatar_message}"
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">— Seu Coach Avatar</p>
          </div>

          {/* User Celebration Message */}
          {celebration.celebration_message && (
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Sua Mensagem de Celebração
              </h4>
              <div className="bg-muted/30 rounded-lg p-4">
                <p className="text-sm">{celebration.celebration_message}</p>
              </div>
            </div>
          )}

          {/* Celebration Stats */}
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-amber-500">
                <Star className="h-6 w-6 fill-amber-500" />
                <Star className="h-6 w-6 fill-amber-500" />
                <Star className="h-6 w-6 fill-amber-500" />
              </div>
              <p className="text-sm text-muted-foreground mt-1">Jornada Completa</p>
            </div>
          </div>

          <Button 
            onClick={triggerConfetti} 
            variant="outline" 
            className="w-full gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
          >
            <Sparkles className="h-4 w-4" />
            Celebrar Novamente!
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-amber-500" />
          Celebração Simbólica
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Chegou a hora de celebrar sua conquista! Você completou um ciclo importante 
          na sua jornada de transição profissional.
        </p>

        {/* Avatar Message Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Mensagem do seu Coach Avatar</label>
          <div className="space-y-2">
            {AVATAR_MESSAGES.map((message, index) => (
              <button
                key={index}
                onClick={() => setSelectedAvatarMessage(message)}
                className={`w-full p-3 rounded-lg text-left text-sm transition-colors ${
                  selectedAvatarMessage === message 
                    ? 'bg-primary/20 border-2 border-primary' 
                    : 'bg-muted/30 hover:bg-muted/50 border-2 border-transparent'
                }`}
              >
                "{message}"
              </button>
            ))}
          </div>
        </div>

        {/* User Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sua Mensagem de Celebração (opcional)</label>
          <Textarea
            placeholder="Escreva uma mensagem para si mesmo celebrando essa conquista..."
            value={celebrationMessage}
            onChange={(e) => setCelebrationMessage(e.target.value)}
            rows={3}
          />
        </div>

        <Button 
          onClick={handleCelebrate} 
          className="w-full gap-2 bg-gradient-to-r from-amber-500 to-primary"
          size="lg"
        >
          <PartyPopper className="h-5 w-5" />
          Celebrar Minha Conquista!
        </Button>
      </CardContent>
    </Card>
  );
};
