import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useDiscovery } from '@/hooks/useDiscovery';
import { EventType } from '@/types/discovery';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

const eventTypeConfig: Record<EventType, { icon: React.ElementType; label: string; color: string; bgColor: string }> = {
  positive: { icon: TrendingUp, label: 'Positivo', color: 'text-green-600', bgColor: 'bg-green-500' },
  negative: { icon: TrendingDown, label: 'Negativo', color: 'text-red-600', bgColor: 'bg-red-500' },
  neutral: { icon: Minus, label: 'Neutro', color: 'text-gray-600', bgColor: 'bg-gray-500' },
};

export function ProfessionalTimeline() {
  const { timeline, addTimelineEvent, deleteTimelineEvent, updateTimelineWithAILearning } = useDiscovery();
  const [isAdding, setIsAdding] = useState(false);
  const [generatingAI, setGeneratingAI] = useState<string | null>(null);
  
  // Form state
  const [year, setYear] = useState(new Date().getFullYear());
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState<EventType>('positive');
  const [learnings, setLearnings] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) return;
    
    await addTimelineEvent(year, title, description, eventType, learnings);
    
    // Reset form
    setTitle('');
    setDescription('');
    setEventType('positive');
    setLearnings('');
    setIsAdding(false);
  };

  const handleGenerateAILearning = async (eventId: string, eventData: { event_title: string; event_description: string | null; event_type: string }) => {
    setGeneratingAI(eventId);
    try {
      const response = await supabase.functions.invoke('profession-recommendations', {
        body: { 
          userProfile: eventData, 
          action: 'suggest_timeline_learning' 
        },
      });

      if (response.data?.content) {
        await updateTimelineWithAILearning(eventId, response.data.content);
      }
    } catch (error) {
      console.error('Error generating AI learning:', error);
    } finally {
      setGeneratingAI(null);
    }
  };

  // Group events by decade
  const groupedEvents = timeline.reduce((acc, event) => {
    const decade = Math.floor(event.event_year / 10) * 10;
    if (!acc[decade]) acc[decade] = [];
    acc[decade].push(event);
    return acc;
  }, {} as Record<number, typeof timeline>);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Linha do Tempo Profissional</h2>
        <p className="text-muted-foreground">
          Mapeie os marcos da sua trajetória profissional
        </p>
      </div>

      {/* Add New Event */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Adicionar Marco</CardTitle>
            <Button
              variant={isAdding ? 'outline' : 'default'}
              size="sm"
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-1" /> Adicionar</>}
            </Button>
          </div>
        </CardHeader>
        
        <AnimatePresence>
          {isAdding && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ano</label>
                    <Input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value))}
                      min={1950}
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo</label>
                    <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(eventTypeConfig) as EventType[]).map((type) => {
                          const { icon: Icon, label, color } = eventTypeConfig[type];
                          return (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${color}`} />
                                {label}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Título do Marco</label>
                  <Input
                    placeholder="Ex: Promoção para gerente, Mudança de área..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    placeholder="Descreva o que aconteceu..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Aprendizados (opcional)</label>
                  <Textarea
                    placeholder="O que você aprendeu com essa experiência?"
                    value={learnings}
                    onChange={(e) => setLearnings(e.target.value)}
                    className="h-20"
                  />
                </div>

                <Button onClick={handleAdd} disabled={!title.trim()} className="w-full">
                  Salvar Marco
                </Button>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Timeline Display */}
      {timeline.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum marco adicionado ainda. Comece mapeando sua trajetória!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-ml-px" />

          <div className="space-y-8">
            {Object.entries(groupedEvents)
              .sort(([a], [b]) => parseInt(b) - parseInt(a))
              .map(([decade, events]) => (
                <div key={decade} className="space-y-4">
                  <Badge variant="outline" className="ml-10 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                    {decade}s
                  </Badge>

                  {events.map((event, index) => {
                    const { icon: Icon, color, bgColor } = eventTypeConfig[event.event_type as EventType];
                    const isLeft = index % 2 === 0;

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`relative flex items-start ${isLeft ? 'md:flex-row-reverse' : ''}`}
                      >
                        {/* Timeline dot */}
                        <div className={`absolute left-4 md:left-1/2 md:-ml-2 w-4 h-4 rounded-full ${bgColor} border-4 border-background z-10`} />

                        {/* Content */}
                        <Card className={`ml-10 flex-1 ${isLeft ? 'md:mr-10 md:ml-0' : 'md:ml-10'}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${color}`} />
                                <Badge variant="secondary">{event.event_year}</Badge>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteTimelineEvent(event.id)}
                                aria-label="Excluir evento"
                              >
                                <Trash2 className="h-3 w-3" aria-hidden="true" />
                              </Button>
                            </div>
                            <CardTitle className="text-base">{event.event_title}</CardTitle>
                            {event.event_description && (
                              <CardDescription>{event.event_description}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {event.learnings && (
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm font-medium mb-1">💡 Aprendizado:</p>
                                <p className="text-sm text-muted-foreground">{event.learnings}</p>
                              </div>
                            )}
                            
                            {event.ai_suggested_learning && (
                              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3 text-primary" />
                                  Insight do Coach:
                                </p>
                                <p className="text-sm text-muted-foreground">{event.ai_suggested_learning}</p>
                              </div>
                            )}

                            {!event.ai_suggested_learning && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs"
                                disabled={generatingAI === event.id}
                                onClick={() => handleGenerateAILearning(event.id, {
                                  event_title: event.event_title,
                                  event_description: event.event_description,
                                  event_type: event.event_type,
                                })}
                              >
                                {generatingAI === event.id ? (
                                  <><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Gerando...</>
                                ) : (
                                  <><Sparkles className="h-3 w-3 mr-1" /> Gerar insight com IA</>
                                )}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
