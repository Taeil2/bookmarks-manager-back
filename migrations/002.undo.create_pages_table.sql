ALTER TABLE pages
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS pages CASCADE;
