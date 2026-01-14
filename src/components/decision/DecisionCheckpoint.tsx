import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Flag, 
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import confetti from 'canvas-confetti';

interface DecisionCheckpointProps {
  onComplete?: () => void;
}

export const DecisionCheckpoint = ({ onComplete }: DecisionCheckpointProps) => {
  const { routes, checkpoint, selectedRoute, confirmDecision } = useDecision();
  const [isConfirming, setIsConfirming] = useState(false);
  const [commitment, setCommitment] = useState('');
  const [confidence, setConfidence] = useState(7);

  const handleConfirmDecision = async () => {
    if (!selectedRoute) return;
    
    const result = await confirmDecision(selectedRoute.id, commitment, confidence);
    
    if (result) {
      // Celebration animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsConfirming(false);
    }
  };

  const activeRoutes = routes.filter(r => !r.is_discarded);

  // Already confirmed
  if (checkpoint?.is_confirmed && checkpoint.selected_route_id) {
    const confirmedRoute = routes.find(r => r.id === checkpoint.selected_route_id);
    
    return (
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Decisão Confirmada!</h2>
              <p className="opacity-90">Você escolheu sua rota de transição</p>
            </div>
          </div>
        </div>
        <CardContent className="pt-6 space-y-6">
          {/* Selected Route */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <div>
                  <Badge className="mb-1">Rota Escolhida</Badge>
                  <h3 className="text-xl font-bold">{confirmedRoute?.route_name}</h3>
                </div>
              </div>
              
              {checkpoint.commitment_statement && (
                <div className="p-4 rounded-lg bg-background border">
                  <p className="text-sm italic">"{checkpoint.commitment_statement}"</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Nível de confiança:
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${(checkpoint.confidence_level || 0) * 10}%` }}
                  />
                </div>
                <div className="font-bold">{checkpoint.confidence_level}/10</div>
              </div>
            </CardContent>
          </Card>

          {/* Discarded Routes */}
          {checkpoint.discarded_routes && checkpoint.discarded_routes.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Rotas bloqueadas
              </h4>
              <div className="space-y-2">
                {checkpoint.discarded_routes.map((dr, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 opacity-60"
                  >
                    <XCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{dr.route_name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Decisão confirmada em {new Date(checkpoint.decision_date!).toLocaleDateString('pt-BR')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" />
          Checkpoint de Decisão
        </CardTitle>
        <CardDescription>
          Confirme sua escolha final e bloqueie simbolicamente as demais rotas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pre-requisites check */}
        {!selectedRoute && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">Pré-requisitos</h4>
                  <p className="text-sm text-muted-foreground">
                    Antes de confirmar sua decisão, você precisa:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                      Selecionar uma rota na Matriz de Possibilidades
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Route Summary */}
        {selectedRoute && !isConfirming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <Badge className="mb-1">Rota Selecionada</Badge>
                    <h3 className="text-xl font-bold">{selectedRoute.route_name}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">
                      {Number(selectedRoute.total_score).toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Score</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold">
                      {selectedRoute.transition_time_months || '?'}
                    </div>
                    <div className="text-xs text-muted-foreground">Meses</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-background">
                    <div className="text-2xl font-bold text-primary">
                      {selectedRoute.profile_fit_percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">Fit</div>
                  </div>
                </div>

                {activeRoutes.length > 1 && (
                  <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    <p>
                      Ao confirmar, as outras {activeRoutes.length - 1} rotas serão simbolicamente bloqueadas.
                    </p>
                  </div>
                )}

                <Button 
                  className="w-full mt-4"
                  size="lg"
                  onClick={() => setIsConfirming(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Confirmar Esta Decisão
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confirmation Form */}
        <AnimatePresence>
          {isConfirming && selectedRoute && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <Card className="border-primary">
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Flag className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">Confirmar Decisão Final</h3>
                    <p className="text-muted-foreground">
                      Você está prestes a escolher: <strong>{selectedRoute.route_name}</strong>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Declaração de Compromisso</Label>
                    <Textarea
                      value={commitment}
                      onChange={(e) => setCommitment(e.target.value)}
                      placeholder="Escreva um compromisso pessoal com esta decisão..."
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Ex: "Eu me comprometo a dedicar 100% do meu foco para me tornar um Product Manager nos próximos 6 meses..."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Nível de Confiança na Decisão</Label>
                      <span className="text-2xl font-bold text-primary">{confidence}/10</span>
                    </div>
                    <Slider
                      value={[confidence]}
                      onValueChange={(v) => setConfidence(v[0])}
                      max={10}
                      min={1}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Ainda tenho dúvidas</span>
                      <span>100% confiante</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsConfirming(false)}
                    >
                      Voltar
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={handleConfirmDecision}
                      disabled={commitment.length < 20 || confidence < 5}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Confirmar Decisão
                    </Button>
                  </div>

                  {(commitment.length < 20 || confidence < 5) && (
                    <p className="text-xs text-center text-muted-foreground">
                      {commitment.length < 20 && 'Escreva uma declaração mais detalhada. '}
                      {confidence < 5 && 'Seu nível de confiança precisa ser pelo menos 5.'}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No routes */}
        {routes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Flag className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Adicione rotas na Matriz de Possibilidades primeiro.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
