-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text NOT NULL,
  is_premium boolean NOT NULL DEFAULT false,
  is_admin boolean NOT NULL DEFAULT false,
  is_banned boolean NOT NULL DEFAULT false,
  replies_generated integer NOT NULL DEFAULT 0,
  shared_once boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  note_admin text
);

-- Create a function to increment replies_generated
CREATE OR REPLACE FUNCTION increment_replies_generated()
RETURNS integer
LANGUAGE SQL SECURITY DEFINER
AS $$
  UPDATE users 
  SET replies_generated = replies_generated + 1
  WHERE id = auth.uid()
  RETURNING replies_generated;
$$;