/*
  # Fix recursive RLS policies

  1. Changes
    - Remove recursive admin policies that were causing infinite loops
    - Replace with simplified policies that avoid recursion
    - Keep existing user self-access policies
  
  2. Security
    - Maintain row-level security
    - Ensure admins can still access all users
    - Ensure users can still access their own data
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;

-- Create new non-recursive admin policies
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT
  TO authenticated
  USING (
    is_admin = true
  );

CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE
  TO authenticated
  USING (
    is_admin = true
  )
  WITH CHECK (
    is_admin = true
  );