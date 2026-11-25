-- Fitness Builder Phase 2 schema
-- This script creates the core tables required for database integration.

CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT users_email_format_check CHECK (position('@' in email) > 1)
);

CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    muscle_group VARCHAR(100),
    equipment VARCHAR(100),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT exercises_name_not_blank_check CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS workout_templates (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_workout_templates_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT workout_templates_name_not_blank_check CHECK (char_length(trim(name)) > 0)
);

CREATE TABLE IF NOT EXISTS workout_sessions (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    workout_template_id INTEGER,
    name VARCHAR(150) NOT NULL,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_workout_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_workout_sessions_template
        FOREIGN KEY (workout_template_id)
        REFERENCES workout_templates(id)
        ON DELETE SET NULL,
    CONSTRAINT workout_sessions_name_not_blank_check CHECK (char_length(trim(name)) > 0),
    CONSTRAINT workout_sessions_status_check CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS workout_sets (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    workout_session_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    set_number INTEGER NOT NULL,
    reps INTEGER,
    weight_kg NUMERIC(7,2),
    duration_seconds INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_workout_sets_session
        FOREIGN KEY (workout_session_id)
        REFERENCES workout_sessions(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_workout_sets_exercise
        FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
        ON DELETE RESTRICT,
    CONSTRAINT workout_sets_set_number_check CHECK (set_number > 0),
    CONSTRAINT workout_sets_reps_check CHECK (reps IS NULL OR reps >= 0),
    CONSTRAINT workout_sets_weight_check CHECK (weight_kg IS NULL OR weight_kg >= 0),
    CONSTRAINT workout_sets_duration_check CHECK (duration_seconds IS NULL OR duration_seconds >= 0),
    CONSTRAINT workout_sets_session_set_unique UNIQUE (workout_session_id, exercise_id, set_number)
);

CREATE TABLE IF NOT EXISTS personal_records (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    workout_set_id INTEGER,
    record_type VARCHAR(50) NOT NULL,
    record_value NUMERIC(10,2) NOT NULL,
    record_unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    achieved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_personal_records_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_personal_records_exercise
        FOREIGN KEY (exercise_id)
        REFERENCES exercises(id)
        ON DELETE RESTRICT,
    CONSTRAINT fk_personal_records_workout_set
        FOREIGN KEY (workout_set_id)
        REFERENCES workout_sets(id)
        ON DELETE SET NULL,
    CONSTRAINT personal_records_type_not_blank_check CHECK (char_length(trim(record_type)) > 0),
    CONSTRAINT personal_records_value_check CHECK (record_value >= 0)
);

CREATE INDEX IF NOT EXISTS idx_workout_templates_user_id ON workout_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_template_id ON workout_sessions(workout_template_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_session_id ON workout_sets(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise_id ON workout_sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_id ON personal_records(exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_workout_set_id ON personal_records(workout_set_id);
