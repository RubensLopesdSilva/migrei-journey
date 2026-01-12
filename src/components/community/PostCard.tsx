import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Heart, MessageCircle, MoreHorizontal, Flag, AlertCircle, CheckCircle, HelpCircle, HandHeart, Briefcase, MessageSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { CommunityPost, PostType } from '@/types/community';
import { POST_TEMPLATES } from '@/types/community';
import { PostComments } from './PostComments';

const POST_ICONS: Record<PostType, React.ElementType> = {
  stuck_at: AlertCircle,
  completed_phase: CheckCircle,
  need_help: HelpCircle,
  can_help: HandHeart,
  opportunity: Briefcase,
  general: MessageSquare
};

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => Promise<{ error: Error | null }>;
  onFetchComments: (postId: string) => Promise<any[]>;
}

export function PostCard({ post, onLike, onComment, onFetchComments }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const Icon = POST_ICONS[post.post_type];
  const template = POST_TEMPLATES[post.post_type];

  return (
    <Card className="card-elevated">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {post.author?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{post.author?.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("gap-1", template.color)}>
              <Icon className="h-3 w-3" />
              {template.label}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-destructive">
                  <Flag className="h-4 w-4 mr-2" />
                  Denunciar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <h3 className="font-semibold text-foreground mb-2">{post.title}</h3>
        <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
        {post.phase && (
          <div className="mt-3 flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: post.phase.color }}
            />
            <span className="text-xs text-muted-foreground">{post.phase.name}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex-col items-stretch gap-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={cn(
              "gap-2",
              post.user_liked && "text-red-500 hover:text-red-600"
            )}
          >
            <Heart className={cn("h-4 w-4", post.user_liked && "fill-current")} />
            {post.likes_count}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            {post.comments_count}
          </Button>
        </div>
        {showComments && (
          <PostComments
            postId={post.id}
            onComment={onComment}
            onFetchComments={onFetchComments}
          />
        )}
      </CardFooter>
    </Card>
  );
}
