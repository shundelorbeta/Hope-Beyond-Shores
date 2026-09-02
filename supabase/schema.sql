-- Hope Beyond Shores Supabase Schema
-- Run this in Supabase SQL Editor before starting the app

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing objects in reverse dependency order (safe reset)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS story_images CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Profiles table (owner)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'owner' CHECK (role IN ('owner')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations
CREATE TABLE IF NOT EXISTS locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stories
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(name) ON DELETE RESTRICT,
  location TEXT NOT NULL REFERENCES locations(name) ON DELETE RESTRICT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Story images
CREATE TABLE IF NOT EXISTS story_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  hero_title TEXT DEFAULT '',
  hero_subtitle TEXT DEFAULT '',
  hero_cta_text TEXT DEFAULT '',
  hero_image_url TEXT,
  about_title TEXT DEFAULT '',
  about_content TEXT DEFAULT '',
  writer_name TEXT DEFAULT '',
  writer_bio TEXT DEFAULT '',
  facebook_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  visitor_name TEXT,
  visitor_email TEXT,
  message_content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default site settings
INSERT INTO site_settings (id, hero_title, hero_subtitle, hero_cta_text, about_title, about_content, writer_name, writer_bio)
VALUES (
  uuid_generate_v4(),
  'Hope Beyond Shores',
  'Island stories of faith, community, and life beyond the shore.',
  'Read Our Stories',
  'About Hope Beyond Shores',
  'Hope Beyond Shores is a digital journal documenting island life, local communities, faith, hope, and meaningful experiences around Bantayan Island and nearby communities.',
  'Janice Almohallas',
  'A storyteller capturing the spirit of island life and the communities that make it special.'
)
ON CONFLICT DO NOTHING;

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public read access for published stories
CREATE POLICY "Public can read published stories" ON stories
  FOR SELECT USING (status = 'published');

-- Public read access for story images of published stories
CREATE POLICY "Public can read story images" ON story_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = story_images.story_id
      AND stories.status = 'published'
    )
  );

-- Public read access for categories and locations
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read locations" ON locations FOR SELECT USING (true);

-- Public read access for site settings
CREATE POLICY "Public can read site settings" ON site_settings FOR SELECT USING (true);

-- Public can insert messages
CREATE POLICY "Public can create messages" ON messages FOR INSERT WITH CHECK (true);

-- Owner full access (via service role key on server)
-- Service role bypasses RLS, so server can manage all data

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_status ON stories(status);
CREATE INDEX IF NOT EXISTS idx_stories_published_at ON stories(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
