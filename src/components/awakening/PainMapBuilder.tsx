import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, Frown, Battery, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAwakening } from '@/hooks/useAwakening';
import { cn } from '@/lib/utils';

interface PainMapBuilderProps {
  onComplete: () => void;
}

type PainType = 'hurts' | 'tires' | 'frustrates';

const painTypes: { key: PainType; label: string; shortLabel: string; icon: typeof Frown; color: string }[] = [
  { key: 'hurts', label: 'O que dói', shortLabel: 'Dói', icon: Frown, color: 'text-rose-500' },
  { key: 'tires', label: 'O que cansa', shortLabel: 'Cansa', icon: Battery, color: 'text-amber-500' },
  { key: 'frustrates', label: 'O que frustra', shortLabel: 'Frustra', icon: AlertTriangle, color: 'text-orange-500' }
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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold">
          Mapeie suas dores profissionais
        </h2>
        <p className="text-muted-foreground">
          O que te incomoda hoje? Seja honesto.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex p-1 bg-muted rounded-xl">
        {painTypes.map(type => {
          const Icon = type.icon;
          const count = getPainsByType(type.key).length;
          const isActive = activePainType === type.key;
          
          return (
            <button
              key={type.key}
              onClick={() => setActivePainType(type.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-all font-medium text-sm",
                isActive 
                  ? "bg-background shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? type.color : "")} />
              <span className="hidden sm:inline">{type.shortLabel}</span>
              {count > 0 && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  isActive ? "bg-primary/10 text-primary" : "bg-muted-foreground/20"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder={`Ex: ${activePainType === 'hurts' ? 'Falta de reconhecimento' : activePainType === 'tires' ? 'Reuniões intermináveis' : 'Burocracia excessiva'}...`}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="h-12"
          />
          <Button 
            onClick={handleAdd} 
            disabled={!newDescription.trim() || isAdding}
            size="lg"
            className="h-12 px-4"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Intensity Selector */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Intensidade:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                onClick={() => setIntensity(level)}
                className={cn(
                  "h-8 w-8 rounded-lg text-sm font-medium transition-all",
                  intensity >= level 
                    ? cn("text-white", 
                        level <= 2 ? "bg-amber-400" :
                        level <= 4 ? "bg-orange-500" : "bg-rose-500"
                      )
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                )}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pain List */}
      <div className="space-y-3 min-h-[120px]">
        <AnimatePresence mode="popLayout">
          {painMap.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-muted-foreground"
            >
              <p className="text-sm">Adicione pelo menos 2 dores para continuar</p>
            </motion.div>
          ) : (
            painMap.map(pain => {
              const type = painTypes.find(t => t.key === pain.pain_type)!;
              const Icon = type.icon;
              
              return (
                <motion.div
                  key={pain.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl group"
                >
                  <Icon className={cn("h-5 w-5 shrink-0", type.color)} />
                  <span className="flex-1 text-sm">{pain.description}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1.5 w-3 rounded-full",
                          i < pain.intensity ? "bg-primary/60" : "bg-muted"
                        )}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePainPoint(pain.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Continue */}
      <Button 
        onClick={onComplete} 
        disabled={!canContinue}
        className="w-full h-12 gap-2"
        size="lg"
      >
        Continuar
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
