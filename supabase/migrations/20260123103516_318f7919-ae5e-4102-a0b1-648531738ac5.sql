-- Add attachment_url column to ticket_messages
ALTER TABLE public.ticket_messages
ADD COLUMN attachment_url TEXT,
ADD COLUMN attachment_name TEXT;

-- Create storage bucket for support attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('support-attachments', 'support-attachments', true);

-- Allow authenticated users to upload to their ticket folders
CREATE POLICY "Users can upload support attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'support-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own attachments
CREATE POLICY "Users can view their support attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow admins to view all support attachments
CREATE POLICY "Admins can view all support attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'support-attachments'
  AND public.is_admin(auth.uid())
);

-- Allow admins to upload attachments
CREATE POLICY "Admins can upload support attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'support-attachments'
  AND public.is_admin(auth.uid())
);