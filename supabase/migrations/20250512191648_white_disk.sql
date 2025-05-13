/*
  # Fix admin RLS policies

  1. Changes
    - Drop existing admin policies
    - Create new admin policies that check auth.uid() directly
    - Add user self-access policies if missing
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- Create new admin policies that check the current user's admin status
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT is_admin FROM users WHERE id = auth.uid())
  );

-- Ensure user self-access policies exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can read own data'
  ) THEN
    CREATE POLICY "Users can read own data"
      ON users
      FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Users can update own data'
  ) THEN
    CREATE POLICY "Users can update own data"
      ON users
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;