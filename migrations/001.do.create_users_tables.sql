CREATE TYPE icon_size_type as ENUM (
  'small', 'medium', 'large'
);
CREATE TYPE icon_shape_type as ENUM (
  'square', 'rounded', 'circle'
);
CREATE TYPE icon_alignment_type as ENUM (
  'left', 'center', 'right'
);

CREATE TABLE users (
  id Integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  note TEXT,
  enable_pages BOOLEAN NOT NULL DEFAULT FALSE,
  enable_folders BOOLEAN NOT NULL DEFAULT TRUE,
  icon_size icon_size_type NOT NULL DEFAULT 'medium',
  icon_shape icon_shape_type NOT NULL DEFAULT 'rounded',
  icons_per_row INTEGER NOT NULL DEFAULT 5,
  icon_alignment icon_alignment_type NOT NULL DEFAULT 'center',
  enable_groups BOOLEAN NOT NULL DEFAULT FALSE,
  enable_hiding BOOLEAN NOT NULL DEFAULT FALSE
);
