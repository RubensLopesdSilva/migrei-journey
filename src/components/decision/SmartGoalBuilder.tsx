import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  CheckCircle2,
  Circle,
  Lightbulb,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';

const SMART_FIELDS = [
  { key: 'specific', label: 'S - Específico', placeholder: 'O que exatamente você quer alcançar?', tip: 'Seja claro e detalhado sobre seu objetivo' },
  { key: 'measurable', label: 'M - Mensurável', placeholder: 'Como você vai medir o progresso?', tip: 'Defina indicadores quantificáveis' },
  { key: 'achievable', label: 'A - Alcançável', placeholder: 'É realista? O que precisa para alcançar?', tip: 'Considere seus recursos e limitações' },
  { key: 'relevant', label: 'R - Relevante', placeholder: 'Por que este objetivo é importante para você?', tip: 'Conecte com seus valores e propósito' },
  { key: 'time_bound', label: 'T - Temporal', placeholder: 'Qual o prazo para alcançar?', tip: 'Defina uma data limite clara' },
];

interface SmartGoalBuilderProps {
  onComplete?: () => void;
}

export const SmartGoalBuilder = ({ onComplete }: SmartGoalBuilderProps) => {
  const { smartGoals, selectedRoute, addSmartGoal, updateSmartGoal, createPlan90Days } = useDecision();
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
      setNewGoal({
        goal_title: '',
        specific: '',
        measurable: '',
        achievable: '',
        relevant: '',
        time_bound: '',
        target_date: '',
      });
      setCurrentStep(0);
    }
  };

  const activeGoal = smartGoals.find(g => g.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Meta SMART Profissional
        </CardTitle>
        <CardDescription>
          Defina uma meta clara seguindo a metodologia SMART
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Goal Display */}
        {activeGoal && !isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2">Meta Ativa</Badge>
                    <h3 className="font-semibold text-lg">{activeGoal.goal_title}</h3>
                  </div>
                  {activeGoal.is_validated && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm">Validada</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {SMART_FIELDS.map(field => (
                    <div key={field.key} className="flex gap-3">
                      <div className="w-24 flex-shrink-0">
                        <Badge variant="outline" className="w-full justify-center">
                          {field.label.split(' - ')[0]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(activeGoal as any)[field.key]}
                      </p>
                    </div>
                  ))}
                </div>

                {activeGoal.target_date && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Data limite: {new Date(activeGoal.target_date).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Goal Creation Form */}
        <AnimatePresence mode="wait">
          {isCreating ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-6">
                {SMART_FIELDS.map((field, index) => (
                  <div key={field.key} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                        index === currentStep
                          ? 'bg-primary text-primary-foreground'
                          : isStepComplete(index)
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}
                      onClick={() => setCurrentStep(index)}
                    >
                      {isStepComplete(index) ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        field.label[0]
                      )}
                    </div>
                    {index < SMART_FIELDS.length - 1 && (
                      <div className={`w-8 h-0.5 ${isStepComplete(index) ? 'bg-green-500' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Goal Title */}
              <div>
                <Label>Título da Meta</Label>
                <Input
                  value={newGoal.goal_title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, goal_title: e.target.value }))}
                  placeholder="Ex: Transição para Product Manager"
                  className="text-lg"
                />
              </div>

              {/* Current Step Field */}
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-lg">{SMART_FIELDS[currentStep].label}</Label>
                  {isStepComplete(currentStep) && (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                </div>
                
                <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <span className="text-muted-foreground">{SMART_FIELDS[currentStep].tip}</span>
                </div>

                <Textarea
                  value={(newGoal as any)[SMART_FIELDS[currentStep].key]}
                  onChange={(e) => setNewGoal(prev => ({ 
                    ...prev, 
                    [SMART_FIELDS[currentStep].key]: e.target.value 
                  }))}
                  placeholder={SMART_FIELDS[currentStep].placeholder}
                  rows={4}
                />
              </motion.div>

              {/* Navigation */}
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep(prev => prev - 1)}
                  >
                    Anterior
                  </Button>
                )}
                
                {currentStep < SMART_FIELDS.length - 1 ? (
                  <Button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="flex-1"
                    disabled={!isStepComplete(currentStep)}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCreateGoal}
                    className="flex-1"
                    disabled={!allStepsComplete}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Criar Meta & Plano de 90 Dias
                  </Button>
                )}

                <Button variant="ghost" onClick={() => setIsCreating(false)}>
                  Cancelar
                </Button>
              </div>

              {/* Target Date */}
              <div>
                <Label>Data Limite (opcional)</Label>
                <Input
                  type="date"
                  value={newGoal.target_date}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </motion.div>
          ) : !activeGoal && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground mb-4">
                {selectedRoute 
                  ? `Defina sua meta SMART para a rota: ${selectedRoute.route_name}`
                  : 'Selecione uma rota primeiro para definir sua meta SMART'}
              </p>
              <Button 
                onClick={() => setIsCreating(true)}
                disabled={!selectedRoute}
              >
                <Target className="w-4 h-4 mr-2" />
                Criar Meta SMART
              </Button>
            </div>
          )}
        </AnimatePresence>

        {/* Past Goals */}
        {smartGoals.filter(g => g.status !== 'active').length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Metas Anteriores</h4>
            <div className="space-y-2">
              {smartGoals.filter(g => g.status !== 'active').map(goal => (
                <div 
                  key={goal.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <span className="text-sm">{goal.goal_title}</span>
                  <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                    {goal.status === 'completed' ? 'Concluída' : 'Abandonada'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
