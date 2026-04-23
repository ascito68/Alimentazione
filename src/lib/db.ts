import { supabase } from './supabase'
import { GiornoAlimentare, TipoPasto, VoceAlimento, VoceAttivita, ImpostazioniBMR, ImpostazioniUtente, ImpostazioniGoogle } from '../types'
import { creaGiornoVuoto } from '../utils/calculations'

interface VocePastoRow {
  id: string
  giorno_id: string
  tipo_pasto: string
  alimento_id: string
  nome_alimento: string
  grammi: number
  calorie: number
  proteine: number
  carboidrati: number
  zuccheri: number
  grassi: number
  grassi_saturi: number
  fibre: number
  sodio: number
}

function costruisciGiorno(data: string, voci: VocePastoRow[]): GiornoAlimentare {
  const giorno = creaGiornoVuoto(data)
  for (const v of voci) {
    giorno.pasti[v.tipo_pasto as TipoPasto].voci.push({
      id: v.id,
      alimentoId: v.alimento_id,
      nomeAlimento: v.nome_alimento,
      grammi: v.grammi,
      nutrienti: {
        calorie: v.calorie,
        proteine: v.proteine,
        carboidrati: v.carboidrati,
        zuccheri: v.zuccheri,
        grassi: v.grassi,
        grassiSaturi: v.grassi_saturi,
        fibre: v.fibre,
        sodio: v.sodio,
      },
    })
  }
  return giorno
}

export async function caricaTuttiGiorni(): Promise<GiornoAlimentare[]> {
  const { data: giorni, error: eg } = await supabase
    .from('giorni_alimentari')
    .select('id, data')
    .order('data', { ascending: true })

  if (eg || !giorni || giorni.length === 0) return []

  const { data: voci, error: ev } = await supabase
    .from('voci_pasto')
    .select('*')
    .in('giorno_id', giorni.map(g => g.id))

  if (ev) return []

  return giorni.map(g =>
    costruisciGiorno(g.data, ((voci ?? []) as VocePastoRow[]).filter(v => v.giorno_id === g.id))
  )
}

async function upsertGiornoId(data: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: row, error } = await supabase
    .from('giorni_alimentari')
    .upsert({ user_id: user.id, data }, { onConflict: 'user_id,data' })
    .select('id')
    .single()

  return error ? null : (row as { id: string }).id
}

export async function inserisciVoce(
  giornoData: string,
  tipo: TipoPasto,
  voce: VoceAlimento
): Promise<void> {
  const giornoId = await upsertGiornoId(giornoData)
  if (!giornoId) return

  await supabase.from('voci_pasto').insert({
    id: voce.id,
    giorno_id: giornoId,
    tipo_pasto: tipo,
    alimento_id: voce.alimentoId,
    nome_alimento: voce.nomeAlimento,
    grammi: voce.grammi,
    calorie: voce.nutrienti.calorie,
    proteine: voce.nutrienti.proteine,
    carboidrati: voce.nutrienti.carboidrati,
    zuccheri: voce.nutrienti.zuccheri,
    grassi: voce.nutrienti.grassi,
    grassi_saturi: voce.nutrienti.grassiSaturi,
    fibre: voce.nutrienti.fibre,
    sodio: voce.nutrienti.sodio,
  })
}

export async function eliminaVoce(voceId: string): Promise<void> {
  await supabase.from('voci_pasto').delete().eq('id', voceId)
}

export async function aggiornaVoceSu(
  voceId: string,
  grammi: number,
  n: VoceAlimento['nutrienti']
): Promise<void> {
  await supabase.from('voci_pasto').update({
    grammi,
    calorie: n.calorie,
    proteine: n.proteine,
    carboidrati: n.carboidrati,
    zuccheri: n.zuccheri,
    grassi: n.grassi,
    grassi_saturi: n.grassiSaturi,
    fibre: n.fibre,
    sodio: n.sodio,
  }).eq('id', voceId)
}

export async function caricaImpostazioni(): Promise<{
  utente: Partial<ImpostazioniUtente> | null
  google: Partial<ImpostazioniGoogle> | null
  attivita: { peso: number; voci: VoceAttivita[] } | null
  bmr: ImpostazioniBMR | null
}> {
  const { data, error } = await supabase
    .from('impostazioni_utente')
    .select('*')
    .single()

  if (error || !data) return { utente: null, google: null, attivita: null, bmr: null }

  const row = data as {
    nome: string
    target_calorie: number
    target_proteine: number
    target_carboidrati: number
    target_grassi: number
    target_fibre: number
    google_client_id: string
    google_spreadsheet_id: string | null
    peso_attivita: number | null
    voci_attivita: VoceAttivita[] | null
    bmr_sesso: 'M' | 'F' | null
    bmr_eta: number | null
    bmr_altezza: number | null
    bmr_peso: number | null
    bmr_livello: string | null
  }

  return {
    utente: {
      nome: row.nome,
      targetCalorie: row.target_calorie,
      targetProteine: row.target_proteine,
      targetCarboidrati: row.target_carboidrati,
      targetGrassi: row.target_grassi,
      targetFibre: row.target_fibre,
    },
    google: {
      spreadsheetId: row.google_spreadsheet_id,
    },
    attivita: {
      peso: row.peso_attivita ?? 70,
      voci: row.voci_attivita ?? [],
    },
    bmr: row.bmr_sesso ? {
      sesso: row.bmr_sesso,
      eta: row.bmr_eta ?? 30,
      altezza: row.bmr_altezza ?? 170,
      peso: row.bmr_peso ?? 70,
      livello: row.bmr_livello ?? 'moderato',
    } : null,
  }
}

export async function salvaBmr(b: ImpostazioniBMR): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('impostazioni_utente').upsert({
    user_id: user.id,
    bmr_sesso: b.sesso,
    bmr_eta: b.eta,
    bmr_altezza: b.altezza,
    bmr_peso: b.peso,
    bmr_livello: b.livello,
    updated_at: new Date().toISOString(),
  })
}

export async function salvaAttivita(peso: number, voci: VoceAttivita[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('impostazioni_utente').upsert({
    user_id: user.id,
    peso_attivita: peso,
    voci_attivita: voci,
    updated_at: new Date().toISOString(),
  })
}

export async function salvaImpostazioni(imp: ImpostazioniUtente): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('impostazioni_utente').upsert({
    user_id: user.id,
    nome: imp.nome,
    target_calorie: imp.targetCalorie,
    target_proteine: imp.targetProteine,
    target_carboidrati: imp.targetCarboidrati,
    target_grassi: imp.targetGrassi,
    target_fibre: imp.targetFibre,
    updated_at: new Date().toISOString(),
  })
}

export async function salvaImpostazioniGoogle(spreadsheetId: string | null): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.from('impostazioni_utente').upsert({
    user_id: user.id,
    google_spreadsheet_id: spreadsheetId,
    updated_at: new Date().toISOString(),
  })
}
