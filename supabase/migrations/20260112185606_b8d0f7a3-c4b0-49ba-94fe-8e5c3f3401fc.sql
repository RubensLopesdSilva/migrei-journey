-- =====================================================
-- SUBSCRIPTION SYSTEM ARCHITECTURE
-- Scalable, feature-based access control
-- =====================================================

-- 1. ENUM TYPES
-- =====================================================

-- Subscription status enum
CREATE TYPE public.subscription_status AS ENUM (
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'paused'
);

-- Coupon type enum
CREATE TYPE public.coupon_type AS ENUM (
  'percentage',
  'fixed_amount',
  'trial_extension'
);

-- Coupon eligibility enum
CREATE TYPE public.coupon_eligibility AS ENUM (
  'all_plans',
  'specific_plans',
  'new_users_only',
  'upgrade_only'
);

-- Payment event type enum
CREATE TYPE public.payment_event_type AS ENUM (
  'payment_succeeded',
  'payment_failed',
  'subscription_created',
  'subscription_updated',
  'subscription_canceled',
  'subscription_renewed',
  'invoice_paid',
  'invoice_payment_failed',
  'customer_created',
  'refund_processed'
);

-- 2. SUBSCRIPTION PLANS TABLE
-- =====================================================
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_product_id TEXT UNIQUE,
  stripe_price_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BRL',
  interval TEXT NOT NULL DEFAULT 'month', -- month, year
  interval_count INTEGER NOT NULL DEFAULT 1,
  trial_days INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_public BOOLEAN NOT NULL DEFAULT true, -- visible in pricing page
  sort_order INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. PLAN FEATURES TABLE (feature-based access control)
-- =====================================================
CREATE TABLE public.plan_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE CASCADE,
  feature_key TEXT NOT NULL, -- e.g., 'mentoring_sessions', 'ai_assistant', 'priority_support'
  feature_name TEXT NOT NULL, -- Display name
  feature_value JSONB NOT NULL DEFAULT 'true', -- Can be boolean, number, or object
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(plan_id, feature_key)
);

-- 4. USER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status public.subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
  canceled_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  coupon_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast user lookups
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_stripe ON public.user_subscriptions(stripe_subscription_id);

-- 5. COUPONS TABLE
-- =====================================================
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_coupon_id TEXT UNIQUE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  coupon_type public.coupon_type NOT NULL,
  discount_value NUMERIC NOT NULL, -- percentage (0-100) or fixed amount in cents
  currency TEXT DEFAULT 'BRL', -- for fixed_amount type
  duration TEXT NOT NULL DEFAULT 'once', -- once, repeating, forever
  duration_in_months INTEGER, -- for repeating duration
  max_redemptions INTEGER, -- null = unlimited
  redemptions_count INTEGER NOT NULL DEFAULT 0,
  eligibility public.coupon_eligibility NOT NULL DEFAULT 'all_plans',
  eligible_plan_ids UUID[], -- for specific_plans eligibility
  min_purchase_amount INTEGER, -- minimum cart value in cents
  first_time_only BOOLEAN NOT NULL DEFAULT false,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for fast coupon lookups
CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(is_active, valid_from, valid_until);

-- 6. COUPON REDEMPTIONS TABLE (audit trail)
-- =====================================================
CREATE TABLE public.coupon_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id),
  discount_applied_cents INTEGER NOT NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index for checking user redemptions
CREATE INDEX idx_coupon_redemptions_user ON public.coupon_redemptions(user_id, coupon_id);

-- 7. PAYMENT EVENTS LOG TABLE (webhook audit trail)
-- =====================================================
CREATE TABLE public.payment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT UNIQUE NOT NULL,
  event_type public.payment_event_type NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for webhook processing
CREATE INDEX idx_payment_events_processed ON public.payment_events(processed, created_at);
CREATE INDEX idx_payment_events_stripe ON public.payment_events(stripe_event_id);
CREATE INDEX idx_payment_events_user ON public.payment_events(user_id);

