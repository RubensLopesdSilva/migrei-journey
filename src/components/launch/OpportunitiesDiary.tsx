import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Plus, BookOpen, MessageCircle, UserPlus, ClipboardList, Trash2, Edit2, Star } from 'lucide-react';
import { useLaunch } from '@/hooks/useLaunch';
import { ENTRY_TYPE_LABELS, type OpportunityDiaryEntry } from '@/types/launch';

interface OpportunitiesDiaryProps {
  onComplete?: () => void;
}

export function OpportunitiesDiary({ onComplete }: OpportunitiesDiaryProps) {
  const { diaryEntries, addDiaryEntry, updateDiaryEntry, deleteDiaryEntry } = useLaunch();
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<OpportunityDiaryEntry | null>(null);
  const [formData, setFormData] = useState({
    entry_type: 'conversation' as 'conversation' | 'referral' | 'selection_process',
    title: '',
    description: '',
    contact_name: '',
    company: '',
    outcome: '',
    next_steps: '',
    importance_level: 3,
    entry_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async () => {
    if (!formData.title) return;
    
    if (editingEntry) {
      await updateDiaryEntry(editingEntry.id, formData);
    } else {
      await addDiaryEntry(formData);
    }
    
    setIsOpen(false);
    setEditingEntry(null);
    resetForm();
    onComplete?.();
  };

  const resetForm = () => {
    setFormData({
      entry_type: 'conversation',
      title: '',
      description: '',
      contact_name: '',
      company: '',
      outcome: '',
      next_steps: '',
      importance_level: 3,
      entry_date: new Date().toISOString().split('T')[0]
    });
  };

  const openEdit = (entry: OpportunityDiaryEntry) => {
    setEditingEntry(entry);
    setFormData({
      entry_type: entry.entry_type,
      title: entry.title,
      description: entry.description || '',
      contact_name: entry.contact_name || '',
      company: entry.company || '',
      outcome: entry.outcome || '',
      next_steps: entry.next_steps || '',
      importance_level: entry.importance_level,
      entry_date: entry.entry_date
    });
    setIsOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'conversation': return <MessageCircle className="h-4 w-4" />;
      case 'referral': return <UserPlus className="h-4 w-4" />;
      case 'selection_process': return <ClipboardList className="h-4 w-4" />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'conversation': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'referral': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'selection_process': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted';
    }
  };

  const renderImportanceStars = (level: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= level ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`}
          />
        ))}
      </div>
    );
  };

  // Group entries by date
  const groupedEntries = diaryEntries.reduce((acc, entry) => {
    const date = entry.entry_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, OpportunityDiaryEntry[]>);

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Diário de Oportunidades
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Registre conversas, indicações e processos seletivos
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingEntry(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Entrada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Editar Entrada' : 'Nova Entrada'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <Select
                    value={formData.entry_type}
                    onValueChange={(v) => setFormData({ ...formData, entry_type: v as typeof formData.entry_type })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conversation">Conversa</SelectItem>
                      <SelectItem value="referral">Indicação</SelectItem>
                      <SelectItem value="selection_process">Processo Seletivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={formData.entry_date}
                    onChange={(e) => setFormData({ ...formData, entry_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Conversa com recrutador da ABC"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Contato</label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Nome do contato"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Empresa</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes sobre a oportunidade..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Resultado/Outcome</label>
                <Textarea
                  value={formData.outcome}
                  onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                  placeholder="O que aconteceu?"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Próximos Passos</label>
                <Textarea
                  value={formData.next_steps}
                  onChange={(e) => setFormData({ ...formData, next_steps: e.target.value })}
                  placeholder="O que você precisa fazer a seguir?"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Importância: {formData.importance_level}/5</label>
                <Slider
                  value={[formData.importance_level]}
                  onValueChange={(v) => setFormData({ ...formData, importance_level: v[0] })}
                  min={1}
                  max={5}
                  step={1}
                  className="mt-2"
                />
              </div>
              
              <Button onClick={handleSubmit} className="w-full">
                {editingEntry ? 'Salvar Alterações' : 'Adicionar Entrada'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {Object.keys(groupedEntries).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Seu diário está vazio.</p>
            <p className="text-sm">Registre suas conversas e oportunidades para acompanhar sua jornada.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, entries]) => (
                <div key={date}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">
                    {new Date(date).toLocaleDateString('pt-BR', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </h4>
                  <div className="space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <Badge variant="outline" className={`gap-1 ${getTypeColor(entry.entry_type)}`}>
                                {getTypeIcon(entry.entry_type)}
                                {ENTRY_TYPE_LABELS[entry.entry_type]}
                              </Badge>
                              {renderImportanceStars(entry.importance_level)}
                            </div>
                            <h5 className="font-medium">{entry.title}</h5>
                            {(entry.contact_name || entry.company) && (
                              <p className="text-sm text-muted-foreground">
                                {[entry.contact_name, entry.company].filter(Boolean).join(' • ')}
                              </p>
                            )}
                            {entry.description && (
                              <p className="text-sm mt-2">{entry.description}</p>
                            )}
                            {entry.next_steps && (
                              <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
                                <strong>Próximos passos:</strong> {entry.next_steps}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(entry)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteDiaryEntry(entry.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
