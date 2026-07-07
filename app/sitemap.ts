import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const SITE_URL = '{{SITE_URL}}'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('maquinas')
    .select('id, criado_em')
    .eq('publicado', true)

  const maquinas = (data ?? []).map((m) => ({
    url: `${SITE_URL}/maquina/${m.id}`,
    lastModified: new Date(m.criado_em),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    ...maquinas,
  ]
}
