-- ============================================================
-- NutriTrack – Schema Supabase
-- Esegui questo file nel SQL Editor del tuo progetto Supabase
-- ============================================================

-- ── 1. TABELLA GIORNI ALIMENTARI ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.giorni_alimentari (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  data       DATE        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT giorni_alimentari_user_data_unique UNIQUE (user_id, data)
);

ALTER TABLE public.giorni_alimentari ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utente vede solo i propri giorni"
  ON public.giorni_alimentari FOR ALL
  USING (auth.uid() = user_id);

-- ── 2. TABELLA VOCI PASTO ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.voci_pasto (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  giorno_id     UUID         NOT NULL REFERENCES public.giorni_alimentari(id) ON DELETE CASCADE,
  tipo_pasto    TEXT         NOT NULL CHECK (tipo_pasto IN ('colazione','pranzo','spuntino','cena')),
  alimento_id   TEXT         NOT NULL,
  nome_alimento TEXT         NOT NULL,
  grammi        NUMERIC(8,1) NOT NULL,
  calorie       NUMERIC(8,1) NOT NULL,
  proteine      NUMERIC(8,1) NOT NULL,
  carboidrati   NUMERIC(8,1) NOT NULL,
  zuccheri      NUMERIC(8,1) NOT NULL,
  grassi        NUMERIC(8,1) NOT NULL,
  grassi_saturi NUMERIC(8,1) NOT NULL,
  fibre         NUMERIC(8,1) NOT NULL,
  sodio         NUMERIC(8,1) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);

ALTER TABLE public.voci_pasto ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utente vede solo le proprie voci"
  ON public.voci_pasto FOR ALL
  USING (
    auth.uid() = (
      SELECT user_id FROM public.giorni_alimentari WHERE id = giorno_id
    )
  );

-- ── 3. TABELLA IMPOSTAZIONI UTENTE ────────────────────────────
CREATE TABLE IF NOT EXISTS public.impostazioni_utente (
  user_id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome              TEXT        NOT NULL DEFAULT '',
  target_calorie    INTEGER     NOT NULL DEFAULT 2000,
  target_proteine   NUMERIC     NOT NULL DEFAULT 50,
  target_carboidrati NUMERIC    NOT NULL DEFAULT 260,
  target_grassi     NUMERIC     NOT NULL DEFAULT 70,
  target_fibre      NUMERIC     NOT NULL DEFAULT 25,
  google_client_id  TEXT        NOT NULL DEFAULT '',
  google_spreadsheet_id TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.impostazioni_utente ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Utente vede solo le proprie impostazioni"
  ON public.impostazioni_utente FOR ALL
  USING (auth.uid() = user_id);
