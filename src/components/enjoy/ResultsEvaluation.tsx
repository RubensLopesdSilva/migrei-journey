import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { EVALUATION_DIMENSIONS } from '@/types/enjoy';
import type { ResultsEvaluation as ResultsEvaluationType } from '@/types/enjoy';
import { cn } from '@/lib/utils';

interface Props {
  evaluations: ResultsEvaluationType[];
  onSave: (dimension: string, beforeScore: number, afterScore: number, reflection?: string) => Promise<void>;
}

export const ResultsEvaluation = ({ evaluations, onSave }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, { before: number; after: number; reflection: string }>>(() => {
    const initial: Record<string, { before: number; after: number; reflection: string }> = {};
    EVALUATION_DIMENSIONS.forEach(dim => {
      const existing = evaluations.find(e => e.dimension === dim.key);
      initial[dim.key] = {
        before: existing?.before_score || 5,
        after: existing?.after_score || 5,
        reflection: existing?.reflection || '',
      };
    });
    return initial;
  });

  const currentDimension = EVALUATION_DIMENSIONS[activeIndex];
  const currentScores = scores[currentDimension.key];

  const handleSave = async () => {
    await onSave(currentDimension.key, currentScores.before, currentScores.after, currentScores.reflection);
    if (activeIndex < EVALUATION_DIMENSIONS.length - 1) {
      setActiveIndex(prev => prev + 1);
    }
  };

  const getTrend = (before: number, after: number) => {
    const diff = after - before;
    if (diff > 0) return { icon: TrendingUp, color: 'text-emerald-500', label: 'Evolução' };
    if (diff < 0) return { icon: TrendingDown, color: 'text-rose-500', label: 'Atenção' };
    return { icon: Minus, color: 'text-muted-foreground', label: 'Estável' };
  };

  const overallProgress = EVALUATION_DIMENSIONS.reduce((acc, dim) => {
    const s = scores[dim.key];
    return acc + (s.after - s.before);
  }, 0);

  const completedCount = evaluations.length;
  const progress = ((activeIndex + 1) / EVALUATION_DIMENSIONS.length) * 100;
  const trend = getTrend(currentScores.before, currentScores.after);
  const TrendIcon = trend.icon;

  const ScoreSelector = ({ value, onChange, label, isPrimary }: { value: number; onChange: (v: number) => void; label: string; isPrimary?: boolean }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn("text-2xl font-bold", isPrimary ? "text-primary" : "text-muted-foreground")}>{value}</span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              "flex-1 h-10 rounded text-sm font-medium transition-all",
              value >= n 
                ? (isPrimary ? "bg-primary text-primary-foreground" : "bg-muted-foreground/30 text-foreground")
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Avaliação de Resultados</h2>
        <p className="text-muted-foreground">Compare seu antes e depois</p>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4">
        <div>
          <p className="text-sm text-muted-foreground">Evolução total</p>
          <p className="text-2xl font-bold text-primary">
            {overallProgress > 0 ? '+' : ''}{overallProgress} pts
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Avaliadas</p>
          <p className="text-2xl font-bold">{completedCount}/{EVALUATION_DIMENSIONS.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-muted-foreground">{activeIndex + 1}/{EVALUATION_DIMENSIONS.length}</span>
      </div>

      {/* Dimension Evaluation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          <div className="p-5 bg-muted/30 rounded-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{currentDimension.label}</h3>
                {evaluations.find(e => e.dimension === currentDimension.key) && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{currentDimension.description}</p>
            </div>

            <ScoreSelector
              value={currentScores.before}
              onChange={(v) => setScores(p => ({ ...p, [currentDimension.key]: { ...p[currentDimension.key], before: v } }))}
              label="Antes da jornada"
            />

            <ScoreSelector
              value={currentScores.after}
              onChange={(v) => setScores(p => ({ ...p, [currentDimension.key]: { ...p[currentDimension.key], after: v } }))}
              label="Depois da jornada"
              isPrimary
            />

            {/* Trend */}
            <div className="flex items-center justify-center gap-3 p-3 bg-background rounded-lg">
              <TrendIcon className={cn("h-5 w-5", trend.color)} />
              <span className="font-medium">{trend.label}</span>
              <Badge variant="outline">
                {currentScores.after - currentScores.before > 0 ? '+' : ''}{currentScores.after - currentScores.before} pts
              </Badge>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Reflexão</label>
              <Textarea
                placeholder="O que contribuiu para essa mudança?"
                value={currentScores.reflection}
                onChange={(e) => setScores(p => ({ ...p, [currentDimension.key]: { ...p[currentDimension.key], reflection: e.target.value } }))}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setActiveIndex(p => p - 1)}
          disabled={activeIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button onClick={handleSave} className="flex-1 gap-2">
          {activeIndex === EVALUATION_DIMENSIONS.length - 1 ? 'Concluir' : 'Salvar e continuar'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
