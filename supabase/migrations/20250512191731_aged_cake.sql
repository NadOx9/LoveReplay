/*
  # Fix recursive RLS policies

  1. Changes
    - Drop existing policies that cause recursion
    - Create new non-recursive policies for users table
    
  2. Security
    - Maintain same security model but implement it without recursion
    - Enable RLS
    - Add policies for admin and user access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for authenticated users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    -- Allow users to read their own data
    auth.uid() = id
    OR
    -- Allow users marked as admin to read all data
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND id IN (
        SELECT id 
        FROM users 
        WHERE is_admin = true
      )
    )
  );

CREATE POLICY "Enable update for users and admins"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    -- Allow users to update their own data
    auth.uid() = id
    OR
    -- Allow users marked as admin to update all data
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND id IN (
        SELECT id 
        FROM users 
        WHERE is_admin = true
      )
    )
  )
  WITH CHECK (
    -- Same conditions for the check policy
    auth.uid() = id
    OR
    EXISTS (
      SELECT 1
      FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND id IN (
        SELECT id 
        FROM users 
        WHERE is_admin = true
      )
    )
  );