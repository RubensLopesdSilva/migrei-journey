import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { Heart, Wallet, Briefcase, Check, AlertCircle, Loader2 } from 'lucide-react';
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
      [category]: {
        ...prev[category],
        [questionIndex]: value
      }
    }));
  };

  const handleSaveCategory = async (category: ReadinessCategory) => {
    const questions = READINESS_QUESTIONS[category];
    const categoryAnswers = answers[category];
    
    // Check if all questions are answered
    if (Object.keys(categoryAnswers).length !== questions.length) {
      return;
    }

    setIsSaving(true);
    const answersToSave: ReadinessAnswer[] = questions.map((q, i) => ({
      question: q.question,
      value: categoryAnswers[i] ?? 5,
      weight: q.weight
    }));

    await saveReadinessAssessment(category, answersToSave);
    setIsSaving(false);

    // Move to next tab or complete
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

  const getReadinessLabel = (level: string | undefined) => {
    switch (level) {
      case 'not_ready': return { label: 'Não pronto', color: 'text-destructive', bg: 'bg-destructive/10' };
      case 'preparing': return { label: 'Em preparação', color: 'text-amber-600', bg: 'bg-amber-500/10' };
      case 'ready': return { label: 'Pronto para avançar', color: 'text-emerald-600', bg: 'bg-emerald-500/10' };
      default: return { label: 'Não avaliado', color: 'text-muted-foreground', bg: 'bg-muted' };
    }
  };

  const readinessInfo = getReadinessLabel(readinessAssessment?.readiness_level);

  return (
    <Card className="w-full max-w-3xl mx-auto card-elevated">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Teste de Prontidão</CardTitle>
        <CardDescription>
          Avalie sua preparação para a transição de carreira em três dimensões
        </CardDescription>

        {readinessAssessment && readinessAssessment.total_score > 0 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <Badge className={cn("text-sm", readinessInfo.bg, readinessInfo.color)}>
              {readinessInfo.label}
            </Badge>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Score geral: <strong className="text-foreground">{readinessAssessment.total_score}%</strong></span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <AnimatedTabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReadinessCategory)}>
          <AnimatedTabsList className="grid grid-cols-3 mb-6">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isComplete = isCategoryComplete(cat.key);
              const score = getCategoryScore(cat.key);

              return (
                <AnimatedTabsTrigger key={cat.key} value={cat.key} className="relative">
                  <Icon className={cn("h-4 w-4 mr-2", cat.color)} aria-hidden="true" />
                  {cat.label}
                  {isComplete && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" aria-hidden="true" />
                    </div>
                  )}
                  {score !== null && score > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">{score}%</span>
                  )}
                </AnimatedTabsTrigger>
              );
            })}
          </AnimatedTabsList>

          {categories.map(cat => (
            <AnimatedTabsContent key={cat.key} value={cat.key} className="space-y-6">
              {READINESS_QUESTIONS[cat.key].map((q, index) => {
                const value = answers[cat.key][index] ?? 5;
                return (
                  <div key={index} className="space-y-3 p-4 rounded-lg bg-muted/30">
                    <p className="font-medium">{q.question}</p>
                    <Slider
                      value={[value]}
                      onValueChange={([v]) => handleAnswerChange(cat.key, index, v)}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Discordo</span>
                      <span className="font-medium text-foreground">{value}/10</span>
                      <span>Concordo</span>
                    </div>
                  </div>
                );
              })}

              <Button
                onClick={() => handleSaveCategory(cat.key)}
                disabled={Object.keys(answers[cat.key]).length !== READINESS_QUESTIONS[cat.key].length || isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                ) : isCategoryComplete(cat.key) ? (
                  <Check className="h-4 w-4 mr-2" aria-hidden="true" />
                ) : null}
                {isCategoryComplete(cat.key) ? 'Atualizar' : 'Salvar'} avaliação {cat.label.toLowerCase()}
              </Button>
            </AnimatedTabsContent>
          ))}
        </AnimatedTabs>

        {allComplete && (
          <div className="mt-6 pt-6 border-t">
            <Button onClick={onComplete} className="w-full" size="lg">
              Continuar para próxima etapa
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
