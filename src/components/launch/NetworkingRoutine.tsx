import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, Clock, MessageCircle, UserPlus, Send, 
  CheckCircle2, Circle, Trash2, ExternalLink, Sparkles 
} from 'lucide-react';
import { useLaunch } from '@/hooks/useLaunch';
import { ACTION_TYPE_LABELS, type NetworkingRoutineItem } from '@/types/launch';

interface NetworkingRoutineProps {
  onComplete?: () => void;
}

export function NetworkingRoutine({ onComplete }: NetworkingRoutineProps) {
  const { 
    networkingItems, 
    addNetworkingItem, 
    completeNetworkingItem, 
    deleteNetworkingItem,
    getTodayNetworkingActions 
  } = useLaunch();
  
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    action_type: 'comment' as 'comment' | 'connect' | 'message',
    target_name: '',
    target_profile_url: '',
    action_description: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    completed: false
  });

  const todayActions = getTodayNetworkingActions();
  const completedToday = todayActions.filter(a => a.completed).length;
  const progressPercent = todayActions.length > 0 ? (completedToday / todayActions.length) * 100 : 0;

  const handleSubmit = async () => {
    if (!formData.action_type) return;
    
    await addNetworkingItem(formData);
    setIsOpen(false);
    resetForm();
    onComplete?.();
  };

  const resetForm = () => {
    setFormData({
      action_type: 'comment',
      target_name: '',
      target_profile_url: '',
      action_description: '',
      scheduled_date: new Date().toISOString().split('T')[0],
      completed: false
    });
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'connect': return <UserPlus className="h-4 w-4" />;
      case 'message': return <Send className="h-4 w-4" />;
      default: return null;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'comment': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'connect': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'message': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted';
    }
  };

  const suggestedActions = [
    { type: 'comment', description: 'Comente em um post relevante do seu setor' },
    { type: 'connect', description: 'Conecte-se com alguém da sua área de interesse' },
    { type: 'message', description: 'Envie uma mensagem de agradecimento a um contato recente' }
  ];

  const addSuggestedAction = (action: typeof suggestedActions[0]) => {
    setFormData({
      ...formData,
      action_type: action.type as 'comment' | 'connect' | 'message',
      action_description: action.description
    });
    setIsOpen(true);
  };

  return (
    <Card className="border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Rotina de Networking (10 min/dia)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Pequenas ações diárias que constroem grandes redes
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Ação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Ação de Networking</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo de Ação</label>
                <Select
                  value={formData.action_type}
                  onValueChange={(v) => setFormData({ ...formData, action_type: v as typeof formData.action_type })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comment">💬 Comentar</SelectItem>
                    <SelectItem value="connect">🤝 Conectar</SelectItem>
                    <SelectItem value="message">📨 Enviar Mensagem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Nome do Contato/Perfil</label>
                <Input
                  value={formData.target_name}
                  onChange={(e) => setFormData({ ...formData, target_name: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">URL do Perfil (opcional)</label>
                <Input
                  value={formData.target_profile_url}
                  onChange={(e) => setFormData({ ...formData, target_profile_url: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Descrição da Ação</label>
                <Input
                  value={formData.action_description}
                  onChange={(e) => setFormData({ ...formData, action_description: e.target.value })}
                  placeholder="O que você vai fazer?"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Data Agendada</label>
                <Input
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>
              
              <Button onClick={handleSubmit} className="w-full">
                Adicionar Ação
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Today's Progress */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Progresso de Hoje</h4>
            <span className="text-sm text-muted-foreground">
              {completedToday}/{todayActions.length} ações
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          {todayActions.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Nenhuma ação agendada para hoje. Adicione suas ações diárias!
            </p>
          )}
        </div>

        {/* Suggested Actions */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Sugestões de Ações
          </h4>
          <div className="grid gap-2">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => addSuggestedAction(action)}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors text-left"
              >
                <div className={`p-2 rounded-lg ${getActionColor(action.type)}`}>
                  {getActionIcon(action.type)}
                </div>
                <div className="flex-1">
                  <span className="text-sm">{action.description}</span>
                </div>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        {/* Today's Actions */}
        {todayActions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Ações de Hoje</h4>
            <div className="space-y-2">
              {todayActions.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    item.completed ? 'bg-green-500/10' : 'bg-muted/50'
                  }`}
                >
                  <button
                    onClick={() => !item.completed && completeNetworkingItem(item.id)}
                    className={`p-1 rounded-full transition-colors ${
                      item.completed 
                        ? 'text-green-500' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    disabled={item.completed}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </button>
                  
                  <Badge variant="outline" className={`${getActionColor(item.action_type)} gap-1`}>
                    {getActionIcon(item.action_type)}
                    {ACTION_TYPE_LABELS[item.action_type]}
                  </Badge>
                  
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.target_name || item.action_description || 'Ação de networking'}
                    </span>
                  </div>
                  
                  {item.target_profile_url && (
                    <a
                      href={item.target_profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteNetworkingItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Previous Actions */}
        {networkingItems.filter(i => i.scheduled_date !== new Date().toISOString().split('T')[0]).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Ações Anteriores</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {networkingItems
                .filter(i => i.scheduled_date !== new Date().toISOString().split('T')[0])
                .slice(0, 10)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 p-2 rounded-lg text-sm ${
                      item.completed ? 'bg-green-500/5 text-muted-foreground' : 'bg-muted/30'
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.scheduled_date).toLocaleDateString('pt-BR')}
                    </span>
                    <Badge variant="outline" className={`text-xs ${getActionColor(item.action_type)}`}>
                      {ACTION_TYPE_LABELS[item.action_type]}
                    </Badge>
                    <span className="flex-1 truncate">
                      {item.target_name || item.action_description}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
