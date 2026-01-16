import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Target, 
  Heart,
  TrendingUp,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useAwakening } from '@/hooks/useAwakening';
import { AwakeningResponsesSummary } from './AwakeningResponsesSummary';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';

interface PhaseEvaluationProps {
  onComplete: () => void;
}

interface EvaluationResult {
  satisfactionLevel: 'low' | 'medium' | 'high';
  commitmentLevel: 'low' | 'medium' | 'high';
  readinessLevel: 'not_ready' | 'preparing' | 'ready';
  overallScore: number;
  insights: string[];
  recommendation: string;
  motivationalMessage: string;
}

export function PhaseEvaluation({ onComplete }: PhaseEvaluationProps) {
  const { consciousnessResponses, readinessAssessment, painMap, commitment } = useAwakening();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    analyzeResponses();
  }, []);

  const analyzeResponses = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay for UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate satisfaction from consciousness responses
    const avgConsciousness = consciousnessResponses.length > 0
      ? consciousnessResponses.reduce((sum, r) => sum + r.response_value, 0) / consciousnessResponses.length
      : 5;
    
    const satisfactionLevel: 'low' | 'medium' | 'high' = 
      avgConsciousness <= 4 ? 'low' : avgConsciousness <= 7 ? 'medium' : 'high';

    // Calculate readiness from assessment
    const readinessScore = readinessAssessment 
      ? (readinessAssessment.emotional_score + readinessAssessment.financial_score + readinessAssessment.professional_score) / 3
      : 50;
    
    const readinessLevel: 'not_ready' | 'preparing' | 'ready' = 
      readinessScore < 40 ? 'not_ready' : readinessScore < 70 ? 'preparing' : 'ready';

    // Calculate commitment from pain points and declaration
    const painIntensity = painMap.length > 0
      ? painMap.reduce((sum, p) => sum + p.intensity, 0) / painMap.length
      : 5;
    
    const hasCommitment = !!commitment;
    const commitmentLevel: 'low' | 'medium' | 'high' = 
      !hasCommitment ? 'low' : painIntensity < 5 ? 'medium' : 'high';

    // Calculate overall score
    const overallScore = Math.round(
      (avgConsciousness * 10 + readinessScore + (hasCommitment ? 100 : 0)) / 3
    );

    // Generate insights based on data
    const insights: string[] = [];
    
    if (satisfactionLevel === 'low') {
      insights.push('Você demonstrou clareza sobre sua insatisfação atual - isso é um motor poderoso para mudança.');
    } else if (satisfactionLevel === 'high') {
      insights.push('Apesar de alguma satisfação, você reconhece a necessidade de evolução.');
    }

    if (readinessLevel === 'ready') {
      insights.push('Sua preparação emocional, financeira e profissional está em bom nível.');
    } else if (readinessLevel === 'preparing') {
      insights.push('Há pontos a fortalecer na sua preparação, que abordaremos nas próximas fases.');
    } else {
      insights.push('Identificamos áreas que precisam atenção - a Fase 2 vai ajudar nisso.');
    }

    if (painMap.length > 0) {
      const dominantPain = painMap.reduce((prev, curr) => 
        curr.intensity > prev.intensity ? curr : prev
      );
      const painTypeNames = { hurts: 'dói', tires: 'cansa', frustrates: 'frustra' };
      insights.push(`O que mais ${painTypeNames[dominantPain.pain_type]} será nosso foco de transformação.`);
    }

    // Generate recommendation
    let recommendation = '';
    if (overallScore >= 70) {
      recommendation = 'Você está muito bem preparado! A Fase 2 vai acelerar sua descoberta profissional.';
    } else if (overallScore >= 50) {
      recommendation = 'Você tem uma boa base. A Fase 2 vai fortalecer seu autoconhecimento.';
    } else {
      recommendation = 'Cada jornada começa com um primeiro passo. A Fase 2 vai construir sua confiança.';
    }

    // Generate motivational message based on profile
    const motivationalMessages = {
      ready: '🚀 Você está pronto para decolar! Sua consciência está desperta e sua determinação é evidente. A Fase 2 vai revelar todo seu potencial.',
      preparing: '💪 Você deu passos importantes! Reconhecer onde está é o primeiro passo para chegar onde quer. A Fase 2 vai iluminar seu caminho.',
      not_ready: '🌱 Toda grande transformação começa com uma semente de consciência. Você plantou a sua. A Fase 2 vai nutrir seu crescimento.'
    };

    setEvaluation({
      satisfactionLevel,
      commitmentLevel,
      readinessLevel,
      overallScore,
      insights,
      recommendation,
      motivationalMessage: motivationalMessages[readinessLevel]
    });

    setIsAnalyzing(false);
    setTimeout(() => setShowResults(true), 500);
  };

  const handleProceed = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    setTimeout(onComplete, 1000);
  };

  const getLevelColor = (level: 'low' | 'medium' | 'high' | 'not_ready' | 'preparing' | 'ready') => {
    const colors = {
      low: 'text-amber-500',
      medium: 'text-blue-500',
      high: 'text-emerald-500',
      not_ready: 'text-amber-500',
      preparing: 'text-blue-500',
      ready: 'text-emerald-500'
    };
    return colors[level];
  };

  const getLevelLabel = (level: 'low' | 'medium' | 'high' | 'not_ready' | 'preparing' | 'ready') => {
    const labels = {
      low: 'Inicial',
      medium: 'Moderado',
      high: 'Elevado',
      not_ready: 'Preparando',
      preparing: 'Em progresso',
      ready: 'Pronto'
    };
    return labels[level];
  };

  if (isAnalyzing) {
    return (
      <div className="w-full max-w-lg mx-auto text-center space-y-8 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
            >
              <Brain className="h-10 w-10 text-primary" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 h-20 w-20 mx-auto rounded-full bg-primary/10"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Analisando suas respostas...</h2>
            <p className="text-muted-foreground text-sm">
              A IA está avaliando seu perfil para um fechamento personalizado
            </p>
          </div>

          <div className="flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                className="h-2 w-2 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!evaluation) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tabs for Evaluation and Responses Summary */}
            <Tabs defaultValue="evaluation" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="evaluation" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Avaliação IA
                </TabsTrigger>
                <TabsTrigger value="responses" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Suas Respostas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="evaluation" className="space-y-6 mt-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40"
                  >
                    <Sparkles className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Avaliação da Fase 1</h2>
                  <p className="text-muted-foreground">
                    Seu perfil de despertar profissional
                  </p>
                </div>

                {/* Overall Score */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium">Pontuação Geral</span>
                      <span className="text-3xl font-bold text-primary">{evaluation.overallScore}%</span>
                    </div>
                    <Progress value={evaluation.overallScore} className="h-3" />
                  </Card>
                </motion.div>

                {/* Metrics Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <Card className="p-4 text-center">
                    <Heart className={cn("h-6 w-6 mx-auto mb-2", getLevelColor(evaluation.satisfactionLevel))} />
                    <p className="text-xs text-muted-foreground mb-1">Consciência</p>
                    <p className={cn("text-sm font-semibold", getLevelColor(evaluation.satisfactionLevel))}>
                      {getLevelLabel(evaluation.satisfactionLevel)}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <Target className={cn("h-6 w-6 mx-auto mb-2", getLevelColor(evaluation.readinessLevel))} />
                    <p className="text-xs text-muted-foreground mb-1">Prontidão</p>
                    <p className={cn("text-sm font-semibold", getLevelColor(evaluation.readinessLevel))}>
                      {getLevelLabel(evaluation.readinessLevel)}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <TrendingUp className={cn("h-6 w-6 mx-auto mb-2", getLevelColor(evaluation.commitmentLevel))} />
                    <p className="text-xs text-muted-foreground mb-1">Comprometimento</p>
                    <p className={cn("text-sm font-semibold", getLevelColor(evaluation.commitmentLevel))}>
                      {getLevelLabel(evaluation.commitmentLevel)}
                    </p>
                  </Card>
                </motion.div>

                {/* Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="p-5">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Insights da IA
                    </h3>
                    <ul className="space-y-3">
                      {evaluation.insights.map((insight, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{insight}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </Card>
                </motion.div>

                {/* Motivational Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Card className="p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border-emerald-500/20">
                    <p className="text-lg font-medium text-center leading-relaxed">
                      {evaluation.motivationalMessage}
                    </p>
                  </Card>
                </motion.div>

                {/* Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="p-4 rounded-xl bg-muted/50 border"
                >
                  <p className="text-sm text-center text-muted-foreground">
                    <strong>Próximo passo:</strong> {evaluation.recommendation}
                  </p>
                </motion.div>
              </TabsContent>

              <TabsContent value="responses" className="mt-6">
                <AwakeningResponsesSummary />
              </TabsContent>
            </Tabs>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <Button 
                onClick={handleProceed}
                size="lg"
                className="w-full h-14 text-lg gap-3"
              >
                Avançar para Fase 2: Descobrir
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
