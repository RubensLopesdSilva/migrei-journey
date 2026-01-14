import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Gift, HelpCircle, Plus, MessageCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from '@/components/ui/animated-tabs';
import { cn } from '@/lib/utils';
import type { GiveAskPost, GiveAskType } from '@/types/community';

interface GiveAskSectionProps {
  posts: GiveAskPost[];
  onCreatePost: (type: GiveAskType, title: string, description: string, skills: string[]) => Promise<{ error: Error | null }>;
  onFilter: (type?: GiveAskType) => void;
}

export function GiveAskSection({ posts, onCreatePost, onFilter }: GiveAskSectionProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState<GiveAskType>('give');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return;
    
    setLoading(true);
    const { error } = await onCreatePost(createType, title, description, skills);
    if (!error) {
      setTitle('');
      setDescription('');
      setSkills([]);
      setShowCreate(false);
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const givePosts = posts.filter(p => p.type === 'give');
  const askPosts = posts.filter(p => p.type === 'ask');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Dar & Receber</h2>
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {createType === 'give' ? 'Oferecer Ajuda' : 'Pedir Ajuda'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={createType === 'give' ? 'default' : 'outline'}
                  onClick={() => setCreateType('give')}
                  className="flex-1 gap-2"
                >
                  <Gift className="h-4 w-4" />
                  Oferecer
                </Button>
                <Button
                  variant={createType === 'ask' ? 'default' : 'outline'}
                  onClick={() => setCreateType('ask')}
                  className="flex-1 gap-2"
                >
                  <HelpCircle className="h-4 w-4" />
                  Pedir
                </Button>
              </div>

              <div>
                <Label htmlFor="give-title" className="mb-2 block">Título</Label>
                <Input
                  id="give-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={createType === 'give' ? 'Com o que você pode ajudar?' : 'Com o que você precisa de ajuda?'}
                />
              </div>

              <div>
                <Label htmlFor="give-desc" className="mb-2 block">Descrição</Label>
                <Textarea
                  id="give-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva em detalhes..."
                  className="resize-none"
                />
              </div>

              <div>
                <Label className="mb-2 block">Habilidades Relacionadas</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Ex: Marketing, Excel..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" variant="outline" onClick={addSkill}>+</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {skills.map(skill => (
                    <Badge 
                      key={skill} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => setSkills(skills.filter(s => s !== skill))}
                    >
                      {skill} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCreate(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate} disabled={!title.trim() || !description.trim() || loading}>
                  {loading ? 'Criando...' : 'Publicar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatedTabs defaultValue="all" className="w-full">
        <AnimatedTabsList className="grid w-full grid-cols-3">
          <AnimatedTabsTrigger value="all" onClick={() => onFilter()}>Todos</AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="give" onClick={() => onFilter('give')}>
            <Gift className="h-4 w-4 mr-2" aria-hidden="true" />
            Ofertas
          </AnimatedTabsTrigger>
          <AnimatedTabsTrigger value="ask" onClick={() => onFilter('ask')}>
            <HelpCircle className="h-4 w-4 mr-2" aria-hidden="true" />
            Pedidos
          </AnimatedTabsTrigger>
        </AnimatedTabsList>

        <AnimatedTabsContent value="all" className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold text-green-500 flex items-center gap-2">
                <Gift className="h-4 w-4" aria-hidden="true" />
                Ofertas de Ajuda
              </h3>
              {givePosts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhuma oferta ainda</p>
              ) : (
                givePosts.map(post => <GiveAskCard key={post.id} post={post} />)
              )}
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-500 flex items-center gap-2">
                <HelpCircle className="h-4 w-4" aria-hidden="true" />
                Pedidos de Ajuda
              </h3>
              {askPosts.length === 0 ? (
                <p className="text-muted-foreground text-sm">Nenhum pedido ainda</p>
              ) : (
                askPosts.map(post => <GiveAskCard key={post.id} post={post} />)
              )}
            </div>
          </div>
        </AnimatedTabsContent>

        <AnimatedTabsContent value="give" className="mt-6 space-y-4">
          {givePosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">Nenhuma oferta de ajuda ainda</p>
          ) : (
            givePosts.map(post => <GiveAskCard key={post.id} post={post} />)
          )}
        </AnimatedTabsContent>

        <AnimatedTabsContent value="ask" className="mt-6 space-y-4">
          {askPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">Nenhum pedido de ajuda ainda</p>
          ) : (
            askPosts.map(post => <GiveAskCard key={post.id} post={post} />)
          )}
        </AnimatedTabsContent>
      </AnimatedTabs>
    </div>
  );
}

function GiveAskCard({ post }: { post: GiveAskPost }) {
  return (
    <Card className={cn(
      "card-elevated transition-all hover:shadow-md",
      post.type === 'give' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {post.author?.full_name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{post.author?.full_name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
              </span>
            </div>
            <h4 className="font-semibold mb-1">{post.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
            {post.skills_related.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {post.skills_related.map(skill => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {post.responses_count} {post.responses_count === 1 ? 'resposta' : 'respostas'}
          </span>
          <Button size="sm" variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Responder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
