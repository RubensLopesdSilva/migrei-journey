import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Wallet, Briefcase, Check, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { READINESS_QUESTIONS, ReadinessCategory, ReadinessAnswer } from '@/types/awakening';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';

interface ReadinessTestProps {
  onComplete: () => void;
}

const scaleLabels = [
  { value: 1, emoji: '😟', label: 'Nada' },
  { value: 3, emoji: '😕', label: 'Pouco' },
  { value: 5, emoji: '😐', label: 'Médio' },
  { value: 7, emoji: '🙂', label: 'Bem' },
  { value: 10, emoji: '😄', label: 'Muito' }
];

export function ReadinessTest({ onComplete }: ReadinessTestProps) {
  const { readinessAssessment, saveReadinessAssessment } = useAwakening();
  const [activeTab, setActiveTab] = useState<ReadinessCategory>('emotional');
  const [answers, setAnswers] = useState<Record<ReadinessCategory, Record<number, number>>>({
    emotional: {},
    financial: {},
    professional: {}
  });
  const [isSaving, setIsSaving] = useState(false);

  const categories: { key: ReadinessCategory; label: string; icon: typeof Heart; gradient: string }[] = [
    { key: 'emotional', label: 'Emocional', icon: Heart, gradient: 'from-rose-500 to-pink-500' },
    { key: 'financial', label: 'Financeiro', icon: Wallet, gradient: 'from-emerald-500 to-teal-500' },
    { key: 'professional', label: 'Profissional', icon: Briefcase, gradient: 'from-blue-500 to-indigo-500' }
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
  const currentCategoryIndex = categories.findIndex(c => c.key === activeTab);
  const currentCategory = categories[currentCategoryIndex];

  const getReadinessInfo = (level: string | undefined) => {
    switch (level) {
      case 'not_ready': return { label: 'Em preparação', color: 'text-amber-600', bg: 'bg-amber-500/10' };
      case 'preparing': return { label: 'Quase lá', color: 'text-blue-600', bg: 'bg-blue-500/10' };
      case 'ready': return { label: 'Pronto para migrar!', color: 'text-emerald-600', bg: 'bg-emerald-500/10' };
      default: return null;
    }
  };

  const readinessInfo = getReadinessInfo(readinessAssessment?.readiness_level);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Sparkles className="h-4 w-4" />
          Diagnóstico rápido
        </div>
        <h2 className="text-2xl font-bold mb-2">
          Qual sua prontidão para a transição?
        </h2>
        <p className="text-muted-foreground">
          Responda com sinceridade — não existe certo ou errado
        </p>
      </motion.div>

      {/* Result Badge */}
      {readinessInfo && readinessAssessment && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn("flex items-center justify-center gap-2 py-3 px-4 rounded-xl mb-6", readinessInfo.bg)}
        >
          <span className={cn("font-semibold", readinessInfo.color)}>
            {readinessInfo.label}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium">{readinessAssessment.total_score}% preparado</span>
        </motion.div>
      )}

      {/* Category Navigation */}
      <div className="flex gap-2 mb-8">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.key;
          const isComplete = isCategoryComplete(cat.key);
          const score = getCategoryScore(cat.key);
          
          return (
            <button
              key={cat.key}
              onClick={() => setActiveTab(cat.key)}
              className={cn(
                "flex-1 relative p-4 rounded-2xl transition-all duration-300",
                isActive 
                  ? "bg-background shadow-lg ring-2 ring-primary/20" 
                  : "bg-muted/50 hover:bg-muted"
              )}
            >
              {/* Complete indicator */}
              {isComplete && (
                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
              
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all",
                isActive 
                  ? `bg-gradient-to-br ${cat.gradient} text-white shadow-md` 
                  : "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              <p className={cn(
                "text-sm font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {cat.label}
              </p>
              
              {score !== null && score > 0 && (
                <p className="text-xs text-muted-foreground mt-1">{score}%</p>
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
          const answeredCount = Object.keys(answers[cat.key]).length;
          
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Progress */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn("h-full rounded-full bg-gradient-to-r", cat.gradient)}
                    initial={{ width: 0 }}
                    animate={{ width: `${(answeredCount / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-muted-foreground font-medium">
                  {answeredCount}/{questions.length}
                </span>
              </div>

              {/* Question Cards */}
              <div className="space-y-4">
                {questions.map((q, index) => {
                  const value = answers[cat.key][index];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-5 rounded-2xl border-2 transition-all duration-200",
                        value !== undefined 
                          ? "border-primary/20 bg-primary/5" 
                          : "border-transparent bg-muted/30"
                      )}
                    >
                      <p className="font-medium text-[15px] mb-4">{q.question}</p>
                      
                      {/* Scale Options */}
                      <div className="flex gap-2">
                        {scaleLabels.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleAnswerChange(cat.key, index, option.value)}
                            className={cn(
                              "flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-200",
                              value === option.value 
                                ? `bg-gradient-to-br ${cat.gradient} text-white shadow-md scale-105` 
                                : "bg-background hover:bg-muted border border-border hover:border-primary/30"
                            )}
                          >
                            <span className="text-xl">{option.emoji}</span>
                            <span className={cn(
                              "text-[11px] font-medium",
                              value === option.value ? "text-white/90" : "text-muted-foreground"
                            )}>
                              {option.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Save Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={() => handleSaveCategory(cat.key)}
                  disabled={answeredCount !== questions.length || isSaving}
                  className={cn(
                    "w-full h-14 text-base font-semibold rounded-2xl transition-all",
                    answeredCount === questions.length && !isSaving
                      ? `bg-gradient-to-r ${cat.gradient} hover:opacity-90 shadow-lg`
                      : ""
                  )}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      {isCategoryComplete(cat.key) ? 'Atualizar' : 'Salvar'} e continuar
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Complete All */}
      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 pt-6 border-t"
        >
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 text-emerald-600 font-medium">
              <Check className="h-5 w-5" />
              Diagnóstico completo!
            </div>
          </div>
          <Button 
            onClick={onComplete} 
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-lg"
          >
            Avançar para próxima etapa
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
