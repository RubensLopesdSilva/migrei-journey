import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Mic, Play, Pause, RotateCcw, Save, Clock } from 'lucide-react';
import type { ProfessionalPitch } from '@/types/develop';

interface PitchGeneratorProps {
  pitch: ProfessionalPitch | null;
  onSave: (data: Partial<ProfessionalPitch>) => Promise<any>;
  onRecordPractice: () => void;
  onComplete?: () => void;
}

export function PitchGenerator({ pitch, onSave, onRecordPractice, onComplete }: PitchGeneratorProps) {
  const [formData, setFormData] = useState({
    who_am_i: pitch?.who_am_i || '',
    what_i_do: pitch?.what_i_do || '',
    problem_i_solve: pitch?.problem_i_solve || ''
  });
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPracticing) {
      interval = setInterval(() => {
        setPracticeTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPracticing]);

  const fullPitch = [formData.who_am_i, formData.what_i_do, formData.problem_i_solve]
    .filter(Boolean)
    .join(' ');

  const estimatedDuration = Math.ceil(fullPitch.split(' ').length / 2.5); // ~150 words/min

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
    if (onComplete) onComplete();
  };

  const togglePractice = () => {
    if (isPracticing) {
      onRecordPractice();
    }
    setIsPracticing(!isPracticing);
    if (!isPracticing) {
      setPracticeTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Mic className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <CardTitle>Gerador de Pitch Profissional</CardTitle>
            <p className="text-sm text-muted-foreground">
              Crie seu pitch de 30 segundos
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Guided structure */}
        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">1</span>
              Quem sou eu?
            </Label>
            <Textarea
              value={formData.who_am_i}
              onChange={(e) => setFormData({ ...formData, who_am_i: e.target.value })}
              placeholder="Ex: Sou um profissional com 10 anos de experiência em finanças, apaixonado por tecnologia..."
              rows={2}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Apresente-se de forma memorável e relevante
            </p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">2</span>
              O que eu faço?
            </Label>
            <Textarea
              value={formData.what_i_do}
              onChange={(e) => setFormData({ ...formData, what_i_do: e.target.value })}
              placeholder="Ex: Ajudo empresas a otimizar seus processos financeiros através de análise de dados..."
              rows={2}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Descreva sua proposta de valor de forma clara
            </p>
          </div>

          <div>
            <Label className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">3</span>
              Que problema eu resolvo?
            </Label>
            <Textarea
              value={formData.problem_i_solve}
              onChange={(e) => setFormData({ ...formData, problem_i_solve: e.target.value })}
              placeholder="Ex: Reduzo custos operacionais e aumento a eficiência das equipes em até 30%..."
              rows={2}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Mostre o resultado tangível que você entrega
            </p>
          </div>
        </div>

        {/* Full pitch preview */}
        {fullPitch && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Seu Pitch Completo</h4>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    ~{estimatedDuration}s
                  </span>
                  {estimatedDuration <= 30 ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Ideal
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      Muito longo
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm italic">"{fullPitch}"</p>
            </CardContent>
          </Card>
        )}

        {/* Practice section */}
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">Treino de Leitura</h4>
                <p className="text-sm text-muted-foreground">
                  Pratique seu pitch em voz alta
                </p>
              </div>
              {pitch && (
                <Badge variant="secondary">
                  {pitch.practice_count} práticas
                </Badge>
              )}
            </div>

            {isPracticing && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-mono font-bold text-orange-600">
                    {formatTime(practiceTime)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Meta: 30s
                  </span>
                </div>
                <Progress value={Math.min((practiceTime / 30) * 100, 100)} className="h-2" />
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant={isPracticing ? 'destructive' : 'default'}
                onClick={togglePractice}
                className="flex-1"
              >
                {isPracticing ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Parar
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Treino
                  </>
                )}
              </Button>
              {isPracticing && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setPracticeTime(0);
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Salvando...' : 'Salvar Pitch'}
        </Button>
      </CardContent>
    </Card>
  );
}
