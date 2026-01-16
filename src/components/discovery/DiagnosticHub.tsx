import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Heart, Shuffle, TrendingUp, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { DIAGNOSTIC_TESTS, DiagnosticType } from '@/types/discovery';
import { useDiscovery } from '@/hooks/useDiscovery';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = { Brain, Heart, Shuffle, TrendingUp };

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
      const scores: Record<string, number> = {};
      const totalQuestions = questions.length;
      const answeredCount = Object.keys(answers).length;
      scores.completion = (answeredCount / totalQuestions) * 100;
      scores.tendency = Object.values(answers).reduce((acc, v) => acc + v, 0) / answeredCount;
      
      let summary = '';
      switch (activeTest) {
        case 'personality':
          summary = scores.tendency < 1.5 ? 'Perfil Extrovertido' : scores.tendency < 2.5 ? 'Perfil Equilibrado' : 'Perfil Analítico';
          break;
        case 'motivators':
          summary = scores.tendency < 1.5 ? 'Motivado por Reconhecimento' : scores.tendency < 2.5 ? 'Motivado por Propósito' : 'Motivado por Autonomia';
          break;
        case 'transferable_skills':
          summary = scores.tendency < 1.5 ? 'Forte em Liderança' : scores.tendency < 2.5 ? 'Forte em Execução' : 'Forte em Criatividade';
          break;
        case 'maturity':
          summary = scores.tendency < 1 ? 'Alta Maturidade' : scores.tendency < 2 ? 'Maturidade em Desenvolvimento' : 'Maturidade Inicial';
          break;
      }
      saveDiagnosticResult(activeTest, answers, scores, summary);
      setActiveTest(null);
    }
  };

  // Test in progress
  if (activeTest) {
    const questions = diagnosticQuestions[activeTest];
    const testInfo = DIAGNOSTIC_TESTS.find(t => t.type === activeTest)!;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="w-full max-w-xl mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            {currentQuestion + 1}/{questions.length}
          </span>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-center">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = answers[currentQuestion] === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left transition-all border-2",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-5 w-5 rounded-full border-2 flex items-center justify-center",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}>
                        {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={() => currentQuestion === 0 ? setActiveTest(null) : setCurrentQuestion(prev => prev - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentQuestion === 0 ? 'Cancelar' : 'Anterior'}
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={answers[currentQuestion] === undefined}
            className="gap-2"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Test selection
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Hub de Diagnósticos</h2>
        <p className="text-muted-foreground">Mapeie seu perfil profissional</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {DIAGNOSTIC_TESTS.map((test) => {
          const Icon = iconMap[test.icon];
          const isCompleted = getTestStatus(test.type) === 'completed';

          return (
            <button
              key={test.type}
              onClick={() => handleStartTest(test.type)}
              className={cn(
                "p-4 rounded-xl text-left transition-all border-2 group",
                isCompleted 
                  ? "border-emerald-500/30 bg-emerald-500/5" 
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  isCompleted ? "bg-emerald-500/20" : "bg-primary/10"
                )}>
                  {Icon && <Icon className={cn("h-5 w-5", isCompleted ? "text-emerald-500" : "text-primary")} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{test.title}</h3>
                    {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{test.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {test.questions} perguntas • ~{test.estimatedTime}min
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {diagnosticResults.filter(r => r.completed_at).length > 0 && (
        <div className="pt-6 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Seus resultados</h3>
          <div className="flex flex-wrap gap-2">
            {diagnosticResults.filter(r => r.completed_at).map(result => (
              <Badge key={result.id} variant="secondary">
                {result.result_summary}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
