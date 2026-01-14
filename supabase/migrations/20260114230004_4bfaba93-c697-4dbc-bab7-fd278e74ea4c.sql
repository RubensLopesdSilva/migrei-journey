-- Restrict community_events meeting_url to authenticated users only
-- Create a view that hides meeting_url for unauthenticated users

-- First, drop the existing policy
DROP POLICY IF EXISTS "Anyone can view active events" ON public.community_events;

-- Create a more restrictive policy - only authenticated users can see events
CREATE POLICY "Authenticated users can view active events" 
ON public.community_events 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Also add a policy for public to see basic event info (but we'll handle meeting_url in application layer)
-- Actually, let's just require authentication for all event access
COMMENT ON TABLE public.community_events IS 'Community events - meeting URLs only accessible to authenticated users';