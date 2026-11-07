-- ============================================================
-- Ashish Foundation - Complete Database Schema & Initial Seed
-- Migration: 20261101000000_complete_foundation_schema.sql
-- Description: Complete Postgres schema for all 11 foundation collections
--              with Row Level Security (RLS) and idempotent initial data seeding.
-- ============================================================

-- Ensure pgcrypto extension is enabled for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. Contact Messages (Website inquiries)
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

DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
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

DROP POLICY IF EXISTS "Admins can view contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 2. Volunteers (Volunteer applications)
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

DROP POLICY IF EXISTS "Public can register as volunteer" ON public.volunteers;
CREATE POLICY "Public can register as volunteer"
  ON public.volunteers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND
    char_length(trim(email)) > 0 AND
    char_length(trim(phone)) > 0
  );

DROP POLICY IF EXISTS "Admins can manage volunteers" ON public.volunteers;
CREATE POLICY "Admins can manage volunteers"
  ON public.volunteers
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

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

DROP POLICY IF EXISTS "Public can record a pending donation" ON public.donations;
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

DROP POLICY IF EXISTS "Admins can manage donations" ON public.donations;
CREATE POLICY "Admins can manage donations"
  ON public.donations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 4. Events (Foundation Camps, Drives, Workshops)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 250),
  date TEXT NOT NULL CHECK (char_length(trim(date)) > 0 AND char_length(date) <= 100),
  location TEXT NOT NULL CHECK (char_length(trim(location)) > 0 AND char_length(location) <= 200),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0 AND char_length(description) <= 3000),
  image TEXT NOT NULL DEFAULT '/images/hero-bg.jpg',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_events_created_at ON public.events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events (published);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published events" ON public.events;
CREATE POLICY "Public can view published events"
  ON public.events
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
CREATE POLICY "Admins can manage events"
  ON public.events
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 5. Event Registrations (Public RSVPs)
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

DROP POLICY IF EXISTS "Public can register for an event" ON public.event_registrations;
CREATE POLICY "Public can register for an event"
  ON public.event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) > 0 AND
    char_length(trim(email)) > 0 AND
    char_length(trim(phone)) > 0
  );

