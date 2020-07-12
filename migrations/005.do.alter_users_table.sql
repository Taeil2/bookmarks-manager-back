ALTER TABLE users ADD
  random_background BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE users ADD
  unsplash_url TEXT DEFAULT 'https://unsplash.com/photos/phIFdC6lA4E';
