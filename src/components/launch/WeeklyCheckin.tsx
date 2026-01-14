import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarCheck, Battery, TrendingUp, TrendingDown, 
  Target, Save, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { useLaunch } from '@/hooks/useLaunch';
import type { WeeklyCheckin as WeeklyCheckinType } from '@/types/launch';

interface WeeklyCheckinProps {
  onComplete?: () => void;
}

export function WeeklyCheckin({ onComplete }: WeeklyCheckinProps) {
  const { weeklyCheckins, addOrUpdateCheckin } = useLaunch();
  
  const getWeekStart = (date: Date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split('T')[0];
  };

  const [currentWeek, setCurrentWeek] = useState(getWeekStart());
  const [formData, setFormData] = useState({
    week_start: currentWeek,
    what_worked: '',
    what_blocked: '',
    suggested_adjustments: '',
    energy_level: 5,
    confidence_level: 5,
    goals_next_week: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const existingCheckin = weeklyCheckins.find(c => c.week_start === currentWeek);
    if (existingCheckin) {
      setFormData({
        week_start: existingCheckin.week_start,
        what_worked: existingCheckin.what_worked || '',
        what_blocked: existingCheckin.what_blocked || '',
        suggested_adjustments: existingCheckin.suggested_adjustments || '',
        energy_level: existingCheckin.energy_level,
        confidence_level: existingCheckin.confidence_level,
        goals_next_week: existingCheckin.goals_next_week || ''
      });
    } else {
      setFormData({
        week_start: currentWeek,
        what_worked: '',
        what_blocked: '',
        suggested_adjustments: '',
        energy_level: 5,
        confidence_level: 5,
        goals_next_week: ''
      });
    }
  }, [currentWeek, weeklyCheckins]);

  const handleSave = async () => {
    setIsSaving(true);
    await addOrUpdateCheckin(formData);
    setIsSaving(false);
    onComplete?.();
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const date = new Date(currentWeek);
    date.setDate(date.getDate() + (direction === 'prev' ? -7 : 7));
    setCurrentWeek(getWeekStart(date));
  };

  const formatWeekRange = (weekStart: string) => {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    
    return `${start.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}`;
  };

  const isCurrentWeek = currentWeek === getWeekStart();
  const existingCheckin = weeklyCheckins.find(c => c.week_start === currentWeek);

  const getEnergyLabel = (level: number) => {
    if (level <= 2) return '😴 Baixa';
    if (level <= 4) return '😐 Regular';
    if (level <= 6) return '🙂 Boa';
    if (level <= 8) return '😊 Ótima';
    return '🔥 Máxima';
  };

  const getConfidenceLabel = (level: number) => {
    if (level <= 2) return '😟 Inseguro';
    if (level <= 4) return '😐 Neutro';
    if (level <= 6) return '🙂 Confiante';
    if (level <= 8) return '😊 Muito Confiante';
    return '💪 Determinado';
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Check-in Semanal
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Reflita sobre sua semana e planeje os próximos passos
            </p>
          </div>
          {existingCheckin && (
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Preenchido
            </Badge>
          )}
        </div>
        
        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <div className="font-medium">{formatWeekRange(currentWeek)}</div>
            {isCurrentWeek && (
              <Badge variant="secondary" className="text-xs mt-1">Semana Atual</Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigateWeek('next')}
            disabled={isCurrentWeek}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Energy & Confidence Sliders */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Battery className="h-4 w-4 text-yellow-500" />
                Nível de Energia
              </label>
              <span className="text-sm">{getEnergyLabel(formData.energy_level)}</span>
            </div>
            <Slider
              value={[formData.energy_level]}
              onValueChange={(v) => setFormData({ ...formData, energy_level: v[0] })}
              min={1}
              max={10}
              step={1}
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Nível de Confiança
              </label>
              <span className="text-sm">{getConfidenceLabel(formData.confidence_level)}</span>
            </div>
            <Slider
              value={[formData.confidence_level]}
              onValueChange={(v) => setFormData({ ...formData, confidence_level: v[0] })}
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>

        {/* What Worked */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            O que funcionou esta semana?
          </label>
          <Textarea
            value={formData.what_worked}
            onChange={(e) => setFormData({ ...formData, what_worked: e.target.value })}
            placeholder="Liste as vitórias e conquistas da semana..."
            rows={3}
          />
        </div>

        {/* What Blocked */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-red-500" />
            O que travou ou não funcionou?
          </label>
          <Textarea
            value={formData.what_blocked}
            onChange={(e) => setFormData({ ...formData, what_blocked: e.target.value })}
            placeholder="Identifique os obstáculos e desafios..."
            rows={3}
          />
        </div>

        {/* Suggested Adjustments */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-blue-500" />
            Ajustes sugeridos para a próxima semana
          </label>
          <Textarea
            value={formData.suggested_adjustments}
            onChange={(e) => setFormData({ ...formData, suggested_adjustments: e.target.value })}
            placeholder="O que você pode fazer diferente?"
            rows={2}
          />
        </div>

        {/* Goals Next Week */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            Metas para a próxima semana
          </label>
          <Textarea
            value={formData.goals_next_week}
            onChange={(e) => setFormData({ ...formData, goals_next_week: e.target.value })}
            placeholder="Defina 3-5 metas claras e alcançáveis..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full gap-2"
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {existingCheckin ? 'Atualizar Check-in' : 'Salvar Check-in'}
            </>
          )}
        </Button>

        {/* Previous Check-ins Summary */}
        {weeklyCheckins.length > 1 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Histórico de Check-ins</h4>
            <div className="space-y-2">
              {weeklyCheckins
                .filter(c => c.week_start !== currentWeek)
                .slice(0, 4)
                .map((checkin) => (
                  <button
                    key={checkin.id}
                    onClick={() => setCurrentWeek(checkin.week_start)}
                    className="w-full flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-sm">{formatWeekRange(checkin.week_start)}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        ⚡ {checkin.energy_level}/10
                      </span>
                      <span className="text-xs text-muted-foreground">
                        💪 {checkin.confidence_level}/10
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
