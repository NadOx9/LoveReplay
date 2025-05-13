/*
  # Fix authentication policies

  1. Changes
    - Drop all existing policies to start fresh
    - Create simplified policies for user authentication
    - Add basic RLS policies for users table
    - Ensure admin access works correctly
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON users;
DROP POLICY IF EXISTS "Enable update for users and admins" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new simplified policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR is_admin = true
  );

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR is_admin = true
  )
  WITH CHECK (
    auth.uid() = id OR is_admin = true
  );

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
  );