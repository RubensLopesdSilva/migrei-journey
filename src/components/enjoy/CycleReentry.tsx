import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Rocket, Target, ArrowRight, History } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import type { CycleReentry as CycleReentryType } from '@/types/enjoy';

interface Props {
  reentries: CycleReentryType[];
  onStartNewCycle: (nextLevelGoal: string, motivation: string) => Promise<void>;
}

export const CycleReentry = ({ reentries, onStartNewCycle }: Props) => {
  const navigate = useNavigate();
  const [nextLevelGoal, setNextLevelGoal] = useState('');
  const [motivation, setMotivation] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const currentCycle = reentries.length > 0 ? reentries[0].new_cycle : 1;

  const handleStartNewCycle = async () => {
    if (!nextLevelGoal.trim() || !motivation.trim()) return;
    setIsStarting(true);
    await onStartNewCycle(nextLevelGoal, motivation);
    setIsStarting(false);
    // Navigate to Despertar phase
    navigate('/fase/despertar');
  };

  return (
    <Card className="border-green-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-green-500" />
          Reentrada no Círculo
          <Badge variant="outline" className="ml-2">Ciclo {currentCycle}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Previous Cycles */}
        {reentries.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm">
              <History className="h-4 w-4" />
              Ciclos Anteriores
            </h4>
            <div className="space-y-2">
              {reentries.slice(0, 3).map((reentry) => (
                <div 
                  key={reentry.id} 
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Ciclo {reentry.previous_cycle} → {reentry.new_cycle}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Objetivo: {reentry.next_level_goal}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(reentry.started_at), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Cycle Form */}
        <div className="bg-gradient-to-br from-green-500/10 to-primary/10 rounded-lg p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Qual será seu próximo nível profissional?</h3>
            <p className="text-muted-foreground">
              Você completou um ciclo. É hora de definir novos horizontes.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Próximo Nível / Objetivo
              </label>
              <Input
                placeholder="Ex: Tornar-me Tech Lead em uma startup"
                value={nextLevelGoal}
                onChange={(e) => setNextLevelGoal(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Rocket className="h-4 w-4 text-secondary" />
                O que te motiva a continuar?
              </label>
              <Textarea
                placeholder="Descreva o que te impulsiona a buscar esse novo nível..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <Button 
            onClick={handleStartNewCycle}
            disabled={!nextLevelGoal.trim() || !motivation.trim() || isStarting}
            className="w-full gap-2 bg-gradient-to-r from-green-500 to-primary"
            size="lg"
          >
            {isStarting ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
                Iniciando...
              </>
            ) : (
              <>
                Iniciar Novo Ciclo
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Ao iniciar um novo ciclo, você retornará à fase Despertar com novos objetivos
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
