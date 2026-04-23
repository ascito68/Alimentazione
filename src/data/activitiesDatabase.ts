export interface Attivita {
  id: string
  nome: string
  categoria: string
  met: number // Metabolic Equivalent of Task
}

export const DATABASE_ATTIVITA: Attivita[] = [
  // ── CAMMINATA E CORSA ────────────────────────────────────────────────────
  { id: 'camminata-lenta',    nome: 'Camminata lenta (3 km/h)',    categoria: 'camminata', met: 2.8 },
  { id: 'camminata-normale',  nome: 'Camminata normale (5 km/h)',  categoria: 'camminata', met: 3.5 },
  { id: 'camminata-veloce',   nome: 'Camminata veloce (6 km/h)',   categoria: 'camminata', met: 5.0 },
  { id: 'camminata-salita',   nome: 'Camminata in salita',         categoria: 'camminata', met: 5.3 },
  { id: 'corsa-leggera',      nome: 'Corsa leggera (8 km/h)',      categoria: 'camminata', met: 8.0 },
  { id: 'corsa-moderata',     nome: 'Corsa moderata (10 km/h)',    categoria: 'camminata', met: 10.0 },
  { id: 'corsa-veloce',       nome: 'Corsa veloce (12 km/h)',      categoria: 'camminata', met: 11.5 },

  // ── CICLISMO E NUOTO ─────────────────────────────────────────────────────
  { id: 'bici-lenta',         nome: 'Ciclismo lento (< 16 km/h)', categoria: 'ciclismo',  met: 4.0 },
  { id: 'bici-moderata',      nome: 'Ciclismo moderato (16-20 km/h)', categoria: 'ciclismo', met: 8.0 },
  { id: 'bici-veloce',        nome: 'Ciclismo veloce (> 20 km/h)', categoria: 'ciclismo', met: 10.0 },
  { id: 'nuoto-lento',        nome: 'Nuoto lento',                 categoria: 'ciclismo',  met: 5.8 },
  { id: 'nuoto-moderato',     nome: 'Nuoto moderato',              categoria: 'ciclismo',  met: 7.0 },
  { id: 'nuoto-veloce',       nome: 'Nuoto veloce',                categoria: 'ciclismo',  met: 10.0 },

  // ── PALESTRA ─────────────────────────────────────────────────────────────
  { id: 'pesi-leggero',       nome: 'Pesi – leggero',              categoria: 'palestra',  met: 3.0 },
  { id: 'pesi-intenso',       nome: 'Pesi – intenso',              categoria: 'palestra',  met: 6.0 },
  { id: 'hiit',               nome: 'CrossFit / HIIT',             categoria: 'palestra',  met: 9.0 },
  { id: 'aerobica',           nome: 'Aerobica / Step',             categoria: 'palestra',  met: 7.3 },
  { id: 'spinning',           nome: 'Spinning',                    categoria: 'palestra',  met: 8.5 },
  { id: 'corda',              nome: 'Salto con la corda',          categoria: 'palestra',  met: 12.3 },
  { id: 'yoga',               nome: 'Yoga',                        categoria: 'palestra',  met: 2.5 },
  { id: 'pilates',            nome: 'Pilates',                     categoria: 'palestra',  met: 3.0 },
  { id: 'stretching',         nome: 'Stretching',                  categoria: 'palestra',  met: 2.3 },

  // ── SPORT DI SQUADRA ─────────────────────────────────────────────────────
  { id: 'calcio',             nome: 'Calcio',                      categoria: 'sport',     met: 7.0 },
  { id: 'basket',             nome: 'Basket',                      categoria: 'sport',     met: 8.0 },
  { id: 'tennis',             nome: 'Tennis (singolo)',            categoria: 'sport',     met: 7.3 },
  { id: 'pallavolo',          nome: 'Pallavolo',                   categoria: 'sport',     met: 4.0 },
  { id: 'padel',              nome: 'Padel',                       categoria: 'sport',     met: 6.0 },
  { id: 'boxe',               nome: 'Boxe / Arti marziali',        categoria: 'sport',     met: 9.8 },
  { id: 'danza',              nome: 'Danza / Ballo',               categoria: 'sport',     met: 4.8 },

  // ── ATTIVITÀ QUOTIDIANE ───────────────────────────────────────────────────
  { id: 'scale',              nome: 'Salire le scale',             categoria: 'quotidiano', met: 4.0 },
  { id: 'pulizie',            nome: 'Pulizie domestiche',          categoria: 'quotidiano', met: 3.3 },
  { id: 'giardinaggio',       nome: 'Giardinaggio',                categoria: 'quotidiano', met: 3.5 },
]

export const CATEGORIE_ATTIVITA: Record<string, string> = {
  camminata: 'Camminata e corsa',
  ciclismo:  'Ciclismo e nuoto',
  palestra:  'Palestra',
  sport:     'Sport di squadra',
  quotidiano: 'Attività quotidiane',
}
