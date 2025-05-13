-- Drop all existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "Enable signup access" ON users;
DROP POLICY IF EXISTS "Enable update access" ON users;
DROP POLICY IF EXISTS "Enable app stats read" ON app_stats;
DROP POLICY IF EXISTS "Enable app stats update" ON app_stats;
DROP POLICY IF EXISTS "Enable announcements read" ON announcements;
DROP POLICY IF EXISTS "Enable announcements management" ON announcements;

-- Create basic policies without recursion
CREATE POLICY "Enable all access"
ON users
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all access"
ON app_stats
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all access"
ON announcements
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Keep RLS enabled for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;