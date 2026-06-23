-- Create the B2B Quote Inquiries table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS public.quote_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_notes TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price NUMERIC DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'New'
);

-- Enable Row Level Security (RLS) if needed
ALTER TABLE public.quote_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous or authenticated inserts (for public B2B form submissions)
CREATE POLICY "Allow public inserts on quote_inquiries" 
ON public.quote_inquiries 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Create policy to allow read/write operations by service-role or authenticated administrators
CREATE POLICY "Allow full access to authenticated admins" 
ON public.quote_inquiries 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Create the Vacancies table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS public.vacancies (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    title JSONB NOT NULL DEFAULT '{}'::jsonb,
    department JSONB NOT NULL DEFAULT '{}'::jsonb,
    location TEXT NOT NULL DEFAULT 'Brad, RO',
    type JSONB NOT NULL DEFAULT '{}'::jsonb,
    description JSONB NOT NULL DEFAULT '{}'::jsonb,
    requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
    salary JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS for vacancies
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;

-- Enable public select and full write access (gated by the Next.js API passcode check)
CREATE POLICY "Allow full access to vacancies" ON public.vacancies FOR ALL TO public USING (true) WITH CHECK (true);

-- Create the News table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS public.news (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    tag JSONB NOT NULL DEFAULT '{}'::jsonb,
    date JSONB NOT NULL DEFAULT '{}'::jsonb,
    author TEXT NOT NULL DEFAULT 'Digital Team',
    title JSONB NOT NULL DEFAULT '{}'::jsonb,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    link_url TEXT,
    link_text JSONB NOT NULL DEFAULT '{}'::jsonb,
    image TEXT NOT NULL DEFAULT '/images/hero_bg.jpg',
    is_romania_only BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS for news
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Enable public select and full write access (gated by the Next.js API passcode check)
CREATE POLICY "Allow full access to news" ON public.news FOR ALL TO public USING (true) WITH CHECK (true);


-- =========================================================================
-- Analytics & Telemetry Schema
-- =========================================================================

-- Create the Page Views table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'nl',
    referrer TEXT,
    is_mobile BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS for page_views
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts
CREATE POLICY "Allow public inserts on page_views" 
ON public.page_views 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow full access to authenticated admins (service role)
CREATE POLICY "Allow full access to authenticated admins on page_views" 
ON public.page_views 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- Create the Configurator Events table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS public.configurator_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL, -- e.g., 'configurator_start', 'category_selected', 'added_to_cart', 'quote_submitted'
    category TEXT,            -- sawn, planed, dowels, etc.
    sub_category TEXT,
    dimensions JSONB,         -- {thickness, width, length, radius}
    grade TEXT,
    drying TEXT,
    quantity INTEGER,
    language TEXT NOT NULL DEFAULT 'nl'
);

-- Enable RLS for configurator_events
ALTER TABLE public.configurator_events ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts
CREATE POLICY "Allow public inserts on configurator_events" 
ON public.configurator_events 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Allow full access to authenticated admins
CREATE POLICY "Allow full access to authenticated admins on configurator_events" 
ON public.configurator_events 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- Create the Chatbot Conversations table in Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    session_id TEXT NOT NULL UNIQUE, -- One record per chat session
    message_count INTEGER NOT NULL DEFAULT 0,
    completed_configuration BOOLEAN NOT NULL DEFAULT false,
    had_fallback BOOLEAN NOT NULL DEFAULT false,
    language TEXT NOT NULL DEFAULT 'nl'
);

-- Enable RLS for chatbot_conversations
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Allow public anonymous inserts and updates
CREATE POLICY "Allow public inserts on chatbot_conversations" 
ON public.chatbot_conversations 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "Allow public updates on chatbot_conversations" 
ON public.chatbot_conversations 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

-- Allow full access to authenticated admins
CREATE POLICY "Allow full access to authenticated admins on chatbot_conversations" 
ON public.chatbot_conversations 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- =========================================================================
-- Database Migrations (Schema updates)
-- =========================================================================

-- Add FSC certified column to configurator events
ALTER TABLE public.configurator_events ADD COLUMN IF NOT EXISTS fsc BOOLEAN;

-- Add fallback messages logger column to chatbot conversations
ALTER TABLE public.chatbot_conversations ADD COLUMN IF NOT EXISTS fallback_messages JSONB DEFAULT '[]'::jsonb;


