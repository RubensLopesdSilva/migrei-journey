import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Heart, Rocket, Check } from 'lucide-react';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface CommitmentDeclarationProps {
  onComplete: () => void;
}

export function CommitmentDeclaration({ onComplete }: CommitmentDeclarationProps) {
  const { commitment, saveCommitment } = useAwakening();
  const [customText, setCustomText] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const baseDeclaration = "Eu assumo o compromisso de conduzir minha transição profissional";

  const handleConfirm = async () => {
    if (!agreed) return;
    
    setIsSaving(true);
    await saveCommitment(customText || undefined);
    
    // Celebration!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setIsSaving(false);
    setTimeout(onComplete, 1500);
  };

  if (commitment) {
    return (
      <Card className="w-full max-w-2xl mx-auto card-elevated">
        <CardContent className="py-12 text-center space-y-6">
          <div className="h-20 w-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
            <Check className="h-10 w-10 text-emerald-500" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl">Compromisso Firmado! 🎉</CardTitle>
            <p className="text-muted-foreground">
              Você deu o primeiro passo na sua jornada de transformação.
            </p>
          </div>

          <div className="p-6 rounded-lg bg-muted/50 border">
            <p className="text-lg font-medium italic">"{commitment.declaration_text}"</p>
            {commitment.custom_text && (
              <p className="mt-2 text-sm text-muted-foreground">{commitment.custom_text}</p>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Confirmado em {new Date(commitment.confirmed_at).toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </div>

          <Button onClick={onComplete} size="lg" className="w-full">
            <Rocket className="h-4 w-4 mr-2" />
            Continuar minha jornada
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto card-elevated">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-rose-500" />
          <Badge variant="secondary">Ritual de Compromisso</Badge>
        </div>
        <CardTitle className="text-2xl">Declaração de Compromisso MIGREI</CardTitle>
        <CardDescription>
          Este é um momento simbólico importante. Ao firmar esse compromisso, você está 
          oficializando sua decisão de transformar sua carreira.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Declaration */}
        <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
          <p className="text-xl font-medium text-center leading-relaxed">
            "{baseDeclaration}"
          </p>
        </div>

        {/* Optional Custom Text */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Adicione uma motivação pessoal (opcional):
          </label>
          <Textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Por que essa mudança é importante para mim..."
            rows={3}
          />
        </div>

        {/* Agreement Checkbox */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
          <Checkbox
            id="agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
            className="mt-0.5"
          />
          <label htmlFor="agreement" className="text-sm cursor-pointer leading-relaxed">
            Eu entendo que essa é uma jornada que exige dedicação e compromisso. 
            Estou pronto(a) para investir tempo e energia na minha transformação profissional.
          </label>
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!agreed || isSaving}
          size="lg"
          className="w-full bg-gradient-to-r from-primary to-primary/80"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Firmar meu compromisso
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          🔒 Este compromisso é pessoal e privado. Apenas você terá acesso a ele.
        </p>
      </CardContent>
    </Card>
  );
}
