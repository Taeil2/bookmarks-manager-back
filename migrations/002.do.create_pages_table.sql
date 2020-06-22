-- finish userId
-- finish order - can this be automatic?

CREATE TABLE pages (
  id Integer PRIMARY KEY GENEREATED BY DEFAULT AS IDENTITY,
  userId INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name string NOT NULL,
  order Integer,
  isDrawer BOOLEAN NOT NULL DEFAULT FALSE,
);
