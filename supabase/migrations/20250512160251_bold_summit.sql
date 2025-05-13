/*
  # Make nadimytb@gmail.com an admin user

  1. Changes
    - Updates the specified user to have admin privileges
*/

UPDATE users 
SET is_admin = true 
WHERE email = 'nadimytb@gmail.com';