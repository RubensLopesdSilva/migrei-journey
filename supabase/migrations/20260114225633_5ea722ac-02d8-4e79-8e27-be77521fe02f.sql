-- Remove phone column from profiles table (sensitive PII that shouldn't be stored)
-- This is a security hardening measure

ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

-- Add comment documenting the security decision
COMMENT ON TABLE public.profiles IS 'User profile data. Phone number intentionally excluded for privacy/security.';