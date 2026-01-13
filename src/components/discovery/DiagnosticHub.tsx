import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Brain, Heart, Shuffle, TrendingUp, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { DIAGNOSTIC_TESTS, DiagnosticType } from '@/types/discovery';
import { useDiscovery } from '@/hooks/useDiscovery';
import { motion, AnimatePresence } from 'framer-motion';

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Heart,
  Shuffle,
  TrendingUp,
};

// Sample questions for each diagnostic type
const diagnosticQuestions: Record<DiagnosticType, { question: string; options: string[] }[]> = {
  personality: [
    { question: 'Em situações sociais, você geralmente:', options: ['Prefere liderar conversas', 'Prefere ouvir e observar', 'Depende do contexto', 'Evita situações sociais'] },
    { question: 'Quando enfrenta um problema complexo:', options: ['Age rapidamente com intuição', 'Analisa cuidadosamente antes de agir', 'Busca opiniões de outros', 'Adia até ter mais informações'] },
    { question: 'Seu ambiente de trabalho ideal é:', options: ['Dinâmico e cheio de interações', 'Calmo e focado', 'Flexível entre os dois', 'Trabalho remoto/isolado'] },
    { question: 'Você se considera mais:', options: ['Prático e realista', 'Criativo e visionário', 'Analítico e lógico', 'Empático e intuitivo'] },
    { question: 'Diante de mudanças, você:', options: ['Abraça rapidamente', 'Precisa de tempo para adaptar', 'Resiste inicialmente', 'Depende do tipo de mudança'] },
  ],
  motivators: [
    { question: 'O que mais te motiva no trabalho?', options: ['Reconhecimento e status', 'Autonomia e liberdade', 'Impacto positivo no mundo', 'Estabilidade e segurança'] },
    { question: 'Você prefere trabalhar:', options: ['Por desafios intelectuais', 'Por conexões humanas', 'Por resultados financeiros', 'Por propósito maior'] },
    { question: 'O que te faz sair da cama animado?', options: ['Aprender algo novo', 'Ajudar outras pessoas', 'Alcançar metas', 'Criar algo único'] },
    { question: 'Quando você se sente mais realizado?', options: ['Ao resolver problemas complexos', 'Ao liderar uma equipe', 'Ao ver resultados tangíveis', 'Ao inovar e criar'] },
  ],
  transferable_skills: [
    { question: 'Qual habilidade você mais utiliza atualmente?', options: ['Comunicação', 'Análise de dados', 'Gestão de projetos', 'Relacionamento interpessoal'] },
    { question: 'As pessoas mais te procuram para:', options: ['Resolver conflitos', 'Organizar processos', 'Ter ideias criativas', 'Tomar decisões difíceis'] },
    { question: 'Você aprende melhor:', options: ['Fazendo na prática', 'Lendo e estudando', 'Discutindo com outros', 'Observando exemplos'] },
    { question: 'Em equipe, você naturalmente assume o papel de:', options: ['Líder/coordenador', 'Executor/realizador', 'Criativo/inovador', 'Mediador/facilitador'] },
    { question: 'Sua maior força profissional é:', options: ['Pensamento estratégico', 'Execução detalhada', 'Networking', 'Adaptabilidade'] },
  ],
  maturity: [
    { question: 'Como você lida com feedback negativo?', options: ['Aceito e uso para melhorar', 'Fico desconfortável mas reflito', 'Tendo a me defender', 'Ignoro ou fico ressentido'] },
    { question: 'Sua postura diante de erros é:', options: ['Assumo e aprendo', 'Busco entender o que aconteceu', 'Procuro justificativas', 'Evito falar sobre'] },
    { question: 'Diante de incertezas na carreira:', options: ['Me sinto confortável', 'Fico ansioso mas sigo', 'Preciso de muita segurança', 'Paraliso e não ajo'] },
  ],
};

