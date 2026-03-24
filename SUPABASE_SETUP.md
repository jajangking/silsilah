# Setup Supabase Backend

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Login
3. Create new project
4. Save your project URL and anon key

## 2. Setup Database

1. Go to SQL Editor in Supabase dashboard
2. Copy paste content from `supabase-setup.sql`
3. Run the SQL to create storage bucket and policies

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 4. Upload Profile Photos

- Click edit (pencil icon) on any member card
- Click on the avatar placeholder
- Select an image (max 5MB)
- Photo will be uploaded to Supabase Storage
- Photo URL will be saved to the member data

## Storage Limits (Free Tier)

- 500MB storage
- 50,000 requests/day
- 2GB bandwidth/month

## Notes

- Photos are stored in `silsilah/profile-photos/` bucket
- File naming: `{memberId}-{timestamp}.{ext}`
- Photos are public (readable by anyone with URL)
- LocalStorage still used for family tree data structure
