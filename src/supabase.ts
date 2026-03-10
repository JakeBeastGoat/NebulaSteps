import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase Dashboard -> Project Settings -> API
// Use .env variables in a real project
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://evpyycprvwgraftaamtf.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cHl5Y3BydndncmFmdGFhbXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNDQ2MDYsImV4cCI6MjA4NjkyMDYwNn0.ff8zLtBpT_LLAHeSjJyUPeuuc38hzDVA1M1snMXtTBo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
