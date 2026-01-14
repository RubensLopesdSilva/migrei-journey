import { supabase } from '@/integrations/supabase/client';
import type { RepositoryResult, RepositoryListResult } from './base.repository';
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

interface PhaseInfo {
  id: string;
  name: string;
  color: string;
  phase_number: number;
}

export class CommunityRepository {
  // Phases
  async getPhases(): Promise<RepositoryListResult<PhaseInfo>> {
    const { data, error } = await supabase
      .from('migrei_phases')
      .select('id, name, color, phase_number')
      .order('phase_number');

    return { data: (data as PhaseInfo[]) || [], error };
  }

  // User Progress
  async getUserCurrentPhaseId(userId: string): Promise<string | null> {
    const { data } = await supabase
      .from('user_progress')
      .select('current_phase_id')
      .eq('user_id', userId)
      .maybeSingle();

    return data?.current_phase_id || null;
  }

  // Posts
  async getPosts(phaseId: string): Promise<RepositoryListResult<CommunityPost>> {
    const { data, error } = await supabase
      .from('community_posts')
      .select('*')
      .eq('phase_id', phaseId)
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    return { 
      data: (data?.map(post => ({
        ...post,
        post_type: post.post_type as PostType,
      })) as CommunityPost[]) || [], 
      error 
    };
  }

  async getProfiles(userIds: string[]): Promise<RepositoryListResult<{ user_id: string; full_name: string | null; avatar_url: string | null }>> {
    if (userIds.length === 0) return { data: [], error: null };
    
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, full_name, avatar_url')
      .in('user_id', userIds);

    return { data: data || [], error };
  }

  async getUserPostLikes(userId: string, postIds: string[]): Promise<string[]> {
    if (postIds.length === 0) return [];
    
    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId)
      .in('post_id', postIds);

