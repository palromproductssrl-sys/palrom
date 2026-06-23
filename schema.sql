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

-- Enable public read, admin write policies for vacancies
CREATE POLICY "Allow public select on vacancies" ON public.vacancies FOR SELECT TO public USING (true);
CREATE POLICY "Allow full access to authenticated admins on vacancies" ON public.vacancies FOR ALL TO authenticated USING (true) WITH CHECK (true);

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

-- Enable public read, admin write policies for news
CREATE POLICY "Allow public select on news" ON public.news FOR SELECT TO public USING (true);
CREATE POLICY "Allow full access to authenticated admins on news" ON public.news FOR ALL TO authenticated USING (true) WITH CHECK (true);

