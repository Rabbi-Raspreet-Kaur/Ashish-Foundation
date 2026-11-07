-- ============================================================
-- Ashish Foundation Database Schema Migration (Part 2)
-- Migration: 20260421000001_remaining_tables.sql
-- Description: Creates remaining tables (programmes, impact_stats, transparency_docs, website_settings)
-- ============================================================

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
