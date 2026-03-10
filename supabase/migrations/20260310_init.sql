-- Migration: Create challenges and steps tables

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  obstacle text NOT NULL,
  created_at timestamp WITH time ZONE DEFAULT now(),
  target_date timestamp WITH time ZONE
);

-- Create steps table
CREATE TABLE IF NOT EXISTS public.steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE,
  text text NOT NULL,
  completed boolean DEFAULT false,
  created_at timestamp WITH time ZONE DEFAULT now()
);

-- Basic RLS Policies (Allow all for development)
-- You may want to restrict this later with auth.uid()
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all for anyone" ON public.challenges FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for anyone" ON public.steps FOR ALL TO anon USING (true) WITH CHECK (true);
