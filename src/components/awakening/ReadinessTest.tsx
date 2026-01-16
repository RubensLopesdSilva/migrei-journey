import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Wallet, Briefcase, Check, ArrowRight, Loader2, ChevronLeft } from 'lucide-react';
import { READINESS_QUESTIONS, ReadinessCategory, ReadinessAnswer } from '@/types/awakening';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';

interface ReadinessTestProps {
  onComplete: () => void;
}

const scaleOptions = [
  { value: 1, label: 'Discordo totalmente' },
  { value: 3, label: 'Discordo parcialmente' },
  { value: 5, label: 'Neutro' },
  { value: 7, label: 'Concordo parcialmente' },
  { value: 10, label: 'Concordo totalmente' }
];

export function ReadinessTest({ onComplete }: ReadinessTestProps) {
  const { readinessAssessment, saveReadinessAssessment } = useAwakening();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<ReadinessCategory, Record<number, number>>>({
    emotional: {},
    financial: {},
    professional: {}
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showCategorySummary, setShowCategorySummary] = useState(false);

  const categories: { key: ReadinessCategory; label: string; icon: typeof Heart; color: string }[] = [
    { key: 'emotional', label: 'Emocional', icon: Heart, color: 'text-rose-500' },
    { key: 'financial', label: 'Financeiro', icon: Wallet, color: 'text-emerald-500' },
    { key: 'professional', label: 'Profissional', icon: Briefcase, color: 'text-blue-500' }
  ];

  const currentCategory = categories[currentCategoryIndex];
  const currentQuestions = READINESS_QUESTIONS[currentCategory.key];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  
  // Total progress
  const totalQuestions = categories.reduce((acc, cat) => acc + READINESS_QUESTIONS[cat.key].length, 0);
  const answeredQuestions = categories.reduce((acc, cat, idx) => {
    if (idx < currentCategoryIndex) {
      return acc + READINESS_QUESTIONS[cat.key].length;
    } else if (idx === currentCategoryIndex) {
      return acc + Object.keys(answers[cat.key]).length;
    }
    return acc;
  }, 0);

  const handleAnswer = async (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentCategory.key]: { ...prev[currentCategory.key], [currentQuestionIndex]: value }
    }));

    // Auto advance after short delay
    setTimeout(() => {
      if (currentQuestionIndex < currentQuestions.length - 1) {
        // Next question in same category
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // End of category - save and show summary or move to next
        handleSaveCategory();
      }
    }, 300);
  };

  const handleSaveCategory = async () => {
    const categoryAnswers = answers[currentCategory.key];
    
    setIsSaving(true);
    const answersToSave: ReadinessAnswer[] = currentQuestions.map((q, i) => ({
      question: q.question,
      value: categoryAnswers[i] ?? 5,
      weight: q.weight
    }));

    await saveReadinessAssessment(currentCategory.key, answersToSave);
    setIsSaving(false);

    if (currentCategoryIndex < categories.length - 1) {
      // Move to next category
      setCurrentCategoryIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // All done
      setShowCategorySummary(true);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (currentCategoryIndex > 0) {
      const prevCategoryIndex = currentCategoryIndex - 1;
      const prevCategory = categories[prevCategoryIndex];
      setCurrentCategoryIndex(prevCategoryIndex);
      setCurrentQuestionIndex(READINESS_QUESTIONS[prevCategory.key].length - 1);
    }
  };

  const canGoBack = currentQuestionIndex > 0 || currentCategoryIndex > 0;
  const currentAnswer = answers[currentCategory.key][currentQuestionIndex];

  const getCategoryScore = (category: ReadinessCategory) => {
    if (!readinessAssessment) return null;
    const scoreKey = `${category}_score` as keyof typeof readinessAssessment;
    return readinessAssessment[scoreKey] as number;
  };

  const getReadinessInfo = (level: string | undefined) => {
    switch (level) {
      case 'not_ready': return { label: 'Em preparação', sublabel: 'Você está começando sua jornada' };
      case 'preparing': return { label: 'Quase lá', sublabel: 'Você está no caminho certo' };
      case 'ready': return { label: 'Pronto!', sublabel: 'Você está preparado para a transição' };
      default: return null;
    }
  };

  // Show final summary
  if (showCategorySummary && readinessAssessment) {
    const readinessInfo = getReadinessInfo(readinessAssessment.readiness_level);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto text-center py-8"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Diagnóstico Completo</h2>
        
        {readinessInfo && (
          <div className="mb-8">
            <p className="text-4xl font-bold text-primary mb-2">
              {readinessAssessment.total_score}%
            </p>
            <p className="text-lg font-medium">{readinessInfo.label}</p>
            <p className="text-muted-foreground">{readinessInfo.sublabel}</p>
          </div>
        )}

        {/* Category breakdown */}
        <div className="space-y-3 mb-8">
          {categories.map(cat => {
            const Icon = cat.icon;
            const score = getCategoryScore(cat.key);
            return (
              <div key={cat.key} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Icon className={cn("h-5 w-5", cat.color)} />
                <span className="flex-1 text-left font-medium">{cat.label}</span>
                <span className="font-semibold">{score}%</span>
              </div>
            );
          })}
        </div>

        <Button onClick={onComplete} size="lg" className="w-full h-12 gap-2">
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        {/* Category indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = idx === currentCategoryIndex;
            const isComplete = idx < currentCategoryIndex;
            
            return (
              <div key={cat.key} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  isActive ? "bg-primary text-primary-foreground" :
                  isComplete ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                {idx < categories.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5 rounded-full transition-colors",
                    idx < currentCategoryIndex ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Current category label */}
        <div className="text-center mb-4">
          <span className={cn("text-sm font-medium", currentCategory.color)}>
            {currentCategory.label}
          </span>
          <span className="text-muted-foreground text-sm ml-2">
            {currentQuestionIndex + 1} de {currentQuestions.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentCategory.key}-${currentQuestionIndex}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-center leading-relaxed">
            {currentQuestion.question}
          </h2>
        </motion.div>
      </AnimatePresence>

      {/* Answer Options */}
      <div className="space-y-3 mb-8">
        {scaleOptions.map((option, idx) => (
          <motion.button
            key={option.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => handleAnswer(option.value)}
            disabled={isSaving}
            className={cn(
              "w-full p-4 rounded-xl text-left transition-all duration-200 border-2",
              currentAnswer === option.value
                ? "border-primary bg-primary/5 text-foreground"
                : "border-transparent bg-muted/50 hover:bg-muted hover:border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                currentAnswer === option.value
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30"
              )}>
                {currentAnswer === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-primary-foreground"
                  />
                )}
              </div>
              <span className="font-medium">{option.label}</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {canGoBack && (
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isSaving}
            className="h-12 px-4"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        {isSaving && (
          <Button disabled className="flex-1 h-12 gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Salvando...
          </Button>
        )}
      </div>
    </div>
  );
}
