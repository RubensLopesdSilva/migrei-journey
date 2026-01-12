-- Make user_id nullable for demo/test mentors
ALTER TABLE public.mentors ALTER COLUMN user_id DROP NOT NULL;

-- Drop the unique constraint temporarily to allow multiple demo mentors
ALTER TABLE public.mentors DROP CONSTRAINT IF EXISTS mentors_user_id_key;