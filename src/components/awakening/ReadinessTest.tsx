import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Wallet, Briefcase, Check, ArrowRight, Loader2 } from 'lucide-react';
import { READINESS_QUESTIONS, ReadinessCategory, ReadinessAnswer } from '@/types/awakening';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';

interface ReadinessTestProps {
  onComplete: () => void;
}

export function ReadinessTest({ onComplete }: ReadinessTestProps) {
  const { readinessAssessment, saveReadinessAssessment } = useAwakening();
  const [activeTab, setActiveTab] = useState<ReadinessCategory>('emotional');
  const [answers, setAnswers] = useState<Record<ReadinessCategory, Record<number, number>>>({
    emotional: {},
    financial: {},
    professional: {}
  });
  const [isSaving, setIsSaving] = useState(false);

  const categories: { key: ReadinessCategory; label: string; icon: typeof Heart; color: string }[] = [
    { key: 'emotional', label: 'Emocional', icon: Heart, color: 'text-rose-500' },
    { key: 'financial', label: 'Financeiro', icon: Wallet, color: 'text-emerald-500' },
    { key: 'professional', label: 'Profissional', icon: Briefcase, color: 'text-blue-500' }
  ];

  const handleAnswerChange = (category: ReadinessCategory, questionIndex: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [category]: { ...prev[category], [questionIndex]: value }
    }));
  };

  const handleSaveCategory = async (category: ReadinessCategory) => {
    const questions = READINESS_QUESTIONS[category];
    const categoryAnswers = answers[category];
    
    if (Object.keys(categoryAnswers).length !== questions.length) return;

    setIsSaving(true);
    const answersToSave: ReadinessAnswer[] = questions.map((q, i) => ({
      question: q.question,
      value: categoryAnswers[i] ?? 5,
      weight: q.weight
    }));

    await saveReadinessAssessment(category, answersToSave);
    setIsSaving(false);

    const currentIndex = categories.findIndex(c => c.key === category);
    if (currentIndex < categories.length - 1) {
      setActiveTab(categories[currentIndex + 1].key);
    }
  };

  const getCategoryScore = (category: ReadinessCategory) => {
    if (!readinessAssessment) return null;
    const scoreKey = `${category}_score` as keyof typeof readinessAssessment;
    return readinessAssessment[scoreKey] as number;
  };

  const isCategoryComplete = (category: ReadinessCategory) => {
    const score = getCategoryScore(category);
    return score !== null && score > 0;
  };

  const allComplete = categories.every(c => isCategoryComplete(c.key));

  const getReadinessInfo = (level: string | undefined) => {
    switch (level) {
      case 'not_ready': return { label: 'Em preparação', color: 'bg-amber-500/10 text-amber-600' };
      case 'preparing': return { label: 'Quase lá', color: 'bg-blue-500/10 text-blue-600' };
      case 'ready': return { label: 'Pronto!', color: 'bg-emerald-500/10 text-emerald-600' };
      default: return null;
    }
  };

  const readinessInfo = getReadinessInfo(readinessAssessment?.readiness_level);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">
          Teste de Prontidão
        </h2>
        <p className="text-muted-foreground">
          Avalie sua preparação em 3 dimensões
        </p>
        {readinessInfo && readinessAssessment && (
          <Badge className={cn("mt-2", readinessInfo.color)}>
            {readinessInfo.label} • {readinessAssessment.total_score}%
          </Badge>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex p-1 bg-muted rounded-xl">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.key;
          const isComplete = isCategoryComplete(cat.key);
          const score = getCategoryScore(cat.key);
          
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-lg transition-all font-medium text-sm relative",
                isActive 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? cat.color : "")} />
              <span className="hidden sm:inline">{cat.label}</span>
              {isComplete && (
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              {score !== null && score > 0 && (
                <span className="text-xs opacity-60">{score}%</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <AnimatePresence mode="wait">
        {categories.map(cat => {
          if (activeTab !== cat.key) return null;
          const questions = READINESS_QUESTIONS[cat.key];
          
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {questions.map((q, index) => {
                const value = answers[cat.key][index];
                
                return (
                  <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-xl">
                    <p className="font-medium text-sm">{q.question}</p>
                    <div className="flex gap-2">
                      {[1, 3, 5, 7, 10].map(level => (
                        <button
                          key={level}
                          onClick={() => handleAnswerChange(cat.key, index, level)}
                          className={cn(
                            "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                            value === level 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-background border hover:border-primary/50"
                          )}
                        >
                          {level === 1 ? '👎' : level === 3 ? '😕' : level === 5 ? '😐' : level === 7 ? '🙂' : '👍'}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}

              <Button
                onClick={() => handleSaveCategory(cat.key)}
                disabled={Object.keys(answers[cat.key]).length !== questions.length || isSaving}
                className="w-full h-12 gap-2"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isCategoryComplete(cat.key) ? 'Atualizar' : 'Salvar'} {cat.label}
              </Button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Continue */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 border-t"
        >
          <Button onClick={onComplete} className="w-full h-12 gap-2" size="lg">
            Continuar
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
