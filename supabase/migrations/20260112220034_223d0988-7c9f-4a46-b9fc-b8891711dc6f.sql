-- Enum for post types (templates)
CREATE TYPE post_type AS ENUM (
  'stuck_at',
  'completed_phase',
  'need_help',
  'can_help',
  'opportunity',
  'general'
);

-- Enum for connection status
CREATE TYPE connection_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'blocked'
);

-- Enum for conversation request status
CREATE TYPE conversation_status AS ENUM (
  'pending',
  'accepted',
  'declined',
  'completed',
  'cancelled'
);

-- Enum for give/ask type
CREATE TYPE give_ask_type AS ENUM (
  'give',
  'ask'
);

-- Enum for event type
CREATE TYPE event_type AS ENUM (
  'networking_round',
  'workshop',
  'q_and_a',
  'mentoring_group'
);

-- Extended user profiles for networking
CREATE TABLE public.user_networking_profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  career_objective text,
  interest_areas text[] DEFAULT '{}',
  previous_experience text,
  skills text[] DEFAULT '{}',
  what_seeking text,
  what_offering text,
  linkedin_url text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.user_networking_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public profiles"
  ON public.user_networking_profiles FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.user_networking_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.user_networking_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Community posts
CREATE TABLE public.community_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  phase_id uuid NOT NULL,
  post_type post_type NOT NULL DEFAULT 'general',
  title text NOT NULL,
  content text NOT NULL,
  is_pinned boolean NOT NULL DEFAULT false,
  likes_count integer NOT NULL DEFAULT 0,
  comments_count integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active posts"
  ON public.community_posts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Post comments
CREATE TABLE public.post_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active comments"
  ON public.post_comments FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create comments"
  ON public.post_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.post_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Post likes
CREATE TABLE public.post_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view likes"
  ON public.post_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like posts"
  ON public.post_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON public.post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- User connections
CREATE TABLE public.user_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL,
  requested_id uuid NOT NULL,
  status connection_status NOT NULL DEFAULT 'pending',
  match_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(requester_id, requested_id)
);

ALTER TABLE public.user_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
  ON public.user_connections FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create connection requests"
  ON public.user_connections FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update connections they're involved in"
  ON public.user_connections FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Conversation requests (1:1)
CREATE TABLE public.conversation_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id uuid NOT NULL,
  requested_id uuid NOT NULL,
  reason text NOT NULL,
  suggested_duration integer NOT NULL DEFAULT 30,
  status conversation_status NOT NULL DEFAULT 'pending',
  scheduled_at timestamp with time zone,
  meeting_url text,
  feedback_requester text,
  feedback_requested text,
  rating_requester integer,
  rating_requested integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.conversation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversation requests"
  ON public.conversation_requests FOR SELECT
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

CREATE POLICY "Users can create conversation requests"
  ON public.conversation_requests FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update conversations they're involved in"
  ON public.conversation_requests FOR UPDATE
  USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Give & Ask posts
CREATE TABLE public.give_ask_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  phase_id uuid,
  type give_ask_type NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  skills_related text[] DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  responses_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.give_ask_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active give/ask posts"
  ON public.give_ask_posts FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can create give/ask posts"
  ON public.give_ask_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own give/ask posts"
  ON public.give_ask_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Give/Ask responses
CREATE TABLE public.give_ask_responses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES public.give_ask_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  message text NOT NULL,
  is_accepted boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.give_ask_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view responses to own posts or own responses"
  ON public.give_ask_responses FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.give_ask_posts WHERE id = post_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can create responses"
  ON public.give_ask_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Post owners can update responses"
  ON public.give_ask_responses FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.give_ask_posts WHERE id = post_id AND user_id = auth.uid()));