    return data?.map(l => l.post_id) || [];
  }

  async createPost(params: {
    userId: string;
    phaseId: string;
    postType: PostType;
    title: string;
    content: string;
  }): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('community_posts')
      .insert({
        user_id: params.userId,
        phase_id: params.phaseId,
        post_type: params.postType,
        title: params.title,
        content: params.content,
      });

    return { error };
  }

  async addLike(postId: string, userId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });
    return { error };
  }

  async removeLike(postId: string, userId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    return { error };
  }

  // Comments
  async getComments(postId: string): Promise<RepositoryListResult<PostComment>> {
    const { data, error } = await supabase
      .from('post_comments')
      .select('*')
      .eq('post_id', postId)
      .eq('is_active', true)
      .order('created_at');

    return { data: (data as PostComment[]) || [], error };
  }

  async addComment(postId: string, userId: string, content: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('post_comments')
      .insert({ post_id: postId, user_id: userId, content });
    return { error };
  }

  // Networking Profile
  async getNetworkingProfile(userId: string): Promise<RepositoryResult<UserNetworkingProfile>> {
    const { data, error } = await supabase
      .from('user_networking_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    return { data: data as UserNetworkingProfile | null, error };
  }

  async upsertNetworkingProfile(
    userId: string, 
    profile: Partial<UserNetworkingProfile>
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('user_networking_profiles')
      .upsert({
        user_id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });
    return { error };
  }

  // Connections
  async getAcceptedConnections(userId: string): Promise<RepositoryListResult<UserConnection>> {
    const { data, error } = await supabase
      .from('user_connections')
      .select('*')
      .or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
      .eq('status', 'accepted');

    return { 
      data: (data?.map(conn => ({
        ...conn,
        status: conn.status as UserConnection['status'],
      })) as UserConnection[]) || [], 
      error 
    };
  }

  async getPendingConnections(userId: string): Promise<RepositoryListResult<UserConnection>> {
    const { data, error } = await supabase
      .from('user_connections')
      .select('*')
      .eq('requested_id', userId)
      .eq('status', 'pending');

    return { 
      data: (data?.map(conn => ({
        ...conn,
        status: conn.status as UserConnection['status'],
      })) as UserConnection[]) || [], 
      error 
    };
  }

  async createConnectionRequest(
    requesterId: string, 
    requestedId: string, 
    reason?: string
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('user_connections')
      .insert({
        requester_id: requesterId,
        requested_id: requestedId,
        match_reason: reason,
      });
    return { error };
  }

  async updateConnectionStatus(
    connectionId: string, 
    status: 'accepted' | 'rejected'
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('user_connections')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', connectionId);
    return { error };
  }

  // Give & Ask
  async getGiveAskPosts(params?: {
    type?: GiveAskType;
    phaseId?: string;
  }): Promise<RepositoryListResult<GiveAskPost>> {
    let query = supabase
      .from('give_ask_posts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (params?.type) query = query.eq('type', params.type);
    if (params?.phaseId) query = query.eq('phase_id', params.phaseId);

    const { data, error } = await query;

    return { 
      data: (data?.map(post => ({
        ...post,
        type: post.type as GiveAskType,
      })) as GiveAskPost[]) || [], 
      error 
    };
  }

  async createGiveAskPost(params: {
    userId: string;
    phaseId: string | null;
    type: GiveAskType;
    title: string;
    description: string;
    skills: string[];
  }): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('give_ask_posts')
      .insert({
        user_id: params.userId,
        phase_id: params.phaseId,
        type: params.type,
        title: params.title,
        description: params.description,
        skills_related: params.skills,
      });
    return { error };
  }

  // Events
  async getUpcomingEvents(phaseId?: string): Promise<RepositoryListResult<CommunityEvent>> {
    let query = supabase
      .from('community_events')
      .select('*')
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at');

    if (phaseId) query = query.eq('phase_id', phaseId);

    const { data, error } = await query;

    return { 
      data: (data?.map(event => ({
        ...event,
        event_type: event.event_type as CommunityEvent['event_type'],
      })) as CommunityEvent[]) || [], 
      error 
    };
  }

  async getEventRegistrations(userId: string, eventIds: string[]): Promise<string[]> {
    if (eventIds.length === 0) return [];
    
    const { data } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', userId)
      .in('event_id', eventIds);

    return data?.map(r => r.event_id) || [];
  }

  async registerForEvent(eventId: string, userId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: eventId, user_id: userId });
    return { error };
  }

  // Match Suggestions
  async getMatchSuggestions(userId: string, weekStart: string): Promise<RepositoryListResult<MatchSuggestion>> {
    const { data, error } = await supabase
      .from('match_suggestions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('week_of', weekStart);

    return { 
      data: (data?.map(match => ({
        ...match,
        match_reasons: Array.isArray(match.match_reasons) ? match.match_reasons as string[] : [],
      })) as MatchSuggestion[]) || [], 
      error 
    };
  }

  async getNetworkingProfiles(userIds: string[]): Promise<RepositoryListResult<{ user_id: string; career_objective: string | null; skills: string[] | null }>> {
    if (userIds.length === 0) return { data: [], error: null };
    
    const { data, error } = await supabase
      .from('user_networking_profiles')
      .select('user_id, career_objective, skills')
      .in('user_id', userIds);

    return { data: data || [], error };
  }

  async updateMatchStatus(matchId: string, status: 'connected' | 'ignored'): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('match_suggestions')
      .update({ status })
      .eq('id', matchId);
    return { error };
  }

  // Notifications
  async getNotifications(userId: string, limit: number = 20): Promise<RepositoryListResult<CommunityNotification>> {
    const { data, error } = await supabase
      .from('community_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    return { data: (data as CommunityNotification[]) || [], error };
  }

  async markNotificationRead(notificationId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('community_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    return { error };
  }

  async markAllNotificationsRead(userId: string): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from('community_notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    return { error };
  }
}

// Singleton instance
export const communityRepository = new CommunityRepository();
