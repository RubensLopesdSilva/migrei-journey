import { z } from 'zod';

// Post Type
export const PostTypeSchema = z.enum(['discussion', 'question', 'achievement', 'resource']);

// Give/Ask Type
export const GiveAskTypeSchema = z.enum(['give', 'ask']);

// Event Type
export const EventTypeSchema = z.enum(['workshop', 'networking', 'qa_session', 'masterclass']);

// Connection Status
export const ConnectionStatusSchema = z.enum(['pending', 'accepted', 'rejected']);

// Phase Info
export const PhaseInfoSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
  phase_number: z.number().int().min(1).max(6),
});

// Author
export const AuthorSchema = z.object({
  full_name: z.string(),
  avatar_url: z.string().nullable(),
  user_id: z.string().uuid().optional(),
});

// Community Post
export const CommunityPostSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  phase_id: z.string().uuid(),
  post_type: PostTypeSchema,
  title: z.string().min(1),
  content: z.string().min(1),
  likes_count: z.number().int().min(0),
  comments_count: z.number().int().min(0),
  is_pinned: z.boolean(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  // Enriched fields
  author: AuthorSchema.optional(),
  phase: z.object({ name: z.string(), color: z.string() }).optional(),
  user_liked: z.boolean().optional(),
});

// Post Comment
export const PostCommentSchema = z.object({
  id: z.string().uuid(),
  post_id: z.string().uuid(),
  user_id: z.string().uuid(),
  content: z.string().min(1),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  author: AuthorSchema.optional(),
});

// User Networking Profile
export const UserNetworkingProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  career_objective: z.string().nullable().optional(),
  skills: z.array(z.string()).nullable().optional(),
  interests: z.array(z.string()).nullable().optional(),
  looking_for: z.array(z.string()).nullable().optional(),
  can_offer: z.array(z.string()).nullable().optional(),
  linkedin_url: z.string().url().nullable().optional(),
  is_visible: z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

// User Connection
export const UserConnectionSchema = z.object({
  id: z.string().uuid(),
  requester_id: z.string().uuid(),
  requested_id: z.string().uuid(),
  status: ConnectionStatusSchema,
  match_reason: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
  user: z.object({
    id: z.string().uuid(),
    full_name: z.string(),
    avatar_url: z.string().nullable(),
  }).optional(),
});

// Give/Ask Post
export const GiveAskPostSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  phase_id: z.string().uuid().nullable(),
  type: GiveAskTypeSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  skills_related: z.array(z.string()).nullable().optional(),
  responses_count: z.number().int().min(0).optional(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  author: AuthorSchema.optional(),
});

// Community Event
export const CommunityEventSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  event_type: EventTypeSchema,
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  meeting_url: z.string().url().nullable().optional(),
  max_participants: z.number().int().nullable().optional(),
  phase_id: z.string().uuid().nullable(),
  is_active: z.boolean(),
  created_at: z.string().datetime().optional(),
  phase: z.object({ name: z.string(), color: z.string() }).optional(),
  is_registered: z.boolean().optional(),
});

// Match Suggestion
export const MatchSuggestionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  suggested_user_id: z.string().uuid(),
  match_score: z.number().min(0).max(100),
  match_reasons: z.array(z.string()),
  status: z.string(),
  week_of: z.string(),
  created_at: z.string().datetime().optional(),
  suggested_user: z.object({
    full_name: z.string(),
    avatar_url: z.string().nullable(),
    career_objective: z.string().optional(),
    skills: z.array(z.string()).optional(),
  }).optional(),
});

// Community Notification
export const CommunityNotificationSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: z.string(),
  title: z.string(),
  message: z.string(),
  reference_type: z.string().nullable().optional(),
  reference_id: z.string().uuid().nullable().optional(),
  is_read: z.boolean(),
  created_at: z.string().datetime(),
});

// Input schemas for actions
export const CreatePostInputSchema = z.object({
  postType: PostTypeSchema,
  title: z.string().min(1, 'Título é obrigatório'),
  content: z.string().min(1, 'Conteúdo é obrigatório'),
  phaseId: z.string().uuid().optional(),
});

export const CreateGiveAskInputSchema = z.object({
  type: GiveAskTypeSchema,
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  skills: z.array(z.string()),
});

export const AddCommentInputSchema = z.object({
  postId: z.string().uuid(),
  content: z.string().min(1, 'Comentário é obrigatório'),
});

// Type exports
export type PhaseInfo = z.infer<typeof PhaseInfoSchema>;
export type CommunityPostInput = z.infer<typeof CommunityPostSchema>;
export type PostCommentInput = z.infer<typeof PostCommentSchema>;
export type UserNetworkingProfileInput = z.infer<typeof UserNetworkingProfileSchema>;
export type UserConnectionInput = z.infer<typeof UserConnectionSchema>;
export type GiveAskPostInput = z.infer<typeof GiveAskPostSchema>;
export type CommunityEventInput = z.infer<typeof CommunityEventSchema>;
export type MatchSuggestionInput = z.infer<typeof MatchSuggestionSchema>;
export type CommunityNotificationInput = z.infer<typeof CommunityNotificationSchema>;
export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;
export type CreateGiveAskInput = z.infer<typeof CreateGiveAskInputSchema>;
export type AddCommentInput = z.infer<typeof AddCommentInputSchema>;
