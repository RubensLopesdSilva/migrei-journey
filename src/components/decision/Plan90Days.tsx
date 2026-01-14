import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Plus,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import { MONTH_THEMES } from '@/types/decision';

export const Plan90Days = () => {
  const { plan90Days, weeklyTasks, activeGoal, addWeeklyTask, toggleTaskComplete, createPlan90Days } = useDecision();
  const [expandedMonth, setExpandedMonth] = useState<number | null>(1);
  const [newTask, setNewTask] = useState({ monthId: '', week: 1, title: '' });

  const getTasksForMonth = (monthId: string) => 
    weeklyTasks.filter(t => t.plan_month_id === monthId);

  const getMonthProgress = (monthId: string) => {
    const tasks = getTasksForMonth(monthId);
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.is_completed).length / tasks.length) * 100);
  };

  const handleAddTask = async (monthId: string, week: number) => {
    if (!newTask.title.trim()) return;
    
    await addWeeklyTask(monthId, week, newTask.title);
    setNewTask({ monthId: '', week: 1, title: '' });
  };

  const overallProgress = plan90Days.length > 0
    ? Math.round(plan90Days.reduce((acc, m) => acc + getMonthProgress(m.id), 0) / plan90Days.length)
    : 0;

  if (plan90Days.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Plano Migrei de 90 Dias
          </CardTitle>
          <CardDescription>
            Divida sua meta em 3 meses estratégicos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="mb-4">
              {activeGoal 
                ? 'Seu plano de 90 dias será criado automaticamente com sua meta SMART.'
                : 'Crie uma meta SMART primeiro para gerar seu plano de 90 dias.'}
            </p>
            {activeGoal && (
              <Button onClick={() => createPlan90Days(activeGoal.id)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Gerar Plano de 90 Dias
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Plano Migrei de 90 Dias
        </CardTitle>
        <CardDescription>
          Divida sua meta em 3 meses estratégicos com tarefas semanais
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progresso Geral</span>
            <span className="text-lg font-bold text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>

        {/* Months */}
        <div className="space-y-4">
          {plan90Days.map((month, index) => {
            const monthInfo = MONTH_THEMES[index];
            const tasks = getTasksForMonth(month.id);
            const progress = getMonthProgress(month.id);
            const isExpanded = expandedMonth === month.month_number;

            return (
              <motion.div
                key={month.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={isExpanded ? 'ring-1 ring-primary' : ''}>
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedMonth(isExpanded ? null : month.month_number)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          progress === 100 ? 'bg-green-500 text-white' : 'bg-primary/10 text-primary'
                        }`}>
                          {progress === 100 ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span className="font-bold">{month.month_number}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{monthInfo?.name || month.month_theme}</h3>
                          <p className="text-sm text-muted-foreground">
                            {monthInfo?.description || month.month_objective}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm font-medium">{progress}%</div>
                          <div className="text-xs text-muted-foreground">
                            {tasks.filter(t => t.is_completed).length}/{tasks.length} tarefas
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <Progress value={progress} className="h-1 mt-3" />
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CardContent className="pt-0 space-y-4">
                          {/* Weeks */}
                          {[1, 2, 3, 4].map(week => {
                            const weekTasks = tasks.filter(t => t.week_number === week);
                            
                            return (
                              <div key={week} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline">Semana {week}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {weekTasks.filter(t => t.is_completed).length}/{weekTasks.length} concluídas
                                  </span>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-1 pl-2">
                                  {weekTasks.map(task => (
                                    <div
                                      key={task.id}
                                      className={`flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors ${
                                        task.is_completed ? 'opacity-60' : ''
                                      }`}
                                    >
                                      <Checkbox
                                        checked={task.is_completed}
                                        onCheckedChange={() => toggleTaskComplete(task.id)}
                                      />
                                      <span className={task.is_completed ? 'line-through' : ''}>
                                        {task.task_title}
                                      </span>
                                    </div>
                                  ))}
                                </div>

                                {/* Add Task */}
                                {newTask.monthId === month.id && newTask.week === week ? (
                                  <div className="flex gap-2 pl-2">
                                    <Input
                                      value={newTask.title}
                                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                                      placeholder="Nova tarefa..."
                                      className="flex-1"
                                      autoFocus
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddTask(month.id, week);
                                        if (e.key === 'Escape') setNewTask({ monthId: '', week: 1, title: '' });
                                      }}
                                    />
                                    <Button size="sm" onClick={() => handleAddTask(month.id, week)}>
                                      Adicionar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => setNewTask({ monthId: '', week: 1, title: '' })}
                                    >
                                      Cancelar
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-muted-foreground"
                                    onClick={() => setNewTask({ monthId: month.id, week, title: '' })}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    Adicionar tarefa
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
