import { useCommunityData } from './community/useCommunityData';
import { useCommunityActions } from './community/useCommunityActions';

/**
 * Main community hook - composes smaller specialized hooks
 * Provides backwards compatibility with the original API
 */
export function useCommunity() {
  // Data layer
  const {
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
    setCurrentPhaseId,
    setPosts,
    setMatchSuggestions,
    setNotifications,
    setUnreadCount,
    fetchPosts,
    fetchGiveAskPosts,
    fetchEvents,
    fetchConnections,
    fetchNetworkingProfile,
  } = useCommunityData();

  // Actions layer
  const {
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
  } = useCommunityActions({
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
  });

  return {
    // State
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
    markAllNotificationsRead,
  };
}
