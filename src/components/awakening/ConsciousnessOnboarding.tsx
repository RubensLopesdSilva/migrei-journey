import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { CONSCIOUSNESS_QUESTIONS } from '@/types/awakening';
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

  const scaleOptions = [
    { value: 1, label: 'Discordo totalmente' },
    { value: 3, label: 'Discordo' },
    { value: 5, label: 'Neutro' },
    { value: 7, label: 'Concordo' },
    { value: 10, label: 'Concordo totalmente' },
  ];

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Minimal Progress */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {/* Question */}
          <h2 className="text-xl md:text-2xl font-semibold text-center leading-relaxed">
            {currentQuestion.text}
          </h2>

          {/* Scale Buttons */}
          <div className="space-y-3">
            {scaleOptions.map((option) => {
              const isSelected = (existingResponse?.response_value ?? currentValue) === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => setCurrentValue(option.value)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all duration-200",
                    "border-2 hover:border-primary/50",
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border bg-background hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )}>
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className={cn(
                      "font-medium",
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {option.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t">
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
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <Button onClick={handleAnswer} disabled={isSubmitting} className="gap-2 min-w-[120px]">
          {currentIndex === questions.length - 1 ? 'Concluir' : 'Próxima'}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
