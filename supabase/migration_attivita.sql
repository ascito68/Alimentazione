-- Migrazione: aggiunge colonne per il salvataggio delle attività sportive
-- Da eseguire nel SQL Editor di Supabase

ALTER TABLE impostazioni_utente
  ADD COLUMN IF NOT EXISTS peso_attivita numeric(5,1) DEFAULT 70,
  ADD COLUMN IF NOT EXISTS voci_attivita jsonb DEFAULT '[]'::jsonb;
