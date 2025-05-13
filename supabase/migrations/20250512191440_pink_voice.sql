/*
  # Add missing RLS policies and indexes
  
  1. Changes
    - Enable RLS on tables that don't have it
    - Add missing policies for admin access
    - Add performance index for email lookups
    - Skip existing policies to avoid conflicts
*/

-- Enable RLS on tables if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE users ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'app_stats' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE app_stats ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add admin policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Admins can read all users'
  ) THEN
    CREATE POLICY "Admins can read all users"
      ON users
      FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.is_admin = true
        )
      );
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND policyname = 'Admins can update all users'
  ) THEN
    CREATE POLICY "Admins can update all users"
      ON users
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.is_admin = true
        )
      );
  END IF;
END $$;

-- Add app_stats policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'app_stats' 
    AND policyname = 'Anyone can read app_stats'
  ) THEN
    CREATE POLICY "Anyone can read app_stats"
      ON app_stats
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'app_stats' 
    AND policyname = 'Only admins can update app_stats'
  ) THEN
    CREATE POLICY "Only admins can update app_stats"
      ON app_stats
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users 
          WHERE users.id = auth.uid() 
          AND users.is_admin = true
        )
      );
  END IF;
END $$;

-- Add index for faster user lookups if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'users' 
    AND indexname = 'users_email_idx'
  ) THEN
    CREATE INDEX users_email_idx ON users(email);
  END IF;
END $$;