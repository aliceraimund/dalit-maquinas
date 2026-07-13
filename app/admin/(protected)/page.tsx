import Link from 'next/link'
import AdminMaquinaList from '@/components/AdminMaquinaList'
import { createClient } from '@/lib/supabase/server'
import type { Maquina } from '@/types/maquina'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin | Máquinas',
  robots: { index: false, follow: false },
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('maquinas')
    .select('*')
    .order('criado_em', { ascending: false })

  const maquinas = (data ?? []) as Maquina[]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-[var(--cor-texto)]">
          Máquinas <span className="text-base font-normal text-[var(--cor-texto-suave)]">({maquinas.length})</span>
        </h1>
        <Link
          href="/admin/maquinas/novo"
          className="rounded-lg bg-[var(--cor-primaria)] px-5 py-2.5 text-sm font-semibold text-[var(--cor-primaria-texto)] transition-colors hover:bg-[var(--cor-primaria-hover)]"
        >
          + Nova máquina
        </Link>
      </div>

      <div className="mt-6">
        <AdminMaquinaList maquinas={maquinas} />
      </div>
    </div>
  )
}
