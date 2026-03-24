-- Setup Supabase Storage for profile photos
-- Run this in your Supabase SQL Editor

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('silsilah', 'silsilah', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profile photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'silsilah');

-- Allow authenticated users to upload files
CREATE POLICY "Enable upload for users"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'silsilah');

-- Allow users to update their own files
CREATE POLICY "Enable update for users"
ON storage.objects FOR UPDATE
USING (bucket_id = 'silsilah');

-- Allow users to delete their own files
CREATE POLICY "Enable delete for users"
ON storage.objects FOR DELETE
USING (bucket_id = 'silsilah');
