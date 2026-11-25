CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exercises (
  id BIGSERIAL PRIMARY KEY,
  owner_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS exercises_global_unique
  ON exercises (LOWER(name), LOWER(muscle_group), LOWER(equipment))
  WHERE owner_user_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS exercises_custom_unique
  ON exercises (owner_user_id, LOWER(name))
  WHERE owner_user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS workout_templates (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS template_exercises (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  position INTEGER NOT NULL CHECK (position > 0),
  target_sets INTEGER NOT NULL CHECK (target_sets BETWEEN 1 AND 20),
  target_reps INTEGER NOT NULL CHECK (target_reps BETWEEN 1 AND 100),
  target_rpe NUMERIC(3, 1) CHECK (target_rpe BETWEEN 1 AND 10),
  UNIQUE (template_id, position)
);

CREATE TABLE IF NOT EXISTS workouts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id BIGINT REFERENCES workout_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'completed')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id BIGSERIAL PRIMARY KEY,
  workout_id BIGINT NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE RESTRICT,
  position INTEGER NOT NULL CHECK (position > 0),
  UNIQUE (workout_id, position)
);

CREATE TABLE IF NOT EXISTS workout_sets (
  id BIGSERIAL PRIMARY KEY,
  workout_exercise_id BIGINT NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL CHECK (set_number > 0),
  reps INTEGER NOT NULL CHECK (reps > 0),
  weight NUMERIC(8, 2) NOT NULL CHECK (weight >= 0),
  weight_unit TEXT NOT NULL CHECK (weight_unit IN ('kg', 'lb')),
  rpe NUMERIC(3, 1) NOT NULL CHECK (rpe BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workout_exercise_id, set_number)
);

CREATE TABLE IF NOT EXISTS personal_records (
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id BIGINT NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  best_estimated_1rm_kg NUMERIC(10, 2) NOT NULL CHECK (best_estimated_1rm_kg >= 0),
  workout_set_id BIGINT NOT NULL REFERENCES workout_sets(id) ON DELETE CASCADE,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, exercise_id)
);

CREATE INDEX IF NOT EXISTS workouts_user_started_idx ON workouts (user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS workout_exercises_workout_idx ON workout_exercises (workout_id, position);
CREATE INDEX IF NOT EXISTS workout_sets_exercise_idx ON workout_sets (workout_exercise_id);
CREATE INDEX IF NOT EXISTS templates_user_updated_idx ON workout_templates (user_id, updated_at DESC);