-- Community events
CREATE TABLE public.community_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phase_id uuid,
  title text NOT NULL,
  description text NOT NULL,
  event_type event_type NOT NULL,
  starts_at timestamp with time zone NOT NULL,
  ends_at timestamp with time zone NOT NULL,
  max_participants integer,
  meeting_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active events"
  ON public.community_events FOR SELECT
  USING (is_active = true);

-- Event registrations
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.community_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  attended boolean DEFAULT false,
  feedback text,
  rating integer,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations"
  ON public.event_registrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can register for events"
  ON public.event_registrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registrations"
  ON public.event_registrations FOR UPDATE
  USING (auth.uid() = user_id);

-- Match suggestions (weekly networking matches)
CREATE TABLE public.match_suggestions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  suggested_user_id uuid NOT NULL,
  match_score integer NOT NULL DEFAULT 0,
  match_reasons jsonb NOT NULL DEFAULT '[]',
  status text NOT NULL DEFAULT 'pending',
  week_of date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, suggested_user_id, week_of)
);

ALTER TABLE public.match_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own match suggestions"
  ON public.match_suggestions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own match suggestions"
  ON public.match_suggestions FOR UPDATE
  USING (auth.uid() = user_id);

-- Community notifications
CREATE TABLE public.community_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  reference_id uuid,
  reference_type text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.community_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.community_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.community_notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- User blocks (moderation)
CREATE TABLE public.user_blocks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id uuid NOT NULL,
  blocked_id uuid NOT NULL,
  reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blocks"
  ON public.user_blocks FOR SELECT
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can create blocks"
  ON public.user_blocks FOR INSERT
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete own blocks"
  ON public.user_blocks FOR DELETE
  USING (auth.uid() = blocker_id);

-- Content reports (moderation)
CREATE TABLE public.content_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id uuid NOT NULL,
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  resolved_at timestamp with time zone,
  resolved_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
  ON public.content_reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON public.content_reports FOR SELECT
  USING (auth.uid() = reporter_id);

-- XP rewards for community activities
CREATE TABLE public.community_xp_actions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type text NOT NULL UNIQUE,
  xp_reward integer NOT NULL DEFAULT 10,
  daily_limit integer,
  description text
);

INSERT INTO public.community_xp_actions (action_type, xp_reward, daily_limit, description) VALUES
  ('create_post', 20, 3, 'Criar um post na comunidade'),
  ('comment', 10, 10, 'Comentar em um post'),
  ('like', 2, 20, 'Curtir um post'),
  ('receive_like', 5, NULL, 'Receber uma curtida'),
  ('connect', 30, 5, 'Conectar com outro membro'),
  ('give_help', 50, 3, 'Oferecer ajuda'),
  ('ask_help', 15, 3, 'Pedir ajuda'),
  ('attend_event', 100, NULL, 'Participar de evento'),
  ('complete_conversation', 75, NULL, 'Completar conversa 1:1');

ALTER TABLE public.community_xp_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view xp actions"
  ON public.community_xp_actions FOR SELECT
  USING (true);

-- Function to update post likes count
CREATE OR REPLACE FUNCTION public.update_post_likes_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_post_like_change
  AFTER INSERT OR DELETE ON public.post_likes
  FOR EACH ROW EXECUTE FUNCTION public.update_post_likes_count();

-- Function to update post comments count
CREATE OR REPLACE FUNCTION public.update_post_comments_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_posts SET comments_count = comments_count + 1 WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_posts SET comments_count = comments_count - 1 WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
END;
$$;

CREATE TRIGGER on_post_comment_change
  AFTER INSERT OR DELETE ON public.post_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_post_comments_count();

-- Insert sample events
INSERT INTO public.community_events (phase_id, title, description, event_type, starts_at, ends_at, max_participants) 
SELECT 
  mp.id,
  'Rodada de Networking - ' || mp.name,
  'Encontro semanal para networking entre membros na fase ' || mp.name,
  'networking_round',
  now() + interval '7 days',
  now() + interval '7 days' + interval '1 hour',
  20
FROM public.migrei_phases mp;