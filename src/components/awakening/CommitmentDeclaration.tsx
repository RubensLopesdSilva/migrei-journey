import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Rocket, Check, Sparkles } from 'lucide-react';
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

  const baseDeclaration = "Eu assumo o compromisso de conduzir minha transição profissional com dedicação e propósito.";

  const handleConfirm = async () => {
    if (!agreed) return;
    
    setIsSaving(true);
    await saveCommitment(customText || undefined);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    setIsSaving(false);
    setTimeout(onComplete, 1500);
  };

  // Already committed state
  if (commitment) {
    return (
      <div className="w-full max-w-lg mx-auto text-center space-y-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="h-20 w-20 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center"
        >
          <Check className="h-10 w-10 text-emerald-500" />
        </motion.div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Compromisso firmado! 🎉</h2>
          <p className="text-muted-foreground">
            Você deu o primeiro passo na sua jornada.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-muted/30 border text-left">
          <p className="text-lg font-medium">"{commitment.declaration_text}"</p>
          {commitment.custom_text && (
            <p className="mt-3 text-sm text-muted-foreground italic">
              {commitment.custom_text}
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">
            {new Date(commitment.confirmed_at).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <Button onClick={onComplete} size="lg" className="w-full h-12 gap-2">
          <Rocket className="h-4 w-4" />
          Continuar jornada
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl md:text-2xl font-semibold">
          Declaração de Compromisso
        </h2>
        <p className="text-muted-foreground text-sm">
          Um momento simbólico para oficializar sua decisão
        </p>
      </div>

      {/* Declaration */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20"
      >
        <p className="text-lg md:text-xl font-medium text-center leading-relaxed">
          "{baseDeclaration}"
        </p>
      </motion.div>

      {/* Optional Personal Note */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Adicione uma nota pessoal <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Textarea
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          placeholder="Por que essa mudança é importante para mim..."
          rows={3}
          className="resize-none"
        />
      </div>

      {/* Agreement */}
      <label 
        htmlFor="agreement" 
        className={cn(
          "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
          agreed ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
        )}
      >
        <Checkbox
          id="agreement"
          checked={agreed}
          onCheckedChange={(checked) => setAgreed(checked === true)}
          className="mt-0.5"
        />
        <span className="text-sm leading-relaxed">
          Declaro que estou comprometido(a) com minha transformação profissional
        </span>
      </label>

      {/* Confirm Button */}
      <Button
        onClick={handleConfirm}
        disabled={!agreed || isSaving}
        size="lg"
        className="w-full h-12 gap-2"
      >
        {isSaving ? (
          <>Confirmando...</>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Firmar compromisso
          </>
        )}
      </Button>
    </div>
  );
}
