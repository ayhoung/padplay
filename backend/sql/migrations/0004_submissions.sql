CREATE TABLE IF NOT EXISTS submissions (
  id                     SERIAL        PRIMARY KEY,
  submitter_email        TEXT          NOT NULL,
  submitter_ip           TEXT,
  app_store_url          TEXT,
  play_store_url         TEXT,

  -- Enriched at submit time (mirror of games schema)
  title                  TEXT,
  developer              TEXT,
  category               TEXT,
  platforms              TEXT,
  short_description      TEXT,
  icon_url               TEXT,
  screenshots            TEXT[]        NOT NULL DEFAULT '{}',
  ios_rating             NUMERIC(2,1),
  ios_rating_count       INTEGER,
  android_rating         NUMERIC(2,1),
  android_rating_count   INTEGER,
  price_usd              NUMERIC(6,2),
  release_year           INTEGER,

  -- Submitter questionnaire + pitch
  questionnaire          JSONB         NOT NULL DEFAULT '{}',
  computed_tablet_score  INTEGER,
  user_pitch             TEXT,

  -- Moderation
  status                 TEXT          NOT NULL DEFAULT 'pending',
  rejection_reason       TEXT,
  approved_slug          TEXT,
  reviewed_at            TIMESTAMPTZ,

  created_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS submissions_status_idx ON submissions (status, created_at DESC);
CREATE INDEX IF NOT EXISTS submissions_ip_idx ON submissions (submitter_ip, created_at DESC);