DROP POLICY IF EXISTS "Admins can manage event registrations" ON public.event_registrations;
CREATE POLICY "Admins can manage event registrations"
  ON public.event_registrations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 6. Gallery Images (Photo showcase)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL CHECK (char_length(trim(src)) > 0),
  alt TEXT NOT NULL CHECK (char_length(trim(alt)) > 0 AND char_length(alt) <= 300),
  category TEXT NOT NULL DEFAULT 'Community' CHECK (char_length(category) <= 100),
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images (category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_published ON public.gallery_images (published);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published gallery images" ON public.gallery_images;
CREATE POLICY "Public can view published gallery images"
  ON public.gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage gallery images" ON public.gallery_images;
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
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_stories_created_at ON public.stories (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_published ON public.stories (published);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published stories" ON public.stories;
CREATE POLICY "Public can view published stories"
  ON public.stories
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage stories" ON public.stories;
CREATE POLICY "Admins can manage stories"
  ON public.stories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 8. Programmes (Foundation Programmes / Our Work)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.programmes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 200),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0 AND char_length(description) <= 2000),
  image TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Heart',
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_programmes_sort_order ON public.programmes (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_programmes_published ON public.programmes (published);

ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published programmes" ON public.programmes;
CREATE POLICY "Public can view published programmes"
  ON public.programmes
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage programmes" ON public.programmes;
CREATE POLICY "Admins can manage programmes"
  ON public.programmes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 9. Impact Stats (Verified numerical metrics)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.impact_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL CHECK (char_length(trim(label)) > 0 AND char_length(label) <= 150),
  value NUMERIC NOT NULL CHECK (value >= 0),
  suffix TEXT NOT NULL DEFAULT '+' CHECK (char_length(suffix) <= 20),
  verified BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_impact_stats_sort_order ON public.impact_stats (sort_order ASC);

ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified impact stats" ON public.impact_stats;
CREATE POLICY "Public can view verified impact stats"
  ON public.impact_stats
  FOR SELECT
  TO anon, authenticated
  USING (verified = true);

DROP POLICY IF EXISTS "Admins can manage impact stats" ON public.impact_stats;
CREATE POLICY "Admins can manage impact stats"
  ON public.impact_stats
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 10. Transparency Documents (Trust & Governance files)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.transparency_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(trim(title)) > 0 AND char_length(title) <= 250),
  description TEXT NOT NULL CHECK (char_length(trim(description)) > 0 AND char_length(description) <= 1000),
  file_url TEXT,
  available BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_transparency_docs_sort_order ON public.transparency_docs (sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_transparency_docs_published ON public.transparency_docs (published);

ALTER TABLE public.transparency_docs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published transparency docs" ON public.transparency_docs;
CREATE POLICY "Public can view published transparency docs"
  ON public.transparency_docs
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

DROP POLICY IF EXISTS "Admins can manage transparency docs" ON public.transparency_docs;
CREATE POLICY "Admins can manage transparency docs"
  ON public.transparency_docs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- 11. Website Settings (Single-row foundation configuration)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  upi_name TEXT NOT NULL,
  facebook TEXT NOT NULL DEFAULT '#',
  instagram TEXT NOT NULL DEFAULT '#',
  twitter TEXT NOT NULL DEFAULT '#',
  youtube TEXT NOT NULL DEFAULT '#',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view website settings" ON public.website_settings;
CREATE POLICY "Public can view website settings"
  ON public.website_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage website settings" ON public.website_settings;
CREATE POLICY "Admins can manage website settings"
  ON public.website_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- INITIAL SEED DATA (Idempotent: Only inserted if missing)
-- ============================================================

-- 1. Programmes Seed
INSERT INTO public.programmes (id, title, description, image, icon, published, sort_order)
VALUES
  ('education', 'Education', 'Provide educational opportunities and support for children from disadvantaged backgrounds, including learning materials and other educational assistance.', '/images/education.jpg', 'GraduationCap', true, 1),
  ('inclusive-support', 'Inclusive Support', 'Support persons with disabilities and promote opportunities for greater independence and participation in society.', '/images/inclusive-support.jpg', 'Heart', true, 2),
  ('women-empowerment', 'Women Empowerment', 'Promote women''s education, awareness and opportunities for self-reliance.', '/images/women-empowerment.jpg', 'Users', true, 3),
  ('skill-development', 'Skill Development', 'Provide vocational and technical training, including areas such as stitching, embroidery and other practical skills.', '/images/skill-development.jpg', 'Wrench', true, 4),
  ('healthcare', 'Healthcare', 'Support awareness and access to healthcare for people who need assistance.', '/images/healthcare-camp.jpg', 'Stethoscope', true, 5),
  ('community-relief', 'Community & Relief', 'Support vulnerable communities during difficult circumstances, including disaster situations, food/clothing distribution and other forms of assistance.', '/images/community-support.jpg', 'HandHeart', true, 6)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  icon = EXCLUDED.icon,
  published = EXCLUDED.published,
  sort_order = EXCLUDED.sort_order;

-- 2. Impact Stats Seed
INSERT INTO public.impact_stats (label, value, suffix, verified, sort_order)
SELECT 'Children Supported', 500, '+', true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.impact_stats WHERE label = 'Children Supported');

INSERT INTO public.impact_stats (label, value, suffix, verified, sort_order)
SELECT 'Families Reached', 100, '+', true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.impact_stats WHERE label = 'Families Reached');

INSERT INTO public.impact_stats (label, value, suffix, verified, sort_order)
SELECT 'Community Initiatives', 50, '+', true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.impact_stats WHERE label = 'Community Initiatives');

INSERT INTO public.impact_stats (label, value, suffix, verified, sort_order)
SELECT 'Lives Touched', 1000, '+', true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.impact_stats WHERE label = 'Lives Touched');

-- 3. Transparency Docs Seed
INSERT INTO public.transparency_docs (title, description, available, published, sort_order)
SELECT 'Registration Certificate', 'Foundation registration documentation under applicable society/trust laws.', false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM public.transparency_docs WHERE title = 'Registration Certificate');

INSERT INTO public.transparency_docs (title, description, available, published, sort_order)
SELECT '12A Registration', 'Income Tax Act exemption registration document.', false, true, 2
WHERE NOT EXISTS (SELECT 1 FROM public.transparency_docs WHERE title = '12A Registration');

INSERT INTO public.transparency_docs (title, description, available, published, sort_order)
SELECT '80G Certificate', 'Tax deduction certificate for donor contributions.', false, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.transparency_docs WHERE title = '80G Certificate');

INSERT INTO public.transparency_docs (title, description, available, published, sort_order)
SELECT 'Annual Activity Report (FY 2023-24)', 'Summary of community activities and programmes conducted during the financial year.', false, true, 4
WHERE NOT EXISTS (SELECT 1 FROM public.transparency_docs WHERE title = 'Annual Activity Report (FY 2023-24)');

