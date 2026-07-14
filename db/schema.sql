CREATE TABLE logs (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  scenario text NOT NULL,
  run int NOT NULL,
  content text NOT NULL,
  content_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT NOW(),
  UNIQUE (scenario, run),
  UNIQUE (content_hash)
);
