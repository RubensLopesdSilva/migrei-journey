import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, CheckCircle2, Lightbulb, ArrowRight, ArrowLeft } from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import { cn } from '@/lib/utils';

const SMART_FIELDS = [
  { key: 'specific', label: 'Específico', placeholder: 'O que exatamente você quer alcançar?', tip: 'Seja claro e detalhado' },
  { key: 'measurable', label: 'Mensurável', placeholder: 'Como medir o progresso?', tip: 'Defina indicadores quantificáveis' },
  { key: 'achievable', label: 'Alcançável', placeholder: 'É realista?', tip: 'Considere seus recursos' },
  { key: 'relevant', label: 'Relevante', placeholder: 'Por que é importante?', tip: 'Conecte com seu propósito' },
  { key: 'time_bound', label: 'Temporal', placeholder: 'Qual o prazo?', tip: 'Defina uma data limite' },
];

interface SmartGoalBuilderProps {
  onComplete?: () => void;
}

export const SmartGoalBuilder = ({ onComplete }: SmartGoalBuilderProps) => {
  const { smartGoals, selectedRoute, addSmartGoal, createPlan90Days } = useDecision();
  const [isCreating, setIsCreating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newGoal, setNewGoal] = useState({
    goal_title: '',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    time_bound: '',
    target_date: '',
  });

  const isStepComplete = (step: number) => {
    const field = SMART_FIELDS[step]?.key;
    return field ? (newGoal as any)[field]?.length >= 10 : false;
  };

  const allStepsComplete = SMART_FIELDS.every((_, i) => isStepComplete(i)) && newGoal.goal_title.length >= 5;

  const handleCreateGoal = async () => {
    const goal = await addSmartGoal({
      ...newGoal,
      route_id: selectedRoute?.id || null,
      target_date: newGoal.target_date || null,
      is_validated: false,
      validation_feedback: null,
      status: 'active',
    });
    if (goal) {
      await createPlan90Days(goal.id);
      setIsCreating(false);
      setNewGoal({ goal_title: '', specific: '', measurable: '', achievable: '', relevant: '', time_bound: '', target_date: '' });
      setCurrentStep(0);
    }
  };

  const activeGoal = smartGoals.find(g => g.status === 'active');

  // Active Goal Display
  if (activeGoal && !isCreating) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-semibold">Sua Meta SMART</h2>
          <p className="text-muted-foreground">Meta definida e pronta para execução</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-primary/5 border-2 border-primary/20"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <Badge className="bg-primary/20 text-primary mb-2">Meta Ativa</Badge>
              <h3 className="text-lg font-semibold">{activeGoal.goal_title}</h3>
            </div>
            {activeGoal.is_validated && (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            )}
          </div>

          <div className="space-y-3">
            {SMART_FIELDS.map(field => (
              <div key={field.key} className="flex gap-3">
                <Badge variant="outline" className="shrink-0 w-8 justify-center font-bold">
                  {field.label[0]}
                </Badge>
                <p className="text-sm text-muted-foreground">{(activeGoal as any)[field.key]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Creation Flow
  if (isCreating) {
    const progress = ((currentStep + 1) / SMART_FIELDS.length) * 100;

    return (
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <motion.div className="h-full bg-primary" animate={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm text-muted-foreground">{currentStep + 1}/{SMART_FIELDS.length}</span>
        </div>

        {/* Goal Title (always visible) */}
        {currentStep === 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Título da Meta</label>
            <Input
              value={newGoal.goal_title}
              onChange={(e) => setNewGoal(p => ({ ...p, goal_title: e.target.value }))}
              placeholder="Ex: Transição para Product Manager"
              className="h-12 text-lg"
            />
          </div>
        )}

        {/* Current Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {SMART_FIELDS[currentStep].label[0]}
              </div>
              <div>
                <h3 className="font-semibold">{SMART_FIELDS[currentStep].label}</h3>
                <p className="text-sm text-muted-foreground">{SMART_FIELDS[currentStep].tip}</p>
              </div>
            </div>

            <Textarea
              value={(newGoal as any)[SMART_FIELDS[currentStep].key]}
              onChange={(e) => setNewGoal(p => ({ ...p, [SMART_FIELDS[currentStep].key]: e.target.value }))}
              placeholder={SMART_FIELDS[currentStep].placeholder}
              rows={4}
              className="resize-none"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => currentStep === 0 ? setIsCreating(false) : setCurrentStep(p => p - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 0 ? 'Cancelar' : 'Anterior'}
          </Button>
          
          {currentStep < SMART_FIELDS.length - 1 ? (
            <Button onClick={() => setCurrentStep(p => p + 1)} disabled={!isStepComplete(currentStep)} className="flex-1 gap-2">
              Próximo
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreateGoal} disabled={!allStepsComplete} className="flex-1 gap-2">
              Criar Meta
              <Target className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Empty State
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Meta SMART</h2>
        <p className="text-muted-foreground">Defina uma meta clara usando a metodologia SMART</p>
      </div>

      <div className="text-center py-12">
        <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Target className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">
          {selectedRoute 
            ? `Pronto para definir sua meta para: ${selectedRoute.route_name}`
            : 'Selecione uma rota primeiro na Matriz de Possibilidades'}
        </p>
        <Button onClick={() => setIsCreating(true)} disabled={!selectedRoute} className="gap-2">
          <Target className="h-4 w-4" />
          Criar Meta SMART
        </Button>
      </div>
    </div>
  );
};
