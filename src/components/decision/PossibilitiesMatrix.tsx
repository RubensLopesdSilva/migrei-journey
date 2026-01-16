import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Heart, Wrench, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import { RISK_LEVEL_LABELS } from '@/types/decision';
import type { RiskLevel } from '@/types/decision';
import { cn } from '@/lib/utils';

interface PossibilitiesMatrixProps {
  onComplete?: () => void;
}

export const PossibilitiesMatrix = ({ onComplete }: PossibilitiesMatrixProps) => {
  const { routes, addRoute, deleteRoute, selectRoute } = useDecision();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route_name: '',
    passion_score: 5,
    skill_score: 5,
    market_score: 5,
    transition_time_months: 6,
    risk_level: 'medium' as RiskLevel,
    notes: '',
  });

  const handleAddRoute = async () => {
    if (!newRoute.route_name.trim()) return;
    await addRoute({ ...newRoute, is_selected: false, is_discarded: false, financial_return: '', profile_fit_percentage: 50 });
    setNewRoute({ route_name: '', passion_score: 5, skill_score: 5, market_score: 5, transition_time_months: 6, risk_level: 'medium', notes: '' });
    setIsAdding(false);
  };

  const ScoreBar = ({ value, color, label, icon: Icon }: { value: number; color: string; label: string; icon: React.ElementType }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <Icon className={cn("h-4 w-4", color)} />
          <span className="text-muted-foreground">{label}</span>
        </div>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={cn("h-full rounded-full", color.replace('text-', 'bg-'))}
          initial={{ width: 0 }}
          animate={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  );

  const ScoreInput = ({ value, onChange, color, label, icon: Icon }: { value: number; onChange: (v: number) => void; color: string; label: string; icon: React.ElementType }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-4 w-4", color)} />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm font-bold">{value}</span>
      </div>
      <div className="flex gap-1">
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className={cn(
              "flex-1 h-8 rounded text-xs font-medium transition-all",
              value >= n ? cn(color.replace('text-', 'bg-'), "text-white") : "bg-muted hover:bg-muted/80"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">Matriz de Possibilidades</h2>
        <p className="text-muted-foreground">Avalie suas rotas: Paixão × Habilidade × Mercado</p>
      </div>

      {/* Routes List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {routes.map((route) => (
            <motion.div
              key={route.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={cn(
                "p-5 rounded-xl border-2 transition-all",
                route.is_selected ? "border-primary bg-primary/5" : "border-border"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{route.route_name}</h3>
                    {route.is_selected && (
                      <Badge className="bg-primary/20 text-primary">Selecionada</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 mt-1.5">
                    <Badge variant="outline" className={
                      route.risk_level === 'low' ? 'border-emerald-500/50 text-emerald-600' :
                      route.risk_level === 'high' ? 'border-rose-500/50 text-rose-600' :
                      'border-amber-500/50 text-amber-600'
                    }>
                      {RISK_LEVEL_LABELS[route.risk_level as RiskLevel]}
                    </Badge>
                    {route.transition_time_months && (
                      <Badge variant="outline">{route.transition_time_months}m</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{Number(route.total_score).toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">score</div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <ScoreBar value={route.passion_score} color="text-rose-500" label="Paixão" icon={Heart} />
                <ScoreBar value={route.skill_score} color="text-blue-500" label="Habilidade" icon={Wrench} />
                <ScoreBar value={route.market_score} color="text-emerald-500" label="Mercado" icon={TrendingUp} />
              </div>

              <div className="flex gap-2">
                {!route.is_selected && (
                  <Button size="sm" onClick={() => selectRoute(route.id)} className="flex-1 gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Selecionar
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => deleteRoute(route.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 p-5 rounded-xl border-2 border-dashed"
          >
            <Input
              value={newRoute.route_name}
              onChange={(e) => setNewRoute(prev => ({ ...prev, route_name: e.target.value }))}
              placeholder="Nome da rota (ex: Product Manager em Tech)"
              className="h-12 text-lg"
            />

            <div className="space-y-4">
              <ScoreInput value={newRoute.passion_score} onChange={(v) => setNewRoute(p => ({ ...p, passion_score: v }))} color="text-rose-500" label="Paixão" icon={Heart} />
              <ScoreInput value={newRoute.skill_score} onChange={(v) => setNewRoute(p => ({ ...p, skill_score: v }))} color="text-blue-500" label="Habilidade" icon={Wrench} />
              <ScoreInput value={newRoute.market_score} onChange={(v) => setNewRoute(p => ({ ...p, market_score: v }))} color="text-emerald-500" label="Mercado" icon={TrendingUp} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Tempo (meses)</label>
                <Input
                  type="number"
                  value={newRoute.transition_time_months}
                  onChange={(e) => setNewRoute(p => ({ ...p, transition_time_months: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Risco</label>
                <div className="flex gap-2 mt-1">
                  {(['low', 'medium', 'high'] as RiskLevel[]).map(r => (
                    <button
                      key={r}
                      onClick={() => setNewRoute(p => ({ ...p, risk_level: r }))}
                      className={cn(
                        "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                        newRoute.risk_level === r ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {r === 'low' ? 'Baixo' : r === 'medium' ? 'Médio' : 'Alto'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Textarea
              value={newRoute.notes}
              onChange={(e) => setNewRoute(p => ({ ...p, notes: e.target.value }))}
              placeholder="Observações (opcional)"
              rows={2}
            />

            <div className="flex gap-2">
              <Button onClick={handleAddRoute} className="flex-1 gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>Cancelar</Button>
            </div>
          </motion.div>
        ) : (
          <Button variant="outline" className="w-full h-12 border-dashed gap-2" onClick={() => setIsAdding(true)}>
            <Plus className="h-5 w-5" />
            Adicionar rota
          </Button>
        )}
      </AnimatePresence>

      {routes.length === 0 && !isAdding && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma rota cadastrada</p>
          <p className="text-sm">Adicione possibilidades de carreira para avaliar</p>
        </div>
      )}
    </div>
  );
};
