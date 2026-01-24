CREATE OR REPLACE FUNCTION public.count_monthly_sessions(user_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.mentoring_sessions
  WHERE mentee_id = user_uuid
    AND status != 'cancelled'
    AND scheduled_at >= date_trunc('month', CURRENT_DATE)
    AND scheduled_at < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
    AND (counts_towards_limit IS NULL OR counts_towards_limit = true)
$function$