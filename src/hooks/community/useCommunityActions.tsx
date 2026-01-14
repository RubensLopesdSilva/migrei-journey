import { useCallback } from 'react';
import { communityRepository } from '@/lib/repositories';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { CreatePostInputSchema, AddCommentInputSchema, CreateGiveAskInputSchema } from '@/lib/schemas/community.schema';
import type { 
  CommunityPost, 
  PostComment, 
  UserNetworkingProfile,
  UserConnection,
  GiveAskPost,
  CommunityEvent,
  MatchSuggestion,
  CommunityNotification,
  PostType,
  GiveAskType
} from '@/types/community';

interface UseCommunityActionsProps {
  posts: CommunityPost[];
  currentPhaseId: string | null;
  matchSuggestions: MatchSuggestion[];
  notifications: CommunityNotification[];
  unreadCount: number;
  setPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
  setMatchSuggestions: React.Dispatch<React.SetStateAction<MatchSuggestion[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<CommunityNotification[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchPosts: (phaseId?: string) => Promise<void>;
  fetchGiveAskPosts: (type?: GiveAskType, phaseId?: string) => Promise<void>;
  fetchEvents: (phaseId?: string) => Promise<void>;
  fetchConnections: () => Promise<void>;
  fetchNetworkingProfile: () => Promise<void>;
}

/**
 * Hook for community-related actions
 */
export function useCommunityActions({
  posts,
  currentPhaseId,
  matchSuggestions,
  notifications,
  unreadCount,
  setPosts,
  setMatchSuggestions,
  setNotifications,
  setUnreadCount,
  fetchPosts,
  fetchGiveAskPosts,
  fetchEvents,
  fetchConnections,
  fetchNetworkingProfile,
}: UseCommunityActionsProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  // Create post
  const createPost = useCallback(async (
    postType: PostType, 
    title: string, 
    content: string, 
    phaseId?: string
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const targetPhaseId = phaseId || currentPhaseId;
    if (!targetPhaseId) return { error: new Error('No phase selected') };

    // Validate input
    const validation = CreatePostInputSchema.safeParse({ postType, title, content, phaseId: targetPhaseId });
    if (!validation.success) {
      toast({ title: 'Erro', description: validation.error.errors[0].message, variant: 'destructive' });
      return { error: validation.error };
    }

    const { error } = await communityRepository.createPost({
      userId: user.id,
      phaseId: targetPhaseId,
      postType,
      title,
      content,
    });

    if (error) {
      toast({ title: 'Erro ao criar post', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Post criado!', description: 'Seu post foi publicado na comunidade.' });
    fetchPosts(targetPhaseId);
    return { error: null };
  }, [user, currentPhaseId, fetchPosts, toast]);

  // Toggle like
  const toggleLike = useCallback(async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user_liked) {
      await communityRepository.removeLike(postId, user.id);
    } else {
      await communityRepository.addLike(postId, user.id);
    }

    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, user_liked: !p.user_liked, likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
  }, [user, posts, setPosts]);

  // Fetch comments
  const fetchComments = useCallback(async (postId: string): Promise<PostComment[]> => {
    const { data } = await communityRepository.getComments(postId);
    
    if (data.length === 0) return [];

    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await communityRepository.getProfiles(userIds);

    return data.map(comment => ({
      ...comment,
      author: profiles?.find(p => p.user_id === comment.user_id) || { full_name: 'Usuário', avatar_url: null },
    }));
  }, []);

  // Add comment
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const validation = AddCommentInputSchema.safeParse({ postId, content });
    if (!validation.success) {
      toast({ title: 'Erro', description: validation.error.errors[0].message, variant: 'destructive' });
      return { error: validation.error };
    }

    const { error } = await communityRepository.addComment(postId, user.id, content);

    if (error) {
      toast({ title: 'Erro ao comentar', description: error.message, variant: 'destructive' });
      return { error };
    }

    setPosts(posts.map(p => 
      p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
    ));

    return { error: null };
  }, [user, posts, setPosts, toast]);

  // Update networking profile
  const updateNetworkingProfile = useCallback(async (profile: Partial<UserNetworkingProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await communityRepository.upsertNetworkingProfile(user.id, profile);

    if (error) {
      toast({ title: 'Erro ao atualizar perfil', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Perfil atualizado!', description: 'Suas informações foram salvas.' });
    fetchNetworkingProfile();
    return { error: null };
  }, [user, fetchNetworkingProfile, toast]);

  // Send connection request
  const sendConnectionRequest = useCallback(async (userId: string, reason?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await communityRepository.createConnectionRequest(user.id, userId, reason);

    if (error) {
      toast({ title: 'Erro ao enviar solicitação', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Solicitação enviada!', description: 'Aguardando resposta.' });
    return { error: null };
  }, [user, toast]);

  // Respond to connection
  const respondToConnection = useCallback(async (connectionId: string, accept: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await communityRepository.updateConnectionStatus(
      connectionId, 
      accept ? 'accepted' : 'rejected'
    );

    if (error) {
      toast({ title: 'Erro', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ 
      title: accept ? 'Conexão aceita!' : 'Solicitação recusada', 
      description: accept ? 'Vocês agora estão conectados.' : undefined 
    });
    fetchConnections();
    return { error: null };
  }, [user, fetchConnections, toast]);

  // Create give/ask post
  const createGiveAskPost = useCallback(async (
    type: GiveAskType, 
    title: string, 
    description: string, 
    skills: string[]
  ) => {
    if (!user) return { error: new Error('Not authenticated') };

    const validation = CreateGiveAskInputSchema.safeParse({ type, title, description, skills });
    if (!validation.success) {
      toast({ title: 'Erro', description: validation.error.errors[0].message, variant: 'destructive' });
      return { error: validation.error };
    }

    const { error } = await communityRepository.createGiveAskPost({
      userId: user.id,
      phaseId: currentPhaseId,
      type,
      title,
      description,
      skills,
    });

    if (error) {
      toast({ title: 'Erro ao criar post', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ 
      title: type === 'give' ? 'Oferta criada!' : 'Pedido criado!', 
      description: 'Publicado na comunidade.' 
    });
    fetchGiveAskPosts();
    return { error: null };
  }, [user, currentPhaseId, fetchGiveAskPosts, toast]);

  // Register for event
  const registerForEvent = useCallback(async (eventId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await communityRepository.registerForEvent(eventId, user.id);

    if (error) {
      toast({ title: 'Erro ao inscrever', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Inscrição confirmada!', description: 'Você receberá um lembrete antes do evento.' });
    fetchEvents();
    return { error: null };
  }, [user, fetchEvents, toast]);

  // Respond to match
  const respondToMatch = useCallback(async (matchId: string, connect: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const match = matchSuggestions.find(m => m.id === matchId);
    if (!match) return { error: new Error('Match not found') };

    await communityRepository.updateMatchStatus(matchId, connect ? 'connected' : 'ignored');

    if (connect) {
      await sendConnectionRequest(match.suggested_user_id, 'Sugestão de match semanal');
    }

    setMatchSuggestions(matchSuggestions.filter(m => m.id !== matchId));
    return { error: null };
  }, [user, matchSuggestions, setMatchSuggestions, sendConnectionRequest]);

  // Mark notification read
  const markNotificationRead = useCallback(async (notificationId: string) => {
    await communityRepository.markNotificationRead(notificationId);

    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, [notifications, setNotifications, setUnreadCount]);

  // Mark all notifications read
  const markAllNotificationsRead = useCallback(async () => {
    if (!user) return;

    await communityRepository.markAllNotificationsRead(user.id);

    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }, [user, notifications, setNotifications, setUnreadCount]);

  return {
    createPost,
    toggleLike,
    fetchComments,
    addComment,
    updateNetworkingProfile,
    sendConnectionRequest,
    respondToConnection,
    createGiveAskPost,
    registerForEvent,
    respondToMatch,
    markNotificationRead,
    markAllNotificationsRead,
  };
}
