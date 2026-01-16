import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Save, RotateCcw, Lightbulb, Clock, Copy, Check, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MyPitchProps {
  onSave?: (pitch: string) => void;
  initialPitch?: string;
}

const PITCH_MAX_CHARS = 300;
const PITCH_TARGET_SECONDS = 30;

const pitchTips = [
  "Diga quem você é",
  "Sua experiência principal",
  "Seu diferencial",
  "Deixe espaço para conversa"
];

const pitchTemplates = [
  {
    label: "Em transição",
    template: "Sou [nome], estou em transição de [área atual] para [nova área]. Nos últimos [X] anos desenvolvi [habilidade] que agora aplico em [contexto]. Estou buscando [objetivo]."
  },
  {
    label: "Buscando vaga",
    template: "Olá, sou [nome], [cargo]. Tenho [X] anos de experiência em [área] com foco em [especialidade]. Meu diferencial é [valor único]."
  },
  {
    label: "Conversa informal",
    template: "Prazer, [nome]! Trabalho com [área] e estou explorando oportunidades em [interesse]. Vi que você atua com [área] — como está o mercado por aí?"
  }
];

export function MyPitch({ onSave, initialPitch = '' }: MyPitchProps) {
  const [pitch, setPitch] = useState(initialPitch);
  const [isSaving, setIsSaving] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const charCount = pitch.length;
  const charProgress = (charCount / PITCH_MAX_CHARS) * 100;
  const estimatedSeconds = Math.round((charCount / PITCH_MAX_CHARS) * PITCH_TARGET_SECONDS);

  const handleSave = async () => {
    if (!pitch.trim()) return;
    setIsSaving(true);
    try {
      await onSave?.(pitch);
      toast.success('Pitch salvo!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pitch);
    setIsCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const applyTemplate = (template: string) => {
    setPitch(template);
    setShowTips(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mic className="h-4 w-4 text-primary" />
              </div>
              <CardTitle className="text-base">Seu pitch</CardTitle>
            </div>
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              ~{estimatedSeconds}s
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Tips Toggle */}
          <Collapsible open={showTips} onOpenChange={setShowTips}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between h-8 text-xs"
              >
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  Ver dicas e modelos
                </span>
                <ChevronDown className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  showTips && "rotate-180"
                )} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pt-2 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {pitchTips.map((tip, index) => (
                    <Badge key={index} variant="secondary" className="text-xs font-normal">
                      {index + 1}. {tip}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pitchTemplates.map((template) => (
                    <Badge
                      key={template.label}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10 text-xs"
                      onClick={() => applyTemplate(template.template)}
                    >
                      {template.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Pitch textarea */}
          <Textarea
            value={pitch}
            onChange={(e) => setPitch(e.target.value.slice(0, PITCH_MAX_CHARS))}
            placeholder="Como você se apresentaria em 30 segundos?"
            className="min-h-[120px] resize-none text-sm"
          />
          
          {/* Progress */}
          <div className="flex items-center gap-3">
            <Progress 
              value={charProgress} 
              className={cn(
                "flex-1 h-1.5",
                charProgress > 90 && "[&>div]:bg-amber-500",
                charProgress >= 100 && "[&>div]:bg-destructive"
              )}
            />
            <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
              {charCount}/{PITCH_MAX_CHARS}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={!pitch.trim() || isSaving}
              size="sm"
              className="flex-1"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Salvar
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              disabled={!pitch.trim()}
            >
              {isCopied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPitch('')}
              disabled={!pitch}
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
