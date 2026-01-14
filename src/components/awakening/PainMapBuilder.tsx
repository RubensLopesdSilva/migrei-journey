import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, X, Frown, Battery, AlertTriangle, Sparkles } from 'lucide-react';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';

interface PainMapBuilderProps {
  onComplete: () => void;
}

type PainType = 'hurts' | 'tires' | 'frustrates';

const painTypes: { key: PainType; label: string; icon: typeof Frown; color: string; bgColor: string }[] = [
  { key: 'hurts', label: 'O que dói', icon: Frown, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  { key: 'tires', label: 'O que cansa', icon: Battery, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  { key: 'frustrates', label: 'O que frustra', icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-500/10' }
];

export function PainMapBuilder({ onComplete }: PainMapBuilderProps) {
  const { painMap, addPainPoint, removePainPoint } = useAwakening();
  const [activePainType, setActivePainType] = useState<PainType>('hurts');
  const [newDescription, setNewDescription] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newDescription.trim()) return;
    
    setIsAdding(true);
    await addPainPoint(activePainType, newDescription.trim(), intensity);
    setNewDescription('');
    setIntensity(3);
    setIsAdding(false);
  };

  const getPainsByType = (type: PainType) => painMap.filter(p => p.pain_type === type);

  const currentType = painTypes.find(t => t.key === activePainType)!;
  const canContinue = painMap.length >= 2;

  return (
    <Card className="w-full max-w-3xl mx-auto card-elevated">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <Badge variant="secondary">Mapa de Dor</Badge>
        </div>
        <CardTitle className="text-2xl">Identifique suas Dores Profissionais</CardTitle>
        <CardDescription>
          O que te incomoda na sua situação atual? Seja honesto consigo mesmo.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Pain Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          {painTypes.map(type => {
            const Icon = type.icon;
            const count = getPainsByType(type.key).length;
            
            return (
              <Button
                key={type.key}
                variant={activePainType === type.key ? 'default' : 'outline'}
                onClick={() => setActivePainType(type.key)}
                className={cn(
                  "flex flex-col h-auto py-3 gap-1",
                  activePainType === type.key && type.bgColor
                )}
              >
                <Icon className={cn("h-5 w-5", activePainType === type.key ? '' : type.color)} />
                <span className="text-xs">{type.label}</span>
                {count > 0 && (
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Add New Pain */}
        <div className={cn("p-4 rounded-lg border-2 border-dashed space-y-4", currentType.bgColor)}>
          <div className="flex gap-2">
            <Input
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder={`Descreva algo que ${currentType.label.toLowerCase().replace('o que ', '')}...`}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Button onClick={handleAdd} disabled={!newDescription.trim() || isAdding}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Intensidade:</span>
              <span className={cn("font-medium", currentType.color)}>{intensity}/5</span>
            </div>
            <Slider
              value={[intensity]}
              onValueChange={([v]) => setIntensity(v)}
              min={1}
              max={5}
              step={1}
            />
          </div>
        </div>

        {/* Pain List */}
        <div className="space-y-4">
          {painTypes.map(type => {
            const pains = getPainsByType(type.key);
            if (pains.length === 0) return null;

            const Icon = type.icon;
            
            return (
              <div key={type.key} className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon className={cn("h-4 w-4", type.color)} />
                  <span>{type.label}</span>
                </div>
                <div className="space-y-2">
                  {pains.map(pain => (
                    <div
                      key={pain.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg",
                        type.bgColor
                      )}
                    >
                      <div className="flex-1">
                        <p className="text-sm">{pain.description}</p>
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-1.5 w-4 rounded-full",
                                i < pain.intensity ? type.color.replace('text-', 'bg-') : 'bg-muted'
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removePainPoint(pain.id)}
                        aria-label="Remover dor"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {painMap.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Frown className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma dor mapeada ainda.</p>
            <p className="text-sm">Comece identificando o que te incomoda no trabalho.</p>
          </div>
        )}

        {/* Continue Button */}
        <div className="pt-4 border-t">
          <Button 
            onClick={onComplete} 
            disabled={!canContinue}
            className="w-full"
            size="lg"
          >
            {canContinue ? 'Continuar para próxima etapa' : `Adicione pelo menos ${2 - painMap.length} dor(es) para continuar`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
