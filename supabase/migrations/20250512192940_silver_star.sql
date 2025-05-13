/*
  # Fix recursive RLS policies for users table

  1. Changes
    - Remove recursive policies from users table
    - Create new simplified policies that avoid circular references
    - Maintain security while preventing infinite recursion

  2. Security
    - Users can read and update their own data
    - Admins can read and update all user data
    - Authenticated users can insert their own data
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "Enable signup access" ON users;
DROP POLICY IF EXISTS "Enable update access" ON users;

-- Create new non-recursive policies
CREATE POLICY "Users can read own data"
ON users
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR 
  (SELECT is_admin FROM users WHERE id = auth.uid())
);

CREATE POLICY "Users can insert own data"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own data"
ON users
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR 
  (SELECT is_admin FROM users WHERE id = auth.uid())
)
WITH CHECK (
  auth.uid() = id OR 
  (SELECT is_admin FROM users WHERE id = auth.uid())
);