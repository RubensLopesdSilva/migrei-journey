// Post Types (Templates)
export type PostType = 
  | 'stuck_at'
  | 'completed_phase'
  | 'need_help'
  | 'can_help'
  | 'opportunity'
  | 'general';

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';
export type ConversationStatus = 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled';
export type GiveAskType = 'give' | 'ask';
export type EventType = 'networking_round' | 'workshop' | 'q_and_a' | 'mentoring_group';

// Post template definitions
export const POST_TEMPLATES: Record<PostType, { label: string; icon: string; placeholder: string; color: string }> = {
  stuck_at: {
    label: 'Estou travado em...',
    icon: 'AlertCircle',
    placeholder: 'Descreva onde você está travado e que tipo de ajuda precisa...',
    color: 'text-amber-500'
  },
  completed_phase: {
    label: 'Concluí esta fase e aprendi...',
    icon: 'CheckCircle',
    placeholder: 'Compartilhe suas principais aprendizagens e insights...',
    color: 'text-green-500'
  },
  need_help: {
    label: 'Preciso de ajuda com...',
    icon: 'HelpCircle',
    placeholder: 'Explique o que você precisa e como alguém poderia te ajudar...',
    color: 'text-blue-500'
  },
  can_help: {
    label: 'Posso ajudar com...',
    icon: 'HandHeart',
    placeholder: 'Descreva como você pode contribuir com outros membros...',
    color: 'text-purple-500'
  },
  opportunity: {
    label: 'Oportunidade / Indicação',
    icon: 'Briefcase',
    placeholder: 'Compartilhe uma oportunidade ou indicação...',
    color: 'text-phase-deslanchar'
  },
  general: {
    label: 'Post livre',
    icon: 'MessageSquare',
    placeholder: 'Compartilhe algo com a comunidade...',
    color: 'text-foreground'
  }
};

// Interfaces
export interface UserNetworkingProfile {
  id: string;
  user_id: string;
  career_objective: string | null;
  interest_areas: string[];
  previous_experience: string | null;
  skills: string[];
  what_seeking: string | null;
  what_offering: string | null;
  linkedin_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  phase_id: string;
  post_type: PostType;
  title: string;
  content: string;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: {
    full_name: string;
    avatar_url: string | null;
  };
  phase?: {
    name: string;
    color: string;
  };
  user_liked?: boolean;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_active: boolean;
  created_at: string;
  author?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface UserConnection {
  id: string;
  requester_id: string;
  requested_id: string;
  status: ConnectionStatus;
  match_reason: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    career_objective?: string;
    current_phase?: string;
  };
}

export interface ConversationRequest {
  id: string;
  requester_id: string;
  requested_id: string;
  reason: string;
  suggested_duration: number;
  status: ConversationStatus;
  scheduled_at: string | null;
  meeting_url: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface GiveAskPost {
  id: string;
  user_id: string;
  phase_id: string | null;
  type: GiveAskType;
  title: string;
  description: string;
  skills_related: string[];
  is_active: boolean;
  responses_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface CommunityEvent {
  id: string;
  phase_id: string | null;
  title: string;
  description: string;
  event_type: EventType;
  starts_at: string;
  ends_at: string;
  max_participants: number | null;
  meeting_url: string | null;
  is_active: boolean;
  created_at: string;
  phase?: {
    name: string;
    color: string;
  };
  registration_count?: number;
  is_registered?: boolean;
}

export interface MatchSuggestion {
  id: string;
  user_id: string;
  suggested_user_id: string;
  match_score: number;
  match_reasons: string[];
  status: string;
  week_of: string;
  created_at: string;
  suggested_user?: {
    full_name: string;
    avatar_url: string | null;
    career_objective?: string;
    current_phase?: string;
    skills?: string[];
  };
}

export interface CommunityNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  reference_id: string | null;
  reference_type: string | null;
  is_read: boolean;
  created_at: string;
}

// Event type labels
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  networking_round: 'Rodada de Networking',
  workshop: 'Workshop',
  q_and_a: 'Q&A',
  mentoring_group: 'Mentoria em Grupo'
};
