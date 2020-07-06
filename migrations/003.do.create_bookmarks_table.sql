CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  url TEXT,
  base_url TEXT,
  bookmark_order INTEGER NOT NULL,
  folder_name TEXT,
  group_name TEXT,
  is_folder BOOLEAN NOT NULL DEFAULT FALSE,
  hidden BOOLEAN NOT NULL DEFAULT FALSE
);
