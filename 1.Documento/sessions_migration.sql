
-- Migration: create sessions table
CREATE TYPE IF NOT EXISTS session_status AS ENUM ('active', 'paused', 'stopped');

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  prestador_id UUID NOT NULL,
  client_op_id UUID,
  started_at timestamptz,
  client_started_at timestamptz,
  last_heartbeat_at timestamptz,
  elapsed_ms bigint,
  status session_status NOT NULL DEFAULT 'active',
  stopped_at timestamptz,
  stopped_elapsed_ms bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_appointment ON sessions(appointment_id);
CREATE INDEX IF NOT EXISTS idx_sessions_prestador ON sessions(prestador_id);
