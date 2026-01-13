import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { CONSCIOUSNESS_QUESTIONS, ConsciousnessQuestion } from '@/types/awakening';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';

interface ConsciousnessOnboardingProps {
  onComplete: () => void;
}

export function ConsciousnessOnboarding({ onComplete }: ConsciousnessOnboardingProps) {
  const { consciousnessResponses, saveConsciousnessResponse } = useAwakening();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentValue, setCurrentValue] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = CONSCIOUSNESS_QUESTIONS;
  const currentQuestion = questions[currentIndex];
  const isAnswered = consciousnessResponses.some(r => r.question_key === currentQuestion.key);
  const existingResponse = consciousnessResponses.find(r => r.question_key === currentQuestion.key);

  const handleAnswer = async () => {
    setIsSubmitting(true);
    await saveConsciousnessResponse(currentQuestion.key, currentValue);
    setIsSubmitting(false);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setCurrentValue(5);
    } else {
      onComplete();
    }
  };

  const getValueLabel = (value: number) => {
    if (value <= 2) return 'Discordo totalmente';
    if (value <= 4) return 'Discordo';
    if (value <= 6) return 'Neutro';
    if (value <= 8) return 'Concordo';
    return 'Concordo totalmente';
  };

  const getValueColor = (value: number) => {
    if (value <= 3) return 'text-destructive';
    if (value <= 5) return 'text-amber-500';
    if (value <= 7) return 'text-primary';
    return 'text-emerald-500';
  };

  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;
  const answeredCount = consciousnessResponses.length;

  return (
    <Card className="w-full max-w-2xl mx-auto card-elevated">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Badge variant="secondary">Fase 1 - Despertar</Badge>
        </div>
        <CardTitle className="text-2xl">Reflexão de Consciência</CardTitle>
        <CardDescription>
          Responda com sinceridade para entender melhor sua situação atual
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pergunta {currentIndex + 1} de {questions.length}</span>
            <span>{answeredCount} respondida{answeredCount !== 1 ? 's' : ''}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="py-8 text-center space-y-8">
          <h3 className="text-xl font-medium leading-relaxed">
            {currentQuestion.text}
          </h3>

          <div className="space-y-4 max-w-md mx-auto">
            <Slider
              value={[existingResponse?.response_value ?? currentValue]}
              onValueChange={([val]) => setCurrentValue(val)}
              min={1}
              max={10}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Discordo</span>
              <span>Neutro</span>
              <span>Concordo</span>
            </div>
            <p className={cn("text-lg font-medium transition-colors", getValueColor(currentValue))}>
              {getValueLabel(currentValue)}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentIndex(prev => prev - 1);
              const prevResponse = consciousnessResponses.find(
                r => r.question_key === questions[currentIndex - 1]?.key
              );
              setCurrentValue(prevResponse?.response_value ?? 5);
            }}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <Button onClick={handleAnswer} disabled={isSubmitting}>
            {currentIndex === questions.length - 1 ? (
              <>
                Concluir
                <Check className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Próxima
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
