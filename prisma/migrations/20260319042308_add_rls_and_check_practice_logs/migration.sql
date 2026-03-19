-- RLS: practice_logs (own rows only)
ALTER TABLE practice_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "practice_logs_own" ON practice_logs
  FOR ALL USING (user_id = auth.uid());

-- RLS: sequence_logs (via practice_log ownership)
ALTER TABLE sequence_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sequence_logs_own" ON sequence_logs
  FOR ALL USING (
    practice_log_id IN (
      SELECT id FROM practice_logs WHERE user_id = auth.uid()
    )
  );