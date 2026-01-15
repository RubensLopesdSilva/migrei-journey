-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- RLS Policies for user_roles table
-- Only admins can view all roles
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.is_admin(auth.uid()) OR user_id = auth.uid());

-- Only admins can manage roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- Drop the old policy that allowed users to register as mentors
DROP POLICY IF EXISTS "Users can register as mentors" ON public.mentors;

-- Create new policy: Only admins can create mentors
CREATE POLICY "Admins can create mentors"
  ON public.mentors FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- Allow admins to view all mentors (including inactive)
CREATE POLICY "Admins can view all mentors"
  ON public.mentors FOR SELECT
  USING (public.is_admin(auth.uid()) OR is_active = true);

-- Allow admins to manage all mentors
CREATE POLICY "Admins can manage all mentors"
  ON public.mentors FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete mentors"
  ON public.mentors FOR DELETE
  USING (public.is_admin(auth.uid()));