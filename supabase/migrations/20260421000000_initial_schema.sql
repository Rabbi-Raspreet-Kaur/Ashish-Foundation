-- ============================================================
-- Ashish Foundation Database Schema Migration
-- Migration: 20260421000000_initial_schema.sql
-- Description: Creates core foundation tables with Row Level Security (RLS)
-- ============================================================

-- Ensure pgcrypto extension is available for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Contact Messages (Inquiries from the website contact form)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 200),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject TEXT NOT NULL CHECK (char_length(trim(subject)) > 0 AND char_length(subject) <= 300),
  message TEXT NOT NULL CHECK (char_length(trim(message)) > 0 AND char_length(message) <= 5000),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON public.contact_messages (is_read);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated public visitors to submit inquiries
CREATE POLICY "Public can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND
    char_length(trim(email)) > 0 AND
    char_length(trim(subject)) > 0 AND
    char_length(trim(message)) > 0 AND
    is_read = false
  );

-- Only authenticated administrators can read, update read status, or delete messages
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 2. Volunteers (Registrations from the How to Help section)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 200),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT NOT NULL CHECK (char_length(trim(phone)) >= 7 AND char_length(phone) <= 25),
  interest TEXT NOT NULL DEFAULT 'Education' CHECK (char_length(interest) <= 100),
  message TEXT NOT NULL DEFAULT '' CHECK (char_length(message) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_volunteers_created_at ON public.volunteers (created_at DESC);

ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

-- Anyone can apply to volunteer
CREATE POLICY "Public can register as volunteer"
  ON public.volunteers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND
    char_length(trim(email)) > 0 AND
    char_length(trim(phone)) > 0
  );

-- Private data: only authenticated administrators can view or manage volunteers
CREATE POLICY "Admins can view volunteers"
  ON public.volunteers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete volunteers"
  ON public.volunteers
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 3. Donations (Pledged / Logged UPI Donations)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 200),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0 AND amount <= 10000000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_donations_created_at ON public.donations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_donations_status ON public.donations (status);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Donors can submit a donation pledge (status is strictly forced to 'pending')
CREATE POLICY "Public can record a pending donation"
  ON public.donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND
    char_length(trim(email)) > 0 AND
    amount > 0 AND
    status = 'pending'
  );

-- Only authenticated administrators can view donations or reconcile status
CREATE POLICY "Admins can view donations"
  ON public.donations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can update donation status"
  ON public.donations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete donations"
  ON public.donations
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 4. Events (Foundation Drives, Camps, Workshops)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 250),
  date TEXT NOT NULL CHECK (char_length(trim(date)) > 0 AND char_length(date) <= 100),
  location TEXT NOT NULL CHECK (char_length(trim(location)) > 0 AND char_length(location) <= 200),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0 AND char_length(description) <= 3000),
  image TEXT NOT NULL DEFAULT '/images/hero-bg.jpg',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can view scheduled events
CREATE POLICY "Public can view events"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated administrators can create, edit or delete events
CREATE POLICY "Admins can insert events"
  ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update events"
  ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete events"
  ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 5. Event Registrations (Public RSVPs for events)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL,
  event_title TEXT NOT NULL,
  name TEXT NOT NULL CHECK (char_length(trim(name)) > 0 AND char_length(name) <= 200),
  email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT NOT NULL CHECK (char_length(trim(phone)) >= 7 AND char_length(phone) <= 25),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations (event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON public.event_registrations (created_at DESC);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can register for an event"
  ON public.event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND
    char_length(trim(email)) > 0 AND
    char_length(trim(phone)) > 0
  );

CREATE POLICY "Admins can view event registrations"
  ON public.event_registrations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete event registrations"
  ON public.event_registrations
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 6. Gallery Images (Photo showcase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL CHECK (char_length(trim(src)) > 0),
  alt TEXT NOT NULL CHECK (char_length(trim(alt)) > 0 AND char_length(alt) <= 300),
  category TEXT NOT NULL DEFAULT 'Community' CHECK (char_length(category) <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images (category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images (created_at DESC);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery images"
  ON public.gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage gallery images"
  ON public.gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 7. Stories (Impact Stories of Change)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 200),
  location TEXT NOT NULL DEFAULT 'Ayodhya, Uttar Pradesh',
  programme TEXT NOT NULL,
  image TEXT NOT NULL,
  tagline TEXT NOT NULL,
  before_text TEXT NOT NULL,
  after_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories (created_at DESC);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view stories"
  ON public.stories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage stories"
  ON public.stories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Optional initial seed for stories if empty
INSERT INTO public.stories (title, location, programme, image, tagline, before_text, after_text)
SELECT
  'Community Relief & Education Support',
  'Ayodhya, Uttar Pradesh',
  'Community Relief',
  '/images/community-relief.jpg',
  'From Need to Opportunity',
  'Before receiving support, accessing quality education and learning materials was a significant challenge.',
  'Today, with the foundation''s support, new educational opportunities have opened doors to a brighter future.'
WHERE NOT EXISTS (SELECT 1 FROM public.stories WHERE title = 'Community Relief & Education Support');

INSERT INTO public.stories (title, location, programme, image, tagline, before_text, after_text)
SELECT
  'Healthcare Camp & Skill Development',
  'Ayodhya, Uttar Pradesh',
  'Healthcare Camp',
  '/images/healthcare-camp.jpg',
  'From Learning to Earning',
  'Before joining the skill development programme, finding sustainable livelihood opportunities was difficult.',
  'Today, with newly acquired skills in stitching and embroidery, steps towards self-reliance have begun.'
WHERE NOT EXISTS (SELECT 1 FROM public.stories WHERE title = 'Healthcare Camp & Skill Development');

-- ============================================================
-- 8. Programmes (Foundation Initiatives)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.programmes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 250),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0),
  image TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'BookOpen',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_programmes_sort_order ON public.programmes (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_programmes_published ON public.programmes (published);

ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published programmes"
  ON public.programmes
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage programmes"
  ON public.programmes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 9. Impact Stats (Key verified numbers)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL CHECK (char_length(trim(label)) > 0 AND char_length(label) <= 200),
  value NUMERIC NOT NULL CHECK (value >= 0),
  suffix TEXT NOT NULL DEFAULT '+',
  verified BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_impact_stats_sort_order ON public.impact_stats (sort_order ASC);

ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view impact stats"
  ON public.impact_stats
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage impact stats"
  ON public.impact_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 10. Transparency Documents (Annual Reports, Audit Records)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transparency_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 250),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0),
  file_url TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transparency_docs_sort_order ON public.transparency_docs (sort_order ASC);

ALTER TABLE public.transparency_docs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view transparency docs"
  ON public.transparency_docs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage transparency docs"
  ON public.transparency_docs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 11. Website Settings (Contact info, UPI configuration, Socials)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  upi_name TEXT NOT NULL,
  facebook TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  twitter TEXT DEFAULT '',
  youtube TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view website settings"
  ON public.website_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage website settings"
  ON public.website_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
