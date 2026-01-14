import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  GitCompare, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  User,
  TrendingUp,
  Heart,
  Wrench
} from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import { RISK_LEVEL_LABELS } from '@/types/decision';
import type { RiskLevel, PossibilityRoute } from '@/types/decision';

export const RouteComparator = () => {
  const { routes } = useDecision();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : prev.length < 3 ? [...prev, id] : prev
    );
  };

  const selectedRoutes = routes.filter(r => selectedIds.includes(r.id));

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
    }
  };

  const ComparisonRow = ({ 
    label, 
    icon: Icon, 
    getValue, 
    format = (v: any) => v 
  }: { 
    label: string; 
    icon: any;
    getValue: (route: PossibilityRoute) => any;
    format?: (value: any) => React.ReactNode;
  }) => (
    <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-4 py-3 border-b last:border-0">
      <div className="flex items-center gap-2 font-medium text-sm">
        <Icon className="w-4 h-4 text-muted-foreground" />
        {label}
      </div>
      {selectedRoutes.map(route => (
        <div key={route.id} className="text-center">
          {format(getValue(route))}
        </div>
      ))}
      {Array.from({ length: 3 - selectedRoutes.length }).map((_, i) => (
        <div key={i} className="text-center text-muted-foreground">-</div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" />
          Comparador de Rotas
        </CardTitle>
        <CardDescription>
          Selecione até 3 rotas para comparar lado a lado
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Selection */}
        <div className="flex flex-wrap gap-2">
          {routes.filter(r => !r.is_discarded).map(route => (
            <div
              key={route.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                selectedIds.includes(route.id) 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => toggleSelect(route.id)}
            >
              <Checkbox 
                checked={selectedIds.includes(route.id)}
                onCheckedChange={() => toggleSelect(route.id)}
              />
              <span className="text-sm font-medium">{route.route_name}</span>
              <Badge variant="secondary" className="text-xs">
                {Number(route.total_score).toFixed(1)}
              </Badge>
            </div>
          ))}
        </div>

        {selectedRoutes.length >= 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border overflow-hidden"
          >
            {/* Header */}
            <div className="grid grid-cols-[200px_repeat(3,1fr)] gap-4 p-4 bg-muted/50 border-b">
              <div className="font-semibold">Critério</div>
              {selectedRoutes.map(route => (
                <div key={route.id} className="text-center font-semibold">
                  {route.route_name}
                </div>
              ))}
              {Array.from({ length: 3 - selectedRoutes.length }).map((_, i) => (
                <div key={i} />
              ))}
            </div>

            {/* Comparison Rows */}
            <div className="p-4">
              <ComparisonRow
                label="Score Total"
                icon={TrendingUp}
                getValue={(r) => r.total_score}
                format={(v) => (
                  <span className="text-xl font-bold text-primary">{Number(v).toFixed(1)}</span>
                )}
              />

              <ComparisonRow
                label="Paixão"
                icon={Heart}
                getValue={(r) => r.passion_score}
                format={(v) => (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: `${v * 10}%` }} />
                    </div>
                    <span className="text-sm font-medium">{v}/10</span>
                  </div>
                )}
              />

              <ComparisonRow
                label="Habilidade"
                icon={Wrench}
                getValue={(r) => r.skill_score}
                format={(v) => (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${v * 10}%` }} />
                    </div>
                    <span className="text-sm font-medium">{v}/10</span>
                  </div>
                )}
              />

              <ComparisonRow
                label="Mercado"
                icon={TrendingUp}
                getValue={(r) => r.market_score}
                format={(v) => (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${v * 10}%` }} />
                    </div>
                    <span className="text-sm font-medium">{v}/10</span>
                  </div>
                )}
              />

              <ComparisonRow
                label="Tempo de Transição"
                icon={Clock}
                getValue={(r) => r.transition_time_months}
                format={(v) => v ? `${v} meses` : '-'}
              />

              <ComparisonRow
                label="Nível de Risco"
                icon={AlertTriangle}
                getValue={(r) => r.risk_level}
                format={(v) => v ? (
                  <Badge className={getRiskColor(v as RiskLevel)}>
                    {RISK_LEVEL_LABELS[v as RiskLevel]}
                  </Badge>
                ) : '-'}
              />

              <ComparisonRow
                label="Retorno Financeiro"
                icon={DollarSign}
                getValue={(r) => r.financial_return}
                format={(v) => v || '-'}
              />

              <ComparisonRow
                label="Aderência ao Perfil"
                icon={User}
                getValue={(r) => r.profile_fit_percentage}
                format={(v) => (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${v}%` }} />
                    </div>
                    <span className="text-sm font-medium">{v}%</span>
                  </div>
                )}
              />
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <GitCompare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Selecione pelo menos 2 rotas para comparar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
