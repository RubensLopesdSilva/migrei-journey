-- Add cancellation tracking columns to mentoring_sessions
ALTER TABLE public.mentoring_sessions
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rescheduled_from UUID REFERENCES public.mentoring_sessions(id),
ADD COLUMN IF NOT EXISTS counts_towards_limit BOOLEAN NOT NULL DEFAULT true;

-- Create table to track monthly cancellations
CREATE TABLE IF NOT EXISTS public.user_monthly_cancellations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  month_year TEXT NOT NULL, -- Format: YYYY-MM
  free_cancellations_used INTEGER NOT NULL DEFAULT 0,
  paid_cancellations INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS
ALTER TABLE public.user_monthly_cancellations ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_monthly_cancellations
CREATE POLICY "Users can view own cancellations"
ON public.user_monthly_cancellations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cancellations"
ON public.user_monthly_cancellations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cancellations"
ON public.user_monthly_cancellations
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER update_user_monthly_cancellations_updated_at
BEFORE UPDATE ON public.user_monthly_cancellations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check if a time slot is already booked
CREATE OR REPLACE FUNCTION public.is_slot_available(
  p_mentor_id UUID,
  p_scheduled_at TIMESTAMP WITH TIME ZONE,
  p_exclude_session_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1
    FROM public.mentoring_sessions
    WHERE mentor_id = p_mentor_id
      AND status = 'scheduled'
      AND scheduled_at = p_scheduled_at
      AND (p_exclude_session_id IS NULL OR id != p_exclude_session_id)
  );
END;
$$;

-- Function to get booked slots for a mentor
CREATE OR REPLACE FUNCTION public.get_mentor_booked_slots(
  p_mentor_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE(scheduled_at TIMESTAMP WITH TIME ZONE)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT ms.scheduled_at
  FROM public.mentoring_sessions ms
  WHERE ms.mentor_id = p_mentor_id
    AND ms.status = 'scheduled'
    AND ms.scheduled_at >= p_start_date
    AND ms.scheduled_at < p_end_date + INTERVAL '1 day'
$$;

-- Function to get user's cancellation info for current month
CREATE OR REPLACE FUNCTION public.get_monthly_cancellation_info(p_user_id UUID)
RETURNS TABLE(
  free_cancellations_used INTEGER,
  paid_cancellations INTEGER,
  can_cancel_free BOOLEAN
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    COALESCE(umc.free_cancellations_used, 0) as free_cancellations_used,
    COALESCE(umc.paid_cancellations, 0) as paid_cancellations,
    COALESCE(umc.free_cancellations_used, 0) < 1 as can_cancel_free
  FROM (SELECT 1) dummy
  LEFT JOIN public.user_monthly_cancellations umc 
    ON umc.user_id = p_user_id 
    AND umc.month_year = to_char(CURRENT_DATE, 'YYYY-MM')
$$;