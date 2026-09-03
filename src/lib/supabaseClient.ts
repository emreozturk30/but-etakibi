import { createClient } from '@supabase/supabase-js'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabaseUrl = rawSupabaseUrl?.replace(/\/+$/, '') ?? rawSupabaseUrl

try {
  const parsed = new URL(supabaseUrl)
  if (!parsed.hostname.endsWith('.supabase.co')) {
    console.error(
      `SUPABASE_URL yanlış görünüyor ("${supabaseUrl}"). Supabase panelinde ` +
        'Project Settings → API → "Project URL" alanındaki değeri, sonunda ' +
        '"/" veya başka bir yol olmadan birebir kullanmalısın (ör. ' +
        'https://xxxxxxxxxxxx.supabase.co) — dashboard sayfasının linki değil.',
    )
  }
} catch {
  console.error(
    `SUPABASE_URL geçersiz veya boş ("${supabaseUrl}"). Supabase panelinde ` +
      'Project Settings → API → "Project URL" alanındaki değeri kullanmalısın.',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
