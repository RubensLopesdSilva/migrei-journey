-- Add RLS policy to allow authenticated users to register as mentors
CREATE POLICY "Users can register as mentors"
  ON public.mentors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add policy to allow mentors to delete their own profile
CREATE POLICY "Mentors can delete own profile"
  ON public.mentors FOR DELETE
  USING (auth.uid() = user_id);