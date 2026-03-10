-- Migration: Create main_tasks and sub_tasks tables for AI task generator

-- Create main_tasks table
CREATE TABLE IF NOT EXISTS public.main_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,  -- nullable for now; link to auth.users later
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create sub_tasks table
CREATE TABLE IF NOT EXISTS public.sub_tasks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id uuid NOT NULL REFERENCES public.main_tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_done boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_sub_tasks_parent_id ON public.sub_tasks(parent_id);

-- Enable Row Level Security
ALTER TABLE public.main_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow all for anon during development
-- In production, replace with: auth.uid() = user_id
CREATE POLICY "anon_all_main_tasks" ON public.main_tasks
  FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all_sub_tasks" ON public.sub_tasks
  FOR ALL TO anon USING (true) WITH CHECK (true);
