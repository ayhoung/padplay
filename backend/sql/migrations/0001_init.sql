CREATE TABLE IF NOT EXISTS games (
  id                SERIAL PRIMARY KEY,
  slug              TEXT        NOT NULL UNIQUE,
  title             TEXT        NOT NULL,
  developer         TEXT        NOT NULL,
  category          TEXT        NOT NULL,
  platforms         TEXT        NOT NULL,
  tablet_score      INTEGER     NOT NULL,
  price_usd         NUMERIC(6,2),
  short_description TEXT        NOT NULL,
  tablet_features   TEXT[]      NOT NULL DEFAULT '{}',
  app_store_url     TEXT,
  play_store_url    TEXT,
  thumbnail         TEXT        NOT NULL,
  release_year      INTEGER     NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS games_category_idx     ON games (category);
CREATE INDEX IF NOT EXISTS games_tablet_score_idx ON games (tablet_score DESC);
