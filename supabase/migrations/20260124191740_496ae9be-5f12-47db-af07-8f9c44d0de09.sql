-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  source TEXT DEFAULT 'landing_footer',
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscriptions
FOR INSERT
WITH CHECK (true);

-- Only admins can view subscriptions
CREATE POLICY "Admins can view all subscriptions"
ON public.newsletter_subscriptions
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only admins can update subscriptions
CREATE POLICY "Admins can update subscriptions"
ON public.newsletter_subscriptions
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- Only admins can delete subscriptions
CREATE POLICY "Admins can delete subscriptions"
ON public.newsletter_subscriptions
FOR DELETE
USING (public.is_admin(auth.uid()));

-- Add index for email lookups
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);

-- Add index for active subscriptions
CREATE INDEX idx_newsletter_active ON public.newsletter_subscriptions(is_active) WHERE is_active = true;