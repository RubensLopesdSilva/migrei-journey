import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Sparkles, Save, RotateCcw, Lightbulb, Clock, Target, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MyPitchProps {
  onSave?: (pitch: string) => void;
  initialPitch?: string;
}

const PITCH_MAX_CHARS = 300;
const PITCH_TARGET_SECONDS = 30;

const pitchTips = [
  "Comece com quem você é e o que busca",
  "Mencione sua experiência relevante",
  "Fale do valor que você entrega",
  "Termine com um gancho para conversa"
];

const pitchTemplates = [
  {
    label: "Transição de Carreira",
    template: "Sou [nome], estou em transição de [área atual] para [nova área]. Nos últimos [X] anos desenvolvi [habilidade chave] que agora aplico em [contexto]. Estou buscando [objetivo] e adoraria trocar ideias sobre [tema]."
  },
  {
    label: "Buscando Oportunidade",
    template: "Olá, sou [nome], [cargo/área]. Tenho [X] anos de experiência em [área] com foco em [especialidade]. Meu diferencial é [valor único]. Estou aberto a novas oportunidades em [tipo de empresa/projeto]."
  },
  {
    label: "Networking Casual",
    template: "Prazer, [nome]! Trabalho com [área] e estou explorando [interesse]. Vi que você atua com [área deles] - como está o mercado por aí?"
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
      toast.success('Pitch salvo com sucesso!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pitch);
    setIsCopied(true);
    toast.success('Pitch copiado!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const applyTemplate = (template: string) => {
    setPitch(template);
    setShowTips(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Mic className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Meu Pitch</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Sua apresentação pessoal em 30 segundos
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTips(!showTips)}
              className="gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              Dicas
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tips section */}
          {showTips && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-muted/50 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Estrutura ideal
                </h4>
                <ul className="space-y-1">
                  {pitchTips.map((tip, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Templates prontos</h4>
                <div className="flex flex-wrap gap-2">
                  {pitchTemplates.map((template) => (
                    <Badge
                      key={template.label}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => applyTemplate(template.template)}
                    >
                      {template.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Pitch textarea */}
          <div className="space-y-2">
            <Textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value.slice(0, PITCH_MAX_CHARS))}
              placeholder="Olá, sou [seu nome]. Atuo em [área] com foco em [especialidade]. Estou buscando [objetivo] e adoraria conversar sobre [tema de interesse]..."
              className="min-h-[150px] resize-none"
            />
            
            {/* Progress indicators */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>{charCount}/{PITCH_MAX_CHARS} caracteres</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>~{estimatedSeconds}s de fala</span>
                </div>
              </div>
              <Progress 
                value={charProgress} 
                className={cn(
                  "w-24 h-1.5",
                  charProgress > 90 && "[&>div]:bg-amber-500",
                  charProgress >= 100 && "[&>div]:bg-red-500"
                )}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSave}
              disabled={!pitch.trim() || isSaving}
              className="flex-1 gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Pitch
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              disabled={!pitch.trim()}
              title="Copiar pitch"
            >
              {isCopied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setPitch('')}
              disabled={!pitch}
              title="Limpar"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* AI suggestion button */}
          <Button
            variant="ghost"
            className="w-full gap-2 text-primary hover:text-primary hover:bg-primary/10"
          >
            <Sparkles className="h-4 w-4" />
            Melhorar com IA
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
