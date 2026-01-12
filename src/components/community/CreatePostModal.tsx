import { useState } from 'react';
import { AlertCircle, CheckCircle, HelpCircle, HandHeart, Briefcase, MessageSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { PostType } from '@/types/community';
import { POST_TEMPLATES } from '@/types/community';

const POST_ICONS: Record<PostType, React.ElementType> = {
  stuck_at: AlertCircle,
  completed_phase: CheckCircle,
  need_help: HelpCircle,
  can_help: HandHeart,
  opportunity: Briefcase,
  general: MessageSquare
};

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (postType: PostType, title: string, content: string) => Promise<{ error: Error | null }>;
}

export function CreatePostModal({ open, onOpenChange, onSubmit }: CreatePostModalProps) {
  const [selectedType, setSelectedType] = useState<PostType>('general');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const template = POST_TEMPLATES[selectedType];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    const { error } = await onSubmit(selectedType, title, content);
    if (!error) {
      setTitle('');
      setContent('');
      setSelectedType('general');
      onOpenChange(false);
    }
    setLoading(false);
  };

  const postTypes = Object.entries(POST_TEMPLATES) as [PostType, typeof POST_TEMPLATES[PostType]][];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Criar Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Post type selection */}
          <div>
            <Label className="mb-3 block">Tipo de post</Label>
            <div className="grid grid-cols-2 gap-2">
              {postTypes.map(([type, config]) => {
                const Icon = POST_ICONS[type];
                return (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border text-left transition-all",
                      selectedType === type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.color)} />
                    <span className="text-sm font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="mb-2 block">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Um título claro e objetivo"
            />
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="mb-2 block">Conteúdo</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={template.placeholder}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || loading}
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
