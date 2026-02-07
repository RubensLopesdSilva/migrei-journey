import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Copy, Check, ChevronDown, ChevronRight, Code2 } from "lucide-react";

interface TableSchema {
  name: string;
  sql: string;
}

interface SchemaCategory {
  id: string;
  title: string;
  tables: TableSchema[];
}

const schemaCategories: SchemaCategory[] = [
  {
    id: "users",
    title: "Usuários & Autenticação",
    tables: [
      {
        name: "profiles",
        sql: `CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  current_company TEXT,
  current_role TEXT,
  linkedin_url TEXT,
  phone TEXT,
  location TEXT,
  career_goal TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);`
      },
      {
        name: "user_roles",
        sql: `CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);`
      },
      {
        name: "user_subscriptions",
        sql: `CREATE TYPE public.subscription_status AS ENUM (
  'active', 'canceled', 'incomplete', 'incomplete_expired', 
  'past_due', 'trialing', 'unpaid'
);

CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status subscription_status NOT NULL DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  coupon_id UUID REFERENCES coupons(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);`
      },
      {
        name: "user_streaks",
        sql: `CREATE TABLE public.user_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  streak_started_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own streaks" ON public.user_streaks
  FOR ALL USING (auth.uid() = user_id);`
      },
    ],
  },
  {
    id: "progress",
    title: "Progresso & Fases",
    tables: [
      {
        name: "migrei_phases",
        sql: `CREATE TABLE public.migrei_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_number INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  objective TEXT,
  color TEXT,
  icon_name TEXT,
  level_name TEXT NOT NULL,
  level_description TEXT,
  xp_to_complete INTEGER NOT NULL DEFAULT 1000,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.migrei_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view phases" ON public.migrei_phases
  FOR SELECT USING (true);`
      },
      {
        name: "user_progress",
        sql: `CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  current_phase_id UUID REFERENCES migrei_phases(id),
  current_phase_number INTEGER NOT NULL DEFAULT 1,
  total_xp INTEGER NOT NULL DEFAULT 0,
  overall_progress INTEGER NOT NULL DEFAULT 0,
  last_activity_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);`
      },
      {
        name: "user_phase_progress",
        sql: `CREATE TYPE public.phase_status AS ENUM ('locked', 'available', 'in_progress', 'completed');

CREATE TABLE public.user_phase_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phase_id UUID NOT NULL REFERENCES migrei_phases(id),
  status phase_status NOT NULL DEFAULT 'locked',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, phase_id)
);

ALTER TABLE public.user_phase_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own phase progress" ON public.user_phase_progress
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "phase_activities",
        sql: `CREATE TABLE public.phase_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id UUID NOT NULL REFERENCES migrei_phases(id),
  name TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 50,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  estimated_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.phase_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view activities" ON public.phase_activities
  FOR SELECT USING (true);`
      },
      {
        name: "user_activity_completions",
        sql: `CREATE TABLE public.user_activity_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  activity_id UUID NOT NULL REFERENCES phase_activities(id),
  phase_id UUID NOT NULL REFERENCES migrei_phases(id),
  xp_earned INTEGER NOT NULL DEFAULT 0,
  time_spent_minutes INTEGER,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, activity_id)
);

ALTER TABLE public.user_activity_completions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own completions" ON public.user_activity_completions
  FOR ALL USING (auth.uid() = user_id);`
      },
    ],
  },
  {
    id: "gamification",
    title: "Gamificação",
    tables: [
      {
        name: "badges",
        sql: `CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  rarity TEXT NOT NULL DEFAULT 'common',
  phase_id UUID REFERENCES migrei_phases(id),
  xp_reward INTEGER NOT NULL DEFAULT 50,
  requirement_type TEXT NOT NULL,
  requirement_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_phase_completion BOOLEAN NOT NULL DEFAULT false,
  is_master_badge BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges" ON public.badges
  FOR SELECT USING (true);`
      },
      {
        name: "user_badges",
        sql: `CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_displayed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (user_id, badge_id)
);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own badges" ON public.user_badges
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "missions",
        sql: `CREATE TYPE public.mission_type AS ENUM ('daily', 'weekly', 'phase', 'special');

CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mission_type mission_type NOT NULL DEFAULT 'daily',
  phase_id UUID REFERENCES migrei_phases(id),
  xp_reward INTEGER NOT NULL DEFAULT 25,
  badge_id UUID REFERENCES badges(id),
  requirement_type TEXT NOT NULL,
  requirement_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active missions" ON public.missions
  FOR SELECT USING (is_active = true);`
      },
      {
        name: "user_missions",
        sql: `CREATE TABLE public.user_missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  mission_id UUID NOT NULL REFERENCES missions(id),
  progress INTEGER NOT NULL DEFAULT 0,
  target INTEGER NOT NULL DEFAULT 1,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own missions" ON public.user_missions
  FOR ALL USING (auth.uid() = user_id);`
      },
    ],
  },
  {
    id: "mentoring",
    title: "Mentorias",
    tables: [
      {
        name: "mentors",
        sql: `CREATE TABLE public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  expertise TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active mentors" ON public.mentors
  FOR SELECT USING (is_active = true);`
      },
      {
        name: "mentor_availability",
        sql: `CREATE TABLE public.mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mentor availability" ON public.mentor_availability
  FOR SELECT USING (true);`
      },
      {
        name: "mentoring_sessions",
        sql: `CREATE TABLE public.mentoring_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id),
  mentee_id UUID NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled',
  meeting_url TEXT,
  notes TEXT,
  cancelled_at TIMESTAMPTZ,
  rescheduled_from UUID REFERENCES mentoring_sessions(id),
  counts_towards_limit BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mentoring_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.mentoring_sessions
  FOR SELECT USING (
    auth.uid() = mentee_id OR 
    EXISTS (SELECT 1 FROM mentors WHERE id = mentor_id AND user_id = auth.uid())
  );`
      },
    ],
  },
  {
    id: "community",
    title: "Comunidade",
    tables: [
      {
        name: "community_posts",
        sql: `CREATE TYPE public.post_type AS ENUM ('general', 'question', 'win', 'resource', 'event');

CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phase_id UUID NOT NULL REFERENCES migrei_phases(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type post_type NOT NULL DEFAULT 'general',
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active posts" ON public.community_posts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create posts" ON public.community_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);`
      },
      {
        name: "post_comments",
        sql: `CREATE TABLE public.post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active comments" ON public.post_comments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create comments" ON public.post_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);`
      },
      {
        name: "post_likes",
        sql: `CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);

ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own likes" ON public.post_likes
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "community_events",
        sql: `CREATE TYPE public.event_type AS ENUM ('workshop', 'webinar', 'networking', 'mentoria_grupo', 'qa');

CREATE TABLE public.community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_type event_type NOT NULL,
  phase_id UUID REFERENCES migrei_phases(id),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  meeting_url TEXT,
  max_participants INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view events" ON public.community_events
  FOR SELECT USING (is_active = true);`
      },
    ],
  },
  {
    id: "discovery",
    title: "Fase 2 - Descoberta",
    tables: [
      {
        name: "diagnostic_results",
        sql: `CREATE TABLE public.diagnostic_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  diagnostic_type TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  scores JSONB NOT NULL DEFAULT '{}',
  result_summary TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own diagnostics" ON public.diagnostic_results
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "career_wheel_assessments",
        sql: `CREATE TABLE public.career_wheel_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  dimension TEXT NOT NULL,
  current_rating INTEGER NOT NULL DEFAULT 5,
  desired_rating INTEGER NOT NULL DEFAULT 10,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.career_wheel_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own career wheel" ON public.career_wheel_assessments
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "professional_timeline",
        sql: `CREATE TABLE public.professional_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_type TEXT NOT NULL DEFAULT 'positive',
  event_year INTEGER NOT NULL,
  learnings TEXT,
  ai_suggested_learning TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.professional_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own timeline" ON public.professional_timeline
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "clarity_reports",
        sql: `CREATE TABLE public.clarity_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  professional_identity TEXT,
  core_motivators JSONB DEFAULT '[]'::jsonb,
  top_competencies JSONB DEFAULT '[]'::jsonb,
  areas_to_develop JSONB DEFAULT '[]'::jsonb,
  recommended_routes JSONB DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clarity_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own clarity report" ON public.clarity_reports
  FOR ALL USING (auth.uid() = user_id);`
      },
    ],
  },
  {
    id: "decision",
    title: "Fase 3 - Decisão",
    tables: [
      {
        name: "possibility_routes",
        sql: `CREATE TABLE public.possibility_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  route_name TEXT NOT NULL,
  route_type TEXT NOT NULL,
  description TEXT,
  pros JSONB DEFAULT '[]'::jsonb,
  cons JSONB DEFAULT '[]'::jsonb,
  feasibility_score INTEGER DEFAULT 5,
  passion_score INTEGER DEFAULT 5,
  market_score INTEGER DEFAULT 5,
  is_selected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.possibility_routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own routes" ON public.possibility_routes
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "smart_goals",
        sql: `CREATE TABLE public.smart_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  route_id UUID REFERENCES possibility_routes(id),
  goal_title TEXT NOT NULL,
  specific TEXT NOT NULL,
  measurable TEXT NOT NULL,
  achievable TEXT NOT NULL,
  relevant TEXT NOT NULL,
  time_bound TEXT NOT NULL,
  target_date DATE,
  status TEXT DEFAULT 'draft',
  is_validated BOOLEAN DEFAULT false,
  validation_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.smart_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own goals" ON public.smart_goals
  FOR ALL USING (auth.uid() = user_id);`
      },
    ],
  },
  {
    id: "payments",
    title: "Pagamentos & Planos",
    tables: [
      {
        name: "subscription_plans",
        sql: `CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly INTEGER NOT NULL DEFAULT 0,
  price_yearly INTEGER,
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_public BOOLEAN NOT NULL DEFAULT true,
  trial_days INTEGER DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public plans" ON public.subscription_plans
  FOR SELECT USING (is_active = true AND is_public = true);`
      },
      {
        name: "coupons",
        sql: `CREATE TYPE public.coupon_type AS ENUM ('percentage', 'fixed_amount');
CREATE TYPE public.coupon_eligibility AS ENUM ('all', 'new_users_only', 'specific_plans');

CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  coupon_type coupon_type NOT NULL,
  discount_value NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BRL',
  duration TEXT NOT NULL DEFAULT 'once',
  duration_in_months INTEGER,
  eligibility coupon_eligibility NOT NULL DEFAULT 'all',
  eligible_plan_ids UUID[],
  max_redemptions INTEGER,
  redemptions_count INTEGER NOT NULL DEFAULT 0,
  first_time_only BOOLEAN NOT NULL DEFAULT true,
  min_purchase_amount NUMERIC,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  stripe_coupon_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can validate coupons" ON public.coupons
  FOR SELECT USING (is_active = true);`
      },
    ],
  },
  {
    id: "content",
    title: "Conteúdo & Blog",
    tables: [
      {
        name: "blog_categories",
        sql: `CREATE TABLE public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" ON public.blog_categories
  FOR SELECT USING (true);`
      },
      {
        name: "blog_posts",
        sql: `CREATE TYPE public.blog_post_status AS ENUM ('draft', 'published', 'scheduled', 'archived');

CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL,
  category_id UUID REFERENCES blog_categories(id),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  content_format TEXT NOT NULL DEFAULT 'markdown',
  featured_image TEXT,
  status blog_post_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  reading_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published posts" ON public.blog_posts
  FOR SELECT USING (status = 'published');`
      },
      {
        name: "support_tickets",
        sql: `CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_response TEXT,
  responded_at TIMESTAMPTZ,
  responded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);`
      },
    ],
  },
  {
    id: "ai",
    title: "Inteligência Artificial",
    tables: [
      {
        name: "ai_agents",
        sql: `CREATE TABLE public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  persona TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  background_color TEXT NOT NULL DEFAULT '#6366f1',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active agents" ON public.ai_agents
  FOR SELECT USING (is_active = true);`
      },
      {
        name: "user_agents",
        sql: `CREATE TABLE public.user_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  agent_id UUID NOT NULL REFERENCES ai_agents(id),
  selected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own agent" ON public.user_agents
  FOR ALL USING (auth.uid() = user_id);`
      },
      {
        name: "coach_conversations",
        sql: `CREATE TABLE public.coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  phase_id UUID REFERENCES migrei_phases(id),
  context_type TEXT NOT NULL DEFAULT 'general',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.coach_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations" ON public.coach_conversations
  FOR ALL USING (auth.uid() = user_id);`
      },
    ],
  },
];

export function SQLSchemaExport() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<string[]>(["users"]);

  const copyToClipboard = async (sql: string, id: string) => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopiedId(id);
      toast.success("SQL copiado para a área de transferência!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Erro ao copiar SQL");
    }
  };

  const copyAllFromCategory = async (category: SchemaCategory) => {
    const allSql = category.tables.map(t => `-- Table: ${t.name}\n${t.sql}`).join("\n\n-- ----------------------------------------\n\n");
    try {
      await navigator.clipboard.writeText(allSql);
      toast.success(`SQLs de ${category.title} copiados!`);
    } catch {
      toast.error("Erro ao copiar SQLs");
    }
  };

  const copyAll = async () => {
    const allSql = schemaCategories
      .map(cat => 
        `-- ========================================\n-- ${cat.title.toUpperCase()}\n-- ========================================\n\n` +
        cat.tables.map(t => `-- Table: ${t.name}\n${t.sql}`).join("\n\n")
      )
      .join("\n\n\n");
    try {
      await navigator.clipboard.writeText(allSql);
      toast.success("Todos os SQLs copiados!");
    } catch {
      toast.error("Erro ao copiar SQLs");
    }
  };

  const toggleCategory = (id: string) => {
    setOpenCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <Code2 className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <CardTitle className="text-lg">SQL das Tabelas</CardTitle>
              <CardDescription>
                Copie os comandos CREATE TABLE para migrar a estrutura do banco
              </CardDescription>
            </div>
          </div>
          <Button onClick={copyAll} variant="default" size="sm">
            <Copy className="h-4 w-4 mr-1" />
            Copiar Todos
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {schemaCategories.map((category) => (
          <Collapsible
            key={category.id}
            open={openCategories.includes(category.id)}
            onOpenChange={() => toggleCategory(category.id)}
          >
            <div className="border rounded-lg overflow-hidden">
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-2">
                    {openCategories.includes(category.id) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">{category.title}</span>
                    <span className="text-xs text-muted-foreground">
                      ({category.tables.length} tabelas)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyAllFromCategory(category);
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar categoria
                  </Button>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="divide-y">
                  {category.tables.map((table) => (
                    <div key={table.name} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono text-primary bg-primary/5 px-2 py-0.5 rounded">
                          {table.name}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(table.sql, table.name)}
                        >
                          {copiedId === table.name ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <ScrollArea className="h-48">
                        <pre className="text-xs font-mono bg-muted/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                          {table.sql}
                        </pre>
                      </ScrollArea>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </CardContent>
    </Card>
  );
}