-- 4. Events Seed
INSERT INTO public.events (title, date, location, description, image, published)
SELECT
  'Annual Health Checkup Camp',
  'March 25, 2026',
  'Ayodhya Community Centre',
  'Free comprehensive health screenings, blood pressure checks, and medical consultations for families in underserved neighborhoods.',
  '/images/healthcare-camp.jpg',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Annual Health Checkup Camp');

INSERT INTO public.events (title, date, location, description, image, published)
SELECT
  'Skill Development Workshop: Stitching & Crafts',
  'April 10, 2026',
  'Ashish Training Wing, Ayodhya',
  'Practical vocational workshop teaching basic tailoring, embroidery, and craft techniques for women seeking self-reliance.',
  '/images/skill-development.jpg',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Skill Development Workshop: Stitching & Crafts');

INSERT INTO public.events (title, date, location, description, image, published)
SELECT
  'Children''s Book & Learning Kit Drive',
  'April 28, 2026',
  'Primary School Complex, Ayodhya',
  'Distribution of notebooks, textbooks, stationery kits, and school bags to children ahead of the new academic session.',
  '/images/education.jpg',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.events WHERE title = 'Children''s Book & Learning Kit Drive');

-- 5. Stories Seed
INSERT INTO public.stories (title, location, programme, image, tagline, before_text, after_text, published)
SELECT
  'Finding Independence Through Stitching',
  'Ayodhya, UP',
  'Skill Development',
  '/images/skill-development.jpg',
  'From uncertain daily wages to a steady tailoring income.',
  'Struggled with erratic income and limited opportunities to contribute to family expenses.',
  'Completed 3-month tailoring training, acquired a sewing machine, and now earns regular income from home.',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.stories WHERE title = 'Finding Independence Through Stitching');

INSERT INTO public.stories (title, location, programme, image, tagline, before_text, after_text, published)
SELECT
  'Back to School with Hope',
  'Ayodhya, UP',
  'Education Support',
  '/images/education.jpg',
  'A young girl resumes learning after family financial hardship.',
  'Forced to discontinue schooling after primary level due to lack of uniforms and learning material.',
  'Received school supplies, tuition support, and enrolled in class 6 with regular attendance.',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.stories WHERE title = 'Back to School with Hope');

INSERT INTO public.stories (title, location, programme, image, tagline, before_text, after_text, published)
SELECT
  'Restoring Mobility, Restoring Dignity',
  'Faizabad Rural',
  'Inclusive Support',
  '/images/inclusive-support.jpg',
  'An elder regains community participation through assistive care.',
  'Isolated at home due to walking difficulty without appropriate assistive equipment.',
  'Connected with assistive device distribution camp and received a mobility aid with rehabilitation guidance.',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.stories WHERE title = 'Restoring Mobility, Restoring Dignity');

-- 6. Gallery Images Seed
INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/education.jpg', 'Children learning in classroom', 'Education', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/education.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/community-support.jpg', 'Students and volunteers in classroom group photo', 'Education', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/community-support.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/women-empowerment.jpg', 'Women participating in empowerment workshop', 'Empowerment', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/women-empowerment.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/skill-development.jpg', 'Vocational skill development session', 'Skills', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/skill-development.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/healthcare-camp.jpg', 'Medical and healthcare awareness camp', 'Healthcare', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/healthcare-camp.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/inclusive-support.jpg', 'Community inclusive support initiative', 'Community', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/inclusive-support.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/children-hygiene.png', 'Hygiene and care initiative for children', 'Community', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/children-hygiene.png');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/medical-camp.jpg', 'Doctor examining patients at health camp', 'Healthcare', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/medical-camp.jpg');

INSERT INTO public.gallery_images (src, alt, category, published)
SELECT '/images/foundation-team.jpeg', 'Foundation team members', 'Community', true
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_images WHERE src = '/images/foundation-team.jpeg');

-- 7. Website Settings Seed
INSERT INTO public.website_settings (id, name, tagline, description, location, email, phone, address, upi_id, upi_name, facebook, instagram, twitter, youtube)
VALUES (
  'current',
  'Ashish Foundation',
  'Creating Opportunities. Changing Lives.',
  'Ashish Foundation works towards a more educated, empowered and inclusive society where every individual can live with dignity.',
  'Ayodhya, Uttar Pradesh, India',
  'contact@ashishfoundation.org',
  '+91 82990 52548',
  'Ayodhya, Uttar Pradesh, India',
  '8299052548m@pnb',
  'Ashish Foundation',
  '#',
  '#',
  '#',
  '#'
)
ON CONFLICT (id) DO UPDATE SET
  upi_id = EXCLUDED.upi_id,
  upi_name = EXCLUDED.upi_name;
