ALTER TABLE games
  ADD COLUMN IF NOT EXISTS ios_rating           NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS ios_rating_count     INTEGER,
  ADD COLUMN IF NOT EXISTS android_rating       NUMERIC(2,1),
  ADD COLUMN IF NOT EXISTS android_rating_count INTEGER,
  ADD COLUMN IF NOT EXISTS icon_url             TEXT,
  ADD COLUMN IF NOT EXISTS ratings_updated_at   TIMESTAMPTZ;
