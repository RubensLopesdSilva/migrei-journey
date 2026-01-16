import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Briefcase, Users, MessageSquare, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { useLaunch } from '@/hooks/useLaunch';
import { PANEL_STATUS_LABELS, type ExecutionPanelItem } from '@/types/launch';
import { cn } from '@/lib/utils';

interface ExecutionPanelProps {
  onComplete?: () => void;
}

export function ExecutionPanel({ onComplete }: ExecutionPanelProps) {
  const { executionItems, addExecutionItem, updateExecutionItem, deleteExecutionItem, getExecutionStats } = useLaunch();
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExecutionPanelItem | null>(null);
  const [activeTab, setActiveTab] = useState<'job_application' | 'networking' | 'followup'>('job_application');
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
    setFormData({ panel_type: activeTab, title: '', company: '', contact_name: '', status: 'pending', notes: '', due_date: '' });
  };

  const openAdd = () => {
    resetForm();
    setFormData(p => ({ ...p, panel_type: activeTab }));
    setIsOpen(true);
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
      case 'completed': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'rejected': return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const tabs = [
    { key: 'job_application' as const, label: 'Vagas', icon: Briefcase, count: stats.totalJobApps, completed: stats.completedJobApps },
    { key: 'networking' as const, label: 'Networking', icon: Users, count: stats.totalNetworking, completed: stats.completedNetworking },
    { key: 'followup' as const, label: 'Follow-ups', icon: MessageSquare, count: stats.totalFollowups, completed: stats.completedFollowups },
  ];

  const filteredItems = executionItems.filter(i => i.panel_type === activeTab);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">Painel de Execução</h2>
          <p className="text-muted-foreground text-sm">Acompanhe suas ações</p>
        </div>
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { setEditingItem(null); resetForm(); } }}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={openAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Editar' : 'Novo item'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título"
                className="h-12"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Empresa"
                />
                <Input
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  placeholder="Contato"
                />
              </div>
              <div className="flex gap-2">
                {(['pending', 'in_progress', 'completed', 'rejected'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-medium transition-all",
                      formData.status === s ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}
                  >
                    {PANEL_STATUS_LABELS[s]}
                  </button>
                ))}
              </div>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas..."
                rows={2}
              />
              <Button onClick={handleSubmit} className="w-full">{editingItem ? 'Salvar' : 'Adicionar'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "p-4 rounded-xl text-center transition-all",
                activeTab === tab.key ? "bg-primary/10 ring-2 ring-primary" : "bg-muted/50 hover:bg-muted"
              )}
            >
              <Icon className={cn("h-5 w-5 mx-auto mb-1", activeTab === tab.key ? "text-primary" : "text-muted-foreground")} />
              <div className="text-xl font-bold">{tab.completed}/{tab.count}</div>
              <div className="text-xs text-muted-foreground">{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Items List */}
      <AnimatePresence mode="popLayout">
        {filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            <p>Nenhum item nesta categoria</p>
            <p className="text-sm">Clique em "Adicionar" para começar</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">{item.title}</span>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {PANEL_STATUS_LABELS[item.status]}
                    </Badge>
                  </div>
                  {(item.company || item.contact_name) && (
                    <p className="text-sm text-muted-foreground truncate">
                      {[item.company, item.contact_name].filter(Boolean).join(' • ')}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.status !== 'completed' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateExecutionItem(item.id, { status: 'completed', completed_at: new Date().toISOString() })}
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteExecutionItem(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
