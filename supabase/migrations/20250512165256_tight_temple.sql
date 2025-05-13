/*
  # Add announcements system
  
  1. New Tables
    - `announcements`
      - `id` (uuid, primary key)
      - `message` (text)
      - `created_at` (timestamp)
      - `created_by` (uuid, references users)
      - `active` (boolean)

  2. Security
    - Enable RLS on announcements table
    - Add policy for admins to manage announcements
    - Add policy for all users to read active announcements
*/

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES users(id),
  active boolean NOT NULL DEFAULT true
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage announcements
CREATE POLICY "Admins can manage announcements"
  ON announcements
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.is_admin = true
    )
  );

-- Allow everyone to read active announcements
CREATE POLICY "Anyone can read active announcements"
  ON announcements
  FOR SELECT
  TO authenticated
  USING (active = true);