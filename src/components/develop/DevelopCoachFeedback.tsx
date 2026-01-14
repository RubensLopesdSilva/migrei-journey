import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, ThumbsUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import type { DevelopCoachFeedback as DevelopCoachFeedbackType } from '@/types/develop';

interface DevelopCoachFeedbackProps {
  feedback: DevelopCoachFeedbackType[];
  phaseProgress: number;
  onRequestFeedback?: () => void;
  onComplete?: () => void;
}

export function DevelopCoachFeedback({
  feedback,
  phaseProgress,
  onRequestFeedback,
  onComplete
}: DevelopCoachFeedbackProps) {
  const [isLoading, setIsLoading] = useState(false);
  const latestFeedback = feedback[0];

  const handleRequestFeedback = async () => {
    if (!onRequestFeedback) return;
    setIsLoading(true);
    await onRequestFeedback();
    setIsLoading(false);
    if (onComplete) onComplete();
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle>Feedback do Avatar Coach</CardTitle>
              <p className="text-sm text-muted-foreground">
                Análise personalizada do seu preparo
              </p>
            </div>
          </div>
          <Button 
            onClick={handleRequestFeedback}
            disabled={isLoading || phaseProgress < 30}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {latestFeedback ? 'Atualizar Feedback' : 'Solicitar Feedback'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readiness meter */}
        <Card className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Prontidão para o Mercado</h4>
              <span className="text-2xl font-bold text-orange-600">
                {latestFeedback?.overall_readiness || phaseProgress}%
              </span>
            </div>
            <Progress 
              value={latestFeedback?.overall_readiness || phaseProgress} 
              className="h-3"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Iniciante</span>
              <span>Em desenvolvimento</span>
              <span>Pronto</span>
            </div>
          </CardContent>
        </Card>

        {latestFeedback ? (
          <div className="space-y-4">
            {/* Strengths */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  Pontos Fortes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(latestFeedback.strengths || []).map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      {strength}
                    </li>
                  ))}
                  {(!latestFeedback.strengths || latestFeedback.strengths.length === 0) && (
                    <li className="text-sm text-muted-foreground">
                      Continue trabalhando nos itens da fase para receber feedback detalhado
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Improvements */}
            <Card className="border-yellow-200 dark:border-yellow-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  Ajustes Necessários
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(latestFeedback.improvements || []).map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      {improvement}
                    </li>
                  ))}
                  {(!latestFeedback.improvements || latestFeedback.improvements.length === 0) && (
                    <li className="text-sm text-muted-foreground">
                      Nenhum ajuste identificado no momento
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Action items */}
            {latestFeedback.action_items && latestFeedback.action_items.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Próximos Passos Recomendados</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {latestFeedback.action_items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Badge variant="outline" className="mt-0.5">{i + 1}</Badge>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <p className="text-xs text-center text-muted-foreground">
              Último feedback: {new Date(latestFeedback.generated_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">Nenhum feedback ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {phaseProgress < 30 
                ? 'Complete pelo menos 30% da fase para solicitar feedback' 
                : 'Solicite uma análise personalizada do seu progresso'}
            </p>
            {phaseProgress >= 30 && (
              <Button onClick={handleRequestFeedback} disabled={isLoading}>
                <Sparkles className="w-4 h-4 mr-2" />
                Solicitar Primeiro Feedback
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
