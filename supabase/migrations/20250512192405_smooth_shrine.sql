-- 🛡️ Activer la sécurité RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 🧹 Supprimer les policies existantes
DROP POLICY IF EXISTS "Enable signup access" ON users;
DROP POLICY IF EXISTS "Enable read access" ON users;
DROP POLICY IF EXISTS "Enable update access" ON users;

-- ✅ INSERT → pour signup (chaque user peut créer son propre profil)
CREATE POLICY "Enable signup access"
ON users
FOR INSERT
TO authenticated
WITH CHECK (
  id = auth.uid()
);

-- ✅ SELECT → lire son propre profil ou tout voir si admin
CREATE POLICY "Enable read access"
ON users
FOR SELECT
TO authenticated
USING (
  id = auth.uid() OR is_admin = true
);

-- ✅ UPDATE → modifier son profil ou tout si admin
CREATE POLICY "Enable update access"
ON users
FOR UPDATE
TO authenticated
USING (
  id = auth.uid() OR is_admin = true
)
WITH CHECK (
  id = auth.uid() OR is_admin = true
);
