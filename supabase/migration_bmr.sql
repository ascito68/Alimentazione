-- Migrazione: aggiunge colonne per il salvataggio dei dati BMR
-- Da eseguire nel SQL Editor di Supabase

ALTER TABLE impostazioni_utente
  ADD COLUMN IF NOT EXISTS bmr_sesso  char(1)        DEFAULT 'M',
  ADD COLUMN IF NOT EXISTS bmr_eta    integer        DEFAULT 30,
  ADD COLUMN IF NOT EXISTS bmr_altezza integer       DEFAULT 170,
  ADD COLUMN IF NOT EXISTS bmr_peso   numeric(5,1)   DEFAULT 70,
  ADD COLUMN IF NOT EXISTS bmr_livello text          DEFAULT 'moderato';
