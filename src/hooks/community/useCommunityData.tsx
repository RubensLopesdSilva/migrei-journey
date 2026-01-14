import { useState, useEffect, useCallback } from 'react';
import { communityRepository } from '@/lib/repositories';
import { useAuth } from '@/hooks/useAuth';
import type { 
  CommunityPost, 
  UserNetworkingProfile, 
  UserConnection,
  GiveAskPost,
  CommunityEvent,
  MatchSuggestion,
  CommunityNotification
} from '@/types/community';

interface PhaseInfo {
  id: string;
  name: string;
  color: string;
  phase_number: number;
}

export interface CommunityDataState {
  loading: boolean;
  posts: CommunityPost[];
  phases: PhaseInfo[];
  currentPhaseId: string | null;
  networkingProfile: UserNetworkingProfile | null;
  connections: UserConnection[];
  pendingConnections: UserConnection[];
  giveAskPosts: GiveAskPost[];
  events: CommunityEvent[];
  matchSuggestions: MatchSuggestion[];
  notifications: CommunityNotification[];
  unreadCount: number;
}

/**
 * Hook for fetching and managing community data state
 */
export function useCommunityData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [phases, setPhases] = useState<PhaseInfo[]>([]);
  const [currentPhaseId, setCurrentPhaseId] = useState<string | null>(null);
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
    const { data } = await communityRepository.getPhases();
    setPhases(data);
    return data;
  }, []);

  // Fetch current phase
  const fetchCurrentPhase = useCallback(async (phasesData: PhaseInfo[]) => {
    if (!user) return;
    
    const phaseId = await communityRepository.getUserCurrentPhaseId(user.id);
    if (phaseId) {
      setCurrentPhaseId(phaseId);
    } else if (phasesData.length > 0) {
      setCurrentPhaseId(phasesData[0].id);
    }
  }, [user]);

  // Fetch posts for a phase
  const fetchPosts = useCallback(async (phaseId?: string) => {
    setLoading(true);
    const targetPhaseId = phaseId || currentPhaseId;
    if (!targetPhaseId) {
      setLoading(false);
      return;
    }

    const { data: postsData } = await communityRepository.getPosts(targetPhaseId);
    
    if (postsData.length > 0) {
      // Fetch author profiles
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profiles } = await communityRepository.getProfiles(userIds);

      // Get phase info
      const phase = phases.find(p => p.id === targetPhaseId);

      // Check if user liked posts
      let userLikes: string[] = [];
      if (user) {
        userLikes = await communityRepository.getUserPostLikes(user.id, postsData.map(p => p.id));
      }

      const enrichedPosts: CommunityPost[] = postsData.map(post => ({
        ...post,
        author: profiles?.find(p => p.user_id === post.user_id) || { full_name: 'Usuário', avatar_url: null },
        phase: phase ? { name: phase.name, color: phase.color } : undefined,
        user_liked: userLikes.includes(post.id),
      }));

      setPosts(enrichedPosts);
    } else {
      setPosts([]);
    }
    
    setLoading(false);
  }, [currentPhaseId, user, phases]);

  // Fetch networking profile
  const fetchNetworkingProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await communityRepository.getNetworkingProfile(user.id);
    if (data) setNetworkingProfile(data);
  }, [user]);

  // Fetch connections
  const fetchConnections = useCallback(async () => {
    if (!user) return;

    // Accepted connections
    const { data: accepted } = await communityRepository.getAcceptedConnections(user.id);
    if (accepted.length > 0) {
      const otherUserIds = accepted.map(c => 
        c.requester_id === user.id ? c.requested_id : c.requester_id
      );
      const { data: profiles } = await communityRepository.getProfiles(otherUserIds);

      const enriched: UserConnection[] = accepted.map(conn => {
        const otherUserId = conn.requester_id === user.id ? conn.requested_id : conn.requester_id;
        const profile = profiles?.find(p => p.user_id === otherUserId);
        return {
          ...conn,
          user: profile ? {
            id: profile.user_id,
            full_name: profile.full_name || 'Usuário',
            avatar_url: profile.avatar_url,
          } : undefined,
        };
      });
      setConnections(enriched);
    }

    // Pending connections
    const { data: pending } = await communityRepository.getPendingConnections(user.id);
    if (pending.length > 0) {
      const requesterIds = pending.map(p => p.requester_id);
      const { data: profiles } = await communityRepository.getProfiles(requesterIds);

      setPendingConnections(pending.map(conn => {
        const profile = profiles?.find(p => p.user_id === conn.requester_id);
        return {
          ...conn,
          user: profile ? {
            id: profile.user_id,
            full_name: profile.full_name || 'Usuário',
            avatar_url: profile.avatar_url,
          } : undefined,
        };
      }));
    }
  }, [user]);

  // Fetch give/ask posts
  const fetchGiveAskPosts = useCallback(async (type?: 'give' | 'ask', phaseId?: string) => {
    const { data } = await communityRepository.getGiveAskPosts({ type, phaseId });
    
    if (data.length > 0) {
      const userIds = [...new Set(data.map(p => p.user_id))];
      const { data: profiles } = await communityRepository.getProfiles(userIds);

      setGiveAskPosts(data.map(post => ({
        ...post,
        author: profiles?.find(p => p.user_id === post.user_id) || { full_name: 'Usuário', avatar_url: null },
      })));
    } else {
      setGiveAskPosts([]);
    }
  }, []);

  // Fetch events
  const fetchEvents = useCallback(async (phaseId?: string) => {
    const { data } = await communityRepository.getUpcomingEvents(phaseId);
    
    if (data.length > 0 && user) {
      const phasesMap = new Map(phases.map(p => [p.id, p]));
      const registeredIds = await communityRepository.getEventRegistrations(user.id, data.map(e => e.id));

      const enriched: CommunityEvent[] = data.map(event => {
        const phase = event.phase_id ? phasesMap.get(event.phase_id) : undefined;
        return {
          ...event,
          phase: phase ? { name: phase.name, color: phase.color } : undefined,
          is_registered: registeredIds.includes(event.id),
        };
      });
      setEvents(enriched);
    } else if (data.length > 0) {
      const phasesMap = new Map(phases.map(p => [p.id, p]));
      setEvents(data.map(event => {
        const phase = event.phase_id ? phasesMap.get(event.phase_id) : undefined;
        return {
          ...event,
          phase: phase ? { name: phase.name, color: phase.color } : undefined,
        };
      }));
    }
  }, [user, phases]);

  // Fetch match suggestions
  const fetchMatchSuggestions = useCallback(async () => {
    if (!user) return;

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const { data } = await communityRepository.getMatchSuggestions(user.id, weekStartStr);
    
    if (data.length > 0) {
      const suggestedIds = data.map(m => m.suggested_user_id);
      const { data: profiles } = await communityRepository.getProfiles(suggestedIds);
      const { data: netProfiles } = await communityRepository.getNetworkingProfiles(suggestedIds);

      setMatchSuggestions(data.map(match => {
        const profile = profiles?.find(p => p.user_id === match.suggested_user_id);
        const netProfile = netProfiles?.find(p => p.user_id === match.suggested_user_id);
        return {
          ...match,
          suggested_user: {
            full_name: profile?.full_name || 'Usuário',
            avatar_url: profile?.avatar_url || null,
            career_objective: netProfile?.career_objective || undefined,
            skills: netProfile?.skills || undefined,
          },
        };
      }));
    }
  }, [user]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const { data } = await communityRepository.getNotifications(user.id);
    setNotifications(data);
    setUnreadCount(data.filter(n => !n.is_read).length);
  }, [user]);

  // Initial load
  useEffect(() => {
    fetchPhases().then(phasesData => {
      if (phasesData.length > 0) {
        fetchCurrentPhase(phasesData);
      }
    });
  }, [fetchPhases, fetchCurrentPhase]);

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
    // State
    loading,
    posts,
    phases,
    currentPhaseId,
    networkingProfile,
    connections,
    pendingConnections,
    giveAskPosts,
    events,
    matchSuggestions,
    notifications,
    unreadCount,
    // Setters
    setCurrentPhaseId,
    setPosts,
    setGiveAskPosts,
    setEvents,
    setMatchSuggestions,
    setNotifications,
    setUnreadCount,
    setNetworkingProfile,
    setConnections,
    setPendingConnections,
    // Fetchers
    fetchPosts,
    fetchGiveAskPosts,
    fetchEvents,
    fetchConnections,
    fetchNetworkingProfile,
    fetchNotifications,
  };
}