-- 8. FEATURE ACCESS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_feature(
  p_user_id UUID,
  p_feature_key TEXT
)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT pf.feature_value
      FROM user_subscriptions us
      JOIN plan_features pf ON pf.plan_id = us.plan_id
      WHERE us.user_id = p_user_id
        AND us.status IN ('active', 'trialing')
        AND pf.feature_key = p_feature_key
      ORDER BY us.created_at DESC
      LIMIT 1
    ),
    'false'::jsonb
  )
$$;

-- 9. CHECK IF USER HAS ACTIVE SUBSCRIPTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_active_subscription(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_subscriptions
    WHERE user_id = p_user_id
      AND status IN ('active', 'trialing')
  )
$$;

-- 10. GET USER PLAN SLUG
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_plan_slug(p_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT sp.slug
  FROM user_subscriptions us
  JOIN subscription_plans sp ON sp.id = us.plan_id
  WHERE us.user_id = p_user_id
    AND us.status IN ('active', 'trialing')
  ORDER BY us.created_at DESC
  LIMIT 1
$$;

-- 11. VALIDATE COUPON FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.validate_coupon(
  p_code TEXT,
  p_user_id UUID,
  p_plan_id UUID DEFAULT NULL
)
RETURNS TABLE (
  is_valid BOOLEAN,
  coupon_id UUID,
  discount_type public.coupon_type,
  discount_value NUMERIC,
  error_message TEXT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_coupon RECORD;
  v_user_redemptions INTEGER;
  v_has_previous_subscription BOOLEAN;
BEGIN
  -- Find the coupon
  SELECT * INTO v_coupon
  FROM coupons c
  WHERE c.code = UPPER(p_code)
    AND c.is_active = true
    AND c.valid_from <= now()
    AND (c.valid_until IS NULL OR c.valid_until > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::coupon_type, NULL::NUMERIC, 'Cupom inválido ou expirado';
    RETURN;
  END IF;
  
  -- Check max redemptions
  IF v_coupon.max_redemptions IS NOT NULL AND v_coupon.redemptions_count >= v_coupon.max_redemptions THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::coupon_type, NULL::NUMERIC, 'Cupom esgotado';
    RETURN;
  END IF;
  
  -- Check if user already redeemed
  IF v_coupon.first_time_only THEN
    SELECT COUNT(*) INTO v_user_redemptions
    FROM coupon_redemptions cr
    WHERE cr.coupon_id = v_coupon.id AND cr.user_id = p_user_id;
    
    IF v_user_redemptions > 0 THEN
      RETURN QUERY SELECT false, NULL::UUID, NULL::coupon_type, NULL::NUMERIC, 'Você já utilizou este cupom';
      RETURN;
    END IF;
  END IF;
  
  -- Check eligibility
  IF v_coupon.eligibility = 'new_users_only' THEN
    SELECT EXISTS (SELECT 1 FROM user_subscriptions WHERE user_id = p_user_id) INTO v_has_previous_subscription;
    IF v_has_previous_subscription THEN
      RETURN QUERY SELECT false, NULL::UUID, NULL::coupon_type, NULL::NUMERIC, 'Cupom válido apenas para novos usuários';
      RETURN;
    END IF;
  END IF;
  
  -- Check plan eligibility
  IF v_coupon.eligibility = 'specific_plans' AND p_plan_id IS NOT NULL THEN
    IF NOT (p_plan_id = ANY(v_coupon.eligible_plan_ids)) THEN
      RETURN QUERY SELECT false, NULL::UUID, NULL::coupon_type, NULL::NUMERIC, 'Cupom não válido para este plano';
      RETURN;
    END IF;
  END IF;
  
  -- Coupon is valid
  RETURN QUERY SELECT true, v_coupon.id, v_coupon.coupon_type, v_coupon.discount_value, NULL::TEXT;
END;
$$;

-- 12. ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Subscription Plans: Public read for active plans
CREATE POLICY "Anyone can view active plans"
ON public.subscription_plans FOR SELECT
USING (is_active = true AND is_public = true);

-- Plan Features: Public read for active plans
CREATE POLICY "Anyone can view plan features"
ON public.plan_features FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM subscription_plans sp
    WHERE sp.id = plan_features.plan_id
      AND sp.is_active = true
      AND sp.is_public = true
  )
);

-- User Subscriptions: Users can only see their own
CREATE POLICY "Users can view own subscriptions"
ON public.user_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Coupons: Public read for validation (code visibility controlled in app)
CREATE POLICY "Anyone can view active coupons for validation"
ON public.coupons FOR SELECT
USING (is_active = true);

-- Coupon Redemptions: Users can view their own
CREATE POLICY "Users can view own redemptions"
ON public.coupon_redemptions FOR SELECT
USING (auth.uid() = user_id);

-- Payment Events: Users can view their own events
CREATE POLICY "Users can view own payment events"
ON public.payment_events FOR SELECT
USING (auth.uid() = user_id);

-- 13. UPDATE TRIGGERS
-- =====================================================
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
BEFORE UPDATE ON public.user_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 14. INSERT DEFAULT PLANS
-- =====================================================
INSERT INTO public.subscription_plans (name, slug, description, price_cents, interval, sort_order)
VALUES 
  ('Gratuito', 'free', 'Acesso básico à plataforma', 0, 'month', 0),
  ('Essencial', 'essential', 'Para quem quer começar sua jornada de mentoria', 4900, 'month', 1),
  ('Premium', 'premium', 'Acesso completo a todas as funcionalidades', 9900, 'month', 2);

-- 15. INSERT DEFAULT FEATURES
-- =====================================================
INSERT INTO public.plan_features (plan_id, feature_key, feature_name, feature_value, description)
SELECT 
  sp.id,
  f.feature_key,
  f.feature_name,
  f.feature_value,
  f.description
FROM subscription_plans sp
CROSS JOIN (
  VALUES 
    -- Free plan features
    ('free', 'mentoring_sessions_limit', 'Sessões de Mentoria', '0'::jsonb, 'Número de sessões por mês'),
    ('free', 'community_access', 'Acesso à Comunidade', 'true'::jsonb, 'Acesso ao fórum da comunidade'),
    ('free', 'ai_assistant', 'Assistente IA', 'false'::jsonb, 'Acesso ao assistente de IA'),
    ('free', 'priority_support', 'Suporte Prioritário', 'false'::jsonb, 'Atendimento prioritário'),
    ('free', 'exclusive_content', 'Conteúdo Exclusivo', 'false'::jsonb, 'Materiais e cursos exclusivos'),
    
    -- Essential plan features
    ('essential', 'mentoring_sessions_limit', 'Sessões de Mentoria', '2'::jsonb, 'Número de sessões por mês'),
    ('essential', 'community_access', 'Acesso à Comunidade', 'true'::jsonb, 'Acesso ao fórum da comunidade'),
    ('essential', 'ai_assistant', 'Assistente IA', 'true'::jsonb, 'Acesso ao assistente de IA'),
    ('essential', 'priority_support', 'Suporte Prioritário', 'false'::jsonb, 'Atendimento prioritário'),
    ('essential', 'exclusive_content', 'Conteúdo Exclusivo', 'false'::jsonb, 'Materiais e cursos exclusivos'),
    
    -- Premium plan features  
    ('premium', 'mentoring_sessions_limit', 'Sessões de Mentoria', '4'::jsonb, 'Número de sessões por mês'),
    ('premium', 'community_access', 'Acesso à Comunidade', 'true'::jsonb, 'Acesso ao fórum da comunidade'),
    ('premium', 'ai_assistant', 'Assistente IA', 'true'::jsonb, 'Acesso ao assistente de IA'),
    ('premium', 'priority_support', 'Suporte Prioritário', 'true'::jsonb, 'Atendimento prioritário'),
    ('premium', 'exclusive_content', 'Conteúdo Exclusivo', 'true'::jsonb, 'Materiais e cursos exclusivos')
) AS f(plan_slug, feature_key, feature_name, feature_value, description)
WHERE sp.slug = f.plan_slug;