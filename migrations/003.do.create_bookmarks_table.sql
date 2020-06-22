-- is images an object?
-- order can this be generated automatically?

CREATE TABLE bookmarks (
  id Integer PRIMARY KEY GENEREATED BY DEFAULT AS IDENTITY,
  pageId INTEGER REFERENCES pages(id) ON DELETE CASCADE NOT NULL,
  name string NOT NULL,
  url string NOT NULL,
  images,
  order,
  folder STRING,
  group STRING,
  hidden BOOLEAN NOT NULL DEFAULT FALSE,
);
