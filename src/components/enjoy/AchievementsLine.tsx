import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Star, Medal, Award, Plus, PartyPopper, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AchievementLine } from '@/types/enjoy';

interface Props {
  achievements: AchievementLine[];
  onAdd: (title: string, description?: string, achievementType?: string) => Promise<void>;
  onCelebrate: (id: string) => Promise<void>;
}

const ACHIEVEMENT_TYPES = [
  { value: 'milestone', label: 'Marco', icon: Star },
  { value: 'badge', label: 'Distintivo', icon: Medal },
  { value: 'certification', label: 'Certificação', icon: Award },
  { value: 'recognition', label: 'Reconhecimento', icon: Trophy },
];

export const AchievementsLine = ({ achievements, onAdd, onCelebrate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState('milestone');
  const [celebratingId, setCelebratingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await onAdd(newTitle, newDescription || undefined, newType);
    setNewTitle('');
    setNewDescription('');
    setNewType('milestone');
    setIsOpen(false);
  };

  const handleCelebrate = async (id: string) => {
    setCelebratingId(id);
    await onCelebrate(id);
    setTimeout(() => setCelebratingId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = ACHIEVEMENT_TYPES.find(t => t.value === type);
    const Icon = typeConfig?.icon || Star;
    return <Icon className="h-5 w-5" />;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'badge': return 'bg-blue-500/20 text-blue-500';
      case 'certification': return 'bg-purple-500/20 text-purple-500';
      case 'recognition': return 'bg-amber-500/20 text-amber-500';
      default: return 'bg-primary/20 text-primary';
    }
  };

  return (
    <Card className="border-amber-500/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Linha de Conquistas
        </CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Conquista
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Conquista</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select value={newType} onValueChange={setNewType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACHIEVEMENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <type.icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Ex: Completei a Fase 3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição (opcional)</label>
                <Textarea
                  placeholder="Detalhes sobre essa conquista..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button onClick={handleAdd} className="w-full">
                Registrar Conquista
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhuma conquista registrada ainda</p>
            <p className="text-sm">Adicione seus marcos e celebrações!</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-primary to-secondary" />
            
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div 
                  key={achievement.id} 
                  className={`relative flex gap-4 ${celebratingId === achievement.id ? 'animate-pulse' : ''}`}
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${getTypeColor(achievement.achievement_type)}`}>
                    {getTypeIcon(achievement.achievement_type)}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-muted/30 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold">{achievement.title}</h4>
                        {achievement.description && (
                          <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(achievement.achieved_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {achievement.is_celebrated ? (
                          <Badge variant="secondary" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            Celebrada
                          </Badge>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleCelebrate(achievement.id)}
                            className="gap-1"
                          >
                            <PartyPopper className="h-4 w-4" />
                            Celebrar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
