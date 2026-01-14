import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Video, Play, RotateCcw, CheckCircle2, 
  Lightbulb, AlertCircle, ChevronRight, Star
} from 'lucide-react';
import { useLaunch } from '@/hooks/useLaunch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { INTERVIEW_AREAS, INTERVIEW_QUESTIONS, type InterviewSimulation } from '@/types/launch';

interface InterviewSimulatorProps {
  onComplete?: () => void;
}

export function InterviewSimulator({ onComplete }: InterviewSimulatorProps) {
  const { simulations, addSimulation, updateSimulation } = useLaunch();
  const { toast } = useToast();
  
  const [selectedArea, setSelectedArea] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userResponse, setUserResponse] = useState('');
  const [currentSimulation, setCurrentSimulation] = useState<InterviewSimulation | null>(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const startSimulation = async () => {
    if (!selectedArea) return;
    
    const questions = INTERVIEW_QUESTIONS[selectedArea];
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    const simulation = await addSimulation({
      area: selectedArea,
      question: randomQuestion
    });
    
    if (simulation) {
      setCurrentSimulation(simulation);
      setCurrentQuestion(randomQuestion);
      setUserResponse('');
      setShowFeedback(false);
    }
  };

  const submitResponse = async () => {
    if (!currentSimulation || !userResponse.trim()) return;
    
    setIsGeneratingFeedback(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('avatar-coach', {
        body: {
          message: `Você é um entrevistador experiente avaliando uma resposta de candidato.

Área: ${selectedArea}
Pergunta: ${currentQuestion}
Resposta do candidato: ${userResponse}

Por favor, forneça:
1. Uma pontuação de 1 a 10
2. Pontos fortes da resposta
3. Áreas de melhoria
4. Uma sugestão de resposta melhorada

Responda em português brasileiro de forma construtiva e encorajadora.`,
          context: 'interview_feedback',
          phaseId: null
        }
      });
      
      if (error) throw error;
      
      const feedback = data?.response || 'Feedback não disponível no momento.';
      const scoreMatch = feedback.match(/pontuação[:\s]*(\d+)/i) || feedback.match(/nota[:\s]*(\d+)/i);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 7;
      
      await updateSimulation(currentSimulation.id, {
        user_response: userResponse,
        ai_feedback: feedback,
        score: Math.min(10, Math.max(1, score)),
        practiced_at: new Date().toISOString()
      });
      
      setCurrentSimulation({
        ...currentSimulation,
        user_response: userResponse,
        ai_feedback: feedback,
        score: Math.min(10, Math.max(1, score))
      });
      
      setShowFeedback(true);
      onComplete?.();
      
    } catch (error) {
      console.error('Error generating feedback:', error);
      toast({
        title: 'Erro ao gerar feedback',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const resetSimulation = () => {
    setCurrentSimulation(null);
    setCurrentQuestion('');
    setUserResponse('');
    setShowFeedback(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const practicedQuestions = simulations.filter(s => s.practiced_at).length;
  const averageScore = simulations.filter(s => s.score)
    .reduce((sum, s) => sum + (s.score || 0), 0) / (simulations.filter(s => s.score).length || 1);

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Simulador de Entrevistas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Pratique suas respostas e receba feedback orientativo
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{practicedQuestions}</div>
            <div className="text-xs text-muted-foreground">Perguntas Praticadas</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              {averageScore.toFixed(1)}
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="text-xs text-muted-foreground">Nota Média</div>
          </div>
        </div>

        {!currentSimulation ? (
          <>
            {/* Area Selection */}
            <div>
              <label className="text-sm font-medium">Selecione sua área</label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Escolha uma área..." />
                </SelectTrigger>
                <SelectContent>
                  {INTERVIEW_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={startSimulation} 
              disabled={!selectedArea}
              className="w-full gap-2"
            >
              <Play className="h-4 w-4" />
              Iniciar Simulação
            </Button>

            {/* Previous Simulations */}
            {simulations.filter(s => s.practiced_at).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Simulações Anteriores</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {simulations
                    .filter(s => s.practiced_at)
                    .slice(0, 5)
                    .map((sim) => (
                      <div key={sim.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{sim.area}</Badge>
                          {sim.score && (
                            <span className={`font-bold ${getScoreColor(sim.score)}`}>
                              {sim.score}/10
                            </span>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2">{sim.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(sim.practiced_at!).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        ) : !showFeedback ? (
          <>
            {/* Question */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
              <Badge variant="outline" className="mb-3">{selectedArea}</Badge>
              <h4 className="text-lg font-medium">{currentQuestion}</h4>
            </div>

            {/* Response Area */}
            <div>
              <label className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Sua Resposta
              </label>
              <Textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Digite sua resposta como se estivesse em uma entrevista real..."
                rows={6}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Dica: Responda de forma estruturada, use exemplos concretos e seja específico.
              </p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Cancelar
              </Button>
              <Button 
                onClick={submitResponse}
                disabled={!userResponse.trim() || isGeneratingFeedback}
                className="flex-1 gap-2"
              >
                {isGeneratingFeedback ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <ChevronRight className="h-4 w-4" />
                    Enviar Resposta
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Feedback Display */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Feedback da sua resposta</h4>
                {currentSimulation.score && (
                  <div className={`text-2xl font-bold ${getScoreColor(currentSimulation.score)}`}>
                    {currentSimulation.score}/10
                  </div>
                )}
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{currentSimulation.ai_feedback}</p>
              </div>

              <div className="bg-blue-500/10 rounded-lg p-4">
                <h5 className="font-medium flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  Sua Resposta Original
                </h5>
                <p className="text-sm text-muted-foreground">{currentSimulation.user_response}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={resetSimulation}
                className="flex-1 gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Nova Pergunta
              </Button>
              <Button 
                onClick={() => {
                  setShowFeedback(false);
                  setUserResponse('');
                }}
                className="flex-1 gap-2"
              >
                <Play className="h-4 w-4" />
                Tentar Novamente
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
