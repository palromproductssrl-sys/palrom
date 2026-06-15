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
