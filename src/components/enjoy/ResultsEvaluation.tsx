import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, BarChart3, Save } from 'lucide-react';
import { EVALUATION_DIMENSIONS } from '@/types/enjoy';
import type { ResultsEvaluation as ResultsEvaluationType } from '@/types/enjoy';

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

  const handleSave = async () => {
    const dimScores = scores[currentDimension.key];
    await onSave(currentDimension.key, dimScores.before, dimScores.after, dimScores.reflection);
  };

  const getTrendIcon = (before: number, after: number) => {
    const diff = after - before;
    if (diff > 0) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (diff < 0) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getImprovementLabel = (before: number, after: number) => {
    const diff = after - before;
    if (diff > 3) return { text: 'Evolução Excepcional', variant: 'default' as const };
    if (diff > 0) return { text: 'Evolução Positiva', variant: 'secondary' as const };
    if (diff === 0) return { text: 'Estável', variant: 'outline' as const };
    return { text: 'Área de Atenção', variant: 'destructive' as const };
  };

  const overallProgress = EVALUATION_DIMENSIONS.reduce((acc, dim) => {
    const s = scores[dim.key];
    return acc + (s.after - s.before);
  }, 0);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Avaliação de Resultados: Antes × Depois
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Evolução Total</p>
              <p className="text-2xl font-bold text-primary">
                {overallProgress > 0 ? '+' : ''}{overallProgress} pontos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Dimensões Avaliadas</p>
              <p className="text-2xl font-bold">{evaluations.length}/{EVALUATION_DIMENSIONS.length}</p>
            </div>
          </div>
        </div>

        {/* Dimension Selector */}
        <div className="flex flex-wrap gap-2">
          {EVALUATION_DIMENSIONS.map((dim, idx) => {
            const existing = evaluations.find(e => e.dimension === dim.key);
            return (
              <Button
                key={dim.key}
                variant={activeIndex === idx ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveIndex(idx)}
                className="relative"
              >
                {dim.label}
                {existing && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </Button>
            );
          })}
        </div>

        {/* Active Dimension Evaluation */}
        <div className="space-y-6 p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-semibold text-lg">{currentDimension.label}</h3>
            <p className="text-sm text-muted-foreground">{currentDimension.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Before Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Antes da Jornada</span>
                <span className="text-2xl font-bold text-muted-foreground">
                  {scores[currentDimension.key].before}
                </span>
              </div>
              <Slider
                value={[scores[currentDimension.key].before]}
                onValueChange={([value]) => 
                  setScores(prev => ({
                    ...prev,
                    [currentDimension.key]: { ...prev[currentDimension.key], before: value }
                  }))
                }
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muito baixo</span>
                <span>Muito alto</span>
              </div>
            </div>

            {/* After Score */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Depois da Jornada</span>
                <span className="text-2xl font-bold text-primary">
                  {scores[currentDimension.key].after}
                </span>
              </div>
              <Slider
                value={[scores[currentDimension.key].after]}
                onValueChange={([value]) => 
                  setScores(prev => ({
                    ...prev,
                    [currentDimension.key]: { ...prev[currentDimension.key], after: value }
                  }))
                }
                min={1}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Muito baixo</span>
                <span>Muito alto</span>
              </div>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-center gap-3 p-3 bg-background rounded-lg">
            {getTrendIcon(scores[currentDimension.key].before, scores[currentDimension.key].after)}
            <Badge variant={getImprovementLabel(scores[currentDimension.key].before, scores[currentDimension.key].after).variant}>
              {getImprovementLabel(scores[currentDimension.key].before, scores[currentDimension.key].after).text}
            </Badge>
            <span className="text-sm">
              {scores[currentDimension.key].after - scores[currentDimension.key].before > 0 ? '+' : ''}
              {scores[currentDimension.key].after - scores[currentDimension.key].before} pontos
            </span>
          </div>

          {/* Reflection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reflexão sobre essa evolução</label>
            <Textarea
              placeholder="O que contribuiu para essa mudança? O que você aprendeu?"
              value={scores[currentDimension.key].reflection}
              onChange={(e) => 
                setScores(prev => ({
                  ...prev,
                  [currentDimension.key]: { ...prev[currentDimension.key], reflection: e.target.value }
                }))
              }
              rows={3}
            />
          </div>

          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Salvar Avaliação
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
