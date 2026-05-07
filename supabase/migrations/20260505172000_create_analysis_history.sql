-- Create analysis_history table
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  media_name TEXT NOT NULL,
  media_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  caption TEXT,
  hook_strength INTEGER,
  brightness NUMERIC,
  feedback JSONB,
  hashtags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own analysis history
CREATE POLICY "Users can view their own history"
  ON public.analysis_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own analysis results
CREATE POLICY "Users can insert their own results"
  ON public.analysis_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own history
CREATE POLICY "Users can delete their own history"
  ON public.analysis_history
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_analysis_history_user_id ON public.analysis_history(user_id);
CREATE INDEX idx_analysis_history_created_at ON public.analysis_history(created_at DESC);
