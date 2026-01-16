import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Smile, Meh, Frown, Sparkles, HelpCircle, CheckCircle2, Lock, Flame, ArrowRight } from 'lucide-react';
import { DIARY_QUESTIONS, EmotionalReaction } from '@/types/discovery';
import { useDiscovery } from '@/hooks/useDiscovery';
import { cn } from '@/lib/utils';

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

  const completedDays = diaryEntries.filter(e => e.completed_at).length;

  useEffect(() => {
    const completedDayNumbers = diaryEntries.filter(e => e.completed_at).map(e => e.day_number);
    for (let day = 1; day <= 7; day++) {
      if (!completedDayNumbers.includes(day)) {
        setActiveDay(day);
        break;
      }
    }
    if (completedDayNumbers.length === 7) setActiveDay(null);
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
    if (activeDay < 7) {
      setActiveDay(activeDay + 1);
      setResponse('');
      setSelectedEmotion(null);
    }
  };

  const isDayCompleted = (day: number) => diaryEntries.some(e => e.day_number === day && e.completed_at);
  const isDayAvailable = (day: number) => day === 1 || isDayCompleted(day - 1) || isDayCompleted(day);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Diário de Autodescoberta</h2>
        <p className="text-muted-foreground">7 dias de reflexão profunda</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between bg-muted/30 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{completedDays}/7</p>
            <p className="text-xs text-muted-foreground">dias completos</p>
          </div>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5, 6, 7].map(day => (
            <div
              key={day}
              className={cn(
                "h-2 w-6 rounded-full transition-colors",
                isDayCompleted(day) ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Days */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DIARY_QUESTIONS.map((q) => {
          const completed = isDayCompleted(q.day);
          const available = isDayAvailable(q.day);
          const isActive = activeDay === q.day;

          return (
            <button
              key={q.day}
              onClick={() => available && handleSelectDay(q.day)}
              disabled={!available}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all shrink-0",
                isActive ? "bg-primary text-primary-foreground" : 
                completed ? "bg-emerald-500/10 text-emerald-600" : 
                available ? "bg-muted hover:bg-muted/80" : "bg-muted/50 opacity-50"
              )}
            >
              {!available && !completed && <Lock className="h-4 w-4" />}
              {completed && <CheckCircle2 className="h-4 w-4" />}
              {available && !completed && !isActive && <span className="h-4 w-4" />}
              <span className="text-sm font-medium">Dia {q.day}</span>
            </button>
          );
        })}
      </div>

      {/* Active Question */}
      <AnimatePresence mode="wait">
        {activeDay && (
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-muted/30 rounded-xl p-6">
              <h3 className="text-lg font-medium mb-4">
                {DIARY_QUESTIONS.find(q => q.day === activeDay)?.question}
              </h3>
              <Textarea
                placeholder="Escreva sua reflexão..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Emotions */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Como você se sente?</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(emotionIcons) as EmotionalReaction[]).map((emotion) => {
                  const { icon: Icon, label, color } = emotionIcons[emotion];
                  const isSelected = selectedEmotion === emotion;
                  
                  return (
                    <button
                      key={emotion}
                      onClick={() => setSelectedEmotion(emotion)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-muted/80",
                        !isSelected && color
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              onClick={handleSave}
              disabled={!response.trim() || !selectedEmotion}
              className="w-full h-12 gap-2"
            >
              {isDayCompleted(activeDay) ? 'Atualizar' : 'Salvar reflexão'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {completedDays === 7 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-6 bg-emerald-500/10 rounded-xl"
        >
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold">Diário completo! 🎉</h3>
          <p className="text-sm text-muted-foreground">Parabéns por completar os 7 dias</p>
        </motion.div>
      )}
    </div>
  );
}
