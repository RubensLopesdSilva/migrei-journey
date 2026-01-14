import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Heart, 
  Wrench, 
  TrendingUp, 
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import { RISK_LEVEL_LABELS } from '@/types/decision';
import type { RiskLevel } from '@/types/decision';

export const PossibilitiesMatrix = () => {
  const { routes, addRoute, updateRoute, deleteRoute, selectRoute, isLoading } = useDecision();
  const [isAdding, setIsAdding] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route_name: '',
    passion_score: 5,
    skill_score: 5,
    market_score: 5,
    transition_time_months: 6,
    risk_level: 'medium' as RiskLevel,
    financial_return: '',
    profile_fit_percentage: 50,
    notes: '',
  });

  const handleAddRoute = async () => {
    if (!newRoute.route_name.trim()) return;
    
    await addRoute({
      ...newRoute,
      is_selected: false,
      is_discarded: false,
    });
    
    setNewRoute({
      route_name: '',
      passion_score: 5,
      skill_score: 5,
      market_score: 5,
      transition_time_months: 6,
      risk_level: 'medium',
      financial_return: '',
      profile_fit_percentage: 50,
      notes: '',
    });
    setIsAdding(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-700';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700';
      case 'high': return 'bg-red-500/20 text-red-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Matriz Migrei de Possibilidades
        </CardTitle>
        <CardDescription>
          Avalie suas rotas profissionais em 3 eixos: Paixão, Habilidade e Mercado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Routes List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {routes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`relative overflow-hidden ${route.is_selected ? 'ring-2 ring-primary' : ''} ${route.is_discarded ? 'opacity-50' : ''}`}>
                  {route.is_selected && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                      ✓ Selecionada
                    </div>
                  )}
                  
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{route.route_name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getRiskColor(route.risk_level as RiskLevel)}>
                            Risco {RISK_LEVEL_LABELS[route.risk_level as RiskLevel]}
                          </Badge>
                          {route.transition_time_months && (
                            <Badge variant="outline">{route.transition_time_months} meses</Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {Number(route.total_score).toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>

                    {/* Score Bars */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>Paixão</span>
                          <span className={`ml-auto font-bold ${getScoreColor(route.passion_score)}`}>
                            {route.passion_score}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-500 transition-all"
                            style={{ width: `${route.passion_score * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Wrench className="w-4 h-4 text-blue-500" />
                          <span>Habilidade</span>
                          <span className={`ml-auto font-bold ${getScoreColor(route.skill_score)}`}>
                            {route.skill_score}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${route.skill_score * 10}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span>Mercado</span>
                          <span className={`ml-auto font-bold ${getScoreColor(route.market_score)}`}>
                            {route.market_score}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${route.market_score * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {route.notes && (
                      <p className="text-sm text-muted-foreground mb-4">{route.notes}</p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {!route.is_selected && !route.is_discarded && (
                        <Button 
                          size="sm" 
                          onClick={() => selectRoute(route.id)}
                          className="flex-1"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Selecionar
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => deleteRoute(route.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add New Route Form */}
        <AnimatePresence>
          {isAdding ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-dashed">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label>Nome da Rota Profissional</Label>
                    <Input
                      value={newRoute.route_name}
                      onChange={(e) => setNewRoute(prev => ({ ...prev, route_name: e.target.value }))}
                      placeholder="Ex: Product Manager em Tech"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        Paixão: {newRoute.passion_score}
                      </Label>
                      <Slider
                        value={[newRoute.passion_score]}
                        onValueChange={(v) => setNewRoute(prev => ({ ...prev, passion_score: v[0] }))}
                        max={10}
                        min={0}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Wrench className="w-4 h-4 text-blue-500" />
                        Habilidade: {newRoute.skill_score}
                      </Label>
                      <Slider
                        value={[newRoute.skill_score]}
                        onValueChange={(v) => setNewRoute(prev => ({ ...prev, skill_score: v[0] }))}
                        max={10}
                        min={0}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Mercado: {newRoute.market_score}
                      </Label>
                      <Slider
                        value={[newRoute.market_score]}
                        onValueChange={(v) => setNewRoute(prev => ({ ...prev, market_score: v[0] }))}
                        max={10}
                        min={0}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tempo de Transição (meses)</Label>
                      <Input
                        type="number"
                        value={newRoute.transition_time_months}
                        onChange={(e) => setNewRoute(prev => ({ ...prev, transition_time_months: parseInt(e.target.value) || 0 }))}
                      />
                    </div>

                    <div>
                      <Label>Nível de Risco</Label>
                      <Select
                        value={newRoute.risk_level}
                        onValueChange={(v: RiskLevel) => setNewRoute(prev => ({ ...prev, risk_level: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Retorno Financeiro Esperado</Label>
                    <Input
                      value={newRoute.financial_return}
                      onChange={(e) => setNewRoute(prev => ({ ...prev, financial_return: e.target.value }))}
                      placeholder="Ex: R$ 15.000 - R$ 25.000"
                    />
                  </div>

                  <div>
                    <Label>Observações</Label>
                    <Textarea
                      value={newRoute.notes}
                      onChange={(e) => setNewRoute(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Notas sobre esta rota..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddRoute} className="flex-1">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Rota
                    </Button>
                    <Button variant="outline" onClick={() => setIsAdding(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full border-dashed"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Nova Rota
            </Button>
          )}
        </AnimatePresence>

        {routes.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Star className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Nenhuma rota cadastrada ainda.</p>
            <p className="text-sm">Adicione suas possibilidades de carreira para avaliá-las.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
