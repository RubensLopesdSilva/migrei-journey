import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Target, 
  Frown, 
  Heart, 
  ChevronRight,
  Check,
  Eye
} from 'lucide-react';
import { useAwakening } from '@/hooks/useAwakening';
import { CONSCIOUSNESS_QUESTIONS } from '@/types/awakening';
import { cn } from '@/lib/utils';

interface AwakeningResponsesSummaryProps {
  onViewStep?: (step: string) => void;
}

export function AwakeningResponsesSummary({ onViewStep }: AwakeningResponsesSummaryProps) {
  const { consciousnessResponses, readinessAssessment, painMap, commitment } = useAwakening();

  const getScaleLabel = (value: number) => {
    const labels = ['', 'Discordo totalmente', 'Discordo', 'Neutro', 'Concordo parcialmente', 'Concordo totalmente'];
    return labels[value] || '';
  };

  const sections = [
    {
      key: 'consciousness',
      title: 'Consciência',
      icon: Brain,
      completed: consciousnessResponses.length >= 3,
      content: (
        <div className="space-y-3">
          {CONSCIOUSNESS_QUESTIONS.map((question) => {
            const response = consciousnessResponses.find(r => r.question_key === question.key);
            return (
              <div key={question.key} className="flex items-start justify-between gap-4 py-2 border-b border-border/50 last:border-0">
                <p className="text-sm text-muted-foreground flex-1">{question.text}</p>
                {response ? (
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap",
                    response.response_value <= 2 ? "bg-amber-500/10 text-amber-600" :
                    response.response_value === 3 ? "bg-blue-500/10 text-blue-600" :
                    "bg-emerald-500/10 text-emerald-600"
                  )}>
                    {getScaleLabel(response.response_value)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/50">Não respondido</span>
                )}
              </div>
            );
          })}
        </div>
      )
    },
    {
      key: 'readiness',
      title: 'Prontidão',
      icon: Target,
      completed: readinessAssessment && 
                 readinessAssessment.emotional_score > 0 && 
                 readinessAssessment.financial_score > 0 && 
                 readinessAssessment.professional_score > 0,
      content: readinessAssessment ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 rounded-lg bg-rose-500/10">
              <p className="text-2xl font-bold text-rose-600">{readinessAssessment.emotional_score}%</p>
              <p className="text-xs text-muted-foreground">Emocional</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-emerald-500/10">
              <p className="text-2xl font-bold text-emerald-600">{readinessAssessment.financial_score}%</p>
              <p className="text-xs text-muted-foreground">Financeiro</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <p className="text-2xl font-bold text-blue-600">{readinessAssessment.professional_score}%</p>
              <p className="text-xs text-muted-foreground">Profissional</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">
              Nível de prontidão: <strong className={cn(
                readinessAssessment.readiness_level === 'ready' ? "text-emerald-600" :
                readinessAssessment.readiness_level === 'preparing' ? "text-blue-600" :
                "text-amber-600"
              )}>
                {readinessAssessment.readiness_level === 'ready' ? 'Pronto' :
                 readinessAssessment.readiness_level === 'preparing' ? 'Em preparação' :
                 'Inicial'}
              </strong>
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">Ainda não avaliado</p>
      )
    },
    {
      key: 'painmap',
      title: 'Mapa de Dor',
      icon: Frown,
      completed: painMap.length >= 2,
      content: painMap.length > 0 ? (
        <div className="space-y-2">
          {painMap.map((pain) => (
            <div key={pain.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
              <span className={cn(
                "text-lg shrink-0",
                pain.pain_type === 'hurts' ? "text-rose-500" :
                pain.pain_type === 'tires' ? "text-amber-500" :
                "text-purple-500"
              )}>
                {pain.pain_type === 'hurts' ? '💔' : pain.pain_type === 'tires' ? '😮‍💨' : '😤'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{pain.description}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full",
                      i < pain.intensity ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhum ponto mapeado</p>
      )
    },
    {
      key: 'commitment',
      title: 'Compromisso',
      icon: Heart,
      completed: !!commitment,
      content: commitment ? (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <p className="text-sm font-medium">"{commitment.declaration_text}"</p>
            {commitment.custom_text && (
              <p className="mt-2 text-xs text-muted-foreground italic">{commitment.custom_text}</p>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Firmado em {new Date(commitment.confirmed_at).toLocaleDateString('pt-BR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">Compromisso ainda não firmado</p>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Suas Respostas - Fase 1</h3>
        <p className="text-sm text-muted-foreground">Revise o que você compartilhou durante o Despertar</p>
      </div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "overflow-hidden",
              !section.completed && "opacity-60"
            )}>
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    section.completed ? "bg-emerald-500/10" : "bg-muted"
                  )}>
                    {section.completed ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="font-medium">{section.title}</span>
                </div>
                {onViewStep && section.completed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewStep(section.key)}
                    className="gap-1 text-xs"
                  >
                    <Eye className="h-3 w-3" />
                    Ver detalhes
                  </Button>
                )}
              </div>
              <div className="p-4">
                {section.content}
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
