import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Wrench, Zap, Plus, Play, CheckCircle, Clock, Trash2 } from 'lucide-react';
import type { DevelopmentTrackItem } from '@/types/develop';

interface DevelopmentTrackProps {
  items: DevelopmentTrackItem[];
  onAddItem: (data: Partial<DevelopmentTrackItem>) => Promise<any>;
  onUpdateItem: (id: string, data: Partial<DevelopmentTrackItem>) => Promise<boolean>;
  onDeleteItem: (id: string) => Promise<boolean>;
  onComplete?: () => void;
}

const typeConfig = {
  course: { icon: GraduationCap, label: 'Cursos', color: 'text-blue-600 bg-blue-100' },
  project: { icon: Wrench, label: 'Projetos', color: 'text-purple-600 bg-purple-100' },
  microchallenge: { icon: Zap, label: 'Microdesafios', color: 'text-yellow-600 bg-yellow-100' }
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-700 border-green-200'
};

export function DevelopmentTrack({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onComplete
}: DevelopmentTrackProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<DevelopmentTrackItem>>({
    item_type: 'course',
    title: '',
    description: '',
    provider: '',
    url: '',
    estimated_hours: undefined,
    priority: 'medium'
  });

  const completedCount = items.filter(i => i.status === 'completed').length;
  const inProgressCount = items.filter(i => i.status === 'in_progress').length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleAdd = async () => {
    await onAddItem(formData);
    setIsDialogOpen(false);
    setFormData({
      item_type: 'course',
      title: '',
      description: '',
      provider: '',
      url: '',
      estimated_hours: undefined,
      priority: 'medium'
    });
  };

  const handleStatusChange = async (item: DevelopmentTrackItem, status: string) => {
    await onUpdateItem(item.id, { status: status as any });
    if (status === 'completed' && completedCount >= 2 && onComplete) {
      onComplete();
    }
  };

  const getItemsByType = (type: string) => items.filter(i => i.item_type === type);

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>Trilha de Desenvolvimento</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cursos, projetos e microdesafios
              </p>
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{items.length - completedCount - inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Pendentes</p>
          </Card>
          <Card className="p-4 text-center bg-blue-50 dark:bg-blue-950/20">
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
            <p className="text-xs text-blue-600">Em Progresso</p>
          </Card>
          <Card className="p-4 text-center bg-green-50 dark:bg-green-950/20">
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs text-green-600">Concluídos</p>
          </Card>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso geral</span>
            <span className="text-sm font-medium">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Items by type */}
        <Tabs defaultValue="course" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(typeConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <config.icon className="w-4 h-4" />
                {config.label}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  {getItemsByType(key).length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(typeConfig).map(([type, config]) => (
            <TabsContent key={type} value={type} className="space-y-3 mt-4">
              {getItemsByType(type).length > 0 ? (
                getItemsByType(type).map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}>
                          <config.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          {item.provider && (
                            <p className="text-xs text-muted-foreground">{item.provider}</p>
                          )}
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={priorityColors[item.priority]}>
                              {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                            {item.estimated_hours && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {item.estimated_hours}h
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(item, 'in_progress')}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Iniciar
                          </Button>
                        )}
                        {item.status === 'in_progress' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusChange(item, 'completed')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Concluir
                          </Button>
                        )}
                        {item.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Concluído
                          </Badge>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDeleteItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <config.icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum item adicionado</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar à Trilha</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tipo</Label>
                <Select
                  value={formData.item_type}
                  onValueChange={(value: any) => setFormData({ ...formData, item_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="course">Curso</SelectItem>
                    <SelectItem value="project">Projeto Prático</SelectItem>
                    <SelectItem value="microchallenge">Microdesafio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Título</Label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Curso de Product Management"
                />
              </div>

              <div>
                <Label>Descrição (opcional)</Label>
                <Textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o objetivo..."
                  rows={2}
                />
              </div>

              {formData.item_type === 'course' && (
                <div>
                  <Label>Provedor/Plataforma</Label>
                  <Input
                    value={formData.provider || ''}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="Ex: Coursera, Udemy, Alura..."
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Horas Estimadas</Label>
                  <Input
                    type="number"
                    value={formData.estimated_hours || ''}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || undefined })}
                    placeholder="Ex: 10"
                  />
                </div>
                <div>
                  <Label>Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>URL (opcional)</Label>
                <Input
                  value={formData.url || ''}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <Button onClick={handleAdd} className="w-full">
                Adicionar à Trilha
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
