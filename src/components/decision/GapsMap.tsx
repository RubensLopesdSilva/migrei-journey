import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { 
  Map, 
  Plus,
  Lightbulb,
  GraduationCap,
  Hammer,
  Briefcase,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useDecision } from '@/hooks/useDecision';
import { GAP_TYPE_LABELS, PRIORITY_LABELS } from '@/types/decision';
import type { GapType, GapPriority, SuggestedAction } from '@/types/decision';

const ACTION_ICONS: Record<string, any> = {
  course: GraduationCap,
  practice: Hammer,
  project: Briefcase,
  mentoring: Users,
};

const SUGGESTED_ACTIONS_BY_TYPE: Record<GapType, SuggestedAction[]> = {
  technical: [
    { type: 'course', title: 'Curso online', description: 'Plataformas como Coursera, Udemy' },
    { type: 'practice', title: 'Projeto prático', description: 'Aplicar conhecimento em projeto real' },
    { type: 'project', title: 'Contribuição open source', description: 'Participar de projetos da comunidade' },
  ],
  behavioral: [
    { type: 'mentoring', title: 'Mentoria', description: 'Aprender com profissionais experientes' },
    { type: 'practice', title: 'Simulações', description: 'Praticar em situações controladas' },
    { type: 'course', title: 'Workshop', description: 'Treinamentos práticos focados' },
  ],
  positioning: [
    { type: 'project', title: 'Portfólio', description: 'Construir presença profissional' },
    { type: 'mentoring', title: 'Networking', description: 'Expandir rede de contatos' },
    { type: 'practice', title: 'Personal branding', description: 'Fortalecer marca pessoal' },
  ],
};

export const GapsMap = () => {
  const { skillsGaps, selectedRoute, addSkillGap, updateSkillGap } = useDecision();
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newGap, setNewGap] = useState({
    gap_type: 'technical' as GapType,
    gap_name: '',
    current_level: 2,
    required_level: 4,
    priority: 'medium' as GapPriority,
  });

  const handleAddGap = async () => {
    if (!newGap.gap_name.trim()) return;

    const suggestedActions = SUGGESTED_ACTIONS_BY_TYPE[newGap.gap_type] || [];
    
    await addSkillGap({
      ...newGap,
      route_id: selectedRoute?.id || null,
      suggested_actions: suggestedActions,
      is_addressed: false,
    });

    setNewGap({
      gap_type: 'technical',
      gap_name: '',
      current_level: 2,
      required_level: 4,
      priority: 'medium',
    });
    setIsAdding(false);
  };

  const getPriorityColor = (priority: GapPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-300';
    }
  };

  const getTypeColor = (type: GapType) => {
    switch (type) {
      case 'technical': return 'bg-blue-500/20 text-blue-700';
      case 'behavioral': return 'bg-purple-500/20 text-purple-700';
      case 'positioning': return 'bg-orange-500/20 text-orange-700';
    }
  };

  const gapsByType = {
    technical: skillsGaps.filter(g => g.gap_type === 'technical'),
    behavioral: skillsGaps.filter(g => g.gap_type === 'behavioral'),
    positioning: skillsGaps.filter(g => g.gap_type === 'positioning'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          Mapa de Lacunas Profissionais
        </CardTitle>
        <CardDescription>
          Identifique o que falta desenvolver: técnico, comportamental e posicionamento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary by Type */}
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(gapsByType) as [GapType, typeof skillsGaps][]).map(([type, gaps]) => (
            <Card key={type} className={`${getTypeColor(type)} border-0`}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{gaps.length}</div>
                <div className="text-sm">{GAP_TYPE_LABELS[type]}</div>
                <div className="text-xs mt-1 opacity-70">
                  {gaps.filter(g => g.is_addressed).length} resolvidas
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gaps List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {skillsGaps.map((gap, index) => {
              const gapProgress = Math.round(((gap.current_level - 1) / (gap.required_level - 1)) * 100);
              const isExpanded = expandedId === gap.id;

              return (
                <motion.div
                  key={gap.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={gap.is_addressed ? 'opacity-60' : ''}>
                    <div 
                      className="p-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : gap.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {gap.is_addressed && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          <span className="font-medium">{gap.gap_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(gap.gap_type)}>
                            {GAP_TYPE_LABELS[gap.gap_type]}
                          </Badge>
                          <Badge className={getPriorityColor(gap.priority)}>
                            {PRIORITY_LABELS[gap.priority]}
                          </Badge>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground w-16">
                          Nível {gap.current_level}
                        </span>
                        <Progress value={gapProgress} className="flex-1 h-2" />
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          → {gap.required_level}
                        </span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                        >
                          <CardContent className="pt-0 border-t">
                            <div className="pt-4 space-y-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Lightbulb className="w-4 h-4" />
                                <span>Ações sugeridas:</span>
                              </div>

                              <div className="grid gap-2">
                                {gap.suggested_actions.map((action, i) => {
                                  const Icon = ACTION_ICONS[action.type] || Lightbulb;
                                  return (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                      <Icon className="w-5 h-5 text-primary mt-0.5" />
                                      <div>
                                        <div className="font-medium text-sm">{action.title}</div>
                                        {action.description && (
                                          <div className="text-xs text-muted-foreground">{action.description}</div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              <Button
                                variant={gap.is_addressed ? 'outline' : 'default'}
                                size="sm"
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateSkillGap(gap.id, { is_addressed: !gap.is_addressed });
                                }}
                              >
                                {gap.is_addressed ? 'Marcar como pendente' : 'Marcar como resolvida'}
                              </Button>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add Gap Form */}
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
                    <Label>Nome da Lacuna</Label>
                    <Input
                      value={newGap.gap_name}
                      onChange={(e) => setNewGap(prev => ({ ...prev, gap_name: e.target.value }))}
                      placeholder="Ex: Conhecimento em Python"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tipo de Lacuna</Label>
                      <Select
                        value={newGap.gap_type}
                        onValueChange={(v: GapType) => setNewGap(prev => ({ ...prev, gap_type: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Técnica</SelectItem>
                          <SelectItem value="behavioral">Comportamental</SelectItem>
                          <SelectItem value="positioning">Posicionamento</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Prioridade</Label>
                      <Select
                        value={newGap.priority}
                        onValueChange={(v: GapPriority) => setNewGap(prev => ({ ...prev, priority: v }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nível Atual: {newGap.current_level}</Label>
                      <Slider
                        value={[newGap.current_level]}
                        onValueChange={(v) => setNewGap(prev => ({ ...prev, current_level: v[0] }))}
                        max={5}
                        min={1}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Nível Necessário: {newGap.required_level}</Label>
                      <Slider
                        value={[newGap.required_level]}
                        onValueChange={(v) => setNewGap(prev => ({ ...prev, required_level: v[0] }))}
                        max={5}
                        min={1}
                        step={1}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddGap} className="flex-1">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar Lacuna
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
              Adicionar Nova Lacuna
            </Button>
          )}
        </AnimatePresence>

        {skillsGaps.length === 0 && !isAdding && (
          <div className="text-center py-8 text-muted-foreground">
            <Map className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Nenhuma lacuna mapeada ainda.</p>
            <p className="text-sm">Identifique o que precisa desenvolver para sua transição.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
