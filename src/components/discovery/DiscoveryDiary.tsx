import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Smile, 
  Meh, 
  Frown, 
  Sparkles, 
  HelpCircle,
  CheckCircle2,
  Lock,
  Calendar,
  Flame
} from 'lucide-react';
import { DIARY_QUESTIONS, EmotionalReaction } from '@/types/discovery';
import { useDiscovery } from '@/hooks/useDiscovery';
import { motion, AnimatePresence } from 'framer-motion';

const emotionIcons: Record<EmotionalReaction, { icon: React.ElementType; label: string; color: string }> = {
  excited: { icon: Sparkles, label: 'Animado', color: 'text-yellow-500' },
  hopeful: { icon: Smile, label: 'Esperançoso', color: 'text-green-500' },
  neutral: { icon: Meh, label: 'Neutro', color: 'text-gray-500' },
  anxious: { icon: Frown, label: 'Ansioso', color: 'text-orange-500' },
  confused: { icon: HelpCircle, label: 'Confuso', color: 'text-blue-500' },
};

export function DiscoveryDiary() {
  const { diaryEntries, saveDiaryEntry } = useDiscovery();
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalReaction | null>(null);

  // Calculate streak
  const completedDays = diaryEntries.filter(e => e.completed_at).length;
  const streak = completedDays; // Simplified streak calculation

  // Find next available day
  useEffect(() => {
    const completedDayNumbers = diaryEntries.filter(e => e.completed_at).map(e => e.day_number);
    for (let day = 1; day <= 7; day++) {
      if (!completedDayNumbers.includes(day)) {
        setActiveDay(day);
        break;
      }
    }
    if (completedDayNumbers.length === 7) {
      setActiveDay(null);
    }
  }, [diaryEntries]);

  const handleSelectDay = (day: number) => {
    const entry = diaryEntries.find(e => e.day_number === day);
    if (entry) {
      setResponse(entry.response || '');
      setSelectedEmotion(entry.emotional_reaction as EmotionalReaction || null);
    } else {
      setResponse('');
      setSelectedEmotion(null);
    }
    setActiveDay(day);
  };

  const handleSave = async () => {
    if (!activeDay || !selectedEmotion) return;
    
    const question = DIARY_QUESTIONS.find(q => q.day === activeDay)?.question || '';
    await saveDiaryEntry(activeDay, question, response, selectedEmotion);
    
    // Move to next day
    if (activeDay < 7) {
      const nextDay = activeDay + 1;
      setActiveDay(nextDay);
      setResponse('');
      setSelectedEmotion(null);
    }
  };

  const isDayCompleted = (day: number) => {
    return diaryEntries.some(e => e.day_number === day && e.completed_at);
  };

  const isDayAvailable = (day: number) => {
    if (day === 1) return true;
    // Day is available if previous day is completed
    return isDayCompleted(day - 1) || isDayCompleted(day);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Diário de Autodescoberta</h2>
        <p className="text-muted-foreground">
          7 dias de reflexão para clareza profissional
        </p>
      </div>

      {/* Streak & Progress */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sequência</p>
                <p className="text-2xl font-bold">{streak} dias</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Progresso</p>
              <div className="flex items-center gap-2">
                <Progress value={(completedDays / 7) * 100} className="w-24" />
                <span className="text-sm font-medium">{completedDays}/7</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {DIARY_QUESTIONS.map((q) => {
          const completed = isDayCompleted(q.day);
          const available = isDayAvailable(q.day);
          const isActive = activeDay === q.day;
          const entry = diaryEntries.find(e => e.day_number === q.day);

          return (
            <button
              key={q.day}
              onClick={() => available && handleSelectDay(q.day)}
              disabled={!available}
              className={`
                relative p-3 rounded-lg border-2 transition-all
                ${isActive ? 'border-primary bg-primary/10' : 'border-border'}
                ${completed ? 'bg-green-500/10 border-green-500/50' : ''}
                ${!available ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
              `}
            >
              <div className="flex flex-col items-center gap-1">
                {!available && !completed && (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
                {completed && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {available && !completed && (
                  <Calendar className="h-4 w-4 text-primary" />
                )}
                <span className="text-xs font-medium">Dia {q.day}</span>
                {entry?.emotional_reaction && (
                  <div className={emotionIcons[entry.emotional_reaction as EmotionalReaction]?.color}>
                    {(() => {
                      const Icon = emotionIcons[entry.emotional_reaction as EmotionalReaction]?.icon;
                      return Icon ? <Icon className="h-3 w-3" /> : null;
                    })()}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Question */}
      <AnimatePresence mode="wait">
        {activeDay && (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit">Dia {activeDay}</Badge>
                <CardTitle className="text-lg mt-2">
                  {DIARY_QUESTIONS.find(q => q.day === activeDay)?.question}
                </CardTitle>
                <CardDescription>
                  Reflita com calma antes de responder
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Escreva sua reflexão aqui..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="min-h-32"
                />

                <div className="space-y-3">
                  <p className="text-sm font-medium">Como você se sente ao refletir sobre isso?</p>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(emotionIcons) as EmotionalReaction[]).map((emotion) => {
                      const { icon: Icon, label, color } = emotionIcons[emotion];
                      const isSelected = selectedEmotion === emotion;
                      
                      return (
                        <Button
                          key={emotion}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedEmotion(emotion)}
                          className={`gap-2 ${isSelected ? '' : color}`}
                        >
                          <Icon className="h-4 w-4" />
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={!response.trim() || !selectedEmotion}
                  className="w-full"
                >
                  {isDayCompleted(activeDay) ? 'Atualizar Reflexão' : 'Salvar Reflexão'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {completedDays === 7 && (
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Diário Completo!</h3>
            <p className="text-muted-foreground">
              Parabéns! Você completou os 7 dias de autodescoberta.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
