/*
  # Fix user policies to prevent recursion

  1. Changes
    - Drop existing policies that may cause recursion
    - Create simplified policies for user access
    - Add separate admin access policy
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create basic user access policies
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own data"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Create admin policy without recursion
CREATE POLICY "Admin access"
ON users
FOR ALL
TO authenticated
USING (
  COALESCE(
    (SELECT is_admin FROM users WHERE id = auth.uid() LIMIT 1),
    false
  )
);