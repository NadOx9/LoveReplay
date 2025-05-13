/*
  # Add visits counter

  1. Changes
    - Add visits counter to track total app visits
    - Add function to increment visits safely
*/

-- Create visits counter table
CREATE TABLE IF NOT EXISTS app_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visits bigint NOT NULL DEFAULT 0
);

-- Insert initial record if not exists
INSERT INTO app_stats (visits)
SELECT 0
WHERE NOT EXISTS (SELECT 1 FROM app_stats);

-- Create function to increment visits
CREATE OR REPLACE FUNCTION increment_visits()
RETURNS bigint
LANGUAGE SQL SECURITY DEFINER
AS $$
  UPDATE app_stats 
  SET visits = visits + 1 
  RETURNING visits;
$$;