export function DiagnosticHub() {
  const { diagnosticResults, saveDiagnosticResult } = useDiscovery();
  const [activeTest, setActiveTest] = useState<DiagnosticType | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const getTestStatus = (type: DiagnosticType) => {
    const result = diagnosticResults.find(r => r.diagnostic_type === type);
    return result?.completed_at ? 'completed' : 'pending';
  };

  const handleStartTest = (type: DiagnosticType) => {
    setActiveTest(type);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }));
  };

  const handleNext = () => {
    if (!activeTest) return;
    const questions = diagnosticQuestions[activeTest];
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate scores and save
      const scores: Record<string, number> = {};
      const totalQuestions = questions.length;
      const answeredCount = Object.keys(answers).length;
      
      // Simple scoring based on answer distribution
      scores.completion = (answeredCount / totalQuestions) * 100;
      scores.tendency = Object.values(answers).reduce((acc, v) => acc + v, 0) / answeredCount;
      
      // Generate summary based on test type
      let summary = '';
      switch (activeTest) {
        case 'personality':
          summary = scores.tendency < 1.5 ? 'Perfil Extrovertido e Dinâmico' : 
                   scores.tendency < 2.5 ? 'Perfil Equilibrado e Adaptável' : 'Perfil Analítico e Introspectivo';
          break;
        case 'motivators':
          summary = scores.tendency < 1.5 ? 'Motivado por Reconhecimento' : 
                   scores.tendency < 2.5 ? 'Motivado por Propósito' : 'Motivado por Autonomia';
          break;
        case 'transferable_skills':
          summary = scores.tendency < 1.5 ? 'Forte em Liderança e Comunicação' : 
                   scores.tendency < 2.5 ? 'Forte em Execução e Organização' : 'Forte em Criatividade e Inovação';
          break;
        case 'maturity':
          summary = scores.tendency < 1 ? 'Alta Maturidade Profissional' : 
                   scores.tendency < 2 ? 'Maturidade em Desenvolvimento' : 'Maturidade Inicial';
          break;
      }

      saveDiagnosticResult(activeTest, answers, scores, summary);
      setActiveTest(null);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  if (activeTest) {
    const questions = diagnosticQuestions[activeTest];
    const testInfo = DIAGNOSTIC_TESTS.find(t => t.type === activeTest)!;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = iconMap[testInfo.icon];
                return Icon ? <Icon className="h-5 w-5 text-primary" /> : null;
              })()}
              {testInfo.title}
            </CardTitle>
            <Badge variant="outline">
              {currentQuestion + 1} / {questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium">{questions[currentQuestion].question}</h3>
              
              <RadioGroup
                value={answers[currentQuestion]?.toString()}
                onValueChange={(value) => handleAnswer(parseInt(value))}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => currentQuestion === 0 ? setActiveTest(null) : handleBack()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {currentQuestion === 0 ? 'Cancelar' : 'Voltar'}
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[currentQuestion] === undefined}
                >
                  {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Hub de Diagnósticos</h2>
        <p className="text-muted-foreground">
          Complete os diagnósticos para mapear seu perfil profissional
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {DIAGNOSTIC_TESTS.map((test) => {
          const Icon = iconMap[test.icon];
          const status = getTestStatus(test.type);
          const isCompleted = status === 'completed';

          return (
            <Card 
              key={test.type}
              className={`relative transition-all ${isCompleted ? 'border-green-500/50 bg-green-500/5' : 'hover:border-primary/50'}`}
            >
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {Icon && <Icon className="h-5 w-5 text-primary" />}
                  {test.title}
                </CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {test.questions} perguntas • ~{test.estimatedTime} min
                  </div>
                  <Button
                    variant={isCompleted ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleStartTest(test.type)}
                  >
                    {isCompleted ? 'Refazer' : 'Iniciar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {diagnosticResults.length > 0 && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Seus Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {diagnosticResults.filter(r => r.completed_at).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <span className="font-medium capitalize">{result.diagnostic_type.replace('_', ' ')}</span>
                  <Badge variant="secondary">{result.result_summary}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
