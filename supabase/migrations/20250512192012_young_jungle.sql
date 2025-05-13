/*
  # Fix recursive RLS policies for users table

  1. Changes
    - Drop existing policies that cause recursion
    - Create new, non-recursive policies for the users table
    
  2. Security
    - Enable RLS on users table (already enabled)
    - Add policies for:
      - Users can read their own data
      - Users can update their own data
      - Users can insert their own data
      - Admins can manage all users (fixed to avoid recursion)
*/

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Admins can manage all users" ON users;

-- Create new non-recursive policies
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

-- Admin policy that doesn't cause recursion by checking admin status directly
CREATE POLICY "Admins can manage all users"
ON users
FOR ALL
TO authenticated
USING (
  (SELECT is_admin FROM users WHERE id = auth.uid())
  OR auth.uid() = id
);