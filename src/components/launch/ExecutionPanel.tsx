import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus, Briefcase, Users, MessageSquare, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { useLaunch } from '@/hooks/useLaunch';
import { PANEL_TYPE_LABELS, PANEL_STATUS_LABELS, type ExecutionPanelItem } from '@/types/launch';

interface ExecutionPanelProps {
  onComplete?: () => void;
}

export function ExecutionPanel({ onComplete }: ExecutionPanelProps) {
  const { executionItems, addExecutionItem, updateExecutionItem, deleteExecutionItem, getExecutionStats } = useLaunch();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExecutionPanelItem | null>(null);
  const [formData, setFormData] = useState({
    panel_type: 'job_application' as 'job_application' | 'networking' | 'followup',
    title: '',
    company: '',
    contact_name: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'rejected',
    notes: '',
    due_date: ''
  });

  const stats = getExecutionStats();

  const handleSubmit = async () => {
    if (!formData.title) return;
    
    if (editingItem) {
      await updateExecutionItem(editingItem.id, formData);
    } else {
      await addExecutionItem(formData);
    }
    
    setIsOpen(false);
    setEditingItem(null);
    resetForm();
    onComplete?.();
  };

  const resetForm = () => {
    setFormData({
      panel_type: 'job_application',
      title: '',
      company: '',
      contact_name: '',
      status: 'pending',
      notes: '',
      due_date: ''
    });
  };

  const openEdit = (item: ExecutionPanelItem) => {
    setEditingItem(item);
    setFormData({
      panel_type: item.panel_type,
      title: item.title,
      company: item.company || '',
      contact_name: item.contact_name || '',
      status: item.status,
      notes: item.notes || '',
      due_date: item.due_date?.split('T')[0] || ''
    });
    setIsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'job_application': return <Briefcase className="h-4 w-4" />;
      case 'networking': return <Users className="h-4 w-4" />;
      case 'followup': return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };

  const filterByType = (type: string) => executionItems.filter(i => i.panel_type === type);

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Painel de Execução Migrei
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe suas aplicações, networking e follow-ups
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setEditingItem(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar Item' : 'Novo Item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={formData.panel_type}
                  onValueChange={(v) => setFormData({ ...formData, panel_type: v as typeof formData.panel_type })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job_application">Vaga Aplicada</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                    <SelectItem value="followup">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Desenvolvedor Frontend na XYZ"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Empresa</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nome da empresa"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Contato</label>
                  <Input
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    placeholder="Nome do contato"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as typeof formData.status })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="rejected">Rejeitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Data Limite</label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Anotações sobre esta oportunidade..."
                  rows={3}
                />
              </div>
              
              <Button onClick={handleSubmit} className="w-full">
                {editingItem ? 'Salvar Alterações' : 'Adicionar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-500/10 rounded-lg p-4 text-center">
            <Briefcase className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.completedJobApps}/{stats.totalJobApps}</div>
            <div className="text-xs text-muted-foreground">Vagas</div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{stats.completedNetworking}/{stats.totalNetworking}</div>
            <div className="text-xs text-muted-foreground">Networking</div>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{stats.completedFollowups}/{stats.totalFollowups}</div>
            <div className="text-xs text-muted-foreground">Follow-ups</div>
          </div>
        </div>

        <AnimatedTabs defaultValue="job_application">
          <AnimatedTabsList className="grid w-full grid-cols-3">
            <AnimatedTabsTrigger value="job_application">
              <Briefcase className="h-4 w-4 mr-2" aria-hidden="true" />
              Vagas ({filterByType('job_application').length})
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="networking">
              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
              Networking ({filterByType('networking').length})
            </AnimatedTabsTrigger>
            <AnimatedTabsTrigger value="followup">
              <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
              Follow-ups ({filterByType('followup').length})
            </AnimatedTabsTrigger>
          </AnimatedTabsList>
          
          {['job_application', 'networking', 'followup'].map((type) => (
            <AnimatedTabsContent key={type} value={type} className="space-y-3 mt-4">
              {filterByType(type).length === 0 ? (
                <EmptyState
                  icon={type === 'job_application' ? Briefcase : type === 'networking' ? Users : MessageSquare}
                  title="Nenhum item ainda"
                  description='Clique em "Adicionar" para começar.'
                />
              ) : (
                filterByType(type).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getTypeIcon(item.panel_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium truncate">{item.title}</span>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {PANEL_STATUS_LABELS[item.status]}
                          </Badge>
                        </div>
                        {(item.company || item.contact_name) && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {[item.company, item.contact_name].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        {item.due_date && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Prazo: {new Date(item.due_date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status !== 'completed' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateExecutionItem(item.id, { 
                            status: 'completed',
                            completed_at: new Date().toISOString()
                          })}
                          aria-label="Marcar como concluído"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openEdit(item)}
                        aria-label="Editar item"
                      >
                        <Edit2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteExecutionItem(item.id)}
                        aria-label="Excluir item"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </AnimatedTabsContent>
          ))}
        </AnimatedTabs>
      </CardContent>
    </Card>
  );
}
