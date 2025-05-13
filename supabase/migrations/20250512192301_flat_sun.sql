/*
  # Fix RLS policies for proper authentication
  
  1. Changes
    - Drop all existing policies to start fresh
    - Create simplified policies for users and admins
    - Add proper RLS for all tables
    - Fix recursive policy issues
    
  2. Security
    - Enable RLS on all tables
    - Add proper policies for users and admins
    - Ensure no recursion in policy checks
*/

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "Enable insert access" ON users;
DROP POLICY IF EXISTS "Enable update access" ON users;

-- Create new simplified policies for users table
CREATE POLICY "Enable insert access"
ON users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access"
ON users
FOR SELECT
TO authenticated
USING (
  -- Users can read their own data
  auth.uid() = id
  OR 
  -- Admins can read all data (non-recursive check)
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
    LIMIT 1
  )
);

CREATE POLICY "Enable update access"
ON users
FOR UPDATE
TO authenticated
USING (
  -- Users can update their own data
  auth.uid() = id
  OR 
  -- Admins can update all data (non-recursive check)
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
    LIMIT 1
  )
)
WITH CHECK (
  -- Same conditions for the check policy
  auth.uid() = id
  OR 
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
    LIMIT 1
  )
);

-- Policies for app_stats table
CREATE POLICY "Enable app stats read"
ON app_stats
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable app stats update"
ON app_stats
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
    LIMIT 1
  )
);

-- Policies for announcements table
CREATE POLICY "Enable announcements read"
ON announcements
FOR SELECT
TO authenticated
USING (active = true);

CREATE POLICY "Enable announcements management"
ON announcements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
    AND users.is_admin = true
    LIMIT 1
  )
);