import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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

export function useCommunity() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [currentPhaseId, setCurrentPhaseId] = useState<string | null>(null);
  const [phases, setPhases] = useState<Array<{ id: string; name: string; color: string; phase_number: number }>>([]);
  const [networkingProfile, setNetworkingProfile] = useState<UserNetworkingProfile | null>(null);
  const [connections, setConnections] = useState<UserConnection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<UserConnection[]>([]);
  const [giveAskPosts, setGiveAskPosts] = useState<GiveAskPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [matchSuggestions, setMatchSuggestions] = useState<MatchSuggestion[]>([]);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch phases
  const fetchPhases = useCallback(async () => {
    const { data } = await supabase
      .from('migrei_phases')
      .select('id, name, color, phase_number')
      .order('phase_number');
    
    if (data) setPhases(data);
  }, []);

  // Fetch user's current phase
  const fetchCurrentPhase = useCallback(async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_progress')
      .select('current_phase_id')
      .eq('user_id', user.id)
      .single();
    
    if (data?.current_phase_id) {
      setCurrentPhaseId(data.current_phase_id);
    } else if (phases.length > 0) {
      setCurrentPhaseId(phases[0].id);
    }
  }, [user, phases]);

  // Fetch posts for a phase
  const fetchPosts = useCallback(async (phaseId?: string) => {
    setLoading(true);
    const targetPhaseId = phaseId || currentPhaseId;
    if (!targetPhaseId) {
      setLoading(false);
      return;
    }

    const { data: postsData } = await supabase
      .from('community_posts')
      .select('*')
      .eq('phase_id', targetPhaseId)
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (postsData) {
      // Fetch author profiles
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      // Fetch phase info
      const phase = phases.find(p => p.id === targetPhaseId);

      // Check if user liked posts
      let userLikes: string[] = [];
      if (user) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id)
          .in('post_id', postsData.map(p => p.id));
        userLikes = likes?.map(l => l.post_id) || [];
      }

      const enrichedPosts: CommunityPost[] = postsData.map(post => ({
        ...post,
        post_type: post.post_type as PostType,
        author: profiles?.find(p => p.user_id === post.user_id) || { full_name: 'Usuário', avatar_url: null },
        phase: phase ? { name: phase.name, color: phase.color } : undefined,
        user_liked: userLikes.includes(post.id)
      }));

      setPosts(enrichedPosts);
    }
    setLoading(false);
  }, [currentPhaseId, user, phases]);

  // Create a post
  const createPost = async (postType: PostType, title: string, content: string, phaseId?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const targetPhaseId = phaseId || currentPhaseId;
    if (!targetPhaseId) return { error: new Error('No phase selected') };

    const { error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        phase_id: targetPhaseId,
        post_type: postType,
        title,
        content
      });

    if (error) {
      toast({ title: 'Erro ao criar post', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Post criado!', description: 'Seu post foi publicado na comunidade.' });
    fetchPosts(targetPhaseId);
    return { error: null };
  };

  // Like/unlike a post
  const toggleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (post.user_liked) {
      await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
    } else {
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
    }

    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, user_liked: !p.user_liked, likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1 }
        : p
    ));
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string): Promise<PostComment[]> => {
    const { data } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_active', true)
      .order('created_at');

    if (!data) return [];

    const userIds = [...new Set(data.map(c => c.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', userIds);

    return data.map(comment => ({
      ...comment,
      author: profiles?.find(p => p.user_id === comment.user_id) || { full_name: 'Usuário', avatar_url: null }
    }));
  };

  // Add a comment
  const addComment = async (postId: string, content: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: user.id, content });

    if (error) {
      toast({ title: 'Erro ao comentar', description: error.message, variant: 'destructive' });
      return { error };
    }

    // Update comment count locally
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
    ));

    return { error: null };
  };

  // Fetch networking profile
  const fetchNetworkingProfile = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_networking_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setNetworkingProfile(data as UserNetworkingProfile);
    }
  }, [user]);

  // Update networking profile
  const updateNetworkingProfile = async (profile: Partial<UserNetworkingProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('user_networking_profiles')
      .upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({ title: 'Erro ao atualizar perfil', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Perfil atualizado!', description: 'Suas informações foram salvas.' });
    fetchNetworkingProfile();
    return { error: null };
  };

  // Fetch connections
  const fetchConnections = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_connections')
      .select('*')
      .or(`requester_id.eq.${user.id},requested_id.eq.${user.id}`)
      .eq('status', 'accepted');

    if (data) {
      // Get the other user's profile for each connection
      const otherUserIds = data.map(c => c.requester_id === user.id ? c.requested_id : c.requester_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', otherUserIds);

      const enrichedConnections: UserConnection[] = data.map(conn => {
        const otherUserId = conn.requester_id === user.id ? conn.requested_id : conn.requester_id;
        const profile = profiles?.find(p => p.user_id === otherUserId);
        return {
          ...conn,
          status: conn.status as UserConnection['status'],
          user: profile ? {
            id: profile.user_id,
            full_name: profile.full_name || 'Usuário',
            avatar_url: profile.avatar_url
          } : undefined
        };
      });

      setConnections(enrichedConnections);
    }

    // Fetch pending connection requests
    const { data: pending } = await supabase
      .from('user_connections')
      .select('*')
      .eq('requested_id', user.id)
      .eq('status', 'pending');

    if (pending) {
      const requesterIds = pending.map(p => p.requester_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', requesterIds);

      setPendingConnections(pending.map(conn => {
        const profile = profiles?.find(p => p.user_id === conn.requester_id);
        return {
          ...conn,
          status: conn.status as UserConnection['status'],
          user: profile ? {
            id: profile.user_id,
            full_name: profile.full_name || 'Usuário',
            avatar_url: profile.avatar_url
          } : undefined
        };
      }));
    }
  }, [user]);

  // Send connection request
  const sendConnectionRequest = async (userId: string, reason?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('user_connections')
      .insert({
        requester_id: user.id,
        requested_id: userId,
        match_reason: reason
      });

    if (error) {
      toast({ title: 'Erro ao enviar solicitação', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Solicitação enviada!', description: 'Aguardando resposta.' });
    return { error: null };
  };

  // Respond to connection request
  const respondToConnection = async (connectionId: string, accept: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('user_connections')
      .update({ status: accept ? 'accepted' : 'rejected', updated_at: new Date().toISOString() })
      .eq('id', connectionId);

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
  };

  // Fetch Give & Ask posts
  const fetchGiveAskPosts = useCallback(async (type?: GiveAskType, phaseId?: string) => {
    let query = supabase
      .from('give_ask_posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (type) query = query.eq('type', type);
    if (phaseId) query = query.eq('phase_id', phaseId);

    const { data } = await query;

    if (data) {
      const userIds = [...new Set(data.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', userIds);

      setGiveAskPosts(data.map(post => ({
        ...post,
        type: post.type as GiveAskType,
        author: profiles?.find(p => p.user_id === post.user_id) || { full_name: 'Usuário', avatar_url: null }
      })));
    }
  }, []);

  // Create Give/Ask post
  const createGiveAskPost = async (type: GiveAskType, title: string, description: string, skills: string[]) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('give_ask_posts')
      .insert({
        user_id: user.id,
        phase_id: currentPhaseId,
        type,
        title,
        description,
        skills_related: skills
      });

    if (error) {
      toast({ title: 'Erro ao criar post', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: type === 'give' ? 'Oferta criada!' : 'Pedido criado!', description: 'Publicado na comunidade.' });
    fetchGiveAskPosts();
    return { error: null };
  };

  // Fetch events
  const fetchEvents = useCallback(async (phaseId?: string) => {
    let query = supabase
      .from('community_events')
      .select('*')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at');

    if (phaseId) query = query.eq('phase_id', phaseId);

    const { data } = await query;

    if (data && user) {
      // Get phase info
      const phaseIds = [...new Set(data.map(e => e.phase_id).filter(Boolean))];
      const phasesMap = new Map(phases.map(p => [p.id, p]));

      // Check registrations
      const { data: registrations } = await supabase
        .from('event_registrations')
        .select('event_id')
        .eq('user_id', user.id)
        .in('event_id', data.map(e => e.id));

      const registeredIds = registrations?.map(r => r.event_id) || [];

      const enrichedEvents: CommunityEvent[] = data.map(event => {
        const phase = event.phase_id ? phasesMap.get(event.phase_id) : undefined;
        return {
          ...event,
          event_type: event.event_type as CommunityEvent['event_type'],
          phase: phase ? { name: phase.name, color: phase.color } : undefined,
          is_registered: registeredIds.includes(event.id)
        };
      });

      setEvents(enrichedEvents);
    } else if (data) {
      const phasesMap = new Map(phases.map(p => [p.id, p]));
      
      setEvents(data.map(event => {
        const phase = event.phase_id ? phasesMap.get(event.phase_id) : undefined;
        return {
          ...event,
          event_type: event.event_type as CommunityEvent['event_type'],
          phase: phase ? { name: phase.name, color: phase.color } : undefined
        };
      }));
    }
  }, [user, phases]);

  // Register for event
  const registerForEvent = async (eventId: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: eventId, user_id: user.id });

    if (error) {
      toast({ title: 'Erro ao inscrever', description: error.message, variant: 'destructive' });
      return { error };
    }

    toast({ title: 'Inscrição confirmada!', description: 'Você receberá um lembrete antes do evento.' });
    fetchEvents();
    return { error: null };
  };

  // Fetch match suggestions
  const fetchMatchSuggestions = useCallback(async () => {
    if (!user) return;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    const { data } = await supabase
      .from('match_suggestions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .gte('week_of', weekStart.toISOString().split('T')[0]);

    if (data) {
      const suggestedIds = data.map(m => m.suggested_user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url')
        .in('user_id', suggestedIds);

      const { data: networkingProfiles } = await supabase
        .from('user_networking_profiles')
        .select('user_id, career_objective, skills')
        .in('user_id', suggestedIds);

      setMatchSuggestions(data.map(match => {
        const profile = profiles?.find(p => p.user_id === match.suggested_user_id);
        const netProfile = networkingProfiles?.find(p => p.user_id === match.suggested_user_id);
        return {
          ...match,
          match_reasons: Array.isArray(match.match_reasons) ? match.match_reasons as string[] : [],
          suggested_user: {
            full_name: profile?.full_name || 'Usuário',
            avatar_url: profile?.avatar_url || null,
            career_objective: netProfile?.career_objective || undefined,
            skills: netProfile?.skills || undefined
          }
        };
      }));
    }
  }, [user]);

  // Respond to match suggestion
  const respondToMatch = async (matchId: string, connect: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const match = matchSuggestions.find(m => m.id === matchId);
    if (!match) return { error: new Error('Match not found') };

    // Update match status
    await supabase
      .from('match_suggestions')
      .update({ status: connect ? 'connected' : 'ignored' })
      .eq('id', matchId);

    // If connecting, create connection request
    if (connect) {
      await sendConnectionRequest(match.suggested_user_id, 'Sugestão de match semanal');
    }

    setMatchSuggestions(matchSuggestions.filter(m => m.id !== matchId));
    return { error: null };
  };

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('community_notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    }
  }, [user]);

  // Mark notification as read
  const markNotificationRead = async (notificationId: string) => {
    await supabase
      .from('community_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllNotificationsRead = async () => {
    if (!user) return;

    await supabase
      .from('community_notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  // Initial load
  useEffect(() => {
    fetchPhases();
  }, [fetchPhases]);

  useEffect(() => {
    if (phases.length > 0) {
      fetchCurrentPhase();
    }
  }, [phases, fetchCurrentPhase]);

  useEffect(() => {
    if (currentPhaseId) {
      fetchPosts();
    }
  }, [currentPhaseId, fetchPosts]);

  useEffect(() => {
    if (user) {
      fetchNetworkingProfile();
      fetchConnections();
      fetchGiveAskPosts();
      fetchEvents();
      fetchMatchSuggestions();
      fetchNotifications();
    }
  }, [user, fetchNetworkingProfile, fetchConnections, fetchGiveAskPosts, fetchEvents, fetchMatchSuggestions, fetchNotifications]);

  return {
    loading,
    posts,
    phases,
    currentPhaseId,
    setCurrentPhaseId,
    networkingProfile,
    connections,
    pendingConnections,
    giveAskPosts,
    events,
    matchSuggestions,
    notifications,
    unreadCount,
    // Actions
    fetchPosts,
    createPost,
    toggleLike,
    fetchComments,
    addComment,
    updateNetworkingProfile,
    sendConnectionRequest,
    respondToConnection,
    fetchGiveAskPosts,
    createGiveAskPost,
    fetchEvents,
    registerForEvent,
    respondToMatch,
    markNotificationRead,
    markAllNotificationsRead
  };
}
